import React from 'react';
import { Star, Home } from 'lucide-react';
import './SummaryScreen.css';

interface SummaryScreenProps {
  results: { word: string; success: boolean; attempts: number; readingTime: number }[];
  onRestart: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ results, onRestart }) => {
  const correctCount = results.filter(r => r.success).length;
  const incorrect = results.filter(r => !r.success);
  
  // Calculate star rating (1-3 stars)
  const percentage = (correctCount / results.length) * 100;
  const stars = percentage === 100 ? 3 : percentage >= 50 ? 2 : 1;

  return (
    <div className="summary-container">
      <h1>Konec hry!</h1>
      
      <div className="stars">
        {[...Array(3)].map((_, i) => (
          <Star 
            key={i} 
            size={64} 
            fill={i < stars ? "#FFD700" : "none"} 
            color={i < stars ? "#FFD700" : "#555"}
            className="star-icon"
          />
        ))}
      </div>

      <h2>Přečteno: {correctCount} z {results.length}</h2>

      {incorrect.length > 0 && (
        <div className="mistakes-section">
          <h3>Slova k procvičení:</h3>
          <div className="words-grid">
            {incorrect.map((res, i) => (
              <div key={i} className="mistake-card">
                {res.word}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="table-container">
        <h3>Detailní přehled:</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Slovo</th>
              <th style={{ textAlign: 'right' }}>Čas čtení</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className={r.success ? 'correct' : 'incorrect'}>
                <td>{r.word} {r.success ? '✅' : '❌'}</td>
                <td className="time-cell">{r.readingTime}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {incorrect.length === 0 && (
        <div className="perfect-score">
          <p>Fantastická práce! Všechno správně.</p>
        </div>
      )}

      <div className="actions">
        <button className="action-btn primary mc-button" onClick={onRestart}>
          <Home size={24} />
          Zpět na začátek
        </button>
      </div>
    </div>
  );
};

