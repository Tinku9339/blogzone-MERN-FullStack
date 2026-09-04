import { GoogleGenAI } from '@google/genai';

// Clean code blocks or markdown wrappers from AI output
const cleanAiOutput = (rawText) => {
  if (!rawText) return '';
  let cleaned = rawText.trim();
  // Strip leading ```html or ``` and trailing ```
  cleaned = cleaned.replace(/^```(?:html)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  return cleaned.trim();
};

// Intelligent structured editorial generator for zero-limit, free, instant drafting
const generateContextualDescription = (title, category) => {
  const cat = (category || 'General').trim();
  const cleanTitle = title.trim().replace(/[.!?]+$/, '');

  const hooks = [
    `In an era where the landscape of ${cat} is rapidly evolving, "${cleanTitle}" represents a pivotal turning point for thinkers and creators alike. Understanding how to navigate these changes requires both strategic foresight and grounded execution.`,
    `Every transformative movement in ${cat} begins with a fundamental question. In exploring "${cleanTitle}", we uncover the critical principles and deeper patterns that separate temporary noise from lasting impact.`,
    `The intersection of creativity and disciplined methodology is where breakthroughs happen. "${cleanTitle}" challenges conventional wisdom in ${cat} and invites us to reconsider how we approach modern problems.`,
    `Navigating the complexities of ${cat} demands more than surface-level knowledge. In this comprehensive look at "${cleanTitle}", we break down the actionable insights necessary to build sustainable momentum.`,
  ];

  const quotes = [
    `"True mastery in any discipline is not measured by the complexity we introduce, but by the clarity and purpose we leave behind."`,
    `"The future does not belong to those who merely react to change, but to those who deliberately architect it."`,
    `"Simplicity is not the absence of nuance; it is the ultimate expression of intentionality and focus."`,
  ];

  const hash = cleanTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedHook = hooks[hash % hooks.length];
  const selectedQuote = quotes[hash % quotes.length];

  return `<p class="ql-size-large ql-font-fraunces">${selectedHook}</p>

<blockquote class="ql-font-playfair">${selectedQuote}</blockquote>

<h2>1. The Foundation & Core Dynamics</h2>
<p>When examining "${cleanTitle}", the primary challenge often lies in distinguishing foundational principles from ephemeral trends. By focusing on root causes rather than symptoms, practitioners in ${cat} can design systems that remain resilient amidst constant shifts.</p>
<p>Deliberate craftsmanship requires patience and iteration. When we treat our work as an evolving dialogue between theory and practice, unexpected synergies begin to emerge.</p>

<h2>2. Key Takeaways & Actionable Principles</h2>
<ul>
  <li><strong>Intentional Architecture:</strong> Establish clear boundaries and decoupled structures that accommodate future iterations seamlessly.</li>
  <li><strong>Continuous Calibration:</strong> Regularly test assumptions against empirical evidence and real-world feedback loops.</li>
  <li><strong>Sustainable Momentum:</strong> Prioritize deliberate, consistent progress over sporadic bursts of unstructured effort.</li>
  <li><strong>Clarity of Purpose:</strong> Ensure every decision serves a direct, well-defined objective for your readers and users.</li>
</ul>

<h2>3. Looking Forward: The Path Ahead</h2>
<p>As you apply these insights to "${cleanTitle}", remember that meaningful growth is cumulative. Embrace the process of refinement, question default assumptions, and stay relentlessly curious about the nuances of ${cat}.</p>`;
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
      const prompt = `Act as an expert editorial writer. Write a high-quality, comprehensive, and well-structured blog article for:
Title: "${title}"
Category: "${category || 'General'}"

Structure requirements:
1. Opening Hook: An engaging lead paragraph introducing the topic with depth and authority.
2. Key Quote: A memorable, inspiring pull-quote inside a <blockquote>.
3. Main Sections: 2 to 3 detailed sections with <h2> headings and rich, descriptive paragraphs.
4. Key Takeaways: An actionable bulleted list with 3-4 key principles (each with <strong>Concept:</strong> explanation).
5. Conclusion: A forward-looking final section with an <h2> heading and an inspiring closing paragraph.

Formatting Rules:
- Return ONLY the clean markup elements ready to render visually in the editor.
- Do NOT wrap in \`\`\`html or \`\`\` code blocks.
- Do NOT include conversational filler like "Here is your article:". Start directly with the opening paragraph.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      if (response && response.text) {
        const cleaned = cleanAiOutput(response.text);
        if (cleaned) {
          return cleaned;
        }
      }
    } catch (error) {
      console.warn("Gemini API call failed, using intelligent editorial generator fallback:", error.message);
    }
  }

  // Instant, free, zero-limit structured editorial fallback
  return generateContextualDescription(title, category);
};