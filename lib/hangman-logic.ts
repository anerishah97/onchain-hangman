export const onchainTerms: { word: string, hint: string, difficulty: 'easy' | 'medium' | 'hard' }[] = [
    { word: "blockchain", hint: "A distributed, immutable ledger.", difficulty: 'medium' },
    { word: "cryptocurrency", hint: "Digital or virtual currency secured by cryptography.", difficulty: 'hard' },
    { word: "smartcontract", hint: "Self-executing contract with terms written into code.", difficulty: 'hard' },
    { word: "decentralized", hint: "Control and decision-making distributed away from a central point.", difficulty: 'hard' },
    { word: "wallet", hint: "Stores private keys for your crypto assets.", difficulty: 'easy' },
    { word: "mining", hint: "Process of validating transactions and adding them to a blockchain.", difficulty: 'medium' },
    { word: "ledger", hint: "A record-keeping book or system.", difficulty: 'easy' },
    { word: "bitcoin", hint: "The first and most well-known cryptocurrency.", difficulty: 'easy' },
    { word: "ethereum", hint: "A decentralized platform that runs smart contracts.", difficulty: 'medium' },
    { word: "token", hint: "A digital asset representing utility or ownership on a blockchain.", difficulty: 'easy' },
    { word: "nft", hint: "Abbreviation for a unique digital asset.", difficulty: 'easy' },
    { word: "dao", hint: "Abbreviation for a community-led entity with no central authority.", difficulty: 'medium' },
    { word: "defi", hint: "Abbreviation for financial services on blockchains.", difficulty: 'medium' },
    { word: "gasfee", hint: "Transaction cost on the Ethereum network.", difficulty: 'easy' },
    { word: "halving", hint: "Event that reduces the reward for mining new blocks by half.", difficulty: 'medium' },
    { word: "hashrate", hint: "The total computational power used for mining.", difficulty: 'hard' },
    { word: "testnet", hint: "A blockchain network for experimentation and testing.", difficulty: 'easy' },
    { word: "airdrop", hint: "Distributing free tokens to wallet addresses.", difficulty: 'medium' },
    { word: "staking", hint: "Locking up crypto to support a network and earn rewards.", difficulty: 'easy' },
    { word: "yieldfarming", hint: "Strategy to maximize returns on crypto assets.", difficulty: 'hard' },
    { word: "liquiditypool", hint: "A collection of tokens locked in a smart contract.", difficulty: 'hard' },
    { word: "stablecoin", hint: "Crypto pegged to a stable asset like the USD.", difficulty: 'easy' },
    { word: "sharding", hint: "Splitting a database or blockchain for scalability.", difficulty: 'hard' },
    { word: "layerone", hint: "The basic blockchain protocol (e.g., Bitcoin, Ethereum).", difficulty: 'medium' },
    { word: "layertwo", hint: "A scaling solution built on top of a Layer 1.", difficulty: 'medium' },
    { word: "sidechain", hint: "A separate blockchain linked to a main chain.", difficulty: 'hard' },
    { word: "crosschain", hint: "Technology enabling interoperability between blockchains.", difficulty: 'hard' },
    { word: "consensus", hint: "Mechanism for agreement on a blockchain's state.", difficulty: 'medium' },
    { word: "proofofwork", hint: "Consensus algorithm involving solving complex puzzles (e.g., Bitcoin mining).", difficulty: 'hard' },
    { word: "proofofstake", hint: "Consensus algorithm based on the amount of crypto held/staked.", difficulty: 'hard' },
    { word: "governance", hint: "Process of decision-making in a decentralized system.", difficulty: 'medium' },
    { word: "base", hint: "An Ethereum Layer 2 incubated by Coinbase, built on the OP Stack.", difficulty: 'easy' },
    { word: "arbitrum", hint: "A popular Layer 2 optimistic rollup solution for Ethereum.", difficulty: 'medium' },
    { word: "zksync", hint: "A Layer 2 scaling solution using ZK-rollup technology.", difficulty: 'hard' },
    { word: "polygon", hint: "A platform for Ethereum scaling (PoS chain, zkEVM, Supernets).", difficulty: 'easy' },
    { word: "ens", hint: "Service for human-readable Ethereum addresses (e.g., yourname.eth).", difficulty: 'medium' },
    { word: "basename", hint: "A naming service specifically for the Base Layer 2 network.", difficulty: 'hard' },
    { word: "soulbound", hint: "Non-transferable token representing identity or achievements (SBT).", difficulty: 'hard' },
    { word: "minting", hint: "The process of creating a new token (like an NFT) on the blockchain.", difficulty: 'easy' },
    { word: "mev", hint: "Abbreviation for value extracted by reordering/inserting blockchain transactions.", difficulty: 'hard' },
    { word: "permissionless", hint: "Systems open for anyone to participate without central authorization.", difficulty: 'hard' },
    { word: "farcaster", hint: "A social network protocol.", difficulty: 'medium' },
    { word: "accountabstraction", hint: "Allows smart contracts to be top-level accounts in Ethereum (ERC-4337).", difficulty: 'hard' },
    { word: "xmtp", hint: "A secure, decentralized messaging protocol for wallet-to-wallet communication.", difficulty: 'hard' }
];

export const chooseWord = (difficulty?: 'easy' | 'medium' | 'hard'): { word: string, hint: string, difficulty: 'easy' | 'medium' | 'hard' } => {
    let availableWords = onchainTerms;
    if (difficulty) {
        const filteredWords = onchainTerms.filter(term => term.difficulty === difficulty);
        if (filteredWords.length > 0) {
            availableWords = filteredWords;
        } else {
            console.warn(`No words found for difficulty: ${difficulty}, choosing from all words.`);
        }
    }
    if (availableWords.length === 0) { 
        return { word: "error", hint: "Default word if list is empty.", difficulty: 'easy' }; 
    }
    return availableWords[Math.floor(Math.random() * availableWords.length)];
};

export const getDisplayWord = (word: string, guessedLetters: string[]): string => {
    let display = "";
    for (const letter of word) {
        if (guessedLetters.includes(letter)) {
            display += letter + " ";
        } else {
            display += "_ ";
        }
    }
    return display.trim();
};

export const checkWin = (word: string, guessedLetters: string[]): boolean => {
    for (const letter of word) {
        if (!guessedLetters.includes(letter)) {
            return false;
        }
    }
    return true;
}; 