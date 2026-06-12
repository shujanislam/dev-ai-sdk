import { readFile } from 'node:fs/promises'

export async function readFileTool(args: { filePath: string} ){
  return await readFile(args.filePath, 'utf-8')
}
