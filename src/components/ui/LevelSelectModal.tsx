import React from 'react';
import { useGameStore, CAMPAIGN_STAGES } from '../../store/gameStore';

export const LevelSelectModal: React.FC = () => {
  const isLevelModalOpen = useGameStore((s) => s.isLevelModalOpen);
  const currentLevelId = useGameStore((s) => s.currentLevelId);
  const unlockedLevels = useGameStore((s) => s.unlockedLevels);
  const levelStars = useGameStore((s) => s.levelStars);
  const selectLevel = useGameStore((s) => s.selectLevel);
  const toggleLevelModal = useGameStore((s) => s.toggleLevelModal);

  if (!isLevelModalOpen) return null;

  const totalStars = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl p-6 md:p-8 rounded-3xl glass-panel shadow-2xl shadow-slate-300/60 border border-white/90 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-display">
                CAMPAIGN STAGES
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Progress level by level across diverse math disciplines!
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Total Stars Counter */}
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 font-black text-sm shadow-sm">
              <span>⭐</span>
              <span>{totalStars} / 18 STARS</span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => toggleLevelModal(false)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center glass-inner hover:bg-white text-slate-600 font-bold transition-transform active:scale-95 border border-slate-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {CAMPAIGN_STAGES.map((stage) => {
            const isUnlocked = unlockedLevels.includes(stage.id);
            const isCurrent = currentLevelId === stage.id;
            const isLastLevel = stage.id === 6;
            const stars = levelStars[stage.id] || 0;

            return (
              <div
                key={stage.id}
                className={`relative p-5 rounded-2xl border transition-all duration-200 ${
                  isCurrent
                    ? isLastLevel
                      ? 'glass-gold border-amber-500 shadow-lg ring-2 ring-amber-400/50'
                      : 'bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-blue-400 shadow-lg shadow-blue-200/50 ring-2 ring-blue-500/20'
                    : isLastLevel
                    ? 'glass-white border-amber-300 hover:border-amber-400 hover:shadow-md'
                    : isUnlocked
                    ? 'glass-white border-white/90 hover:border-blue-300 hover:shadow-md'
                    : 'bg-slate-100/60 border-slate-200/60 opacity-60'
                }`}
              >
                {/* Top Badge: Level Number + Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{stage.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wider bg-slate-200/80 text-slate-700">
                      STAGE {stage.id}
                    </span>
                  </div>

                  {/* Stars or Lock Icon */}
                  {isUnlocked ? (
                    <div className="flex gap-1 text-sm">
                      {[1, 2, 3].map((starIdx) => (
                        <span key={starIdx} className={starIdx <= stars ? 'text-amber-400' : 'text-slate-200'}>
                          ★
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-base">🔒</span>
                  )}
                </div>

                {/* Stage Title */}
                <h3 className="text-lg font-black text-slate-800 font-display">
                  {stage.title}
                </h3>
                <div className="inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {stage.categoryLabel}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed min-h-[36px]">
                  {stage.description}
                </p>

                {/* Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    Target: {stage.targetScore} pts
                  </span>

                  {isUnlocked ? (
                    <button
                      onClick={() => selectLevel(stage.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all transform active:scale-95 shadow-sm ${
                        isCurrent
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                          : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                    >
                      {isCurrent ? 'Play Now' : 'Select'}
                    </button>
                  ) : (
                    <span className="text-xs font-black text-slate-400">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
