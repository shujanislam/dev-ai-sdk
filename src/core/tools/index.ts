import type { ToolConfig } from '../../types/types';
import { SDKError } from '../../core/error';

export async function executeTool(tools: ToolConfig[] | undefined, toolName: string, args: any){
  const tool = tools?.find((tool) => tool.name === toolName);

  if(!tool){
    throw new SDKError(`Tool not found: ${toolName}`, 'core', 'TOOL_NOT_FOUND');
  }

  return await tool.execute(args);
}
