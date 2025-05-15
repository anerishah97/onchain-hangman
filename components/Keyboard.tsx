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
    // Main container for rows, changed to flex-col
    <div className="flex flex-col items-center gap-1 sm:gap-2 my-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        // Container for each row of keys
        <div key={`row-${rowIndex}`} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {row.split('').map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isDisabled = isGuessed || gameStatus !== 'playing';
            return (
              <button
                key={letter}
                onClick={() => onLetterClick(letter)}
                disabled={isDisabled}
                // Removed flex-grow and min-w-0 to ensure fixed size. Sizes are defined by w-X h-X classes.
                className={`
                  w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 
                  border rounded-md 
                  font-mono text-xs sm:text-sm md:text-base uppercase
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