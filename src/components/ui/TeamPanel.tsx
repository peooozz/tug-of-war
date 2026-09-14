import React, { useEffect, useRef } from 'react';
import { useGameStore, type TeamId } from '../../store/gameStore';
import { Delete, Check, Timer, Trophy, Bot, Sparkles } from 'lucide-react';

interface TeamPanelProps {
  team: TeamId;
  isKeyboardTarget?: boolean;
  onFocusTeam?: () => void;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({
  team,
  isKeyboardTarget = false,
  onFocusTeam,
}) => {
  const isTeam1 = team === 'team1';

  const score = useGameStore((s) => (isTeam1 ? s.team1Score : s.team2Score));
  const question = useGameStore((s) => (isTeam1 ? s.team1Question : s.team2Question));
  const inputVal = useGameStore((s) => (isTeam1 ? s.team1Input : s.team2Input));
  const shake = useGameStore((s) => (isTeam1 ? s.team1Shake : s.team2Shake));
  const timeLeft = useGameStore((s) => (isTeam1 ? s.team1TimeLeft : s.team2TimeLeft));
  const defaultTime = useGameStore((s) => s.defaultQuestionTime);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const isBotMode = useGameStore((s) => s.isBotMode);
  const botThinking = useGameStore((s) => s.botThinking);

  const typeDigit = useGameStore((s) => s.typeDigit);
  const clearInput = useGameStore((s) => s.clearInput);
  const submitAnswer = useGameStore((s) => s.submitAnswer);

  const cardRef = useRef<HTMLDivElement>(null);
  const isBotPlayer = isBotMode && !isTeam1;

  // Premium White Glassmorphism Themes: Team 1 (Electric Blue) vs Team 2 (Warm Amber Gold)
  const theme = isTeam1
    ? {
        name: 'Team Blue',
        accentBg: 'bg-blue-600',
        accentText: 'text-blue-600',
        glow: 'blue-glass-glow',
        tagBg: 'bg-blue-100 text-blue-800 border-blue-200',
        cardBg: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50',
        borderAccent: 'border-blue-200/80',
        keypadSubmit: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
        timerFill: 'bg-gradient-to-r from-blue-600 to-cyan-500',
        mascot: '⚡',
        roleBadge: 'Player 1',
      }
    : {
        name: isBotPlayer ? 'AI Challenger' : 'Team Yellow',
        accentBg: 'bg-amber-500',
        accentText: 'text-amber-600',
        glow: 'yellow-glass-glow',
        tagBg: isBotPlayer ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-amber-100 text-amber-800 border-amber-200',
        cardBg: 'bg-gradient-to-br from-amber-50/80 to-yellow-50/50',
        borderAccent: 'border-amber-200/80',
        keypadSubmit: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/25',
        timerFill: 'bg-gradient-to-r from-amber-500 to-yellow-400',
        mascot: isBotPlayer ? '🤖' : '💥',
        roleBadge: isBotPlayer ? 'AI Bot' : 'Player 2',
      };

  const timerPct = Math.max(0, Math.min(100, (timeLeft / defaultTime) * 100));
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

  // Global physical keyboard listener (only if not an AI player)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gamePhase !== 'playing' || isBotPlayer) return;

      if (isKeyboardTarget) {
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          typeDigit(team, e.key);
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          clearInput(team);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          submitAnswer(team);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, isKeyboardTarget, team, typeDigit, clearInput, submitAnswer, isBotPlayer]);

