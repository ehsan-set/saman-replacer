import axios from "axios";
import Cookies from "js-cookie";

export async function streamChatGPTAnswer(question, contextNote, onChunk) {
  const apiKey = Cookies.get("openai_api_key");
  const model = Cookies.get("openai_model") || "gpt-3.5-turbo";

  if (!apiKey) {
    throw new Error("OpenAI API key not set in cookies.");
  }

  const formattingNotes =
    "Use HTML <li> points to format your response and <strong> to highlight keywords.";

  const prompt = `${contextNote}\n\nUser: ${question}\n Note: ${formattingNotes} \n Assistant:`;
  console.log("prompt:", prompt);

  const requestBody = {
    model,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    stream: true, // Enable streaming response
    temperature: 0.7,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.body) {
    throw new Error("No response body.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;
  let finalAnswer = "";

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    // Use { stream: true } so partial chunks are processed immediately
    const chunkValue = decoder.decode(value, { stream: true });
    const lines = chunkValue.split("\n").filter((line) => line.trim() !== "");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "");
        if (data === "[DONE]") {
          done = true;
          break;
        }
        try {
          const json = JSON.parse(data);
          const token = json.choices[0]?.delta?.content;
          if (token) {
            finalAnswer += token;
            // Invoke the callback on each token so the UI updates incrementally
            onChunk(token, finalAnswer);
          }
        } catch (err) {
          console.error("Error parsing stream chunk", err);
        }
      }
    }
  }
  return finalAnswer;
}

// This function takes a user question and context note,
// constructs a prompt, and returns a response from ChatGPT.
export async function getChatGPTAnswer(question, contextNote) {
  try {
    const apiKey = Cookies.get("openai_api_key");
    const model = Cookies.get("openai_model") || "gpt-3.5-turbo";

    if (!apiKey) {
      throw new Error("OpenAI API key not set in cookies.");
    }

    // Construct your prompt by combining context and the question
    // (Adjust formatting as needed.)
    const prompt = `${contextNote}\n\nUser: ${question}\nAssistant:`;

    // Build request body for Chat Completion API
    // The `messages` format is used for GPT-3.5/GPT-4 endpoints
    // Basic example with a single user message containing the combined prompt
    const requestBody = {
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      // Adjust temperature, etc., based on your preferences
      temperature: 0.7,
    };

    // Make the request to the Chat Completion endpoint
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extract the assistant's message
    const answer = response.data.choices[0]?.message?.content?.trim() || "";
    return answer;
  } catch (error) {
    console.error("Error while calling ChatGPT API:", error);
    // Re-throw so the calling code can handle errors (e.g. show an error message)
    throw error;
  }
}
