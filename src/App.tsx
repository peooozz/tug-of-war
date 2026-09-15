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

  const team1Score = useGameStore((s) => s.team1Score);
  const team2Score = useGameStore((s) => s.team2Score);

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

    const baseDelay = difficulty === 'easy' ? 14000 : difficulty === 'medium' ? 10500 : 8500;
    const randomJitter = Math.random() * 3500;
    const totalThinkingTime = baseDelay + randomJitter;

    botTimeoutRef.current = setTimeout(() => {
      if (useGameStore.getState().gamePhase !== 'playing' || !useGameStore.getState().isBotMode) {
        return;
      }

      const q = useGameStore.getState().team2Question;
      const willBeCorrect = Math.random() < 0.88;
      const answerVal = willBeCorrect ? q.answer : Math.max(0, q.answer + (Math.random() < 0.5 ? 1 : -1));
      const answerStr = answerVal.toString();

      useGameStore.setState({ botThinking: false });

      if (answerStr.length === 1) {
        useGameStore.setState({ team2Input: answerStr });
        botTypeTimeout2.current = setTimeout(() => {
          if (useGameStore.getState().gamePhase === 'playing') {
            submitAnswer('team2');
          }
        }, 600);
      } else {
        useGameStore.setState({ team2Input: answerStr[0] });
        botTypeTimeout1.current = setTimeout(() => {
          if (useGameStore.getState().gamePhase !== 'playing') return;
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

  // Physical Keyboard listener (supports Smart TV remote number keys & PC keyboard)
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
      } else if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'Clear' ||
        e.keyCode === 8 ||
        e.keyCode === 46 ||
        e.keyCode === 461 || // LG webOS Back
        e.keyCode === 10009 // Samsung Tizen Return
      ) {
        e.preventDefault();
        clearInput(target);
      } else if (
        e.key === 'Enter' ||
        e.key === 'Select' ||
        e.key === 'Ok' ||
        e.keyCode === 13
      ) {
        e.preventDefault();
        submitAnswer(target);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gamePhase, isBotMode, activeTeam, typeDigit, clearInput, submitAnswer]);

  return (
    <div className="w-screen h-screen h-[100dvh] max-h-screen light-ambient-bg flex flex-col p-1 sm:p-2.5 lg:p-3 overflow-hidden select-none relative">
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
          ? 'flex flex-col md:grid md:grid-cols-[auto_1fr_auto] gap-1.5 sm:gap-2.5 xl:gap-3.5 items-stretch'
          : 'flex items-center justify-center'
      }`}>
        {/* Desktop & Smart TV Left: Team 1 Panel (Blue) */}
        {gamePhase !== 'ready' && (
          <div className="hidden md:flex h-full max-h-full min-h-0 items-center justify-center">
            <TeamPanel
              team="team1"
              isKeyboardTarget={activeTeam === 'team1' || isBotMode}
              onFocusTeam={() => setActiveTeam('team1')}
            />
          </div>
        )}

        {/* Center: 3D Tug of War Canvas (Dynamic height on Mobile, Full height on TV/Desktop) */}
        <div className={`w-full flex items-center justify-center relative overflow-hidden rounded-2xl ${
          gamePhase !== 'ready'
            ? 'h-[28vh] sm:h-[34vh] md:h-full min-h-[140px] md:min-h-[200px] shrink-0 md:shrink'
            : 'h-full'
        }`}>
          <TugOfWarScene />
        </div>

        {/* Desktop & Smart TV Right: Team 2 Panel (Yellow / AI Bot) */}
        {gamePhase !== 'ready' && (
          <div className="hidden md:flex h-full max-h-full min-h-0 items-center justify-center">
            <TeamPanel
              team="team2"
              isKeyboardTarget={activeTeam === 'team2' && !isBotMode}
              onFocusTeam={() => setActiveTeam('team2')}
            />
          </div>
        )}

        {/* Mobile (Android & iPhone) Portrait Active Station */}
        {gamePhase !== 'ready' && (
          <div className="flex md:hidden flex-1 min-h-0 flex-col items-center justify-between w-full max-w-[420px] mx-auto pt-1">
            {/* 2-Player Mobile Tab Switcher */}
            {!isBotMode ? (
              <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-inner w-full mb-1 border border-white/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTeam('team1')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTeam === 'team1'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>⚡ Blue</span>
                  <span className="font-mono text-[10px] sm:text-xs opacity-90 font-black">({team1Score} pts)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTeam('team2')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTeam === 'team2'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>💥 Yellow</span>
                  <span className="font-mono text-[10px] sm:text-xs opacity-90 font-black">({team2Score} pts)</span>
                </button>
              </div>
            ) : (
              /* 1P Bot Status Strip on Mobile */
              <div className="flex items-center justify-between px-3 py-1 rounded-xl glass-inner w-full mb-1 border border-slate-200/80 text-xs font-black shrink-0">
                <span className="text-purple-700 flex items-center gap-1">
                  <span>🤖 AI Opponent:</span>
                  <span className="font-normal text-slate-500">
                    {useGameStore.getState().botThinking ? 'Calculating...' : 'Ready'}
                  </span>
                </span>
                <span className="font-mono text-amber-600 font-black">
                  {team2Score} pts
                </span>
              </div>
            )}

            {/* Active Station for Mobile View */}
            <div className="flex-1 min-h-0 w-full flex items-center justify-center">
              <TeamPanel
                team={isBotMode ? 'team1' : activeTeam}
                isKeyboardTarget={true}
                onFocusTeam={() => {}}
              />
            </div>
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
