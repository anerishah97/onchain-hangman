'use client';

import React from 'react';

interface KeyboardProps {
  guessedLetters: string[];
  onLetterClick: (letter: string) => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

const Keyboard: React.FC<KeyboardProps> = ({ guessedLetters, onLetterClick, gameStatus }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 my-4 max-w-md sm:max-w-lg mx-auto">
      {ALPHABET.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        const isDisabled = isGuessed || gameStatus !== 'playing';
        return (
          <button
            key={letter}
            onClick={() => onLetterClick(letter)}
            disabled={isDisabled}
            className={`
              w-8 h-8 sm:w-10 sm:h-10 
              border rounded-lg 
              font-mono text-sm sm:text-lg uppercase
              flex items-center justify-center
              transition-colors duration-150
              ${
                isDisabled && isGuessed
                  ? 'bg-purple-200 text-purple-400 cursor-not-allowed border-purple-300'
                  : isDisabled && gameStatus !== 'playing'
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : 'bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--ock-bg-default)] border-[var(--app-accent-hover)]'
              }
            `}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard; 