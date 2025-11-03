"use client";
import React, { useState } from "react";
import BuyTokenPopup from "./BuyTokenPopup";

interface Token {
  name: string;
  price: string;
  holders: string;
  address: string;
  marketCap?: string;
  volume24h?: string;
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
  marketCap: "35625.99",
  volume24h: "12.57",
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
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-plumPurple bg-white py-2">
        {/* Desktop: Static display */}
        <div className="hidden md:flex md:items-center md:justify-center md:gap-6">
          {appName && (
            <>
              <span className="font-semibold">{appName}</span>
              <span className="text-plumPurple/60">•</span>
            </>
          )}
          {creator && (
            <>
              <span>{creator}</span>
              <span className="text-plumPurple/60">•</span>
            </>
          )}
          <span className="font-semibold">{token.name}</span>
          {token.volume24h && (
            <>
              <span className="text-plumPurple/60">•</span>
              <span>Vol: {token.volume24h}</span>
            </>
          )}
          {token.marketCap && (
            <>
              <span className="text-plumPurple/60">•</span>
              <span>MCap: {token.marketCap}</span>
            </>
          )}
          <span className="text-plumPurple/60">•</span>
          <span
            className="cursor-pointer text-mintGreen hover:underline"
            onClick={() => handleBuyClick(token)}
          >
            Buy
          </span>
        </div>

        {/* Mobile: Marquee scrolling */}
        <div className="overflow-hidden md:hidden">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="mx-6 inline-flex items-center gap-2 text-sm"
              >
                {appName && (
                  <>
                    <span className="font-semibold">{appName}</span>
                    <span className="text-plumPurple/60">•</span>
                  </>
                )}
                {creator && (
                  <>
                    <span>{creator}</span>
                    <span className="text-plumPurple/60">•</span>
                  </>
                )}
                <span className="font-semibold">{token.name}</span>
                {token.volume24h && (
                  <>
                    <span className="text-plumPurple/60">•</span>
                    <span>Vol: {token.volume24h}</span>
                  </>
                )}
                {token.marketCap && (
                  <>
                    <span className="text-plumPurple/60">•</span>
                    <span>MCap: {token.marketCap}</span>
                  </>
                )}
                <span className="text-plumPurple/60">•</span>
                <span
                  className="cursor-pointer text-mintGreen hover:underline"
                  onClick={() => handleBuyClick(token)}
                >
                  Buy
                </span>
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
