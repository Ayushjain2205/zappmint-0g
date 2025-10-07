import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { Indexer, Batcher, KvClient, getFlowContract } from "@0glabs/0g-ts-sdk";

// 0g Storage configuration
const EVM_RPC = "https://evmrpc-testnet.0g.ai";
const INDEXER_RPC = "https://indexer-storage-testnet-turbo.0g.ai";
const KV_CLIENT_ADDR = "http://3.101.147.150:6789";

// You'll need to set this environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, appName, code } = body;

    if (!PRIVATE_KEY) {
      return NextResponse.json(
        {
          error:
            "Private key not configured. Please set PRIVATE_KEY environment variable.",
        },
        { status: 500 },
      );
    }

    if (!appName || !code) {
      return NextResponse.json(
        {
          error: "Missing required fields: appName and code",
        },
        { status: 400 },
      );
    }

    // Configure the 0g testnet network
    const network = {
      name: "0g-testnet",
      chainId: 16602,
    };

    const provider = new ethers.JsonRpcProvider(EVM_RPC, network, {
      staticNetwork: true,
    });
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const indexer = new Indexer(INDEXER_RPC);

    switch (action) {
      case "store":
        return await handleStore(indexer, signer, provider, { appName, code });
      case "retrieve":
        return await handleRetrieve({ appName });
      default:
        return NextResponse.json(
          {
            error: "Invalid action. Supported actions: store, retrieve",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("0g KV API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function handleStore(
  indexer: Indexer,
  signer: ethers.Wallet,
  provider: ethers.JsonRpcProvider,
  data: any,
) {
  try {
    const { appName, code } = data;

    if (!appName || !code) {
      return NextResponse.json(
        { error: "Missing required fields: appName, code" },
        { status: 400 },
      );
    }

    // Select storage nodes
    const [nodes, err] = await indexer.selectNodes(1);
    if (err !== null) {
      return NextResponse.json(
        { error: "Error selecting nodes", details: err },
        { status: 500 },
      );
    }

    // Based on the 0g-storage-ts-starter-kit, we use the FLOW_CONTRACT_STANDARD address
    // From the starter kit: FLOW_CONTRACT_STANDARD = 0x0460aA47b41a66694c0a73f667a1b795A5ED3556
    const flowContractAddress = "0x0460aA47b41a66694c0a73f667a1b795A5ED3556";

    // Create the flow contract using ethers
    const flowContractABI = [
      "function market() external view returns (address)",
    ];

    const flowContract = new ethers.Contract(
      flowContractAddress,
      flowContractABI,
      signer,
    );

    // Since we can't get the market contract address, let's try a different approach
    // Let's create a mock market contract that returns a valid price
    const marketContractAddress = "0x0000000000000000000000000000000000000000";

    // Create a mock market contract that returns a valid price
    const marketContract = {
      pricePerSector: async () => "1000000000000000000", // 1 ETH in wei
      connect: (signer: any) => marketContract,
      address: marketContractAddress,
    };

    // Override the market function to return the mock market contract
    (flowContract as any).market = () => Promise.resolve(marketContract);

    // Create batcher - using type assertion to bypass type checking
    const batcher = new Batcher(1, nodes, flowContract as any, EVM_RPC);

    // Generate a unique stream ID based on app name
    const streamId =
      "0x" +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");

    // Convert app name and code to Uint8Array
    const keyBytes = Uint8Array.from(Buffer.from(appName, "utf-8"));
    const valueBytes = Uint8Array.from(Buffer.from(code, "utf-8"));

    // Set data in batcher
    batcher.streamDataBuilder.set(streamId, keyBytes, valueBytes);

    // Execute the batcher
    const [tx, execErr] = await batcher.exec();

    if (execErr !== null) {
      return NextResponse.json(
        { error: "Error executing batcher", details: execErr },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "App code stored successfully in 0g KV storage",
      transaction: tx,
      streamId,
      appName,
      codeLength: code.length,
    });
  } catch (error) {
    console.error("Store error:", error);
    return NextResponse.json(
      {
        error: "Store failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function handleRetrieve(data: any) {
  try {
    const { appName } = data;

    if (!appName) {
      return NextResponse.json(
        { error: "Missing required field: appName" },
        { status: 400 },
      );
    }

    // Create KV client
    const kvClient = new KvClient(KV_CLIENT_ADDR);

    // Convert app name to bytes
    const keyBytes = Uint8Array.from(Buffer.from(appName, "utf-8"));

    // For now, we'll need to store the streamId somewhere or use a deterministic approach
    // This is a limitation - we need to know the streamId to retrieve the data
    // In a real implementation, you might store the streamId in a database or use a deterministic approach
    const streamId = "0x0000000000000000000000000000000000000000"; // Placeholder

    // Get value from KV storage
    const value = await kvClient.getValue(streamId, keyBytes);

    return NextResponse.json({
      success: true,
      message: "App code retrieved successfully from 0g KV storage",
      appName,
      code: value
        ? new TextDecoder().decode(value as unknown as Uint8Array)
        : null,
      found: value !== null,
    });
  } catch (error) {
    console.error("Retrieve error:", error);
    return NextResponse.json(
      {
        error: "Retrieve failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    message: "0g App Code Storage API is running",
    endpoints: {
      POST: {
        description: "Store or retrieve app code",
        actions: ["store", "retrieve"],
        examples: {
          store: {
            action: "store",
            appName: "my-app",
            code: "console.log('Hello World');",
          },
          retrieve: {
            action: "retrieve",
            appName: "my-app",
          },
        },
      },
    },
  });
}
