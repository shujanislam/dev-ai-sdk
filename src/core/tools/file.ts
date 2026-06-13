import { readFile, writeFile } from 'node:fs/promises';
import { promises as fs } from 'fs';
import { SDKError } from '../error';
import path from 'node:path';

function getFileErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Unknown file system error';
}

export async function readFileTool(args: { filePath: string }) {
  if (!args.filePath?.trim()) {
    throw new SDKError('filePath is required', 'core', 'TOOL_ARGUMENT_ERROR');
  }

  try {
    return await readFile(args.filePath, 'utf-8');
  } catch (err) {
    throw new SDKError(`Failed to read file ${args.filePath}: ${getFileErrorMessage(err)}`, 'core', 'FILE_TOOL_ERROR');
  }
}

export async function writeFileTool(args: { filePath: string; data: string }) {
  if (!args.filePath?.trim()) {
    throw new SDKError('filePath is required', 'core', 'TOOL_ARGUMENT_ERROR');
  }

  if (typeof args.data !== 'string') {
    throw new SDKError('data must be a string', 'core', 'TOOL_ARGUMENT_ERROR');
  }

  try {
    await writeFile(args.filePath, args.data, 'utf-8');
    return `File written successfully: ${args.filePath}`;
  } catch (err) {
    throw new SDKError(`Failed to write file ${args.filePath}: ${getFileErrorMessage(err)}`, 'core', 'FILE_TOOL_ERROR');
  }
}

export async function listFileTool(args: { filePath: string }) {
  if(!args.filePath?.trim()){
    throw new SDKError('filePath is required', 'core', 'TOOL_ARGUMENT_ERROR');
  }

  try{
    const files: string[] = await fs.readdir(args.filePath);

    return `Files listed in the filePath: ${args.filePath}: ${files}`;  
  }
  catch(err){
    throw new SDKError('Failed to list files', 'core', 'FILE_TOOL_ERROR');
  }
}