  return (
    <div
      onClick={!isBotPlayer ? onFocusTeam : undefined}
      className={`w-full max-w-[340px] xl:max-w-[370px] h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl glass-white ${
        theme.glow
      } transition-all duration-300 relative ${
        isKeyboardTarget && !isBotPlayer ? 'ring-2 ring-blue-500/60 shadow-blue-500/10' : ''
      }`}
    >
      {/* Top Header: Badge, Mascot, Score */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl glass-inner flex items-center justify-center text-2xl shadow-sm">
            {theme.mascot}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-slate-800 uppercase">
                {theme.name}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${theme.tagBg}`}>
                {theme.roleBadge}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold tracking-tight">
              {isBotPlayer ? 'Autonomous Math Engine' : 'Shared Screen Player'}
            </span>
          </div>
        </div>

        {/* Score Pill in Frosted Glass */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-inner shadow-sm border border-slate-200/60">
          <Trophy className={`w-4 h-4 ${theme.accentText}`} />
          <span className="font-mono font-black text-2xl text-slate-800 tracking-tight">{score}</span>
        </div>
      </div>

      {/* Round Timer Bar (25s per question) */}
      <div className="my-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
          <span className="flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-slate-500" />
            <span>Time Left</span>
          </span>
          <span
            className={`font-mono text-sm font-black ${
              timeLeft <= 5 ? 'text-red-500 animate-pulse-fast' : 'text-slate-800'
            }`}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200/80 p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-linear ${
              timeLeft <= 5 ? 'bg-red-500' : theme.timerFill
            }`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Question Card in White Glassmorphism */}
      <div
        className={`relative overflow-hidden p-3 sm:p-3.5 rounded-2xl ${theme.cardBg} border ${theme.borderAccent} shadow-sm text-center my-1 flex flex-col items-center justify-center`}
      >
        {/* Topic Category Badge */}
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider border shadow-xs ${
              question.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {question.topicName || 'MATH BATTLE'}
          </span>
          {question.hint && (
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
              • {question.hint}
            </span>
          )}
        </div>

        {/* Dynamic Equation Display */}
        <div className="font-black text-2xl sm:text-3xl text-slate-900 tracking-wide font-mono py-1 drop-shadow-sm leading-snug">
          {question.text.includes('?') ? question.text : `${question.text} = ?`}
        </div>
      </div>

      {/* Answer Display Box with shake on error */}
      <div
        ref={cardRef}
        className={`relative my-1.5 py-2.5 px-4 rounded-2xl flex items-center justify-center border-2 transition-all duration-150 ${
          shake
            ? 'animate-shake bg-red-50 border-red-400 text-red-600 shadow-sm'
            : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-inner'
        }`}
      >
        <span
          className={`font-mono font-black text-3xl sm:text-4xl tracking-widest min-h-[44px] flex items-center justify-center ${
            inputVal ? (isTeam1 ? 'text-blue-600' : 'text-amber-600') : 'text-slate-300'
          }`}
        >
          {inputVal || '—'}
        </span>
        {shake && (
          <span className="absolute right-3 px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
            INCORRECT
          </span>
        )}
      </div>

      {/* Bot Thinking Overlay OR Interactive Numeric Keypad */}
      {isBotPlayer ? (
        <div className="h-[210px] rounded-2xl glass-inner p-4 flex flex-col items-center justify-center text-center border border-slate-200/60 my-1">
          <div className="relative mb-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <Bot className="w-8 h-8 animate-bounce" />
            </div>
            <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-spin" />
          </div>
          <span className="font-black text-slate-800 text-sm uppercase tracking-wide mb-1">
            {botThinking ? 'Calculating Answer...' : 'AI Ready'}
          </span>
          <p className="text-xs text-slate-500 font-medium max-w-[200px]">
            The bot analyzes equations automatically and pulls with human pace!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mt-1">
          {keys.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => typeDigit(team, num)}
              disabled={gamePhase !== 'playing'}
              className="keypad-light-btn h-12 sm:h-13 flex items-center justify-center rounded-2xl text-slate-800 font-mono font-black text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}

          {/* Clear Button (Red X) */}
          <button
            type="button"
            onClick={() => clearInput(team)}
            disabled={gamePhase !== 'playing' || inputVal.length === 0}
            title="Clear (Backspace)"
            className="keypad-light-btn h-12 sm:h-13 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 border-red-200 font-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Delete className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            onClick={() => typeDigit(team, '0')}
            disabled={gamePhase !== 'playing'}
            className="keypad-light-btn h-12 sm:h-13 flex items-center justify-center rounded-2xl text-slate-800 font-mono font-black text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            0
          </button>

          {/* Submit Button (✓ Checkmark) */}
          <button
            type="button"
            onClick={() => submitAnswer(team)}
            disabled={gamePhase !== 'playing' || inputVal.length === 0}
            title="Submit (Enter)"
            className={`keypad-light-btn h-12 sm:h-13 flex items-center justify-center rounded-2xl ${theme.keypadSubmit} cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Check className="w-7 h-7 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
