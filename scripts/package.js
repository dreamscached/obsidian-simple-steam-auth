import archiver from "archiver";
import { createWriteStream } from "node:fs";
import { mkdir, cp, readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(projectRoot, "dist");
const distZipDir = join(distDir, "zip");

const mainJs = join(distDir, "main.js");
const manifestJson = join(projectRoot, "manifest.json");

const [pluginName, pluginVersion] = await getPackageNameVersion();
const releaseBase = `${pluginName}-v${pluginVersion}`;
const releaseZip = join(distDir, `${releaseBase}.zip`);

await mkdir(distZipDir, { recursive: true });
await copyDistFile(mainJs);
await copyDistFile(manifestJson);
await createDistZip();

async function getPackageNameVersion() {
	const content = await readFile(manifestJson, "utf-8");
	const { id, version } = JSON.parse(content);
	return [id, version];
}

async function copyDistFile(path) {
	const filename = basename(path);
	console.log(` ✔ Included ${filename} in release`);
	await cp(path, join(distZipDir, filename));
}

function createDistZip() {
	const ws = createWriteStream(releaseZip);
	const zip = archiver.create("zip", { zlib: { level: 9 } });
	return new Promise((resolve, reject) => {
		ws.on("error", (err) => reject(err));
		ws.on("close", () => {
			console.log(` ✔ ${basename(releaseZip)} built`);
			resolve();
		});

		zip.pipe(ws);
		zip.directory(distZipDir, releaseBase);
		zip.finalize();
	});
}
