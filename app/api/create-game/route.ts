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
    const { gameDescription, providerAddress } = await request.json();

    // Validate required fields
    if (!gameDescription) {
      return NextResponse.json(
        { error: "Game description is required" },
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

    // Create the game creation prompt using the existing system prompt
    const systemPrompt = getMainCodingPrompt("none");
    const userMessage = `Create a game: ${gameDescription}`;

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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Inference request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const gameCode = data.choices[0].message.content;
    const chatID = data.id;

    // Process response for verification (if applicable)
    let isValid = null;
    try {
      isValid = await broker.inference.processResponse(
        selectedProvider,
        gameCode,
        chatID,
      );
    } catch (verificationError) {
      console.warn("Response verification failed:", verificationError);
    }

    return NextResponse.json({
      success: true,
      data: {
        gameCode,
        chatID,
        model,
        provider: selectedProvider,
        verified: isValid,
        usage: data.usage || null,
        gameDescription,
        systemPrompt: systemPrompt.substring(0, 200) + "...", // Truncated for response
      },
    });
  } catch (error) {
    console.error("0G Compute Game API Error:", error);
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
    message: "Create Game API",
    version: "1.0.0",
    description: "Create games using 0G Compute Network AI inference",
    usage: {
      method: "POST",
      body: {
        gameDescription:
          "string (required) - Description of the game to create",
        providerAddress:
          "string (optional) - Provider address, defaults to gpt-oss-120b",
      },
    },
    availableProviders: OFFICIAL_PROVIDERS,
    environmentVariables: {
      PRIVATE_KEY: "string (required) - Private key for wallet authentication",
    },
    examples: {
      simpleGame: {
        gameDescription: "A simple tic-tac-toe game with a 3x3 grid",
      },
      puzzleGame: {
        gameDescription: "A memory matching card game with 16 cards",
      },
      arcadeGame: {
        gameDescription: "A snake game where the snake grows when eating food",
      },
    },
  });
}
