import type { ToolConfig } from '../../types/types';
import { SDKError } from '../error';

export async function executeTool(tools: ToolConfig[] | undefined, toolName: string, args: any) {
  const tool = tools?.find((tool) => tool.name === toolName);

  if (!tool) {
    throw new SDKError(`Tool not found: ${toolName}`, 'core', 'TOOL_NOT_FOUND');
  }

  try {
    return await tool.execute(args);
  } catch (err) {
    if (err instanceof SDKError) {
      throw err;
    }

    const message = err instanceof Error ? err.message : 'Unknown tool execution error';
    throw new SDKError(`Tool execution failed for ${toolName}: ${message}`, 'core', 'TOOL_EXECUTION_ERROR');
  }
}
