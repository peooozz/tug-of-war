import React, { useState, useEffect } from 'react';
import { useGameStore, CAMPAIGN_STAGES, type DifficultyLevel } from '../../store/gameStore';
import {
  Play,
  Bot,
  Users,
  Clock,
  Timer,
  Sparkles,
  CheckCircle2,
  Maximize,
  Minimize,
  Swords,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Flame,
  Ruler,
  Gem,
  Crown,
  Info,
} from 'lucide-react';

export const StartScreen: React.FC = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const startGame = useGameStore((s) => s.startGame);
  const currentLevelId = useGameStore((s) => s.currentLevelId);
  const selectLevel = useGameStore((s) => s.selectLevel);
  const difficulty = useGameStore((s) => s.difficulty);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const isBotMode = useGameStore((s) => s.isBotMode);
  const toggleBotMode = useGameStore((s) => s.toggleBotMode);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleSound = useGameStore((s) => s.toggleSound);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
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

  if (gamePhase !== 'ready') return null;

  const currentStage = CAMPAIGN_STAGES.find((st) => st.id === currentLevelId) || CAMPAIGN_STAGES[0];

  const levelIcons: Record<number, React.ReactNode> = {
    1: <Zap className="w-5 h-5 text-blue-500" />,
    2: <Target className="w-5 h-5 text-indigo-500" />,
    3: <Flame className="w-5 h-5 text-orange-500" />,
    4: <Ruler className="w-5 h-5 text-emerald-500" />,
    5: <Gem className="w-5 h-5 text-purple-500" />,
    6: <Crown className="w-6 h-6 text-amber-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen light-ambient-bg flex flex-col justify-between p-3 sm:p-5 lg:p-7 overflow-y-auto lg:overflow-hidden select-none">
      {/* Background Animated Ambient Orbs for Authentic Optical Glassmorphism */}
      <div className="ambient-orb ambient-orb-blue" />
      <div className="ambient-orb ambient-orb-yellow" />
      <div className="ambient-orb ambient-orb-purple" />

      {/* Top Edge-to-Edge Glass Navigation Header */}
      <header className="w-full relative z-10 flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-3xl glass-panel shadow-sm">
        {/* Brand Section */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl glass-inner flex items-center justify-center border border-white/90 shadow-sm text-2xl">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-800">
                Tug of War
              </h1>
              <span className="px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black tracking-wide uppercase shadow-xs">
                Math Battle
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold hidden sm:block">
              Full-Screen Educational Tug-of-War Arena • Select Any Level
            </p>
          </div>
        </div>

        {/* Center Pill Badges */}
        <div className="hidden xl:flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-white text-blue-700 text-xs font-bold border border-blue-200/80 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>3:00 Match Duration</span>
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-white text-amber-700 text-xs font-bold border border-amber-200/80 shadow-xs">
            <Timer className="w-3.5 h-3.5 text-amber-600" />
            <span>25s Per Equation</span>
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-white text-purple-700 text-xs font-bold border border-purple-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>6 Math Stages Unlocked</span>
          </span>
        </div>

        {/* Action Controls: Sound & Native Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 sm:px-3 sm:py-2.5 rounded-2xl glass-white border border-slate-200/80 shadow-xs text-slate-700 hover:text-slate-950 transition-all cursor-pointer hover:shadow-sm"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Native Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-white border border-slate-200/80 shadow-xs text-xs font-black text-slate-700 hover:text-slate-950 transition-all cursor-pointer hover:shadow-sm"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-blue-600" /> : <Maximize className="w-4 h-4 text-blue-600" />}
            <span className="hidden md:inline">{isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}</span>
          </button>
        </div>
      </header>

      {/* Main Panoramic Dashboard Layout */}
      <main className="w-full relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 my-3 sm:my-4 min-h-0 items-stretch">
        {/* Left Column: Game Configuration (4 cols on lg) */}
        <section className="lg:col-span-4 flex flex-col justify-between gap-3.5 h-full">
          {/* 1. Game Mode Card */}
          <div className="p-4 sm:p-5 rounded-3xl glass-panel flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>1. Game Mode</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">Choose duel type</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {/* Bot Mode */}
              <button
                type="button"
                onClick={() => toggleBotMode(true)}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all cursor-pointer text-left ${
                  isBotMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md shadow-purple-500/25 ring-2 ring-purple-400/40 transform scale-[1.01]'
                    : 'glass-inner text-slate-700 border-white/80 hover:bg-white/90 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                  isBotMode ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-sm leading-snug">1P vs AI Bot</div>
                  <div className={`text-xs ${isBotMode ? 'text-purple-100' : 'text-slate-500'}`}>
                    Single player vs smart computer
                  </div>
                </div>
              </button>

              {/* 2-Player Mode */}
              <button
                type="button"
                onClick={() => toggleBotMode(false)}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all cursor-pointer text-left ${
                  !isBotMode
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40 transform scale-[1.01]'
                    : 'glass-inner text-slate-700 border-white/80 hover:bg-white/90 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                  !isBotMode ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-sm leading-snug">2-Player Duel</div>
                  <div className={`text-xs ${!isBotMode ? 'text-blue-100' : 'text-slate-500'}`}>
                    Shared keyboard &amp; screen match
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Difficulty Card */}
          <div className="p-4 sm:p-5 rounded-3xl glass-panel flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>2. Difficulty</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">Pacing &amp; complexity</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => {
                const isActive = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-3 px-2 rounded-2xl font-black capitalize text-xs sm:text-sm border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-800/30 transform scale-[1.02]'
                        : 'glass-inner text-slate-700 border-white/80 hover:bg-white/90 hover:border-slate-300'
                    }`}
                  >
                    <span>{level}</span>
                    <span className={`text-[10px] font-normal ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {level === 'easy' ? 'Relaxed' : level === 'medium' ? 'Standard' : 'Intense'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info / Arena Tip Card */}
          <div className="p-3.5 sm:p-4 rounded-3xl glass-white border border-white/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              <strong className="text-slate-800">How to Win:</strong> Solve equations faster than your opponent to haul the center ribbon across your victory marker!
            </p>
          </div>
        </section>

        {/* Right Column: Level Selector (8 cols on lg) */}
        <section className="lg:col-span-8 flex flex-col justify-between h-full">
          <div className="p-4 sm:p-5 rounded-3xl glass-panel h-full flex flex-col justify-between">
            {/* Header of Stage Selector */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                  3. Choose Any Math Level to Play
                </span>
              </div>
              <span className="text-xs font-black text-blue-700 bg-blue-50/90 px-3 py-1 rounded-full border border-blue-200 shadow-xs">
                Selected: Level {currentLevelId} — {currentStage.title}
              </span>
            </div>

            {/* 6 Clean Glass Level Cards (3 cols x 2 rows on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 flex-1 items-stretch">
              {CAMPAIGN_STAGES.map((stage) => {
                const isSelected = currentLevelId === stage.id;
                const isLastLevel = stage.id === 6;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => selectLevel(stage.id)}
                    className={`relative p-3.5 sm:p-4 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isLastLevel
                          ? 'glass-gold border-amber-500 ring-4 ring-amber-400/40 shadow-xl shadow-amber-500/25 transform scale-[1.02]'
                          : 'bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-white/90 border-blue-500 ring-4 ring-blue-400/40 shadow-xl shadow-blue-500/20 transform scale-[1.02]'
                        : isLastLevel
                        ? 'glass-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/50 shadow-sm hover:scale-[1.01]'
                        : 'glass-white border-white/80 hover:border-blue-300 hover:bg-white/90 shadow-sm hover:scale-[1.01]'
                    }`}
                  >
                    {/* Top Row: Icon + Level Badge + Selection Check */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl glass-inner flex items-center justify-center shadow-xs">
                          {levelIcons[stage.id] || <span>{stage.icon}</span>}
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                            isLastLevel
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          STAGE {stage.id}
                        </span>
                      </div>

                      {isSelected && (
                        <CheckCircle2
                          className={`w-5 h-5 ${isLastLevel ? 'text-amber-600' : 'text-blue-600'}`}
                        />
                      )}
                    </div>

                    {/* Level Title */}
                    <div>
                      <div className="font-black text-base text-slate-800 tracking-tight mb-0.5">
                        {stage.title}
                      </div>

                      {/* Category Label */}
                      <div
                        className={`text-xs font-bold leading-tight ${
                          isLastLevel ? 'text-amber-700' : 'text-blue-600'
                        }`}
                      >
                        {stage.categoryLabel}
                      </div>
                    </div>

                    {/* Level 6 Special Mixed Ribbon / Stage Description */}
                    {isLastLevel ? (
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-black text-amber-950 bg-amber-300/80 border border-amber-400 px-2.5 py-1 rounded-xl w-fit shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                        <span>MIX OF EVERYTHING!</span>
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-slate-500 font-medium">
                        {stage.description}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Sticky Panoramic Action Footer */}
      <footer className="w-full relative z-10 pt-1">
        <button
          type="button"
          onClick={startGame}
          className="game-btn-primary w-full py-4 sm:py-5 px-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white font-black text-lg sm:text-2xl flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wider shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform active:scale-[0.99] transition-all"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
          <span>
            START BATTLE — LEVEL {currentLevelId}: {currentStage.title}
          </span>
        </button>
      </footer>
    </div>
  );
};
