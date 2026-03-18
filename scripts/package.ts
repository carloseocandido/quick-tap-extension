import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type Manifest = {
  manifest_version?: number;
  version: string;
  name?: string;
  description?: string;
  action?: {
    default_popup?: string;
    default_icon?: Record<string, string>;
  };
  icons?: Record<string, string>;
  permissions?: string[];
  browser_specific_settings?: unknown;
  [key: string]: unknown;
};

type PackageJson = {
  name?: string;
  version?: string;
};

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, 'manifest.json');
const packageJsonPath = path.join(rootDir, 'package.json');
const releaseDir = path.join(rootDir, 'release');
const tempDir = path.join(rootDir, '.tmp', 'package');
const firefoxStageDir = path.join(tempDir, 'firefox');
const chromeStageDir = path.join(tempDir, 'chrome');

const REQUIRED_ITEMS = ['assets', 'dist', 'popup.html', 'style.css'] as const;
const REQUIRED_ICON_SIZES = ['16', '48', '128'] as const;
const VALIDATION_CONTEXT = {
  COMMON: 'COMMON',
  FIREFOX: 'AMO',
  CHROME: 'CHROME_WEB_STORE',
} as const;

type ValidationContext = (typeof VALIDATION_CONTEXT)[keyof typeof VALIDATION_CONTEXT];

function fail(message: string): never {
  console.error(`[package:zip] ${message}`);
  process.exit(1);
  throw new Error(message);
}

function failValidation(context: ValidationContext, message: string): never {
  const contextLabel = {
    COMMON: 'Manifesto base',
    AMO: 'AMO (Firefox)',
    CHROME_WEB_STORE: 'Chrome Web Store',
  }[context];

  fail(`[${contextLabel}] ${message}`);
}

function readJsonFile<T>(filePath: string): T {
  if (!existsSync(filePath)) {
    fail(`Required file not found: ${path.relative(rootDir, filePath)}`);
  }

  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    fail(`Invalid JSON at ${path.relative(rootDir, filePath)}: ${(error as Error).message}`);
  }
}

