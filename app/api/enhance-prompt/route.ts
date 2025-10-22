import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { getMainCodingPrompt } from "@/lib/prompts";

// Official 0G Services as per documentation
const OFFICIAL_PROVIDERS = {
  "gpt-oss-120b": "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
  "deepseek-r1-70b": "0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3",
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, providerAddress, enhancementType } = await request.json();

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Use default provider if none specified
    const selectedProvider =
      providerAddress || OFFICIAL_PROVIDERS["gpt-oss-120b"];

    // Initialize broker with private key from environment variable
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: "Private key not configured in environment variables" },
        { status: 500 },
      );
    }

    const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
    const wallet = new ethers.Wallet(privateKey, provider);
    const broker = await createZGComputeNetworkBroker(wallet);

    // Get service metadata
    const { endpoint, model } =
      await broker.inference.getServiceMetadata(selectedProvider);

    // Create enhancement prompt based on type
    const enhancementPrompts = {
      technical:
        "Enhance this prompt to be more technical and detailed for a developer:",
      creative:
        "Make this prompt more creative and inspiring while maintaining its core intent:",
      specific:
        "Make this prompt more specific and actionable with clear requirements:",
      concise:
        "Make this prompt more concise while preserving all essential information:",
      detailed:
        "Expand this prompt with more detailed requirements and context:",
      user_friendly:
        "Rewrite this prompt to be more user-friendly and accessible:",
      professional:
        "Enhance this prompt to be more professional and business-oriented:",
    };

    const enhancementPrefix =
      enhancementType &&
      enhancementPrompts[enhancementType as keyof typeof enhancementPrompts]
        ? enhancementPrompts[enhancementType as keyof typeof enhancementPrompts]
        : "Enhance and improve this prompt while maintaining its original intent:";

    const systemPrompt = `You are an expert prompt engineer. Your task is to enhance and improve user prompts to make them more effective, clear, and actionable. 

Guidelines:
- Maintain the original intent and core purpose of the prompt
- Make the prompt clearer and more specific
- Add relevant context and requirements when helpful
- Improve the structure and flow of the prompt
- Ensure the enhanced prompt will produce better results
- Keep the enhanced prompt concise but comprehensive
- If the prompt is for code generation, ensure it includes technical specifications
- If the prompt is for creative work, make it more inspiring and detailed
- Always preserve the original language and tone unless specifically asked to change it

Return only the enhanced prompt without any explanations or commentary.`;

    const userMessage = `${enhancementPrefix}\n\nOriginal prompt: ${prompt}`;

    // Generate auth headers
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];
    const headers = await broker.inference.getRequestHeaders(
      selectedProvider,
      JSON.stringify(messages),
    );

    // Make the inference request
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        messages: messages,
        model: model,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Inference request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const enhancedPrompt = data.choices[0].message.content;
    const chatID = data.id;

    // Process response for verification (if applicable)
    let isValid = null;
    try {
      isValid = await broker.inference.processResponse(
        selectedProvider,
        enhancedPrompt,
        chatID,
      );
    } catch (verificationError) {
      console.warn("Response verification failed:", verificationError);
    }

    return NextResponse.json({
      success: true,
      data: {
        originalPrompt: prompt,
        enhancedPrompt,
        chatID,
        model,
        provider: selectedProvider,
        verified: isValid,
        usage: data.usage || null,
        enhancementType: enhancementType || "general",
        systemPrompt: systemPrompt.substring(0, 200) + "...", // Truncated for response
      },
    });
  } catch (error) {
    console.error("0G Compute Prompt Enhancement API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Enhance Prompt API",
    version: "1.0.0",
    description:
      "Enhance and improve prompts using 0G Compute Network AI inference",
    usage: {
      method: "POST",
      body: {
        prompt: "string (required) - The prompt to enhance",
        providerAddress:
          "string (optional) - Provider address, defaults to gpt-oss-120b",
        enhancementType: "string (optional) - Type of enhancement to apply",
      },
    },
    availableProviders: OFFICIAL_PROVIDERS,
    enhancementTypes: {
      technical: "Make the prompt more technical and detailed for developers",
      creative: "Make the prompt more creative and inspiring",
      specific: "Make the prompt more specific and actionable",
      concise:
        "Make the prompt more concise while preserving essential information",
      detailed: "Expand the prompt with more detailed requirements and context",
      user_friendly:
        "Rewrite the prompt to be more user-friendly and accessible",
      professional:
        "Enhance the prompt to be more professional and business-oriented",
    },
    environmentVariables: {
      PRIVATE_KEY: "string (required) - Private key for wallet authentication",
    },
    examples: {
      basicEnhancement: {
        prompt: "Create a todo app",
        enhancementType: "specific",
      },
      technicalEnhancement: {
        prompt: "Build a website",
        enhancementType: "technical",
      },
      creativeEnhancement: {
        prompt: "Design a logo",
        enhancementType: "creative",
      },
    },
  });
}
