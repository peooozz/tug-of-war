import React from 'react';
import { useGameStore, CAMPAIGN_STAGES, type DifficultyLevel, type OperationType } from '../../store/gameStore';
import { Clock, Volume2, VolumeX, Settings2, Bot, Users, Home } from 'lucide-react';

export const StadiumHUD: React.FC = () => {
  const team1Score = useGameStore((s) => s.team1Score);
  const team2Score = useGameStore((s) => s.team2Score);
  const matchTimeLeft = useGameStore((s) => s.matchTimeLeft);
  const ropePos = useGameStore((s) => s.ropePosition);
  const difficulty = useGameStore((s) => s.difficulty);
  const allowedOps = useGameStore((s) => s.allowedOperations);
  const isMuted = useGameStore((s) => s.isMuted);
  const isBotMode = useGameStore((s) => s.isBotMode);
  const currentLevelId = useGameStore((s) => s.currentLevelId);
  const toggleLevelModal = useGameStore((s) => s.toggleLevelModal);
  const goToHome = useGameStore((s) => s.goToHome);

  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const toggleOperation = useGameStore((s) => s.toggleOperation);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const toggleBotMode = useGameStore((s) => s.toggleBotMode);

  const gamePhase = useGameStore((s) => s.gamePhase);
  const currentStage = CAMPAIGN_STAGES.find((st) => st.id === currentLevelId) || CAMPAIGN_STAGES[0];

  if (gamePhase === 'ready') return null;

  // Format mm:ss (starts at 03:00)
  const minutes = Math.floor(matchTimeLeft / 60);
  const seconds = matchTimeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const ropePercent = Math.round(ropePos * 100);

  const opSymbols: Record<OperationType, string> = {
    add: '+',
    sub: '−',
    mult: '×',
    div: '÷',
  };

  return (
    <header className="w-full flex flex-col items-center justify-between gap-1 pb-1 select-none shrink-0">
      {/* Top Banner Row */}
      <div className="w-full flex items-center justify-between gap-2 px-1 sm:px-3">
        {/* Left: Brand & Match Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl glass-white flex items-center justify-center border border-slate-200/80 shadow-xs text-base sm:text-lg">
              ⚔️
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black tracking-tight text-slate-800 uppercase leading-tight">
                Tug of War:{' '}
                <span className="text-blue-600">
                  Math
                </span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold hidden md:block">
                3v3 Arena
              </p>
            </div>
          </div>

          {/* Bot Mode Switch Button */}
          <button
            type="button"
            onClick={() => toggleBotMode()}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer border shadow-xs ${
              isBotMode
                ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'
                : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
            }`}
            title="Switch between 1P vs AI and 2P Local Battle"
          >
            {isBotMode ? (
              <>
                <Bot className="w-3 h-3 text-purple-700" />
                <span className="hidden sm:inline">1P BOT</span>
              </>
            ) : (
              <>
                <Users className="w-3 h-3 text-blue-700" />
                <span className="hidden sm:inline">2-PLAYER</span>
              </>
            )}
          </button>

          {/* Campaign Stage Selector Button */}
          <button
            type="button"
            onClick={() => toggleLevelModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer border shadow-xs bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300/80 text-amber-900 hover:border-amber-400"
            title="Open Campaign Level Select & Progression"
          >
            <span>{currentStage.icon}</span>
            <span className="font-bold truncate max-w-[120px]">L{currentStage.id}: {currentStage.title}</span>
            <span className="text-[9px] text-amber-600">▾</span>
          </button>

          {/* Home / Levels Screen Button */}
          <button
            type="button"
            onClick={goToHome}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer border shadow-xs bg-white/80 hover:bg-white text-slate-700 border-slate-200/90"
            title="Return to Homepage"
          >
            <Home className="w-3 h-3 text-slate-600" />
            <span className="hidden sm:inline">HOME</span>
          </button>

          {/* Difficulty selector pill */}
          <div className="hidden lg:flex items-center glass-inner rounded-xl p-0.5 border border-slate-200/70 text-[11px] font-bold shadow-xs">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-2 py-0.5 rounded-lg capitalize transition-all cursor-pointer ${
                  difficulty === level
                    ? 'bg-white text-slate-900 shadow-xs font-black border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Match Countdown Timer (03:00) & Scoreboard */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Team 1 Score (Blue) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 shadow-xs">
            <span className="text-[10px] font-black uppercase text-blue-600 hidden sm:inline">
              Blue
            </span>
            <span className="font-mono font-black text-lg sm:text-xl text-blue-600">{team1Score}</span>
          </div>

          {/* 3-Minute Match Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl glass-white border border-slate-200 shadow-xs">
            <Clock
              className={`w-3.5 h-3.5 ${matchTimeLeft <= 30 ? 'text-red-500 animate-spin' : 'text-amber-500'}`}
            />
            <span
              className={`font-mono font-black text-base sm:text-lg tracking-wider ${
                matchTimeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-slate-800'
              }`}
            >
              {timeFormatted}
            </span>
          </div>

          {/* Team 2 Score (Yellow / AI) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
            <span className="font-mono font-black text-lg sm:text-xl text-amber-600">{team2Score}</span>
            <span className="text-[10px] font-black uppercase text-amber-700 hidden sm:inline">
              {isBotMode ? 'Bot' : 'Yellow'}
            </span>
          </div>
        </div>

        {/* Right: Operations & Sound Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Allowed Operations */}
          <div className="hidden xl:flex items-center gap-1 glass-inner p-0.5 rounded-xl border border-slate-200/70 shadow-xs">
            <Settings2 className="w-3 h-3 text-slate-400 ml-1 mr-0.5" />
            {(['add', 'sub', 'mult', 'div'] as OperationType[]).map((op) => {
              const active = allowedOps.includes(op);
              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => toggleOperation(op)}
                  className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-mono font-black transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title={`Toggle ${op}`}
                >
                  {opSymbols[op]}
                </button>
              );
            })}
          </div>

          {/* Audio Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-1.5 sm:p-2 rounded-xl glass-inner border border-slate-200/80 shadow-xs transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-50 text-red-500 border-red-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Rope Tension Meter - Streamlined for TV & Desktop */}
      <div className="w-full max-w-lg px-2 flex flex-col items-center gap-0.5">
        <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 px-1">
          <span className="text-blue-600 flex items-center gap-0.5">◄ Blue Advantage</span>
          <span className="font-mono text-[10px] sm:text-xs text-slate-700 px-2 py-0.2 rounded-full glass-inner border border-slate-200 shadow-xs font-bold">
            {ropePercent < 0
              ? `Blue +${Math.abs(ropePercent)}%`
              : ropePercent > 0
              ? `Yellow +${ropePercent}%`
              : 'Dead Center (0%)'}
          </span>
          <span className="text-amber-600 flex items-center gap-0.5">Yellow Advantage ►</span>
        </div>

        {/* Tug Progress Track */}
        <div className="w-full h-2 sm:h-2.5 rounded-full bg-slate-200/80 relative overflow-hidden flex items-center justify-center border border-slate-300/60 shadow-inner">
          {/* Center line marker */}
          <div className="absolute w-1 h-full bg-slate-400 z-10" />

          {/* Dynamic Fill Indicator */}
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              ropePos < 0
                ? 'bg-gradient-to-l from-blue-500 to-indigo-600 shadow-xs shadow-blue-500/40'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-xs shadow-amber-500/40'
            }`}
            style={{
              width: `${Math.min(100, Math.abs(ropePos) * 100)}%`,
              marginLeft: ropePos < 0 ? 'auto' : '50%',
              marginRight: ropePos < 0 ? '50%' : 'auto',
            }}
          />
        </div>
      </div>
    </header>
  );
};
