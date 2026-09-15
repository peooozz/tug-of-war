import React, { useEffect, useState, useRef } from 'react';
import { useGameStore, type TeamId } from './store/gameStore';
import { TugOfWarScene } from './components/scene/TugOfWarScene';
import { TeamPanel } from './components/ui/TeamPanel';
import { StadiumHUD } from './components/ui/StadiumHUD';
import { GameOverModal } from './components/ui/GameOverModal';
import { StartScreen } from './components/ui/StartScreen';
import { LevelSelectModal } from './components/ui/LevelSelectModal';

export const App: React.FC = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const isBotMode = useGameStore((s) => s.isBotMode);
  const difficulty = useGameStore((s) => s.difficulty);
  const team2Question = useGameStore((s) => s.team2Question);
  const tickMatchTimer = useGameStore((s) => s.tickMatchTimer);
  const tickQuestionTimer = useGameStore((s) => s.tickQuestionTimer);
  const typeDigit = useGameStore((s) => s.typeDigit);
  const clearInput = useGameStore((s) => s.clearInput);
  const submitAnswer = useGameStore((s) => s.submitAnswer);

  const [activeTeam, setActiveTeam] = useState<TeamId>('team1');
  const botTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botTypeTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botTypeTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Match and Question countdown intervals
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const matchInterval = setInterval(() => {
      tickMatchTimer();
    }, 1000);

    const team1Interval = setInterval(() => {
      tickQuestionTimer('team1');
    }, 1000);

    const team2Interval = setInterval(() => {
      tickQuestionTimer('team2');
    }, 1000);

    return () => {
      clearInterval(matchInterval);
      clearInterval(team1Interval);
      clearInterval(team2Interval);
    };
  }, [gamePhase, tickMatchTimer, tickQuestionTimer]);

  // Autonomous Slower Human-Like Bot AI Loop for Team Yellow
  useEffect(() => {
    if (gamePhase !== 'playing' || !isBotMode) {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
      if (botTypeTimeout1.current) clearTimeout(botTypeTimeout1.current);
      if (botTypeTimeout2.current) clearTimeout(botTypeTimeout2.current);
      return;
    }

    useGameStore.setState({ botThinking: true, team2Input: '' });

    // Slower, relaxed bot calculation delays (giving human ample time):
    // Easy: 14.0s - 18.0s, Medium: 10.5s - 14.5s, Hard: 8.5s - 12.0s
    const baseDelay = difficulty === 'easy' ? 14000 : difficulty === 'medium' ? 10500 : 8500;
    const randomJitter = Math.random() * 3500;
    const totalThinkingTime = baseDelay + randomJitter;

    botTimeoutRef.current = setTimeout(() => {
      if (useGameStore.getState().gamePhase !== 'playing' || !useGameStore.getState().isBotMode) {
        return;
      }

      const q = useGameStore.getState().team2Question;
      // 88% chance to be correct, 12% chance to make a typo on challenging questions
      const willBeCorrect = Math.random() < 0.88;
      const answerVal = willBeCorrect ? q.answer : Math.max(0, q.answer + (Math.random() < 0.5 ? 1 : -1));
      const answerStr = answerVal.toString();

      useGameStore.setState({ botThinking: false });

      // Progressive typing simulation
      if (answerStr.length === 1) {
        useGameStore.setState({ team2Input: answerStr });
        botTypeTimeout2.current = setTimeout(() => {
          if (useGameStore.getState().gamePhase === 'playing') {
            submitAnswer('team2');
          }
        }, 600);
      } else {
        // First digit
        useGameStore.setState({ team2Input: answerStr[0] });
        botTypeTimeout1.current = setTimeout(() => {
          if (useGameStore.getState().gamePhase !== 'playing') return;
          // Full digits
          useGameStore.setState({ team2Input: answerStr });
          botTypeTimeout2.current = setTimeout(() => {
            if (useGameStore.getState().gamePhase === 'playing') {
              submitAnswer('team2');
            }
          }, 650);
        }, 500);
      }
    }, totalThinkingTime);

    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
      if (botTypeTimeout1.current) clearTimeout(botTypeTimeout1.current);
      if (botTypeTimeout2.current) clearTimeout(botTypeTimeout2.current);
    };
  }, [gamePhase, isBotMode, team2Question.id, difficulty, submitAnswer]);

  // Physical Keyboard listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gamePhase !== 'playing') return;

      if (!isBotMode) {
        if (e.key === 'Tab') {
          e.preventDefault();
          setActiveTeam((prev) => (prev === 'team1' ? 'team2' : 'team1'));
          return;
        }

        if (e.code.startsWith('Numpad')) {
          const numpadMatch = e.code.match(/Numpad([0-9])/);
          if (numpadMatch) {
            e.preventDefault();
            typeDigit('team2', numpadMatch[1]);
            return;
          }
          if (e.code === 'NumpadEnter') {
            e.preventDefault();
            submitAnswer('team2');
            return;
          }
        }
      }

      const target = isBotMode ? 'team1' : activeTeam;

      if (/^[0-9]$/.test(e.key) && !e.code.startsWith('Numpad')) {
        e.preventDefault();
        typeDigit(target, e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        clearInput(target);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        submitAnswer(target);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gamePhase, isBotMode, activeTeam, typeDigit, clearInput, submitAnswer]);

  return (
    <div className="w-screen h-screen h-[100dvh] max-h-screen light-ambient-bg flex flex-col p-1.5 sm:p-2.5 lg:p-3 overflow-hidden select-none relative">
      {/* Background Animated Ambient Orbs for Authentic Optical Glassmorphism */}
      <div className="ambient-orb ambient-orb-blue" />
      <div className="ambient-orb ambient-orb-yellow" />
      <div className="ambient-orb ambient-orb-purple" />

      {/* Top Stadium HUD */}
      {gamePhase !== 'ready' && (
        <div className="relative z-10 w-full shrink-0">
          <StadiumHUD />
        </div>
      )}

      {/* Main Arena Layout */}
      <main className={`flex-1 w-full min-h-0 relative ${
        gamePhase !== 'ready'
          ? 'grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-1.5 sm:gap-2.5 xl:gap-3.5 items-stretch'
          : 'flex items-center justify-center'
      }`}>
        {/* Left: Team 1 Panel (Blue) */}
        {gamePhase !== 'ready' && (
          <div className="h-full max-h-full min-h-0 flex items-center justify-center">
            <TeamPanel
              team="team1"
              isKeyboardTarget={activeTeam === 'team1' || isBotMode}
              onFocusTeam={() => setActiveTeam('team1')}
            />
          </div>
        )}

        {/* Center: 3D Tug of War Canvas */}
        <div className="h-full w-full min-h-[220px] flex items-center justify-center relative overflow-hidden rounded-2xl">
          <TugOfWarScene />
        </div>

        {/* Right: Team 2 Panel (Yellow / AI Bot) */}
        {gamePhase !== 'ready' && (
          <div className="h-full max-h-full min-h-0 flex items-center justify-center">
            <TeamPanel
              team="team2"
              isKeyboardTarget={activeTeam === 'team2' && !isBotMode}
              onFocusTeam={() => setActiveTeam('team2')}
            />
          </div>
        )}
      </main>

      {/* Overlays */}
      <StartScreen />
      <LevelSelectModal />
      <GameOverModal />
    </div>
  );
};

export default App;
