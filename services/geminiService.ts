
import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult } from "../types";

export const analyzePlate = async (base64Image: string): Promise<DetectionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: "Analyze this image and identify the vehicle's license plate. Extract the alphanumeric characters exactly as they appear on the plate. If there are multiple plates, focus on the most prominent one. Return the results in a JSON format.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plateNumber: {
            type: Type.STRING,
            description: "The extracted license plate number characters.",
          },
          confidence: {
            type: Type.STRING,
            description: "A qualitative confidence score (e.g., High, Medium, Low).",
          },
          vehicleDescription: {
            type: Type.STRING,
            description: "A brief description of the vehicle (color, make, type).",
          },
          region: {
            type: Type.STRING,
            description: "The estimated region or state of the license plate, if discernible.",
          }
        },
        required: ["plateNumber", "confidence", "vehicleDescription"],
      },
    },
  });

  const jsonStr = response.text?.trim() || "{}";
  try {
    return JSON.parse(jsonStr) as DetectionResult;
  } catch (e) {
    throw new Error("Failed to parse AI response. The image might be too blurry or not contain a visible plate.");
  }
};
