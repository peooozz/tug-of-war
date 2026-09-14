import React from 'react';
import { useGameStore, CAMPAIGN_STAGES, type DifficultyLevel } from '../../store/gameStore';
import {
  Play,
  Bot,
  Users,
  CheckCircle2,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Flame,
  Ruler,
  Gem,
  Crown,
  Sparkles,
  Swords,
  Clock,
  Timer,
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

  if (gamePhase !== 'ready') return null;

  const currentStage = CAMPAIGN_STAGES.find((st) => st.id === currentLevelId) || CAMPAIGN_STAGES[0];

  const levelConfigs: Record<
    number,
    { icon: React.ReactNode; preview: string; color: string; badgeClass: string }
  > = {
    1: {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      preview: '15 + 28 = ?',
      color: 'border-blue-500 bg-blue-50/70',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    2: {
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      preview: '6 + 3 × (4 - 1)',
      color: 'border-indigo-500 bg-indigo-50/70',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    3: {
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      preview: '4² + √25 = ?',
      color: 'border-orange-500 bg-orange-50/70',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    4: {
      icon: <Ruler className="w-5 h-5 text-emerald-600" />,
      preview: 'Area = 8 × 6',
      color: 'border-emerald-500 bg-emerald-50/70',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    5: {
      icon: <Gem className="w-5 h-5 text-purple-600" />,
      preview: '2x + 6 = 20',
      color: 'border-purple-500 bg-purple-50/70',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    6: {
      icon: <Crown className="w-5 h-5 text-amber-600" />,
      preview: 'ALL TOPICS COMBINED',
      color: 'border-amber-500 bg-amber-50/90',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    },
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen light-ambient-bg flex flex-col justify-between p-3 sm:p-5 lg:p-6 overflow-y-auto select-none">
      {/* Dynamic Ambient Background Orbs */}
      <div className="ambient-orb ambient-orb-blue" />
      <div className="ambient-orb ambient-orb-yellow" />
      <div className="ambient-orb ambient-orb-purple" />

      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto relative z-10 flex items-center justify-between gap-4 p-3 sm:p-4 rounded-3xl glass-panel shadow-sm">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-800">
                Tug of War
              </h1>
              <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
                Math Battle
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold hidden sm:block">
              Pull the rope across the line with accurate math answers!
            </p>
          </div>
        </div>

        {/* Center Arena Indicators */}
        <div className="hidden md:flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl glass-inner text-blue-700 text-xs font-bold border border-blue-200/60">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>3:00 Match</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl glass-inner text-amber-700 text-xs font-bold border border-amber-200/60">
            <Timer className="w-3.5 h-3.5 text-amber-600" />
            <span>25s Clock</span>
          </span>
        </div>

        {/* Right Controls: Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-2xl glass-white border border-slate-200/80 shadow-xs text-slate-700 hover:text-slate-950 transition-all cursor-pointer hover:shadow-sm"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Battle Selection Hub */}
      <main className="w-full max-w-6xl mx-auto relative z-10 flex-1 flex flex-col justify-center py-3 sm:py-5 gap-3.5 sm:gap-4">
        {/* Battle Setup Toolbar: Mode + Difficulty */}
        <div className="p-3 sm:p-3.5 rounded-3xl glass-panel shadow-sm flex flex-wrap items-center justify-between gap-3">
          {/* Battle Mode */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 pl-1">
              Mode:
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-inner border border-white/80">
              <button
                type="button"
                onClick={() => toggleBotMode(true)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isBotMode
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25 ring-2 ring-purple-400/30'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>1P vs Bot</span>
              </button>

              <button
                type="button"
                onClick={() => toggleBotMode(false)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  !isBotMode
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-400/30'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>2-Player</span>
              </button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Difficulty:
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-inner border border-white/80">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => {
                const isActive = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black capitalize transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6 Math Battle Stages */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>Choose Any Level</span>
            </span>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
              Selected: Level {currentLevelId} — {currentStage.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {CAMPAIGN_STAGES.map((stage) => {
              const isSelected = currentLevelId === stage.id;
              const isLastLevel = stage.id === 6;
              const config = levelConfigs[stage.id];

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => selectLevel(stage.id)}
                  className={`relative p-4 rounded-3xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[125px] ${
                    isSelected
                      ? isLastLevel
                        ? 'glass-gold border-amber-500 ring-4 ring-amber-400/50 shadow-xl shadow-amber-500/20 transform scale-[1.02]'
                        : 'bg-white/95 border-blue-500 ring-4 ring-blue-400/40 shadow-xl shadow-blue-500/15 transform scale-[1.02]'
                      : isLastLevel
                      ? 'glass-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/40 shadow-sm hover:scale-[1.01]'
                      : 'glass-white border-white/90 hover:border-blue-300 hover:bg-white shadow-sm hover:scale-[1.01]'
                  }`}
                >
                  {/* Top: Icon + Stage Pill + Active Check */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl glass-inner flex items-center justify-center shadow-xs">
                        {config.icon}
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${config.badgeClass}`}
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

                  {/* Middle: Title & Math Discipline */}
                  <div>
                    <div className="font-black text-base text-slate-800 tracking-tight leading-snug">
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

                  {/* Bottom: Formula Preview Chip */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {config.preview}
                    </span>

                    {isLastLevel ? (
                      <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
                        <span>MIXED BOSS</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-bold tracking-widest">
                        ★★★
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Launch Button */}
      <footer className="w-full max-w-6xl mx-auto relative z-10 pt-1 pb-1">
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
