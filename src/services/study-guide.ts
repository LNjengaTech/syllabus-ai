// this service takes the same context used in the chat but formats it specifically for learning

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateStudyMaterial(context: string, type: 'flashcards' | 'summary') {
  const prompts = {
    flashcards: `Based on the following syllabus content, create 5 high-quality flashcards. 
                 Format each card exactly like this:
                 Front: [A clear, concise question]
                 Back: [A brief, accurate answer]
                 
                 Separate each card with a line of dashes (---).`,
    summary: `Provide a "High-Level Summary" of this material. 
              Use bullet points and bold headers. 
              Focus on the key concepts a student must master for an exam.`
  };

  const response = await groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an expert academic tutor. You specialize in converting complex syllabi into simple study materials." 
      },
      { role: "user", content: `CONTEXT:\n${context}\n\nTASK: ${prompts[type]}` }
    ],
    model: "llama-3.1-8b-instant",
  });

  return response.choices[0].message.content;
}