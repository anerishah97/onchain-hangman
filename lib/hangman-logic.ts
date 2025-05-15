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
    { word: "solana", hint: "A high-performance blockchain known for its speed.", difficulty: 'medium' },
    { word: "token", hint: "A digital asset representing utility or ownership on a blockchain.", difficulty: 'easy' },
    { word: "nft", hint: "Abbreviation for a unique digital asset.", difficulty: 'easy' },
    { word: "dao", hint: "Abbreviation for a community-led entity with no central authority.", difficulty: 'medium' },
    { word: "defi", hint: "Abbreviation for financial services on blockchains.", difficulty: 'medium' },
    { word: "oracle", hint: "Connects smart contracts with real-world data.", difficulty: 'medium' },
    { word: "gasfee", hint: "Transaction cost on the Ethereum network.", difficulty: 'easy' },
    { word: "halving", hint: "Event that reduces the reward for mining new blocks by half.", difficulty: 'medium' },
    { word: "hashrate", hint: "The total computational power used for mining.", difficulty: 'hard' },
    { word: "mainnet", hint: "The primary, live blockchain network.", difficulty: 'easy' },
    { word: "testnet", hint: "A blockchain network for experimentation and testing", difficulty: 'easy' },
    { word: "altcoin", hint: "Any cryptocurrency other than Bitcoin.", difficulty: 'easy' },
    { word: "airdrop", hint: "Distributing free tokens to wallet addresses.", difficulty: 'medium' },
    { word: "staking", hint: "Locking up crypto to support a network and earn rewards.", difficulty: 'medium' },
    { word: "yieldfarming", hint: "Strategy to maximize returns on crypto assets.", difficulty: 'hard' },
    { word: "liquiditypool", hint: "A collection of tokens locked in a smart contract.", difficulty: 'hard' },
    { word: "stablecoin", hint: "Crypto pegged to a stable asset like the USD.", difficulty: 'easy' },
    { word: "privacycoin", hint: "Crypto focused on anonymous transactions.", difficulty: 'medium' },
    { word: "sharding", hint: "Splitting a database or blockchain for scalability.", difficulty: 'hard' },
    { word: "layerone", hint: "The base blockchain protocol (e.g., Bitcoin, Ethereum).", difficulty: 'medium' },
    { word: "layertwo", hint: "A scaling solution built on top of a Layer 1.", difficulty: 'medium' },
    { word: "sidechain", hint: "A separate blockchain linked to a main chain.", difficulty: 'hard' },
    { word: "crosschain", hint: "Technology enabling interoperability between blockchains.", difficulty: 'hard' },
    { word: "consensus", hint: "Mechanism for agreement on a blockchain's state.", difficulty: 'medium' },
    { word: "proofofwork", hint: "Consensus algorithm involving solving complex puzzles (e.g., Bitcoin mining).", difficulty: 'hard' },
    { word: "proofofstake", hint: "Consensus algorithm based on the amount of crypto held/staked.", difficulty: 'hard' },
    { word: "governance", hint: "Process of decision-making in a decentralized system.", difficulty: 'medium' }
];

export const chooseWord = (difficulty?: 'easy' | 'medium' | 'hard'): { word: string, hint: string, difficulty: 'easy' | 'medium' | 'hard' } => {
    let availableWords = onchainTerms;
    if (difficulty) {
        const filteredWords = onchainTerms.filter(term => term.difficulty === difficulty);
        if (filteredWords.length > 0) {
            availableWords = filteredWords;
        }
        // If no words of the specified difficulty, it will fallback to the full list implicitly, 
        // or we could throw an error or return a default if preferred.
    }
    // Ensure there's always a word to return, even if filtering yields nothing (shouldn't happen with current setup)
    if (availableWords.length === 0) return onchainTerms[0]; 
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