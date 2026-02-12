import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the schema for the JSON response
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    globalScore: {
      type: Type.NUMBER,
      description: "A floating point score between 0.0 and 10.0 representing the overall artistic and technical quality.",
    },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the metric (e.g., 'Composition', 'Color Harmony')" },
          score: { type: Type.NUMBER, description: "Score from 0.0 to 10.0" },
          description: { type: Type.STRING, description: "Brief justification for the score" },
        },
        required: ["name", "score", "description"]
      },
    },
    visualHotspots: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key visual elements or focal points that draw the eye.",
    },
    critique: {
      type: Type.STRING,
      description: "A professional critique of the image emphasizing composition, lighting, and impact.",
    },
    technicalMetadata: {
      type: Type.OBJECT,
      properties: {
        sharpness: { type: Type.STRING, description: "Assessment of image clarity/sharpness" },
        lighting: { type: Type.STRING, description: "Assessment of lighting quality" },
        colorPalette: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "List of hex codes representing the dominant color palette" 
        },
      },
      required: ["sharpness", "lighting", "colorPalette"]
    },
    visualComplexity: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "0-10 score representing complexity (0=Minimalist, 10=Highly Intricate)" },
        description: { type: Type.STRING, description: "Short description of the visual density (e.g., 'Minimalist negative space', 'Chaotic texture')" }
      },
      required: ["score", "description"]
    },
    emotionalImpact: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "0-10 score representing emotional intensity (0=Neutral, 10=Profound)" },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 emotional keywords (e.g., 'Serene', 'Melancholy')" }
      },
      required: ["score", "keywords"]
    },
    intentMetrics: {
      type: Type.OBJECT,
      properties: {
        detected: { type: Type.BOOLEAN, description: "Whether a specific social signaling intent (e.g. thirst trap) is detected." },
        category: { type: Type.STRING, description: "Category of intent (e.g., 'Gym Validation', 'Suggestive Angle', 'Casual Portrait', 'Landscape')." },
        effortScore: { type: Type.NUMBER, description: "0-10 score measuring how 'staged' or 'forced' the image appears." },
        outcomeScore: { type: Type.NUMBER, description: "0-10 score measuring the actual aesthetic success of the attempt." },
        description: { type: Type.STRING, description: "Analysis of the effort vs outcome dynamic." }
      },
      required: ["detected", "category", "effortScore", "outcomeScore", "description"]
    }
  },
  required: ["globalScore", "metrics", "visualHotspots", "critique", "technicalMetadata", "visualComplexity", "emotionalImpact", "intentMetrics"],
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const ai = getAiClient();
  
  // Use 'gemini-3-flash-preview' which supports multimodal inputs.
  const modelId = 'gemini-3-flash-preview';

  const prompt = `
    Act as a senior Biometric Researcher and Aesthetics Architect.
    Analyze the provided image for its aesthetic quality, composition, and behavioral intent.
    
    CRITICAL BENCHMARKING:
    - For any facial analysis, strictly reference the SCUT-FBP5500 dataset standards for facial beauty prediction (geometry, symmetry, skin texture).
    
    1. STANDARD METRICS:
       - Compositional Balance (Rule of thirds, symmetry, golden ratio)
       - Color Harmony (Palette coherence, saturation)
       - Lighting Quality (Exposure, dynamic range)
       - Subject Definition (Clarity, focus)

    2. ADVANCED ANALYSIS:
       - Visual Complexity: Density of detail (0-10).
       - Emotional Impact: Mood and resonance (0-10).

    3. INTENT & BEHAVIORAL ANALYSIS ('Thirst-Trap' Detection):
       - Detect the underlying intent of the photo. Look for markers such as:
         * Gym mirrors / Flexing
         * Suggestive camera angles (high/low perspectives)
         * Deliberate body-centric framing
         * "Candid" posing that is clearly staged
       - Classify the Category (e.g., "Gym Validation", "Suggestive Framing", "Outfit Check", "Standard Portrait").
       - Calculate "Effort" (0-10): How hard is the subject trying? (Staging, posing intensity).
       - Calculate "Outcome" (0-10): How aesthetically successful is the result?
       - SCORING LOGIC: If Effort is High (>7) but Outcome is Low (<5), this is a "Failed Trap" - PENALIZE the Global Score heavily. If Effort is Moderate and Outcome is High, BOOST the Global Score.

    Provide a rigorous, unbiased scoring output.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent/analytical results
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from the model.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
