import React, { useRef, useState, useEffect } from 'react';
import { CZECH_ALPHABET, getAvailableWords } from '../data/words';
import './SetupScreen.css';

interface SetupScreenProps {
  onStart: (settings: { allowedLetters: string[]; fontSize: number; wordCount: number; uppercaseOnly: boolean }) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [selectedLetters, setSelectedLetters] = useState<string[]>(['A', 'Á', 'E', 'É', 'I', 'Í', 'J', 'L', 'M', 'O', 'Ó', 'P', 'S', 'T', 'U', 'Ú', 'Ů']);
  const fontSize = 3; // Fixed value
  const [wordCount, setWordCount] = useState<number>(10);
  const [uppercaseOnly, setUppercaseOnly] = useState<boolean>(true);
  
  // Focus management for grid
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isGridFocused, setIsGridFocused] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleLetter = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      setSelectedLetters(prev => prev.filter(l => l !== letter));
    } else {
      setSelectedLetters(prev => [...prev, letter]);
    }
  };

  const toggleAll = () => {
    if (selectedLetters.length === CZECH_ALPHABET.length) {
      setSelectedLetters([]);
    } else {
      setSelectedLetters(CZECH_ALPHABET);
    }
  };

  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (!gridRef.current) return;

    const total = CZECH_ALPHABET.length;
    let newIndex = focusedIndex;
    
    // Calculate columns roughly
    const gridStyle = window.getComputedStyle(gridRef.current);
    const gridTemplate = gridStyle.getPropertyValue('grid-template-columns');
    const cols = gridTemplate.split(' ').length;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = focusedIndex + 1;
        if (newIndex >= total) newIndex = 0; // Wrap to start
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = focusedIndex - 1;
        if (newIndex < 0) newIndex = total - 1; // Wrap to end
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = focusedIndex + cols;
        if (newIndex >= total) {
           // Try to wrap or just stay? 
           // Standard behavior: if OOB, stay or go to last line.
           // Let's just clamp or wrap naturally? 
           // Simple wrap:
           newIndex = newIndex % total; 
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = focusedIndex - cols;
        if (newIndex < 0) {
           newIndex = total + newIndex; // wrap from bottom
           // If still negative (very short list), clamp.
           if (newIndex < 0) newIndex = 0;
        }
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < total) {
          toggleLetter(CZECH_ALPHABET[focusedIndex]);
        }
        return; // No index change
      default:
        return; // Allow Tab and other keys
    }

    setFocusedIndex(newIndex);
  };

  // Reset focus index when blur? Or keep it?
  // Usually keep it so when tabbing back we resume.
  // But if we tab out, we might want to clear visual focus?
  // Actually, visual focus only matters when container is focused.
  
  const availableWords = getAvailableWords(selectedLetters);

  return (
    <div className="setup-container">
      <h1>Nastavení pro rodiče</h1>
      
      <div className="section">
        <h2>1. Vyber písmenka</h2>
        <button onClick={toggleAll} className="secondary-btn mc-button">
          {selectedLetters.length === CZECH_ALPHABET.length ? 'Odznačit vše' : 'Vybrat vše'}
        </button>
        
        <div 
          className="alphabet-grid" 
          ref={gridRef}
          role="listbox"
          aria-label="Výběr písmen"
          aria-multiselectable="true"
          tabIndex={0}
          onKeyDown={handleGridKeyDown}
          onFocus={() => {
            setIsGridFocused(true);
            if (focusedIndex === -1) setFocusedIndex(0);
          }}
          onBlur={() => setIsGridFocused(false)}
        >
          {CZECH_ALPHABET.map((letter, index) => (
            <div
              key={letter}
              role="option"
              aria-selected={selectedLetters.includes(letter)}
              className={`letter-btn ${selectedLetters.includes(letter) ? 'selected' : ''} ${focusedIndex === index && isGridFocused ? 'focused' : ''}`}
              onClick={() => {
                setFocusedIndex(index);
                toggleLetter(letter);
                gridRef.current?.focus();
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <p className="hint-text">Tip: Klávesnice: Šipky pro pohyb, Mezerník pro výběr.</p>
      </div>

      <div className="section">
        <h2>2. Nastavení slov</h2>
        
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <input 
            type="checkbox" 
            id="uppercaseCheck"
            checked={uppercaseOnly}
            onChange={(e) => setUppercaseOnly(e.target.checked)}
            style={{ width: '30px', height: '30px' }}
          />
          <label htmlFor="uppercaseCheck" style={{ fontSize: '1.5rem', cursor: 'pointer', fontFamily: 'var(--font-reading)' }}>
            Pouze velká písmena (např. PES)
          </label>
        </div>

        <h3 id="word-count-heading" style={{ fontSize: '1.8rem', marginTop: '0', marginBottom: '15px', color: 'var(--mc-text)', textTransform: 'uppercase', textShadow: '2px 2px 0px #ddd' }}>Počet slov ve hře</h3>
        <div className="count-selector" role="radiogroup" aria-labelledby="word-count-heading">
          {[3, 5, 10, 15, 20, 30].map(count => (
            <label key={count} className="count-radio-wrapper">
              <input 
                type="radio" 
                name="wordCount"
                value={count}
                checked={wordCount === count}
                onChange={() => setWordCount(count)}
                className="count-radio-input"
              />
              <span className="count-radio-visual">
                {count}
              </span>
            </label>
          ))}
          <label className="count-radio-wrapper">
            <input 
              type="radio" 
              name="wordCount" 
              checked={![3, 5, 10, 15, 20, 30].includes(wordCount)}
              onChange={() => {}} // Focus on input handles selection
              className="count-radio-input"
            />
            <div className="count-radio-visual" style={{ width: 'auto', padding: '0 15px', position: 'relative' }}>
              <span style={{ marginRight: '10px' }}>Vlastní:</span>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={wordCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) setWordCount(val);
                }}
                className="custom-count-input"
                style={{ 
                  width: '60px', 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  fontFamily: 'var(--font-reading)',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: '2px solid #333'
                }}
              />
            </div>
          </label>
        </div>
      </div>

      <div className="footer">
        <p>Dostupných slov: {availableWords.length}</p>
        <button 
          className="start-btn mc-button"
          disabled={availableWords.length === 0}
          onClick={() => onStart({ allowedLetters: selectedLetters, fontSize, wordCount, uppercaseOnly })}
        >
          Spustit hru
        </button>
      </div>
    </div>
  );
};
