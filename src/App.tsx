import { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { getAvailableWords, WordCategory } from './data/words';
import './App.css';

type Screen = 'setup' | 'game' | 'summary';

interface GameSettings {
  allowedLetters: string[];
  allowedCategories: WordCategory[];
  fontSize: number;
  wordCount: number;
  uppercaseOnly: boolean;
}

interface GameResult {
  word: string;
  success: boolean;
  attempts: number;
  readingTime: number; // Time in seconds
}

function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);

  const handleStart = (newSettings: GameSettings) => {
    const words = getAvailableWords(newSettings.allowedLetters, newSettings.allowedCategories);
    // Shuffle and slice
    const selectedWords = words
      .sort(() => 0.5 - Math.random())
      .slice(0, newSettings.wordCount);

    setSettings(newSettings);
    setGameWords(selectedWords);
    setResults([]);
    setScreen('game');
  };

  const handleGameEnd = (gameResults: GameResult[]) => {
    setResults(gameResults);
    setScreen('summary');
  };

  const handleRestart = () => {
    setScreen('setup');
  };

  const handleQuickTest = () => {
    if (!settings) return;

    // Words that were incorrect OR took more than 1 attempt
    const problemWords = results
      .filter(r => !r.success || r.attempts > 1)
      .map(r => r.word);

    // Filter unique problem words just in case
    const uniqueProblemWords = [...new Set(problemWords)];
    
    // Limit to max 10 words
    const wordsToTest = uniqueProblemWords
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    
    let newGameWords: string[] = [];

    const pool = getAvailableWords(settings.allowedLetters, settings.allowedCategories);
    // Exclude words that are already in the problem list
    const availableFillers = pool.filter(w => !wordsToTest.includes(w));
      
    const needed = 10 - wordsToTest.length;
    const fillers = availableFillers
      .sort(() => 0.5 - Math.random())
      .slice(0, needed);
        
    newGameWords = [...wordsToTest, ...fillers];

    // Shuffle final list
    setGameWords(newGameWords.sort(() => 0.5 - Math.random()));
    setResults([]);
    setScreen('game');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="app-title">Hravé čtení</span>
      </header>
      <main>
        {screen === 'setup' && <SetupScreen onStart={handleStart} />}
        
        {screen === 'game' && settings && (
          <GameScreen 
            words={gameWords} 
            fontSizeLevel={settings.fontSize}
            uppercaseOnly={settings.uppercaseOnly}
            onComplete={handleGameEnd}
            onExit={handleRestart}
          />
        )}

        {screen === 'summary' && settings && (
          <SummaryScreen 
            results={results} 
            onRestart={handleRestart} 
            onQuickTest={handleQuickTest}
            uppercaseOnly={settings.uppercaseOnly}
          />
        )}
      </main>
    </div>
  );
}

export default App;

