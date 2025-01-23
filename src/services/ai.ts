export async function generateResponse(
  message: string,
  model: string,
  apiKey: string,
  systemPrompt?: string
): Promise<string> {
  const endpoint = model === "gemini-pro" 
    ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    : "https://api.deepseek.com/v1/chat/completions";

  let response;
  
  if (model === "gemini-pro") {
    const payload = {
      contents: [
        ...(systemPrompt ? [{
          role: "user",
          parts: [{ text: systemPrompt }]
        }] : []),
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    };

    response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
  } else {
    const payload = {
      model: "deepseek-chat",
      messages: [
        ...(systemPrompt ? [{
          role: "system",
          content: systemPrompt
        }] : []),
        {
          role: "user",
          content: message
        }
      ]
    };

    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (model === "gemini-pro") {
    return data.candidates[0].content.parts[0].text;
  } else {
    return data.choices[0].message.content;
  }
}