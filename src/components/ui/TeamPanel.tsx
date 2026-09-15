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
        cardBg: 'bg-gradient-to-br from-blue-50/90 to-indigo-50/60',
        borderAccent: 'border-blue-200/90',
        keypadSubmit: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25',
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
        cardBg: 'bg-gradient-to-br from-amber-50/90 to-yellow-50/60',
        borderAccent: 'border-amber-200/90',
        keypadSubmit: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/25',
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
          clearInput(team);
        } else if (
          e.key === 'Enter' ||
          e.key === 'Select' ||
          e.key === 'Ok' ||
          e.keyCode === 13
        ) {
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
      className={`w-full max-w-[340px] sm:max-w-[360px] md:max-w-[370px] lg:max-w-[390px] xl:max-w-[440px] 2xl:max-w-[480px] h-full max-h-full flex flex-col justify-between p-2 sm:p-3 md:p-3.5 xl:p-5 rounded-2xl sm:rounded-3xl glass-white ${
        theme.glow
      } transition-all duration-300 relative select-none min-h-0 overflow-hidden ${
        isKeyboardTarget && !isBotPlayer ? 'ring-2 ring-blue-500/70 shadow-blue-500/15' : ''
      }`}
    >
      {/* Top Header: Mascot, Title, Role Badge, Score */}
      <div className="shrink-0 flex items-center justify-between gap-2 pb-1.5 sm:pb-2 xl:pb-2.5 border-b border-slate-200/70">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-xl sm:rounded-2xl glass-inner flex items-center justify-center text-lg sm:text-xl xl:text-2xl shadow-xs">
            {theme.mascot}
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-xs sm:text-sm md:text-base xl:text-lg tracking-tight text-slate-800 uppercase leading-none">
                {theme.name}
              </span>
              <span className={`text-[9px] sm:text-[10px] xl:text-xs px-1.5 py-0.5 rounded-md font-bold border ${theme.tagBg}`}>
                {theme.roleBadge}
              </span>
            </div>
            <span className="text-[10px] xl:text-xs text-slate-400 font-semibold tracking-tight">
              {isBotPlayer ? 'Autonomous AI' : 'Active Duelist'}
            </span>
          </div>
        </div>

        {/* Score Pill in Frosted Glass */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 xl:px-3.5 xl:py-1.5 rounded-xl sm:rounded-2xl glass-inner shadow-xs border border-slate-200/60">
          <Trophy className={`w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-5 xl:h-5 ${theme.accentText}`} />
          <span className="font-mono font-black text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-slate-800 tracking-tight">{score}</span>
        </div>
      </div>

      {/* Round Timer Bar (25s per question) */}
      <div className="shrink-0 my-1 sm:my-1.5 xl:my-2">
        <div className="flex items-center justify-between text-[11px] xl:text-xs font-bold text-slate-600 mb-0.5">
          <span className="flex items-center gap-1">
            <Timer className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-slate-500" />
            <span>Time Left</span>
          </span>
          <span
            className={`font-mono text-xs sm:text-sm xl:text-base font-black ${
              timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'
            }`}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-2 sm:h-2.5 xl:h-3 rounded-full bg-slate-200/80 p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-linear ${
              timeLeft <= 5 ? 'bg-red-500' : theme.timerFill
            }`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Question Card in White Glassmorphism - Resizable & perfectly fit */}
      <div
        className={`shrink-0 relative overflow-hidden py-1.5 sm:py-2 md:py-2.5 xl:py-3.5 px-2 sm:px-3 xl:px-4 rounded-xl sm:rounded-2xl ${theme.cardBg} border ${theme.borderAccent} shadow-xs text-center my-0.5 sm:my-1 flex flex-col items-center justify-center`}
      >
        {/* Topic Category Badge */}
        <div className="flex items-center gap-1 mb-0.5">
          <span
            className={`px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] xl:text-xs font-black tracking-wider border shadow-xs ${
              question.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {question.topicName || 'MATH BATTLE'}
          </span>
          {question.hint && (
            <span className="text-[9px] xl:text-[11px] font-bold text-slate-400 hidden sm:inline truncate max-w-[180px]">
              • {question.hint}
            </span>
          )}
        </div>

        {/* Dynamic Equation Display - Big & crisp on Smart TV */}
        <div className="font-black text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl text-slate-900 tracking-wide font-mono py-0.5 leading-snug drop-shadow-xs">
          {question.text.includes('?') ? question.text : `${question.text} = ?`}
        </div>
      </div>

      {/* Answer Display Box with shake on error - Resizable & perfectly fit */}
      <div
        ref={cardRef}
        className={`shrink-0 relative my-0.5 sm:my-1 py-1 sm:py-1.5 xl:py-2 px-3 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 transition-all duration-150 min-h-[36px] sm:min-h-[42px] xl:min-h-[50px] ${
          shake
            ? 'animate-shake bg-red-50 border-red-400 text-red-600 shadow-sm'
            : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-inner'
        }`}
      >
        <span
          className={`font-mono font-black text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl tracking-widest flex items-center justify-center leading-none ${
            inputVal ? (isTeam1 ? 'text-blue-600' : 'text-amber-600') : 'text-slate-300'
          }`}
        >
          {inputVal || '—'}
        </span>
        {shake && (
          <span className="absolute right-2 sm:right-3 px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] xl:text-xs font-black uppercase tracking-wider shadow-xs">
            INCORRECT
          </span>
        )}
      </div>

      {/* Bot Thinking Overlay OR Adaptive 4-Row Interactive Numeric Keypad */}
      {isBotPlayer ? (
        <div className="flex-1 min-h-0 rounded-2xl glass-inner p-3 sm:p-4 xl:p-6 flex flex-col items-center justify-center text-center border border-slate-200/60 my-0.5">
          <div className="relative mb-2 xl:mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 xl:w-10 xl:h-10 animate-bounce" />
            </div>
            <Sparkles className="w-4 h-4 xl:w-5 xl:h-5 text-amber-500 absolute -top-1 -right-1 animate-spin" />
          </div>
          <span className="font-black text-slate-800 text-xs sm:text-sm xl:text-base uppercase tracking-wide mb-0.5">
            {botThinking ? 'Calculating Answer...' : 'AI Ready'}
          </span>
          <p className="text-[11px] xl:text-xs text-slate-400 font-medium max-w-[220px] leading-tight">
            The bot calculates with realistic human pacing!
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-4 gap-1 sm:gap-1.5 xl:gap-2.5 mt-0.5 sm:mt-1">
          {keys.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => typeDigit(team, num)}
              disabled={gamePhase !== 'playing'}
              className="keypad-light-btn h-full min-h-0 w-full flex items-center justify-center rounded-xl sm:rounded-2xl text-slate-800 font-mono font-black text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-blue-500 outline-hidden transition-all duration-100 active:scale-95"
            >
              {num}
            </button>
          ))}

          {/* Clear Button (Red ⌫) */}
          <button
            type="button"
            onClick={() => clearInput(team)}
            disabled={gamePhase !== 'playing' || inputVal.length === 0}
            title="Clear (Backspace / Del)"
            className="keypad-light-btn h-full min-h-0 w-full flex items-center justify-center rounded-xl sm:rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 font-black cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-red-500 outline-hidden transition-all duration-100 active:scale-95"
          >
            <Delete className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 stroke-[2.5]" />
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            onClick={() => typeDigit(team, '0')}
            disabled={gamePhase !== 'playing'}
            className="keypad-light-btn h-full min-h-0 w-full flex items-center justify-center rounded-xl sm:rounded-2xl text-slate-800 font-mono font-black text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-blue-500 outline-hidden transition-all duration-100 active:scale-95"
          >
            0
          </button>

          {/* Submit Button (✓ Checkmark) - Always visible & distinctly highlighted */}
          <button
            type="button"
            onClick={() => submitAnswer(team)}
            disabled={gamePhase !== 'playing' || inputVal.length === 0}
            title="Submit (Enter / OK)"
            className={`keypad-light-btn h-full min-h-0 w-full flex items-center justify-center rounded-xl sm:rounded-2xl cursor-pointer focus-visible:ring-4 focus-visible:ring-emerald-500 outline-hidden transition-all duration-100 active:scale-95 ${
              inputVal.length > 0
                ? `${theme.keypadSubmit} shadow-lg ring-2 ring-white/40 scale-[1.01]`
                : 'bg-slate-100/90 hover:bg-slate-200/90 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
            }`}
          >
            <Check className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
