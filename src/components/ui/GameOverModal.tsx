import React, { useEffect } from 'react';
import { useGameStore, CAMPAIGN_STAGES } from '../../store/gameStore';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, Sparkles, Home, ArrowRight } from 'lucide-react';

export const GameOverModal: React.FC = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const winner = useGameStore((s) => s.winner);
  const team1Score = useGameStore((s) => s.team1Score);
  const team2Score = useGameStore((s) => s.team2Score);
  const team1Correct = useGameStore((s) => s.team1Correct);
  const team2Correct = useGameStore((s) => s.team2Correct);
  const team1Attempts = useGameStore((s) => s.team1Attempts);
  const team2Attempts = useGameStore((s) => s.team2Attempts);
  const isBotMode = useGameStore((s) => s.isBotMode);
  const resetGame = useGameStore((s) => s.resetGame);
  const currentLevelId = useGameStore((s) => s.currentLevelId);
  const nextLevel = useGameStore((s) => s.nextLevel);
  const goToHome = useGameStore((s) => s.goToHome);

  const currentStage = CAMPAIGN_STAGES.find((st) => st.id === currentLevelId) || CAMPAIGN_STAGES[0];

  useEffect(() => {
    if (gamePhase === 'gameover') {
      const colors =
        winner === 'team1'
          ? ['#2563EB', '#60A5FA', '#93C5FD']
          : ['#F59E0B', '#FDE047', '#FEF08A'];

      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: colors,
      });

      const timeout = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#2563EB', '#F59E0B', '#10B981'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#2563EB', '#F59E0B', '#10B981'],
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [gamePhase, winner]);

  if (gamePhase !== 'gameover') return null;

  const isTeam1Winner = winner === 'team1';
  const isTeam2Winner = winner === 'team2';

  const t1Acc = team1Attempts > 0 ? Math.round((team1Correct / team1Attempts) * 100) : 100;
  const t2Acc = team2Attempts > 0 ? Math.round((team2Correct / team2Attempts) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xl select-none animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl p-6 sm:p-8 glass-panel shadow-2xl shadow-slate-400/40 flex flex-col items-center text-center relative overflow-hidden">
        {/* Trophy icon */}
        <div className="relative mb-3">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${
              isTeam1Winner
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
                : isTeam2Winner
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30'
                : 'bg-slate-800 text-white shadow-slate-700/30'
            }`}
          >
            <Trophy className="w-10 h-10 drop-shadow" />
          </div>
          <Sparkles className="w-7 h-7 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 mb-1">
          {isTeam1Winner
            ? 'Team Blue Wins!'
            : isTeam2Winner
            ? isBotMode ? 'AI Bot Wins!' : 'Team Yellow Wins!'
            : 'Match Drawn!'}
        </h2>
        <p className="text-sm font-semibold text-slate-500 mb-6">
          {isTeam1Winner
            ? '⚡ Exceptional math calculation pulled Blue across the line!'
            : isTeam2Winner
            ? '💥 Rapid problem-solving secured the victory!'
            : 'Both sides battled with absolute mathematical equality!'}
        </p>

        {/* Match Statistics Grid in White Glass */}
        <div className="w-full grid grid-cols-2 gap-4 mb-6">
          {/* Team 1 Stats Card */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isTeam1Winner
                ? 'bg-blue-50/90 border-blue-300 shadow-md shadow-blue-500/10'
                : 'glass-inner border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-blue-600 text-sm uppercase tracking-wide">
                ⚡ Blue Squad
              </span>
              {isTeam1Winner && <Award className="w-5 h-5 text-amber-500" />}
            </div>
            <div className="font-mono text-3xl font-black text-slate-900 mb-2">{team1Score} pts</div>
            <div className="text-xs text-slate-600 flex flex-col gap-1 text-left font-semibold">
              <div className="flex justify-between">
                <span>Correct:</span>
                <span className="text-slate-900 font-bold">{team1Correct}</span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="text-slate-900 font-bold">{t1Acc}%</span>
              </div>
            </div>
          </div>

          {/* Team 2 Stats Card */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isTeam2Winner
                ? 'bg-amber-50/90 border-amber-300 shadow-md shadow-amber-500/10'
                : 'glass-inner border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-amber-600 text-sm uppercase tracking-wide">
                {isBotMode ? '🤖 AI Bot' : '💥 Yellow Squad'}
              </span>
              {isTeam2Winner && <Award className="w-5 h-5 text-amber-500" />}
            </div>
            <div className="font-mono text-3xl font-black text-slate-900 mb-2">{team2Score} pts</div>
            <div className="text-xs text-slate-600 flex flex-col gap-1 text-left font-semibold">
              <div className="flex justify-between">
                <span>Correct:</span>
                <span className="text-slate-900 font-bold">{team2Correct}</span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="text-slate-900 font-bold">{t2Acc}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Stage Indicator */}
        <div className="w-full mb-4 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>{currentStage.icon} Stage {currentStage.id}: {currentStage.title}</span>
          <span className="text-slate-500">{currentStage.categoryLabel}</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Next Level Button (if won and not final level) */}
          {isTeam1Winner && currentLevelId < 6 && (
            <button
              type="button"
              onClick={nextLevel}
              className="game-btn-primary w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white font-black text-lg flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <span>NEXT LEVEL (STAGE {currentLevelId + 1})</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}

          <div className="w-full grid grid-cols-2 gap-2.5">
            {/* Replay Current Level */}
            <button
              type="button"
              onClick={resetGame}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-md shadow-emerald-600/20"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>REPLAY STAGE</span>
            </button>

            {/* Choose Another Level / Homepage */}
            <button
              type="button"
              onClick={goToHome}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-md shadow-slate-800/20"
            >
              <Home className="w-4 h-4 stroke-[2.5]" />
              <span>ALL LEVELS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
