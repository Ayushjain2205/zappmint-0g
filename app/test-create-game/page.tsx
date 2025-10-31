"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Test0GGamePage() {
  const [gameDescription, setGameDescription] = useState(
    "A simple tic-tac-toe game with a 3x3 grid",
  );
  const [providerAddress, setProviderAddress] = useState(
    "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
  ); // gpt-oss-120b
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const createGame = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameDescription,
          providerAddress,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to create game", details: error });
    } finally {
      setLoading(false);
    }
  };

  const exampleGames = [
    "A simple tic-tac-toe game with a 3x3 grid",
    "A memory matching card game with 16 cards",
    "A snake game where the snake grows when eating food",
    "A number guessing game with hints",
    "A rock paper scissors game with score tracking",
    "A simple platformer game with a character that can jump",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">0G Compute Network Game Creation</h1>

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
            Game Description
          </label>
          <textarea
            value={gameDescription}
            onChange={(e) => setGameDescription(e.target.value)}
            className="h-32 w-full rounded-md border p-2"
            placeholder="Describe the game you want to create..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Example Games (click to use)
          </label>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {exampleGames.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setGameDescription(example)}
                className="h-auto p-3 text-left"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={createGame}
          disabled={loading || !gameDescription}
          className="p-4 text-lg"
        >
          {loading ? "Creating Game..." : "Create Game with 0G AI"}
        </Button>
      </div>

      {loading && (
        <div className="py-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-2">
            Generating your game with 0G Compute Network...
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Result:</h2>
          {result.success ? (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 p-4">
                <h3 className="font-semibold text-green-800">
                  Game Created Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Model: {result.data.model} | Provider: {result.data.provider}{" "}
                  | Verified: {result.data.verified ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Generated Game Code:</h3>
                <pre className="max-h-96 overflow-auto rounded-md bg-gray-100 p-4 text-sm">
                  {result.data.gameCode}
                </pre>
              </div>

              {result.data.usage && (
                <div className="rounded-md bg-blue-50 p-4">
                  <h3 className="font-semibold text-blue-800">Usage Stats:</h3>
                  <p className="text-sm text-blue-700">
                    Tokens: {result.data.usage.total_tokens} | Prompt:{" "}
                    {result.data.usage.prompt_tokens} | Completion:{" "}
                    {result.data.usage.completion_tokens}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md bg-red-50 p-4">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-sm text-red-700">{result.error}</p>
              {result.details && (
                <pre className="mt-2 text-xs text-red-600">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 rounded-md bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold">How to use:</h3>
        <ol className="list-inside list-decimal space-y-1 text-sm">
          <li>Make sure PRIVATE_KEY is set in your environment variables</li>
          <li>Select a provider (gpt-oss-120b or deepseek-r1-70b)</li>
          <li>Describe the game you want to create</li>
          <li>
            Click &quot;Create Game with 0G AI&quot; to generate the game code
          </li>
          <li>Copy the generated code and use it in your React project</li>
        </ol>

        <div className="mt-4 rounded border-l-4 border-blue-400 bg-blue-50 p-3">
          <p className="text-sm">
            <strong>Note:</strong> The private key is configured via the
            PRIVATE_KEY environment variable. Make sure to use a test wallet
            with testnet funds. The generated games use React, TypeScript,
            Tailwind CSS, and Shadcn UI components.
          </p>
        </div>
      </div>
    </div>
  );
}
