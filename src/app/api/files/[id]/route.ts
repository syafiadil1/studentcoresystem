import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, context: { params: Params }) {
  const { id } = await context.params;
  const file = await prisma.courseFile.findUnique({
    where: { id },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fullPath = path.join(process.cwd(), "storage", file.filePath);
  const buffer = await readFile(fullPath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `inline; filename="${file.fileName}"`,
    },
  });
}
