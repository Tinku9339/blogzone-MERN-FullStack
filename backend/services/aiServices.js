import { GoogleGenAI } from '@google/genai';

export const generateBlogDescriptionService = async (title, category) => {
  if (!title) {
    throw new Error("Title is required to generate a description");
  }

  // 1. Verify the API key is actually loaded from .env
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables!");
  }

  // 2. Initialize inside the service or pass it cleanly
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `Write an engaging, SEO-friendly short blog description (about 2 to 3 short sentences) for a blog post titled "${title}" under the category "${category || 'General'}". Return only the description text without any quotes or conversational filler.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    throw new Error("Failed to generate description from AI: " + error.message);
  }
};