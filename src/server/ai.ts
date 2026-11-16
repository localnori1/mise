// One way to call a model for every AI step (interviewer, setup drafter,
// synthesis). Requests go through the owner's AI Gateway, which applies the
// spend limit and, for third-party models such as Claude, bills prepaid credits.

export type Message = { role: "system" | "user" | "assistant"; content: string };

// OpenAI-style names from Workers AI models, Anthropic-style from Claude.
export type Usage = { prompt_tokens?: number; completion_tokens?: number; input_tokens?: number; output_tokens?: number };

export type ModelTarget = { ai: Ai; gateway: string; model: string };

// Workers AI models return text in different shapes depending on the model.
function extractText(result: any): string {
  if (typeof result?.response === "string") return result.response;
  if (result?.response && typeof result.response === "object") return JSON.stringify(result.response);
  // Reasoning models can spend the whole token budget thinking and return null
  // content; treat that as unparseable text so callers' retry handles it.
  if (Array.isArray(result?.choices)) return result.choices[0]?.message?.content ?? "";
  // Anthropic Messages shape (Claude through AI Gateway).
  if (Array.isArray(result?.content)) {
    return result.content.filter((part: any) => part.type === "text").map((part: any) => part.text).join("");
  }
  const message = result?.output?.find?.((part: any) => part.type === "message");
  const text = message?.content?.find?.((part: any) => part.type === "output_text")?.text;
  if (typeof text === "string") return text;
  // Log the shape only: the content may contain respondent answers.
  throw new Error(`Unrecognized model response shape, keys: ${Object.keys(result ?? {}).join(", ")}`);
}

export async function callModel({ ai, gateway, model }: ModelTarget, messages: Message[], maxTokens = 4096) {
  // Claude takes the Anthropic Messages shape: system is a top-level field,
  // not a message role. The budget leaves room for adaptive thinking.
  const input = model.startsWith("anthropic/")
    ? {
        system: messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n"),
        messages: messages.filter((m) => m.role !== "system"),
        max_tokens: maxTokens,
      }
    : { messages, max_tokens: maxTokens };
  const result: any = await ai.run(model as any, input as any, { gateway: { id: gateway } });
  return { text: extractText(result), usage: (result?.usage ?? {}) as Usage };
}

// The first {...} block in a reply, parsed; null if there is none or it isn't JSON.
export function parseJsonObject(text: string): Record<string, any> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const value = JSON.parse(text.slice(start, end + 1));
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

// Fill {{key}} placeholders; an unknown placeholder is a bug, not user input.
export function fillPrompt(template: string, values: Record<string, string>, name: string): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in values)) throw new Error(`${name} prompt has unknown placeholder {{${key}}}`);
    return values[key];
  });
}
