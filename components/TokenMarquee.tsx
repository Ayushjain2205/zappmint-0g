"use client";
import React, { useState } from "react";
import BuyTokenPopup from "@/components/BuyTokenPopup";

interface Token {
  name: string;
  price: string;
  holders: string;
  address: string;
  marketCap?: string;
  volume24h?: string;
  marketCapChange?: string;
  creator?: string;
  totalSupply?: string;
  dateCreated?: string;
  about?: string;
}

interface TokenMarqueeProps {
  appName?: string;
  creator?: string;
}

// Using the first token as the app's token - replace with real data from API
const APP_TOKEN: Token = {
  name: "$QUIZ",
  price: "0.000035",
  holders: "2",
  address: "0x6a81...d99c",
  marketCap: "$3.3M",
  volume24h: "$1.3M",
  marketCapChange: "-9.47%",
  creator: "0xchristopher",
  totalSupply: "1000000000",
  dateCreated: "19 Jun 2025",
  about:
    "QUIZ is the ultimate trivia token. Play, earn, and challenge your friends! Mint ends 6/2 10:00pm ET. 1,000,000,000 max supply. $QUIZ will power the next generation of on-chain quizzes.",
};

export default function TokenMarquee({ appName, creator }: TokenMarqueeProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleBuyClick = (token: Token) => {
    setSelectedToken(token);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedToken(null);
  };

  const token = APP_TOKEN;

  return (
    <>
      <div className="fixed left-0 right-0 top-[44px] z-40 border-b border-t border-plumPurple bg-white px-2 py-1.5">
        {/* Desktop: Static display */}
        <div className="hidden md:flex md:items-center md:justify-between md:px-4">
          {/* Left: App name and creator */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {appName && (
              <>
                <span className="font-semibold text-plumPurple">
                  {appName.length > 60
                    ? `${appName.substring(0, 60)}...`
                    : appName}
                </span>
                {creator && (
                  <>
                    <span className="text-plumPurple/60">by</span>
                    <span className="text-plumPurple">{creator}</span>
                  </>
                )}
              </>
            )}
          </div>

          {/* Center: Token info section with highlighted background */}
          <div className="flex items-center gap-2.5 rounded-lg bg-mintGreen/30 px-3 py-1 font-mono text-xs">
            {/* Token symbol */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-plumPurple">
                <span className="text-[10px] font-bold text-white">$</span>
              </div>
              <span className="font-bold text-plumPurple">
                {token.name.replace("$", "")}
              </span>
            </div>

            {/* Separator */}
            <div className="h-4 w-px bg-plumPurple/20"></div>

            {/* Market Cap */}
            {token.marketCap && (
              <div className="flex items-center gap-1.5">
                <span className="text-plumPurple/70">mcap:</span>
                <span className="font-semibold text-plumPurple">
                  {token.marketCap}
                </span>
                {token.marketCapChange && (
                  <span
                    className={`font-semibold ${
                      token.marketCapChange.startsWith("-")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {token.marketCapChange}
                  </span>
                )}
              </div>
            )}

            {/* Separator */}
            <div className="h-4 w-px bg-plumPurple/20"></div>

            {/* Volume */}
            {token.volume24h && (
              <div className="flex items-center gap-1.5">
                <span className="text-plumPurple/70">vol:</span>
                <span className="font-semibold text-plumPurple">
                  {token.volume24h}
                </span>
              </div>
            )}
          </div>

          {/* Right: Buy button */}
          <button
            className="flex items-center gap-1.5 rounded-lg bg-plumPurple px-3 py-1 font-mono text-xs font-semibold text-white transition-colors hover:bg-plumPurple/90"
            onClick={() => handleBuyClick(token)}
          >
            <span>Buy</span>
            <span>→</span>
          </button>
        </div>

        {/* Mobile: Marquee scrolling */}
        <div className="overflow-hidden md:hidden">
          <div className="animate-marquee flex whitespace-nowrap">
            {/* Render content 2 times for seamless loop */}
            {[...Array(2)].map((_, setIndex) => (
              <div
                key={setIndex}
                className="flex shrink-0 items-center gap-4"
                style={{ width: "max-content" }}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`${setIndex}-${i}`}
                    className="mx-2 inline-flex shrink-0 cursor-pointer items-center gap-4"
                    onClick={() => handleBuyClick(token)}
                  >
                    {/* App name and creator - same as desktop */}
                    {appName && (
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="whitespace-nowrap font-semibold text-plumPurple">
                          {appName.length > 60
                            ? `${appName.substring(0, 60)}...`
                            : appName}
                        </span>
                        {creator && (
                          <>
                            <span className="text-plumPurple/60">by</span>
                            <span className="whitespace-nowrap text-plumPurple">
                              {creator}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Token info section - exact same as desktop */}
                    <div className="flex items-center gap-2.5 rounded-lg bg-mintGreen/30 px-3 py-1 font-mono text-xs">
                      {/* Token symbol */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-plumPurple">
                          <span className="text-[10px] font-bold text-white">
                            $
                          </span>
                        </div>
                        <span className="whitespace-nowrap font-bold text-plumPurple">
                          {token.name.replace("$", "")}
                        </span>
                      </div>

                      {/* Separator */}
                      <div className="h-4 w-px bg-plumPurple/20"></div>

                      {/* Market Cap */}
                      {token.marketCap && (
                        <div className="flex items-center gap-1.5">
                          <span className="whitespace-nowrap text-plumPurple/70">
                            mcap:
                          </span>
                          <span className="whitespace-nowrap font-semibold text-plumPurple">
                            {token.marketCap}
                          </span>
                          {token.marketCapChange && (
                            <span
                              className={`whitespace-nowrap font-semibold ${
                                token.marketCapChange.startsWith("-")
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {token.marketCapChange}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Separator */}
                      <div className="h-4 w-px bg-plumPurple/20"></div>

                      {/* Volume */}
                      {token.volume24h && (
                        <div className="flex items-center gap-1.5">
                          <span className="whitespace-nowrap text-plumPurple/70">
                            vol:
                          </span>
                          <span className="whitespace-nowrap font-semibold text-plumPurple">
                            {token.volume24h}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Buy button - same as desktop */}
                    <div className="flex items-center gap-1.5 rounded-lg bg-plumPurple px-3 py-1 font-mono text-xs font-semibold text-white">
                      <span>Buy</span>
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedToken && (
        <BuyTokenPopup
          token={selectedToken}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}