function runBuild(): void {
  console.log('[package:zip] Building extension...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
}

function ensureRequiredItems(): void {
  for (const item of REQUIRED_ITEMS) {
    const fullPath = path.join(rootDir, item);
    if (!existsSync(fullPath)) {
      fail(`Required item not found: ${item}. Run build and check project structure.`);
    }
  }
}

function resetDirectories(): void {
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(firefoxStageDir, { recursive: true });
  mkdirSync(chromeStageDir, { recursive: true });
  mkdirSync(releaseDir, { recursive: true });
}

function stageCommonFiles(stageDir: string): void {
  for (const item of REQUIRED_ITEMS) {
    const sourcePath = path.join(rootDir, item);
    const targetPath = path.join(stageDir, item);
    cpSync(sourcePath, targetPath, { recursive: true });
  }
}

function writeManifest(stageDir: string, manifest: Manifest): void {
  const targetManifestPath = path.join(stageDir, 'manifest.json');
  writeFileSync(targetManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function zipStage(stageDir: string, zipPath: string): void {
  rmSync(zipPath, { force: true });
  execSync(`zip -qr "${zipPath}" .`, { cwd: stageDir, stdio: 'inherit' });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function expectNonEmptyString(value: unknown, field: string, context: ValidationContext): string {
  if (typeof value !== 'string' || value.trim() === '') {
    failValidation(context, `Campo '${field}' deve ser uma string nao vazia.`);
  }

  return value;
}

function expectVersionString(value: unknown, field: string, context: ValidationContext): string {
  const version = expectNonEmptyString(value, field, context);
  const semverLike = /^\d+(\.\d+){1,3}$/;

  if (!semverLike.test(version)) {
    failValidation(
      context,
      `Campo '${field}' deve ter formato de versao (exemplo: 1.0.0). Recebido: ${version}`,
    );
  }

  return version;
}

function expectArrayOfStrings(value: unknown, field: string, context: ValidationContext): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    failValidation(context, `Campo '${field}' deve ser um array de strings.`);
  }

  return value;
}

function ensureFileExistsFromRoot(
  relativePath: string,
  sourceField: string,
  context: ValidationContext,
): void {
  const fullPath = path.join(rootDir, relativePath);
  if (!existsSync(fullPath)) {
    failValidation(
      context,
      `Campo '${sourceField}' referencia arquivo inexistente: ${relativePath}`,
    );
  }
}

function validateManifestCommon(manifest: Manifest): void {
  if (manifest.manifest_version !== 3) {
    failValidation(
      VALIDATION_CONTEXT.COMMON,
      `Campo 'manifest_version' deve ser 3. Recebido: ${String(manifest.manifest_version)}`,
    );
  }

  expectNonEmptyString(manifest.name, 'name', VALIDATION_CONTEXT.COMMON);
  expectVersionString(manifest.version, 'version', VALIDATION_CONTEXT.COMMON);
  expectNonEmptyString(manifest.description, 'description', VALIDATION_CONTEXT.COMMON);

  if (!isObject(manifest.action)) {
    failValidation(VALIDATION_CONTEXT.COMMON, "Campo 'action' e obrigatorio e deve ser um objeto.");
  }

  const popupPath = expectNonEmptyString(
    manifest.action.default_popup,
    'action.default_popup',
    VALIDATION_CONTEXT.COMMON,
  );
  ensureFileExistsFromRoot(popupPath, 'action.default_popup', VALIDATION_CONTEXT.COMMON);

  if (!isObject(manifest.icons)) {
    failValidation(VALIDATION_CONTEXT.COMMON, "Campo 'icons' e obrigatorio e deve ser um objeto.");
  }

  for (const size of REQUIRED_ICON_SIZES) {
    const iconPath = expectNonEmptyString(
      manifest.icons[size],
      `icons.${size}`,
      VALIDATION_CONTEXT.COMMON,
    );
    ensureFileExistsFromRoot(iconPath, `icons.${size}`, VALIDATION_CONTEXT.COMMON);
  }

  const permissions = expectArrayOfStrings(
    manifest.permissions,
    'permissions',
    VALIDATION_CONTEXT.COMMON,
  );
  if (!permissions.includes('storage')) {
    failValidation(VALIDATION_CONTEXT.COMMON, "Campo 'permissions' deve incluir 'storage'.");
  }
}

function validateFirefoxManifest(manifest: Manifest): void {
  if (!isObject(manifest.browser_specific_settings)) {
    failValidation(
      VALIDATION_CONTEXT.FIREFOX,
      "Pacote Firefox requer 'browser_specific_settings.firefox' no manifest.",
    );
  }

  const firefoxSettings = manifest.browser_specific_settings.firefox;
  if (!isObject(firefoxSettings)) {
    failValidation(
      VALIDATION_CONTEXT.FIREFOX,
      "Pacote Firefox requer objeto 'browser_specific_settings.firefox' no manifest.",
    );
  }

  expectNonEmptyString(
    firefoxSettings.id,
    'browser_specific_settings.firefox.id',
    VALIDATION_CONTEXT.FIREFOX,
  );
  expectVersionString(
    firefoxSettings.strict_min_version,
    'browser_specific_settings.firefox.strict_min_version',
    VALIDATION_CONTEXT.FIREFOX,
  );
}

function validateChromeManifest(manifest: Manifest): void {
  if ('browser_specific_settings' in manifest) {
    failValidation(
      VALIDATION_CONTEXT.CHROME,
      "Pacote Chrome nao pode conter 'browser_specific_settings' no manifest final.",
    );
  }
}

function main(): void {
  const manifest = readJsonFile<Manifest>(manifestPath);
  const packageJson = readJsonFile<PackageJson>(packageJsonPath);

  validateManifestCommon(manifest);
  validateFirefoxManifest(manifest);

  runBuild();
  ensureRequiredItems();
  resetDirectories();

  stageCommonFiles(firefoxStageDir);
  stageCommonFiles(chromeStageDir);

  writeManifest(firefoxStageDir, manifest);

  const chromeManifest: Manifest = { ...manifest };
  delete chromeManifest.browser_specific_settings;
  validateChromeManifest(chromeManifest);
  writeManifest(chromeStageDir, chromeManifest);

  const extensionName = slugify(packageJson.name ?? manifest.name ?? 'extension');
  const extensionVersion = manifest.version ?? packageJson.version ?? '0.0.0';

  const firefoxZipPath = path.join(releaseDir, `${extensionName}-v${extensionVersion}-firefox.zip`);
  const chromeZipPath = path.join(releaseDir, `${extensionName}-v${extensionVersion}-chrome.zip`);

  console.log('[package:zip] Creating Firefox ZIP...');
  zipStage(firefoxStageDir, firefoxZipPath);

  console.log('[package:zip] Creating Chrome ZIP...');
  zipStage(chromeStageDir, chromeZipPath);

  console.log('\n[package:zip] Done. Packages created:');
  console.log(`- ${path.relative(rootDir, firefoxZipPath)}`);
  console.log(`- ${path.relative(rootDir, chromeZipPath)}`);

  rmSync(tempDir, { recursive: true, force: true });
}

main();
