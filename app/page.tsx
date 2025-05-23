"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Button as UIDemoButton } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import HangmanGame from "../components/HangmanGame";

const DIFFICULTY_SEQUENCE: ('easy' | 'medium' | 'hard')[] = [
    'easy', 'easy',
    'medium', 'medium', 'medium',
    'hard', 'hard', 'hard' 
];

// Updated Intro Page Component rules
const IntroPageComponent = ({ onStartChallenge }: { onStartChallenge: () => void }) => {
  return (
    <div className="text-center px-4 pb-4 sm:px-8 sm:pb-8 max-w-xl mx-auto bg-slate-800 rounded-b-2xl sm:rounded-2xl shadow-2xl w-full">
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--app-foreground)] mb-6 pt-6 sm:pt-8">Test Your Onchain Chops!</h1>
      <p className="text-md sm:text-lg text-[var(--app-foreground-muted)] mb-8">
        Are you a degen? Or a web3 newbie? Find out with Onchain Hangman!
        Complete all rounds to prove your mettle!
      </p>

      <div className="text-left bg-slate-700 p-4 sm:p-6 rounded-xl shadow-xl mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--app-foreground)] mb-4">Game Rules:</h2>
        <ul className="list-disc list-inside space-y-2 text-[var(--app-foreground-muted)] text-sm sm:text-base">
          <li><b>The Challenge:</b> Complete 8 rounds (2 Easy, 3 Medium, 3 Hard).</li>
          <li><b>High Stakes:</b> If you lose any single round, the entire challenge ends!</li>
          <li><b>Scoring (per round won):</b>
            <ul className="list-circle list-inside ml-4 mt-1 space-y-1">
              <li>Easy Word: 100 points</li>
              <li>Medium Word: 200 points</li>
              <li>Hard Word: 500 points</li>
              <li>Plus: +10 points for each life (incorrect guess) remaining.</li>
            </ul>
          </li>
          <li><b>Default Letter Hint:</b> One random letter revealed FREE each round.</li>
          <li><b>Word Hint:</b> Optional descriptive hint, also FREE.</li>
          <li><b>Skill Bonus:</b> Win a round <em>without</em> the Word Hint for a <b>1.5x score multiplier</b> for that round!</li>
        </ul>
      </div>

      <button
        onClick={onStartChallenge}
        className="px-8 py-3 text-lg sm:text-xl font-semibold text-white bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] rounded-lg transition duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Start Challenge!
      </button>
    </div>
  );
};

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const minikitOpenUrl = useOpenUrl();
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [gamePhase, setGamePhase] = useState<'intro' | 'playing'>('intro');
  const [totalSessionScore, setTotalSessionScore] = useState<number>(0);
  const [currentRoundInSequence, setCurrentRoundInSequence] = useState<number>(0);
  const [currentWordDifficulty, setCurrentWordDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    DIFFICULTY_SEQUENCE[0]
  );
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false); // True when a single round (word) is done
  const [challengeOutcome, setChallengeOutcome] = useState<null | 'allRoundsWon' | 'roundLost'>(null); // Overall challenge status
  // Removed lastRoundStatus, as challengeOutcome serves a similar purpose for end states

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    const adjustHeight = () => {
      if (mainContentRef.current) {
        mainContentRef.current.style.minHeight = `${window.innerHeight}px`;
      }
    };
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    window.addEventListener('orientationchange', adjustHeight);

    return () => {
      window.removeEventListener('resize', adjustHeight);
      window.removeEventListener('orientationchange', adjustHeight);
    };
  }, []);

  const addFrame = useAddFrame();
  const handleAddFrame = useCallback(async () => {
    const frameAddedResponse = await addFrame();
    setFrameAdded(Boolean(frameAddedResponse));
  }, [addFrame]);

  const startGame = () => {
    setCurrentRoundInSequence(0);
    setTotalSessionScore(0);
    setCurrentWordDifficulty(DIFFICULTY_SEQUENCE[0]);
    setIsRoundOver(false);
    setChallengeOutcome(null); // Reset challenge outcome
    setGamePhase('playing');
  };

  const handleRoundComplete = useCallback((roundScore: number, gameStatus: 'won' | 'lost') => {
    setIsRoundOver(true); // Mark the individual round as over first
    if (gameStatus === 'won') {
      setTotalSessionScore(prevTotal => prevTotal + roundScore);
      if (currentRoundInSequence >= DIFFICULTY_SEQUENCE.length - 1) {
        setChallengeOutcome('allRoundsWon');
      } else {
        // Round won, but not the last one. challengeOutcome remains null.
      }
    } else { // gameStatus === 'lost'
      setChallengeOutcome('roundLost'); // Losing a round ends the challenge
    }
  }, [currentRoundInSequence]);

  // This function handles transitions *after* a round is over, or challenge is over
  const handleGameTransition = () => {
    if (challengeOutcome === 'allRoundsWon' || challengeOutcome === 'roundLost') {
      // Challenge is definitively over, go back to intro to allow a full restart
      setGamePhase('intro');
      // Score and round will be reset if they click "Start Challenge!" via startGame()
    } else if (isRoundOver) { 
      // This means a round was won, and the challenge is not yet over (challengeOutcome is null)
      setIsRoundOver(false); // Prepare for the next round
      const nextRoundIndex = currentRoundInSequence + 1;
      // This check should be safe as challengeOutcome would be set if it were the last round
      if (nextRoundIndex < DIFFICULTY_SEQUENCE.length) { 
        setCurrentRoundInSequence(nextRoundIndex);
        setCurrentWordDifficulty(DIFFICULTY_SEQUENCE[nextRoundIndex]);
      } 
      // No else needed here because winning the last round sets challengeOutcome, handled above.
    }
  };

  const handleShareScore = () => {
    const appURL = process.env.NEXT_PUBLIC_URL || window.location.origin;

    let shareText = "";
    if (challengeOutcome === 'allRoundsWon') {
      shareText = `I'm an Onchain Star! ⭐ I scored ${totalSessionScore} in Onchain Hangman!`;
    } else if (challengeOutcome === 'roundLost') {
      shareText = `I tried Onchain Hangman and scored ${totalSessionScore}. Can you do better?`;
    } else {
      shareText = `Check out Onchain Hangman! I scored ${totalSessionScore}.`; // Fallback
    }
    const framePageURL = `${appURL}/frame?score=${totalSessionScore}&outcome=${challengeOutcome || 'played'}`;
    const warpcastURL = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(framePageURL)}`;
    minikitOpenUrl(warpcastURL);
  };

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <UIDemoButton
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--ock-text-primary)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </UIDemoButton>
      );
    }
    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[var(--ock-text-primary)] animate-fade-out">
          <Icon name="check" size="sm" className="text-[var(--ock-text-primary)]" />
          <span>Saved</span>
        </div>
      );
    }
    return null;
  }, [context, frameAdded, handleAddFrame]);
  
  // Determine button text for transitions
  let transitionButtonText: string | null = null;
  if (isRoundOver) {
    if (challengeOutcome === 'allRoundsWon' || challengeOutcome === 'roundLost') {
      transitionButtonText = "Play Again?";
    } else { // Round was won, challengeOutcome is null (meaning challenge continues)
      transitionButtonText = "Next Round";
    }
  }

  return (
    <div ref={mainContentRef} className="flex flex-col font-sans text-[var(--ock-text-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-screen-md mx-auto px-4 py-3 flex flex-col flex-grow">
        <header className="flex justify-between items-center h-11 flex-shrink-0 mb-2">
          <div className="flex items-center space-x-2">
            <Wallet className="z-10">
                <ConnectWallet><Name className="text-inherit" /></ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar /><Name /><Address /><EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
            </Wallet>
            {/* Show Round/Difficulty only if playing and challenge is not yet decided */}
            {gamePhase === 'playing' && challengeOutcome === null && (
              <div className="text-xs md:text-sm text-[var(--app-foreground-muted)] ml-2 md:ml-4">
                  Round: {currentRoundInSequence + 1}/{DIFFICULTY_SEQUENCE.length} | Difficulty: <span className="font-semibold capitalize">{currentWordDifficulty}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* Show Score if playing and challenge is not decided, OR if challenge has ended (to show final score) */}
            {(gamePhase === 'playing' && challengeOutcome === null) || challengeOutcome !== null ? (
              <div className="text-sm md:text-lg font-semibold">
                  Score: {totalSessionScore}
              </div>
            ) : null}
            {saveFrameButton} 
          </div>
        </header>

        <main className={`flex-1 flex flex-col items-center ${gamePhase === 'intro' ? 'justify-start' : 'justify-center'} flex-grow w-full`}>
          {gamePhase === 'intro' ? (
            <div className="w-full">
                <IntroPageComponent onStartChallenge={startGame} />
            </div>
          ) : challengeOutcome === 'allRoundsWon' ? (
            // UI for winning the entire challenge
            <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">🎉 You&apos;re an Onchain Star! 🎉</h2>
              <p className="text-xl mb-6">You conquered all {DIFFICULTY_SEQUENCE.length} rounds!</p>
              <p className="text-2xl font-semibold mb-8">Onchain Score: {totalSessionScore}</p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleGameTransition}
                  className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-sky-500 hover:bg-sky-600 transition duration-150 rounded-lg"
                >
                  {transitionButtonText} 
                </button>
                <button 
                  onClick={handleShareScore}
                  className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-[var(--ock-bg-default)] bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] transition duration-150 rounded-lg"
                >
                  Share Score
                </button>
              </div>
            </div>
          ) : challengeOutcome === 'roundLost' ? (
            // UI for losing the challenge by losing a round
            <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold text-[var(--ock-text-error)] mb-4">Challenge Ended</h2>
              <p className="text-xl mb-6">You didn&apos;t complete all rounds this time. Better luck next time!</p>
              <p className="text-2xl font-semibold mb-8">Onchain Score: {totalSessionScore}</p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleGameTransition}
                  className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-gray-700 bg-[var(--ock-text-warning)] hover:opacity-90 transition duration-150 rounded-lg"
                >
                  {transitionButtonText} 
                </button>
                <button 
                  onClick={handleShareScore}
                  className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-[var(--ock-bg-default)] bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] transition duration-150 rounded-lg"
                >
                  Share Score
                </button>
              </div>
            </div>
          ) : !isRoundOver ? (
            // Active gameplay for the current round
            <HangmanGame 
              key={currentRoundInSequence} 
              currentRoundInSequence={currentRoundInSequence}
              difficultyForCurrentRound={currentWordDifficulty}
              onRoundComplete={handleRoundComplete}
            />
          ) : ( 
            // A round was won, but the challenge is not over yet (challengeOutcome is null)
            <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-2xl">
              <p className="text-2xl text-[var(--ock-text-success)] mb-6">Round Cleared!</p>
              <p className="text-xl mb-6">Total Score: {totalSessionScore}</p>
              <button 
                onClick={handleGameTransition}
                className="px-6 py-3 text-lg font-semibold text-[var(--ock-bg-default)] bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] transition duration-150 rounded-lg"
              >
                {transitionButtonText} {/* Should be "Next Round" */}
              </button>
            </div>
          )}
        </main>

        <footer className="mt-auto pt-4 flex justify-center flex-shrink-0">
          <UIDemoButton
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => minikitOpenUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </UIDemoButton>
        </footer>
      </div>
    </div>
  );
}
