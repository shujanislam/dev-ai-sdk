import { readFile, writeFile } from 'node:fs/promises';

export async function readFileTool(args: { filePath: string }) {
  return await readFile(args.filePath, 'utf-8');
}

export async function writeFileTool(args: { filePath: string; data: string }) {
  await writeFile(args.filePath, args.data, 'utf-8');
  return `File written successfully: ${args.filePath}`;
}
