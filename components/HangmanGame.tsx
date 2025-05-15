'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { chooseWord, getDisplayWord, checkWin } from '../lib/hangman-logic';
import Keyboard from './Keyboard';

const MAX_INCORRECT_GUESSES = 6;
const BONUS_POINTS_PER_LIFE = 10;
const SCORE_MULTIPLIER_NO_WORD_HINT = 1.5;

const POINTS_BY_DIFFICULTY = {
    easy: 100,
    medium: 200,
    hard: 500,
};

// DIFFICULTY_SEQUENCE will be passed as a prop or managed by parent

const HANGMAN_STAGES = [
  `
  +---+
  |   |
      |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`,
];

interface HangmanGameProps {
    currentRoundInSequence: number; // Current round index (0-based)
    difficultyForCurrentRound: 'easy' | 'medium' | 'hard';
    onRoundComplete: (roundScore: number, gameStatus: 'won' | 'lost') => void; // Callback when a round ends
    // difficultySequenceLength and totalSessionScore will be displayed by parent
}

const HangmanGame: React.FC<HangmanGameProps> = ({
    currentRoundInSequence, // Used for re-initializing based on parent's control
    difficultyForCurrentRound,
    onRoundComplete
}) => {
    const [wordToGuess, setWordToGuess] = useState<string>('');
    const [currentWordHint, setCurrentWordHint] = useState<string>('');
    // currentWordDifficulty is now difficultyForCurrentRound from props
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [inputValue, setInputValue] = useState<string>('');
    const [roundScore, setRoundScore] = useState<number>(0); // Score for this specific round
    const [wordHintRevealed, setWordHintRevealed] = useState<boolean>(false);
    const [wordHintMessage, setWordHintMessage] = useState<string>('');
    const [feedbackMessage, setFeedbackMessage] = useState<string>(''); // For already guessed / invalid input

    const initializeNewRound = useCallback(() => {
        const chosenWordData = chooseWord(difficultyForCurrentRound);
        const newWord = chosenWordData.word.toLowerCase();
        
        setWordToGuess(newWord);
        setCurrentWordHint(chosenWordData.hint);
        
        // Default one letter reveal
        const initialGuessedLetters: string[] = [];
        if (newWord.length > 0) {
            const randomIndex = Math.floor(Math.random() * newWord.length);
            initialGuessedLetters.push(newWord[randomIndex]);
        }
        setGuessedLetters(initialGuessedLetters);
        
        setIncorrectGuesses(0);
        setGameStatus('playing');
        setInputValue('');
        setRoundScore(0);
        setWordHintRevealed(false);
        setWordHintMessage('');
        setFeedbackMessage(''); // Reset feedback message
    }, [difficultyForCurrentRound]);

    // Re-initialize when the parent changes the round (which changes currentRoundInSequence or difficultyForCurrentRound)
    useEffect(() => {
        initializeNewRound();
    }, [initializeNewRound, currentRoundInSequence]); // currentRoundInSequence signals a new round from parent

    // Effect to handle end of round (win/loss) and report to parent
    useEffect(() => {
        if (gameStatus === 'won') {
            const livesRemaining = MAX_INCORRECT_GUESSES - incorrectGuesses;
            const baseWinPoints = POINTS_BY_DIFFICULTY[difficultyForCurrentRound] || 0;
            let calculatedRoundScore = baseWinPoints + (livesRemaining * BONUS_POINTS_PER_LIFE);
            
            if (!wordHintRevealed) {
                calculatedRoundScore *= SCORE_MULTIPLIER_NO_WORD_HINT;
                calculatedRoundScore = Math.floor(calculatedRoundScore); // Ensure integer score
            }
            
            setRoundScore(calculatedRoundScore);
            onRoundComplete(calculatedRoundScore, 'won');
        } else if (gameStatus === 'lost') {
            setRoundScore(0); // Score for a lost round is 0
            onRoundComplete(0, 'lost');
        }
    }, [gameStatus, incorrectGuesses, difficultyForCurrentRound, onRoundComplete, wordHintRevealed]); 

    // advanceToNextRound and handlePlayOrNextRound are now managed by the parent

    const handleRevealWordHint = () => {
        if (wordHintRevealed || gameStatus !== 'playing') return;
        setWordHintRevealed(true);
        setWordHintMessage(`Hint: ${currentWordHint}`);
        setFeedbackMessage(''); // Clear other feedback when hint is shown
    };

    const handleGuess = useCallback((letter: string) => {
        if (wordHintMessage && !wordHintRevealed) setWordHintMessage('');
        // Don't clear feedbackMessage here yet, clear it if guess is valid and new

        if (gameStatus !== 'playing') return; // Should ideally not be callable

        // Normalize letter from keyboard (already lowercase)
        const lowerLetter = letter.toLowerCase();

        if (!lowerLetter.match(/[a-z]/i) || lowerLetter.length !== 1) {
            setFeedbackMessage("Invalid input. Please enter a single letter.");
            setInputValue('');
            return;
        }

        if (guessedLetters.includes(lowerLetter)) {
            setFeedbackMessage(`You already guessed '${lowerLetter}'. Try another letter.`);
            setInputValue('');
            return;
        }
        
        // If we reach here, the guess is valid and new
        setFeedbackMessage(''); // Clear feedback message

        const newGuessedLetters = [...guessedLetters, lowerLetter];
        setGuessedLetters(newGuessedLetters);
        setInputValue('');

        if (wordToGuess.includes(lowerLetter)) {
            if (checkWin(wordToGuess, newGuessedLetters)) {
                setGameStatus('won'); // useEffect will handle onRoundComplete
            }
        } else {
            setIncorrectGuesses(prev => {
                const newIncorrectGuesses = prev + 1;
                if (newIncorrectGuesses >= MAX_INCORRECT_GUESSES) {
                    setGameStatus('lost'); // useEffect will handle onRoundComplete
                }
                return newIncorrectGuesses;
            });
        }
    }, [gameStatus, guessedLetters, wordToGuess, wordHintMessage, wordHintRevealed]);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value.toLowerCase());
        setFeedbackMessage(''); // Clear feedback when user types
    };

    const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue) {
            handleGuess(inputValue);
        }
    };
    
    const displayWord = getDisplayWord(wordToGuess, guessedLetters);

    let hintButtonTitle = "Reveal a descriptive hint for the word (Free).";
    if (wordHintRevealed) {
        hintButtonTitle = "Descriptive hint already revealed.";
    }

    return (
        // Removed the outer div and the top header section (Round, Difficulty, Total Score)
        // Parent component (app/page.tsx) will now control this layout and display those details.
        <div className="w-full max-w-md flex flex-col items-center text-[var(--app-foreground)]">
            {/* Current Round Score can be displayed here if desired, or just shown at end of round by parent */}
            { gameStatus === 'playing' && (
                 <div className="mb-2 text-xl">
                    {/* Optional: display if bonus is active, e.g. "1.5x Bonus Active!" if !wordHintRevealed */}
                 </div>
            )}
            <div className="mb-4">
                <pre className="text-lg font-mono text-[var(--app-foreground-muted)]">
                    {HANGMAN_STAGES[incorrectGuesses]}
                </pre>
            </div>
            
            <div className="mb-1 text-center mb-2">
                <p className="text-2xl tracking-widest">{displayWord}</p>
            </div>

            {/* Display Word Hint Message */}
            {wordHintMessage && (
                 <div className={`my-3 text-sm text-center ${wordHintRevealed ? 'text-blue-300' : 'text-[var(--ock-text-error)]'}`}>
                    <p>{wordHintMessage}</p>
                </div>
            )}

            {/* Display General Feedback Message (already guessed, invalid input) */}
            {feedbackMessage && (
                <div className="my-2 text-sm text-center text-[var(--ock-text-warning)]">
                    <p>{feedbackMessage}</p>
                </div>
            )}

            {gameStatus === 'playing' && (
                <div className="mb-4 w-full max-w-xs flex flex-col items-center">
                    <button 
                        onClick={handleRevealWordHint}
                        disabled={wordHintRevealed || gameStatus !== 'playing'}
                        title={hintButtonTitle}
                        className="w-full px-4 py-2 bg-violet-400 hover:bg-violet-500 text-white font-semibold rounded-lg disabled:bg-violet-200 disabled:text-violet-400 disabled:cursor-not-allowed mb-3 mt-1">
                        Reveal Word Hint
                    </button>
                    
                    <Keyboard 
                        guessedLetters={guessedLetters}
                        onLetterClick={handleGuess} 
                        gameStatus={gameStatus}
                    />
                </div>
            )}

            <div className="mb-2 text-sm text-[var(--app-foreground-muted)]">
                <p>Incorrect Guesses: {incorrectGuesses} / {MAX_INCORRECT_GUESSES}</p>
            </div>

            {/* Win/Loss Messages - Simplified as parent will show overall progress */}
            {/* Parent will trigger a new round/game via changing currentRoundInSequence prop */}
            {(gameStatus === 'won' || gameStatus === 'lost') && (
                <div className="text-center mt-4">
                    {gameStatus === 'won' && (
                        <>
                            <p className="text-2xl text-[var(--ock-text-success)] mb-2">Round Won!</p>
                            <p className="text-xl mb-2">Word: <span className="font-bold uppercase">{wordToGuess}</span></p>
                            <p className="text-xl mb-1">Round Score: +{roundScore}</p>
                            {!wordHintRevealed && <p className="text-sm text-[var(--ock-text-warning)] mb-2">(1.5x bonus applied for not using word hint!)</p>}
                        </>
                    )}
                    {gameStatus === 'lost' && (
                        <>
                            <p className="text-2xl text-[var(--ock-text-error)] mb-2">Round Lost!</p>
                            <p className="text-xl mb-2">Word: <span className="font-bold uppercase">{wordToGuess}</span></p>
                            <p className="text-xl mb-4">Round Score: {roundScore}</p> 
                        </>
                    )}
                    {/* Button to proceed is now handled by parent after onRoundComplete */}
                     <p className="text-gray-400 text-sm mt-2">Next round will start shortly...</p> 
                </div>
            )}
        </div>
    );
};

export default HangmanGame; 