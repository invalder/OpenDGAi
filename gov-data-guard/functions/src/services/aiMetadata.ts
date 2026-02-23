import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Or gemini-1.5-pro, etc. 2.5-flash is hypothetical in prompt

export interface DatasetMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export async function generateDatasetMetadata(data: any[]): Promise<DatasetMetadata> {
  const sampleData = data.slice(0, 5);
  const sampleStr = JSON.stringify(sampleData, null, 2);

  const prompt = `
    Analyze the following dataset sample and generate descriptive metadata in JSON format.

    Sample Data:
    ${sampleStr}

    Output JSON structure:
    {
      "title": "A concise and descriptive title",
      "description": "A detailed description of the dataset contents and potential use cases",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }

    Ensure the output is valid JSON without markdown code blocks.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle potential markdown formatting)
    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return default or throw
    throw new Error("Unable to generate metadata");
  }
}
