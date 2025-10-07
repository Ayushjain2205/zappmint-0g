import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";

// Official 0G Services as per documentation
const OFFICIAL_PROVIDERS = {
  "gpt-oss-120b": "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
  "deepseek-r1-70b": "0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3",
};

export async function POST(request: NextRequest) {
  try {
    const { action, message, providerAddress } = await request.json();

    // Validate required fields
    if (!action) {
      return NextResponse.json(
        {
          error:
            "Action is required. Supported actions: listServices, getBalance, addFunds, acknowledgeProvider, inference",
        },
        { status: 400 },
      );
    }

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

    switch (action) {
      case "listServices": {
        const services = await broker.inference.listService();
        return NextResponse.json({
          success: true,
          data: {
            services: services.map((service) => ({
              provider: service.provider,
              serviceType: service.serviceType,
              url: service.url,
              inputPrice: service.inputPrice.toString(),
              outputPrice: service.outputPrice.toString(),
              updatedAt: service.updatedAt.toString(),
              model: service.model,
              verifiability: service.verifiability,
            })),
            officialProviders: OFFICIAL_PROVIDERS,
          },
        });
      }

      case "getBalance": {
        const account = await broker.ledger.getLedger();
        return NextResponse.json({
          success: true,
          data: {
            balance: ethers.formatEther(account.totalBalance),
            balanceWei: account.totalBalance.toString(),
          },
        });
      }

      case "addFunds": {
        const { amount } = await request.json();
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { error: "Valid amount is required" },
            { status: 400 },
          );
        }

        await broker.ledger.addLedger(amount);
        const account = await broker.ledger.getLedger();

        return NextResponse.json({
          success: true,
          data: {
            message: `Added ${amount} OG tokens`,
            newBalance: ethers.formatEther(account.totalBalance),
          },
        });
      }

      case "acknowledgeProvider": {
        if (!providerAddress) {
          return NextResponse.json(
            { error: "Provider address is required" },
            { status: 400 },
          );
        }

        await broker.inference.acknowledgeProviderSigner(providerAddress);
        return NextResponse.json({
          success: true,
          data: {
            message: `Provider ${providerAddress} acknowledged successfully`,
          },
        });
      }

      case "inference": {
        if (!message || !providerAddress) {
          return NextResponse.json(
            {
              error: "Message and provider address are required for inference",
            },
            { status: 400 },
          );
        }

        // Get service metadata
        const { endpoint, model } =
          await broker.inference.getServiceMetadata(providerAddress);

        // Generate auth headers
        const messages = [{ role: "user", content: message }];
        const headers = await broker.inference.getRequestHeaders(
          providerAddress,
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
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Inference request failed: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        const answer = data.choices[0].message.content;
        const chatID = data.id;

        // Process response for verification (if applicable)
        let isValid = null;
        try {
          isValid = await broker.inference.processResponse(
            providerAddress,
            answer,
            chatID,
          );
        } catch (verificationError) {
          console.warn("Response verification failed:", verificationError);
        }

        return NextResponse.json({
          success: true,
          data: {
            answer,
            chatID,
            model,
            provider: providerAddress,
            verified: isValid,
            usage: data.usage || null,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("0G Compute API Error:", error);
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
    message: "0G Compute Network API",
    version: "1.0.0",
    supportedActions: [
      "listServices",
      "getBalance",
      "addFunds",
      "acknowledgeProvider",
      "inference",
    ],
    officialProviders: OFFICIAL_PROVIDERS,
    usage: {
      method: "POST",
      body: {
        action: "string (required)",
        message: "string (for inference)",
        providerAddress: "string (for acknowledgeProvider and inference)",
        amount: "number (for addFunds)",
      },
    },
    environmentVariables: {
      PRIVATE_KEY: "string (required) - Private key for wallet authentication",
    },
  });
}
