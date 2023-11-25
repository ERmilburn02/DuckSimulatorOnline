import OpenAI from "openai";

class OpenAISingleton {
  private static instance: OpenAI;

  private constructor() {} // Private constructor to prevent external instantiation

  public static getInstance(): OpenAI {
    if (!OpenAISingleton.instance) {
      OpenAISingleton.instance = new OpenAI();
      // Additional configuration or setup can be done here
    }
    return OpenAISingleton.instance;
  }
}

export const openai = OpenAISingleton.getInstance();
