"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Test0GComputePage() {
  const [message, setMessage] = useState("Hello, how are you?");
  const [providerAddress, setProviderAddress] = useState(
    "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
  ); // gpt-oss-120b
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const callAPI = async (action: string, additionalData: any = {}) => {
    setLoading(true);
    try {
      const response = await fetch("/api/0g-compute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          message,
          providerAddress,
          ...additionalData,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to call API", details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">0G Compute Network Test</h1>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Provider Address
          </label>
          <select
            value={providerAddress}
            onChange={(e) => setProviderAddress(e.target.value)}
            className="w-full rounded-md border p-2"
          >
            <option value="0xf07240Efa67755B5311bc75784a061eDB47165Dd">
              gpt-oss-120b (0xf07240Efa67755B5311bc75784a061eDB47165Dd)
            </option>
            <option value="0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3">
              deepseek-r1-70b (0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3)
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Message for Inference
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-20 w-full rounded-md border p-2"
            placeholder="Enter your message for AI inference"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Button
          onClick={() => callAPI("listServices")}
          disabled={loading}
          className="p-4"
        >
          List Services
        </Button>

        <Button
          onClick={() => callAPI("getBalance")}
          disabled={loading}
          className="p-4"
        >
          Get Balance
        </Button>

        <Button
          onClick={() => callAPI("addFunds", { amount: 1 })}
          disabled={loading}
          className="p-4"
        >
          Add 1 OG Token
        </Button>

        <Button
          onClick={() => callAPI("acknowledgeProvider")}
          disabled={loading || !providerAddress}
          className="p-4"
        >
          Acknowledge Provider
        </Button>

        <Button
          onClick={() => callAPI("inference")}
          disabled={loading || !providerAddress || !message}
          className="p-4"
        >
          Run Inference
        </Button>
      </div>

      {loading && (
        <div className="py-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-2">Processing...</p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Result:</h2>
          <pre className="overflow-auto rounded-md bg-gray-100 p-4 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 rounded-md bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold">How to use:</h3>
        <ol className="list-inside list-decimal space-y-1 text-sm">
          <li>Make sure PRIVATE_KEY is set in your environment variables</li>
          <li>Select a provider (gpt-oss-120b or deepseek-r1-70b)</li>
          <li>Click &quot;Get Balance&quot; to check your account balance</li>
          <li>
            Click &quot;Add 1 OG Token&quot; to fund your account if needed
          </li>
          <li>
            Click &quot;Acknowledge Provider&quot; to acknowledge the selected
            provider
          </li>
          <li>
            Enter a message and click &quot;Run Inference&quot; to test AI
            inference
          </li>
        </ol>

        <div className="mt-4 rounded border-l-4 border-blue-400 bg-blue-50 p-3">
          <p className="text-sm">
            <strong>Note:</strong> The private key is configured via the
            PRIVATE_KEY environment variable. Make sure to use a test wallet
            with testnet funds.
          </p>
        </div>
      </div>
    </div>
  );
}
