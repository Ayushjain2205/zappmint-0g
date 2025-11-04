"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestThirdwebContractPage() {
  const [tokenName, setTokenName] = useState("Ayush APP");
  const [tokenSymbol, setTokenSymbol] = useState("AYUSH");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Hardcoded values
  const secretKey =
    "aFc4HqqoULTbt_6d4w8U0JMclATxT5Rid1nBDRyAo8w9-oS7f5MQ2zDboOe7lIQZM_VY7IEgJUM7MjFn0-8qPw";
  const contractAddress = "0xcFCBC223bf658dD24b918Aa03F483FfAB940703b";
  const method =
    "function createAppToken(string name, string symbol) returns (address tokenAddress)";
  const chainId = 11155111;
  const fromAddress = "0xCafa93E9985793E2475bD58B9215c21Dbd421fD0";

  const callContract = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        "https://api.thirdweb.com/v1/contracts/write",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-secret-key": secretKey,
          },
          body: JSON.stringify({
            calls: [
              {
                contractAddress: contractAddress,
                method: method,
                params: [tokenName, tokenSymbol],
              },
            ],
            chainId: chainId,
            from: fromAddress,
          }),
        },
      );

      const data = await response.json();
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
    } catch (error: any) {
      setResult({
        error: "Failed to call API",
        details: error?.message || String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Thirdweb Contract Write Test
      </h1>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Token Name
            </label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="w-full rounded-md border p-2 text-gray-900 dark:bg-gray-800 dark:text-white"
              placeholder="Token name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Token Symbol
            </label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="w-full rounded-md border p-2 text-gray-900 dark:bg-gray-800 dark:text-white"
              placeholder="Token symbol"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={callContract}
          disabled={loading || !tokenName || !tokenSymbol}
          className="p-4 text-lg"
        >
          {loading ? "Calling Contract..." : "Call createAppToken"}
        </Button>
      </div>

      {loading && (
        <div className="py-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-2 text-gray-900 dark:text-white">
            Processing contract call...
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Result:
          </h2>
          {result.error ? (
            <div className="rounded-md bg-red-50 p-4">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-sm text-red-700">{result.error}</p>
              {result.details && (
                <pre className="mt-2 text-xs text-red-600">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`rounded-md p-4 ${
                  result.status >= 200 && result.status < 300
                    ? "bg-green-50"
                    : "bg-yellow-50"
                }`}
              >
                <h3
                  className={`font-semibold ${
                    result.status >= 200 && result.status < 300
                      ? "text-green-800"
                      : "text-yellow-800"
                  }`}
                >
                  HTTP {result.status} {result.statusText}
                </h3>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Response Data:
                </h3>
                <pre className="max-h-96 overflow-auto rounded-md bg-gray-100 p-4 text-sm text-gray-900 dark:bg-gray-800 dark:text-white">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 rounded-md bg-blue-50 p-4 dark:bg-blue-900">
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
          How to use:
        </h3>
        <ol className="list-inside list-decimal space-y-1 text-sm text-gray-900 dark:text-white">
          <li>Enter the token name</li>
          <li>Enter the token symbol</li>
          <li>
            Click &quot;Call createAppToken&quot; to execute the contract call
          </li>
        </ol>

        <div className="mt-4 rounded border-l-4 border-blue-400 bg-blue-50 p-3 dark:bg-blue-900">
          <p className="text-sm text-gray-900 dark:text-white">
            <strong>Note:</strong> All other parameters are hardcoded. Make sure
            the wallet address has sufficient funds to pay for gas fees.
          </p>
        </div>
      </div>
    </div>
  );
}
