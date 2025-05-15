'use client';

import React from 'react';

interface KeyboardProps {
  guessedLetters: string[];
  onLetterClick: (letter: string) => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

// QWERTY-like layout
const KEYBOARD_LAYOUT = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm'
];

const Keyboard: React.FC<KeyboardProps> = ({ guessedLetters, onLetterClick, gameStatus }) => {
  return (
    // Main container for rows, gap between rows can remain sm:gap-2
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 my-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        // Container for each row of keys, increased gap slightly
        <div key={`row-${rowIndex}`} className="flex justify-center gap-1.5 sm:gap-2 w-full">
          {row.split('').map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isDisabled = isGuessed || gameStatus !== 'playing';
            return (
              <button
                key={letter}
                onClick={() => onLetterClick(letter)}
                disabled={isDisabled}
                className={`
                  w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 
                  flex-shrink-0 
                  border rounded-md 
                  font-mono text-sm sm:text-base md:text-base uppercase
                  flex items-center justify-center
                  transition-colors duration-150 
                  ${
                    isDisabled && isGuessed // Letter has been guessed
                      ? 'bg-purple-200 text-purple-400 cursor-not-allowed border-purple-300' 
                      : isDisabled && gameStatus !== 'playing' // Game is over, letter not guessed
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300' 
                      // Active, clickable button: Use primary accent (LightPink)
                      : 'bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--ock-bg-default)] border-[var(--app-accent-hover)]'
                  }
                `}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 