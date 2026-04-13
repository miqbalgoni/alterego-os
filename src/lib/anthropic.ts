import Anthropic from "@anthropic-ai/sdk";

export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export const MODEL_ORCHESTRATOR =
  process.env.ANTHROPIC_MODEL_ORCHESTRATOR ?? "claude-sonnet-4-5";
export const MODEL_ASKME =
  process.env.ANTHROPIC_MODEL_ASKME ?? "claude-sonnet-4-5";

export function isAnthropicConfigured(): boolean {
  return !!anthropic;
}
