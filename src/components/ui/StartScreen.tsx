import React, { useState, useEffect } from 'react';
import { useGameStore, CAMPAIGN_STAGES, type DifficultyLevel } from '../../store/gameStore';
import {
  Play,
  Bot,
  Users,
  CheckCircle2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Flame,
  Ruler,
  Gem,
  Crown,
  Sparkles,
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
    6: <Crown className="w-5 h-5 text-amber-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen light-ambient-bg flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto select-none">
      {/* Dynamic Ambient Background Orbs */}
      <div className="ambient-orb ambient-orb-blue" />
      <div className="ambient-orb ambient-orb-yellow" />
      <div className="ambient-orb ambient-orb-purple" />

      {/* Top Clean Glass Header */}
      <header className="w-full max-w-6xl mx-auto relative z-10 flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-3xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl glass-inner flex items-center justify-center text-2xl shadow-xs">
            ⚔️
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <span>Tug of War:</span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
                Math Battle
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-semibold hidden sm:block">
              Choose any level to play • Solve equations to pull the rope
            </p>
          </div>
        </div>

        {/* Action Controls: Sound & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-2xl glass-white border border-slate-200/80 shadow-xs text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-white border border-slate-200/80 shadow-xs text-xs font-black text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-blue-600" /> : <Maximize className="w-4 h-4 text-blue-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'EXIT' : 'FULLSCREEN'}</span>
          </button>
        </div>
      </header>

      {/* Main Center Area: Mode/Difficulty Bar & 6 Level Cards */}
      <main className="w-full max-w-6xl mx-auto relative z-10 flex-1 flex flex-col justify-center py-4 sm:py-6 gap-4 sm:gap-6">
        {/* Simple & Clean Mode + Difficulty Selector Bar */}
        <div className="p-3 sm:p-4 rounded-3xl glass-panel flex flex-wrap items-center justify-between gap-4">
          {/* Game Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 hidden sm:inline">
              Mode:
            </span>
            <div className="flex items-center gap-1.5 glass-inner p-1 rounded-2xl border border-white/80">
              <button
                type="button"
                onClick={() => toggleBotMode(true)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isBotMode
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>1P vs Bot</span>
              </button>

              <button
                type="button"
                onClick={() => toggleBotMode(false)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  !isBotMode
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>2-Player</span>
              </button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 hidden sm:inline">
              Difficulty:
            </span>
            <div className="flex items-center gap-1.5 glass-inner p-1 rounded-2xl border border-white/80">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => {
                const isActive = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black capitalize transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6 Clean Level Cards Grid */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Choose Any Level
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50/90 px-3 py-0.5 rounded-full border border-blue-200">
              Selected: Level {currentLevelId} — {currentStage.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {CAMPAIGN_STAGES.map((stage) => {
              const isSelected = currentLevelId === stage.id;
              const isLastLevel = stage.id === 6;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => selectLevel(stage.id)}
                  className={`relative p-4 sm:p-5 rounded-3xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[115px] sm:min-h-[125px] ${
                    isSelected
                      ? isLastLevel
                        ? 'glass-gold border-amber-500 ring-4 ring-amber-400/40 shadow-lg shadow-amber-500/20 transform scale-[1.02]'
                        : 'bg-white/95 border-blue-500 ring-4 ring-blue-400/40 shadow-lg shadow-blue-500/15 transform scale-[1.02]'
                      : isLastLevel
                      ? 'glass-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/40 shadow-xs hover:scale-[1.01]'
                      : 'glass-white border-white/90 hover:border-blue-300 hover:bg-white shadow-xs hover:scale-[1.01]'
                  }`}
                >
                  {/* Card Header: Icon + Badge + Check */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl glass-inner flex items-center justify-center">
                        {levelIcons[stage.id] || stage.icon}
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                          isLastLevel
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        LEVEL {stage.id}
                      </span>
                    </div>

                    {isSelected && (
                      <CheckCircle2
                        className={`w-5 h-5 ${isLastLevel ? 'text-amber-600' : 'text-blue-600'}`}
                      />
                    )}
                  </div>

                  {/* Card Body: Title & Category */}
                  <div className="mt-2.5">
                    <div className="font-black text-base sm:text-lg text-slate-800 tracking-tight leading-snug">
                      {stage.title}
                    </div>
                    <div
                      className={`text-xs font-bold mt-0.5 ${
                        isLastLevel ? 'text-amber-700' : 'text-blue-600'
                      }`}
                    >
                      {stage.categoryLabel}
                    </div>
                  </div>

                  {/* Level 6 Special Ribbon */}
                  {isLastLevel && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-amber-950 bg-amber-300/80 border border-amber-400 px-2 py-0.5 rounded-lg w-fit">
                      <Sparkles className="w-3 h-3 text-amber-700 animate-spin" />
                      <span>MIX OF EVERYTHING!</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Sticky Action Footer */}
      <footer className="w-full max-w-6xl mx-auto relative z-10 pt-2 pb-1">
        <button
          type="button"
          onClick={startGame}
          className="game-btn-primary w-full py-4 sm:py-4.5 px-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white font-black text-lg sm:text-2xl flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wider shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform active:scale-[0.99] transition-all"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>
            START BATTLE — LEVEL {currentLevelId}: {currentStage.title}
          </span>
        </button>
      </footer>
    </div>
  );
};
