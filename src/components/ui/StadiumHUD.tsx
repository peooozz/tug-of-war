import React from 'react';
import { useGameStore, CAMPAIGN_STAGES, type DifficultyLevel, type OperationType } from '../../store/gameStore';
import { Clock, Volume2, VolumeX, Settings2, Bot, Users, Home, Maximize, Minimize } from 'lucide-react';

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

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const currentStage = CAMPAIGN_STAGES.find((st) => st.id === currentLevelId) || CAMPAIGN_STAGES[0];

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
    <header className="w-full flex flex-col items-center justify-between gap-2 pb-2 select-none">
      {/* Top Banner Row */}
      <div className="w-full flex items-center justify-between gap-3 px-2 sm:px-4">
        {/* Left: Brand & Mode Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl glass-white flex items-center justify-center border border-slate-200/80 shadow-sm text-xl">
              ⚔️
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-800 uppercase">
                Tug of War:{' '}
                <span className="text-blue-600">
                  Math Battle
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-bold hidden sm:block">
                3-Minute Showdown • 25s per equation
              </p>
            </div>
          </div>

          {/* Bot Mode Switch Button */}
          <button
            type="button"
            onClick={() => toggleBotMode()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border shadow-sm ${
              isBotMode
                ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'
                : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
            }`}
            title="Switch between 1P vs AI and 2P Local Battle"
          >
            {isBotMode ? (
              <>
                <Bot className="w-3.5 h-3.5 text-purple-700" />
                <span>1P vs BOT</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 text-blue-700" />
                <span>2-PLAYER</span>
              </>
            )}
          </button>

          {/* Campaign Stage Selector Button */}
          <button
            type="button"
            onClick={() => toggleLevelModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border shadow-sm bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300/80 text-amber-900 hover:border-amber-400 hover:shadow"
            title="Open Campaign Level Select & Progression"
          >
            <span>{currentStage.icon}</span>
            <span className="hidden sm:inline">STAGE {currentStage.id}:</span>
            <span className="font-bold">{currentStage.title}</span>
            <span className="text-[10px] text-amber-600">▾</span>
          </button>

          {/* Home / Levels Screen Button */}
          <button
            type="button"
            onClick={goToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border shadow-sm bg-white/80 hover:bg-white text-slate-700 border-slate-200/90"
            title="Return to Homepage to Choose Any Level"
          >
            <Home className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">HOME</span>
          </button>

          {/* Difficulty selector pill in Frosted Glass */}
          <div className="hidden md:flex items-center glass-inner rounded-2xl p-1 border border-slate-200/70 text-xs font-bold shadow-sm">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-3 py-1 rounded-xl capitalize transition-all cursor-pointer ${
                  difficulty === level
                    ? 'bg-white text-slate-900 shadow-sm font-black border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Match Countdown Timer (03:00) & Scoreboard */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Team 1 Score (Blue) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 hidden sm:inline">
              Blue
            </span>
            <span className="font-mono font-black text-2xl text-blue-600">{team1Score}</span>
          </div>

          {/* 3-Minute Match Clock */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl glass-white border border-slate-200 shadow-sm">
            <Clock
              className={`w-4 h-4 ${matchTimeLeft <= 30 ? 'text-red-500 animate-spin' : 'text-amber-500'}`}
            />
            <span
              className={`font-mono font-black text-xl tracking-wider ${
                matchTimeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-slate-800'
              }`}
            >
              {timeFormatted}
            </span>
          </div>

          {/* Team 2 Score (Yellow / AI) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm">
            <span className="font-mono font-black text-2xl text-amber-600">{team2Score}</span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 hidden sm:inline">
              {isBotMode ? 'Bot' : 'Yellow'}
            </span>
          </div>
        </div>

        {/* Right: Operations & Sound Toggle */}
        <div className="flex items-center gap-2">
          {/* Allowed Operations */}
          <div className="hidden lg:flex items-center gap-1 glass-inner p-1 rounded-2xl border border-slate-200/70 shadow-sm">
            <Settings2 className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
            {(['add', 'sub', 'mult', 'div'] as OperationType[]).map((op) => {
              const active = allowedOps.includes(op);
              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => toggleOperation(op)}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-mono font-black transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
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
            className={`p-2 rounded-2xl glass-inner border border-slate-200/80 shadow-sm transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-50 text-red-500 border-red-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-2xl glass-inner border border-slate-200/80 shadow-sm transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-white"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-blue-600" /> : <Maximize className="w-5 h-5 text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Dynamic Rope Tension Meter (Light Glassmorphism) */}
      <div className="w-full max-w-xl px-4 flex flex-col items-center gap-1">
        <div className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 px-1">
          <span className="text-blue-600 flex items-center gap-1">◄ Blue Advantage</span>
          <span className="font-mono text-xs text-slate-700 px-2.5 py-0.5 rounded-full glass-inner border border-slate-200 shadow-sm font-bold">
            {ropePercent < 0
              ? `Blue +${Math.abs(ropePercent)}%`
              : ropePercent > 0
              ? `Yellow +${ropePercent}%`
              : 'Dead Center (0%)'}
          </span>
          <span className="text-amber-600 flex items-center gap-1">Yellow Advantage ►</span>
        </div>

        {/* Tug Progress Track */}
        <div className="w-full h-3 rounded-full bg-slate-200/80 relative overflow-hidden flex items-center justify-center border border-slate-300/60 shadow-inner">
          {/* Center line marker */}
          <div className="absolute w-1 h-full bg-slate-400 z-10" />

          {/* Dynamic Fill Indicator */}
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              ropePos < 0
                ? 'bg-gradient-to-l from-blue-500 to-indigo-600 shadow-sm shadow-blue-500/40'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm shadow-amber-500/40'
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
