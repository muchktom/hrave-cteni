import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Mic, SkipForward, XCircle, AudioLines } from 'lucide-react';
import './GameScreen.css';

interface GameScreenProps {
  words: string[];
  fontSizeLevel: number;
  uppercaseOnly: boolean;
  onComplete: (results: { word: string; success: boolean; attempts: number; readingTime: number }[]) => void;
  onExit: () => void;
}

type FeedbackState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export const GameScreen: React.FC<GameScreenProps> = ({ words, fontSizeLevel, uppercaseOnly, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [results, setResults] = useState<{ word: string; success: boolean; attempts: number; readingTime: number }[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [lastHeard, setLastHeard] = useState<string>("");
  const currentWordTimeRef = useRef(0);
  
  const recognitionRef = useRef<any>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const successTriggered = useRef(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    let interval: any;
    if (feedback === 'listening') {
      interval = setInterval(() => {
        currentWordTimeRef.current += 100;
      }, 100);
    }
    return () => clearInterval(interval);
  }, [feedback]);

  useEffect(() => {
    // Focus mic button whenever word changes
    micButtonRef.current?.focus();
  }, [currentIndex]);

  useEffect(() => {
    successTriggered.current = false;
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'cs-CZ';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setFeedback('listening');
      };

      recognition.onend = () => {
        // Always reset to idle when recognition ends for any reason
        // unless we are already in success state
        if (feedback !== 'success') {
          setFeedback('idle');
        }
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        handleSpeechResult(fullTranscript);
      };

      recognition.onerror = (event: any) => {
        // Ignore 'no-speech' error if we just want to keep listening or retry manually
        if (event.error === 'no-speech') {
             // Maybe stay listening? Or idle?
             // Browser usually stops after no-speech.
             return;
        }
        console.error("Speech error", event.error);
        setFeedback('error');
        setTimeout(() => setFeedback('idle'), 2000);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Váš prohlížeč nepodporuje rozpoznávání hlasu. Použijte Chrome nebo Edge.");
    }
  }, [currentIndex]); // Re-init on index change isn't strictly necessary but keeps it clean

  const handleSpeechResult = (transcript: string) => {
    if (successTriggered.current) return;

    // Remove spaces to handle "M - Á - M - A" pauses
    const cleanTranscript = transcript.replace(/\s+/g, '').toUpperCase();
    const target = currentWord.toUpperCase();
    
    // We show raw transcript or cleaned? 
    // Showing raw might be confusing if it has random spaces.
    // Let's show the raw transcript but maybe trimmed.
    setLastHeard(transcript);
    setFeedback('processing');

    // Check strict equality or contains
    if (cleanTranscript.includes(target)) {
      if (recognitionRef.current) recognitionRef.current.stop();
      handleSuccess();
    } else {
      // Just keep listening. Don't trigger failure immediately.
      // We only switch back to 'listening' visual state if we want to reset 'processing'
      setFeedback('listening');
    }
  };

  const handleSuccess = () => {
    if (successTriggered.current) return;
    successTriggered.current = true;

    setFeedback('success');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Speak the word nicely as reinforcement (optional, using synth)
    const utterance = new SpeechSynthesisUtterance("Výborně! " + currentWord);
    utterance.lang = 'cs-CZ';
    window.speechSynthesis.speak(utterance);

    setTimeout(() => {
      nextWord(true);
    }, 2000);
  };

  const nextWord = (success: boolean) => {
    // Stop recognition if running
    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
    }

    const newResult = {
      word: currentWord,
      success,
      attempts: attempts + (success ? 1 : 0), // count current attempt
      readingTime: Math.round(currentWordTimeRef.current / 1000) // seconds
    };

    const newResults = [...results, newResult];
    setResults(newResults);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAttempts(0);
      setFeedback('idle');
      setLastHeard("");
      currentWordTimeRef.current = 0;
    } else {
      onComplete(newResults);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (feedback === 'listening') {
      try {
        recognitionRef.current.stop();
        // Force state update immediately for better responsiveness
        setFeedback('idle');
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    }
  };

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'cs-CZ';
    window.speechSynthesis.speak(utterance);
  };

  const handleSkip = () => {
    if (successTriggered.current) return;
    
    // Stop listening immediately
    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
    }

    setFeedback('processing');
    speakWord();

    // Wait a moment for the word to be spoken before moving on
    setTimeout(() => {
        nextWord(false);
    }, 1000);
  };

  // Font size calculation: 3 is base. Range 1-5.
  // Base 4rem. Step 1rem.
  const dynamicFontSize = `${3 + (fontSizeLevel * 0.8)}rem`;

  const displayWord = uppercaseOnly ? currentWord.toUpperCase() : currentWord;

  return (
    <div className={`game-container ${feedback}`}>
      <div className="header">
        <button className="exit-btn mc-button" onClick={onExit}><XCircle /> Ukončit</button>
        <div className="progress">Slovo {currentIndex + 1} z {words.length}</div>
      </div>

      <div className="word-display" style={{ fontSize: dynamicFontSize }}>
        {displayWord}
      </div>

      {lastHeard && feedback !== 'success' && (
        <div className="feedback-text">Slyším: "{lastHeard}"</div>
      )}

      <div className="controls">
        <button 
          ref={micButtonRef}
          className={`mic-btn ${feedback === 'listening' ? 'pulsing' : 'active-ready'}`}
          onClick={toggleListening}
          disabled={feedback === 'success' || feedback === 'processing'}
        >
          {feedback === 'listening' ? <AudioLines size={48} /> : <Mic size={48} />}
          {feedback === 'listening' ? 'Stop' : 'Mluv'}
        </button>

        <button 
          className="icon-btn skip" 
          onClick={handleSkip} 
          title="Přeskočit"
          disabled={feedback === 'processing' || feedback === 'success'}
        >
          <SkipForward size={32} />
        </button>
      </div>
    </div>
  );
};
