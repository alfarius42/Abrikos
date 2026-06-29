import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "ImageSources");

const INPUT_EXT = new Set([".jpg", ".jpeg", ".jfif", ".png"]);
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

const watchMode = process.argv.includes("--watch");
const forceMode = process.argv.includes("--force");

function isInputFile(filePath) {
  return INPUT_EXT.has(path.extname(filePath).toLowerCase());
}

function webpPathFor(inputPath) {
  return inputPath.replace(/\.(jpe?g|jfif|png)$/i, ".webp");
}

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (entry.isFile() && isInputFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function shouldConvert(inputPath, outputPath) {
  if (forceMode) return true;

  try {
    const [inputStat, outputStat] = await Promise.all([
      stat(inputPath),
      stat(outputPath),
    ]);
    return inputStat.mtimeMs > outputStat.mtimeMs;
  } catch {
    return true;
  }
}

async function convertFile(inputPath) {
  const outputPath = webpPathFor(inputPath);

  if (!(await shouldConvert(inputPath, outputPath))) {
    console.log(`skip  ${path.relative(ROOT, inputPath)} (webp актуален)`);
    return;
  }

  await sharp(inputPath)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  console.log(`ok    ${path.relative(ROOT, inputPath)} -> ${path.relative(ROOT, outputPath)}`);
}

async function convertAll() {
  let files;

  try {
    files = await collectFiles(SOURCE_DIR);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Папка не найдена: ${SOURCE_DIR}`);
      console.error("Создайте ImageSources и положите туда JPEG или PNG.");
      process.exit(1);
    }
    throw error;
  }

  if (files.length === 0) {
    console.log(`В ${SOURCE_DIR} нет JPEG/PNG для конвертации.`);
    return;
  }

  for (const file of files) {
    await convertFile(file);
  }
}

function startWatch() {
  console.log(`Слежу за ${SOURCE_DIR}`);
  console.log("Добавляйте JPEG/PNG — WebP появится рядом. Ctrl+C для выхода.\n");

  const watcher = chokidar.watch(SOURCE_DIR, {
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100,
    },
  });

  const handle = async (filePath) => {
    if (!isInputFile(filePath)) return;

    try {
      await convertFile(filePath);
    } catch (error) {
      console.error(`error ${path.relative(ROOT, filePath)}: ${error.message}`);
    }
  };

  watcher.on("add", handle);
  watcher.on("change", handle);
}

try {
  await stat(SOURCE_DIR);
} catch {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(SOURCE_DIR, { recursive: true });
  console.log(`Создана папка ${SOURCE_DIR}`);
}

if (watchMode) {
  startWatch();
} else {
  await convertAll();
}
