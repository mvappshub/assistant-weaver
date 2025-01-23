import { ModelProvider, Message } from "@/types";

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const DEEPSEEK_API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

export async function generateResponse(
  message: string,
  provider: ModelProvider,
  apiKey: string,
  systemPrompt?: string
): Promise<string> {
  if (provider === "gemini-pro") {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          ...(systemPrompt ? [{ role: "system", parts: [{ text: systemPrompt }] }] : []),
          { role: "user", parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } else {
    const response = await fetch(DEEPSEEK_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }
}