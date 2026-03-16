import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const storageRoot = path.join(process.cwd(), "storage", "uploads");

export async function ensureStorageRoot() {
  await mkdir(storageRoot, { recursive: true });
}

export async function saveCourseFile(file: File) {
  await ensureStorageRoot();

  const extension = path.extname(file.name);
  const storedName = `${randomUUID()}${extension}`;
  const relativePath = path.join("uploads", storedName);
  const fullPath = path.join(process.cwd(), "storage", relativePath);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(fullPath, buffer);

  return {
    fileName: file.name,
    filePath: relativePath,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: buffer.byteLength,
  };
}

export async function removeStoredFile(filePath: string) {
  const fullPath = path.join(process.cwd(), "storage", filePath);

  try {
    await unlink(fullPath);
  } catch {
    // Ignore missing files so database cleanup can still complete.
  }
}
