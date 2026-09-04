import { GoogleGenAI } from '@google/genai';

// Intelligent editorial generator for zero-limit, free, instant drafting
const generateContextualDescription = (title, category) => {
  const cat = (category || 'General').trim();
  const cleanTitle = title.trim().replace(/[.!?]+$/, '');

  const hooks = [
    `In this in-depth look at "${cleanTitle}", we explore the key insights and actionable takeaways shaping the future of ${cat}.`,
    `A practical, thought-provoking examination of "${cleanTitle}" — unpacking what matters most for modern readers interested in ${cat}.`,
    `Delve into the essential principles behind "${cleanTitle}" and discover fresh perspectives on navigating today's ${cat} landscape.`,
    `Explore the ideas, challenges, and breakthroughs at the heart of "${cleanTitle}", tailored for anyone passionate about ${cat}.`,
    `From foundational concepts to advanced strategies, this guide to "${cleanTitle}" provides a clear roadmap for mastering ${cat}.`,
  ];

  const hash = cleanTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedHook = hooks[hash % hooks.length];

  const valueProps = [
    `Learn how to apply these concepts effectively, avoid common pitfalls, and stay ahead in an evolving domain.`,
    `Whether you're starting fresh or refining your current approach, discover critical lessons and real-world examples.`,
    `Gain clear, actionable guidance to make informed decisions and elevate your understanding of the subject.`,
    `Uncover expert tips, proven methodologies, and critical perspectives designed to inform and inspire your next steps.`,
  ];
  const selectedProp = valueProps[(hash + 3) % valueProps.length];

  return `${selectedHook} ${selectedProp}`;
};

export const generateBlogDescriptionService = async (title, category) => {
  if (!title || !title.trim()) {
    throw new Error("Title is required to generate a description");
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // If a real Gemini API key is configured, use Google GenAI
  if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const prompt = `Write an engaging, SEO-friendly short blog description (about 2 to 3 short sentences) for a blog post titled "${title}" under the category "${category || 'General'}". Return only the description text without any quotes or conversational filler.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (error) {
      console.warn("Gemini API call failed, using intelligent editorial generator fallback:", error.message);
    }
  }

  // Instant, free, zero-limit fallback
  return generateContextualDescription(title, category);
};