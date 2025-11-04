// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AppToken
 * @dev Simple ERC20 token for Zappmint apps
 */
contract AppToken is ERC20, Ownable {
    address public factoryContract;

    constructor(
        string memory name,
        string memory symbol,
        address creator,
        address factory
    ) ERC20(name, symbol) Ownable(creator) {
        factoryContract = factory;

        // 1 billion total supply
        uint256 totalSupply = 1_000_000_000 * 10 ** decimals();

        // 50% to creator (500 million)
        uint256 creatorAllocation = totalSupply / 2;
        _mint(creator, creatorAllocation);

        // 50% to factory for bonding curve (500 million)
        uint256 marketAllocation = totalSupply / 2;
        _mint(factory, marketAllocation);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

/**
 * @title TokenFactory
 * @dev Factory contract with bonding curve for app tokens
 */
contract TokenFactory {
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        address indexed factoryAddress,
        string name,
        string symbol,
        uint256 creatorAllocation,
        uint256 marketAllocation
    );

    event TokensPurchased(
        address indexed buyer,
        address indexed tokenAddress,
        uint256 amount,
        uint256 cost,
        uint256 newPrice
    );

    event TokensSold(
        address indexed seller,
        address indexed tokenAddress,
        uint256 amount,
        uint256 refund,
        uint256 newPrice
    );

    struct AppTokenInfo {
        address tokenAddress;
        address creator;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 creatorAllocation;
        uint256 marketAllocation;
        uint256 tokensSold;
        uint256 createdAt;
    }

    mapping(address => AppTokenInfo[]) public creatorTokens;
    mapping(address => uint256) public tokensSold; // Track tokens sold per token address
    mapping(address => AppTokenInfo) public tokenInfoByAddress; // Quick lookup by token address
    AppTokenInfo[] public allTokens;

    address public owner;

    // Bonding curve parameters
    uint256 public constant INITIAL_PRICE = 0.00001 ether; // Starting price: 0.00001 MATIC
    uint256 public constant PRICE_INCREMENT = 0.00000001 ether; // Price increases by this amount
    uint256 public constant TOKENS_PER_STEP = 1000 * 10 ** 18; // Price increases every 1000 tokens sold

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /**
     * @dev Create a new app token with bonding curve
     * @return tokenAddress The address of the newly created token
     */
    function createAppToken(
        string memory name,
        string memory symbol
    ) public returns (address tokenAddress) {
        AppToken newToken = new AppToken(
            name,
            symbol,
            msg.sender,
            address(this)
        );

        tokenAddress = address(newToken);

        uint256 totalSupply = 1_000_000_000 * 10 ** 18; // 1 billion
        uint256 creatorAllocation = totalSupply / 2; // 500 million to creator
        uint256 marketAllocation = totalSupply / 2; // 500 million to market

        AppTokenInfo memory tokenInfo = AppTokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            creatorAllocation: creatorAllocation,
            marketAllocation: marketAllocation,
            tokensSold: 0,
            createdAt: block.timestamp
        });

        creatorTokens[msg.sender].push(tokenInfo);
        allTokens.push(tokenInfo);
        tokenInfoByAddress[tokenAddress] = tokenInfo;
        tokensSold[tokenAddress] = 0;

        emit TokenCreated(
            tokenAddress,
            msg.sender,
            address(this),
            name,
            symbol,
            creatorAllocation,
            marketAllocation
        );

        return tokenAddress;
    }

    /**
     * @dev Calculate current buy price based on bonding curve
     */
    function getCurrentBuyPrice(
        address tokenAddress
    ) public view returns (uint256) {
        uint256 sold = tokensSold[tokenAddress];
        uint256 step = sold / TOKENS_PER_STEP;
        return INITIAL_PRICE + (step * PRICE_INCREMENT);
    }

    /**
     * @dev Calculate current sell price (80% of buy price to prevent arbitrage)
     */
    function getCurrentSellPrice(
        address tokenAddress
    ) public view returns (uint256) {
        uint256 buyPrice = getCurrentBuyPrice(tokenAddress);
        return (buyPrice * 80) / 100; // 80% of buy price
    }

    /**
     * @dev Calculate cost to buy a specific amount of tokens
     */
    function calculateBuyCost(
        address tokenAddress,
        uint256 amount
    ) public view returns (uint256) {
        uint256 totalCost = 0;
        uint256 remainingAmount = amount;
        uint256 currentSold = tokensSold[tokenAddress];

        while (remainingAmount > 0) {
            uint256 currentPrice = INITIAL_PRICE +
                ((currentSold / TOKENS_PER_STEP) * PRICE_INCREMENT);
            uint256 tokensAtCurrentPrice = TOKENS_PER_STEP -
                (currentSold % TOKENS_PER_STEP);

            if (tokensAtCurrentPrice > remainingAmount) {
                tokensAtCurrentPrice = remainingAmount;
            }

            totalCost += (tokensAtCurrentPrice * currentPrice) / 10 ** 18;
            remainingAmount -= tokensAtCurrentPrice;
            currentSold += tokensAtCurrentPrice;
        }

        return totalCost;
    }

    /**
     * @dev Calculate refund when selling tokens
     */
    function calculateSellRefund(
        address tokenAddress,
        uint256 amount
    ) public view returns (uint256) {
        uint256 totalRefund = 0;
        uint256 remainingAmount = amount;
        uint256 currentSold = tokensSold[tokenAddress];

        while (remainingAmount > 0 && currentSold > 0) {
            uint256 currentPrice = INITIAL_PRICE +
                ((currentSold / TOKENS_PER_STEP) * PRICE_INCREMENT);
            uint256 sellPrice = (currentPrice * 80) / 100; // 80% of buy price
            uint256 tokensAtCurrentPrice = (currentSold % TOKENS_PER_STEP);

            if (tokensAtCurrentPrice == 0) {
                tokensAtCurrentPrice = TOKENS_PER_STEP;
            }

            if (tokensAtCurrentPrice > remainingAmount) {
                tokensAtCurrentPrice = remainingAmount;
            }

            totalRefund += (tokensAtCurrentPrice * sellPrice) / 10 ** 18;
            remainingAmount -= tokensAtCurrentPrice;
            currentSold -= tokensAtCurrentPrice;
        }

        return totalRefund;
    }

    /**
     * @dev Buy tokens from the bonding curve
     */
    function buyTokens(address tokenAddress, uint256 amount) public payable {
        require(amount > 0, "Amount must be greater than 0");

        AppToken token = AppToken(tokenAddress);
        require(
            token.balanceOf(address(this)) >= amount,
            "Not enough tokens available"
        );

        uint256 cost = calculateBuyCost(tokenAddress, amount);
        require(msg.value >= cost, "Insufficient payment");

        // Transfer tokens to buyer first (will revert if fails)
        token.transfer(msg.sender, amount);

        // Update tokens sold after successful transfer
        tokensSold[tokenAddress] += amount;

        // Refund excess payment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit TokensPurchased(
            msg.sender,
            tokenAddress,
            amount,
            cost,
            getCurrentBuyPrice(tokenAddress)
        );
    }

    /**
     * @dev Sell tokens back to the bonding curve
     */
    function sellTokens(address tokenAddress, uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(
            tokensSold[tokenAddress] >= amount,
            "Cannot sell more than sold"
        );

        AppToken token = AppToken(tokenAddress);
        require(
            token.balanceOf(msg.sender) >= amount,
            "Insufficient token balance"
        );

        uint256 refund = calculateSellRefund(tokenAddress, amount);
        require(
            address(this).balance >= refund,
            "Insufficient contract balance"
        );

        // Transfer tokens from seller to factory first (will revert if fails)
        token.transferFrom(msg.sender, address(this), amount);

        // Update tokens sold after successful transfer
        tokensSold[tokenAddress] -= amount;

        // Send refund to seller
        payable(msg.sender).transfer(refund);

        emit TokensSold(
            msg.sender,
            tokenAddress,
            amount,
            refund,
            getCurrentBuyPrice(tokenAddress)
        );
    }

    /**
     * @dev Withdraw collected funds (only owner)
     */
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev Get all tokens created by an address
     */
    function getTokensByCreator(
        address creator
    ) public view returns (AppTokenInfo[] memory) {
        return creatorTokens[creator];
    }

    /**
     * @dev Get total number of tokens created
     */
    function getTotalTokens() public view returns (uint256) {
        return allTokens.length;
    }

    /**
     * @dev Get token info by index
     */
    function getTokenByIndex(
        uint256 index
    ) public view returns (AppTokenInfo memory) {
        require(index < allTokens.length, "Index out of bounds");
        return allTokens[index];
    }

    /**
     * @dev Get available tokens for purchase
     */
    function getAvailableTokens(
        address tokenAddress
    ) public view returns (uint256) {
        AppToken token = AppToken(tokenAddress);
        return token.balanceOf(address(this));
    }

    /**
     * @dev Get market stats for a token
     */
    function getMarketStats(
        address tokenAddress
    )
        public
        view
        returns (
            uint256 currentBuyPrice,
            uint256 currentSellPrice,
            uint256 totalSold,
            uint256 availableSupply,
            uint256 marketCap
        )
    {
        currentBuyPrice = getCurrentBuyPrice(tokenAddress);
        currentSellPrice = getCurrentSellPrice(tokenAddress);
        totalSold = tokensSold[tokenAddress];
        availableSupply = getAvailableTokens(tokenAddress);
        marketCap = (totalSold * currentBuyPrice) / 10 ** 18;
    }

    /**
     * @dev Get token info by token address (useful after createAppToken returns address)
     */
    function getTokenInfo(
        address tokenAddress
    ) public view returns (AppTokenInfo memory) {
        AppTokenInfo memory info = tokenInfoByAddress[tokenAddress];
        require(info.tokenAddress != address(0), "Token does not exist");
        return info;
    }

    /**
     * @dev Check if a token exists in the factory
     */
    function tokenExists(address tokenAddress) public view returns (bool) {
        return tokenInfoByAddress[tokenAddress].tokenAddress != address(0);
    }

    /**
     * @dev Get all tokens (be careful - this can be expensive for many tokens)
     */
    function getAllTokens() public view returns (AppTokenInfo[] memory) {
        return allTokens;
    }

    /**
     * @dev Get token count for a specific creator
     */
    function getTokenCountByCreator(
        address creator
    ) public view returns (uint256) {
        return creatorTokens[creator].length;
    }

    /**
     * @dev Get token info by creator and index
     */
    function getTokenByCreatorAndIndex(
        address creator,
        uint256 index
    ) public view returns (AppTokenInfo memory) {
        require(index < creatorTokens[creator].length, "Index out of bounds");
        return creatorTokens[creator][index];
    }

    /**
     * @dev Get the factory contract address (this contract)
     */
    function getFactoryAddress() public view returns (address) {
        return address(this);
    }

    /**
     * @dev Get factory address from a token contract (if token was created by this factory)
     */
    function getFactoryAddressFromToken(
        address tokenAddress
    ) public view returns (address) {
        AppToken token = AppToken(tokenAddress);
        return token.factoryContract();
    }
}
