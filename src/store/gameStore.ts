import { create } from 'zustand';
import {
  generateQuestionForLevel,
  type MathQuestion,
  type DifficultyLevel,
  type OperationType,
  type MathCategory,
} from '../utils/mathGenerator';
import { sounds } from '../utils/soundEffects';

export type { DifficultyLevel, OperationType, MathCategory };

export type TeamId = 'team1' | 'team2';
export type AnimationState = 'idle' | 'pull' | 'strain';

export interface CampaignStage {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  category: MathCategory | 'mixed';
  categoryLabel: string;
  description: string;
  targetScore: number;
  bgTheme: string;
}

export const CAMPAIGN_STAGES: CampaignStage[] = [
  {
    id: 1,
    title: 'Rookie Turf',
    subtitle: 'Arithmetic Warmup',
    icon: '⚡',
    category: 'arithmetic',
    categoryLabel: 'Addition & Subtraction',
    description: 'Master quick mental additions and subtractions to build early rope momentum!',
    targetScore: 400,
    bgTheme: '#F8FAFC',
  },
  {
    id: 2,
    title: 'Speed Gym',
    subtitle: 'Order of Operations',
    icon: '🎯',
    category: 'pemdas',
    categoryLabel: 'PEMDAS & Multi-Step',
    description: 'Calculate multi-step expressions following order of operations before your opponent pulls!',
    targetScore: 500,
    bgTheme: '#F1F5F9',
  },
  {
    id: 3,
    title: 'Power Tower',
    subtitle: 'Powers & Square Roots',
    icon: '🔥',
    category: 'powers',
    categoryLabel: 'Exponents (x², x³) & √x',
    description: 'Solve squares, cubes, and clean square roots under intense match pressure!',
    targetScore: 600,
    bgTheme: '#F3F4F6',
  },
  {
    id: 4,
    title: 'Shape Colosseum',
    subtitle: 'Geometry & Angles',
    icon: '📐',
    category: 'geometry',
    categoryLabel: 'Area, Perimeter & Angles',
    description: 'Calculate rectangle areas, perimeters, and find missing angles of triangles!',
    targetScore: 700,
    bgTheme: '#ECFDF5',
  },
  {
    id: 5,
    title: 'Algebra Champions',
    subtitle: 'Pre-Algebra & Percents',
    icon: '💎',
    category: 'algebra',
    categoryLabel: 'Solve for x & Fractions of Whole',
    description: 'Isolate and solve for x in linear equations and calculate percentages of quantities!',
    targetScore: 800,
    bgTheme: '#EEF2FF',
  },
  {
    id: 6,
    title: 'Grand Titan Boss',
    subtitle: 'Ultimate Math Showdown',
    icon: '👑',
    category: 'mixed',
    categoryLabel: 'All Categories Mixed Showdown',
    description: 'The supreme championship! Every math topic combined against the grand master AI!',
    targetScore: 1000,
    bgTheme: '#FFFBEB',
  },
];

export interface GameState {
  // Scores
  team1Score: number;
  team2Score: number;

  // Stats
  team1Correct: number;
  team2Correct: number;
  team1Attempts: number;
  team2Attempts: number;

  // Questions (independent)
  team1Question: MathQuestion;
  team2Question: MathQuestion;

  // Current inputs
  team1Input: string;
  team2Input: string;

  // Error feedback state
  team1Shake: boolean;
  team2Shake: boolean;

  // Animation states for 3D characters
  team1Animation: AnimationState;
  team2Animation: AnimationState;

  // Rope position from -1 (Team 1 Left full win) to 1 (Team 2 Right full win)
  ropePosition: number;
  targetRopePosition: number;

  // Timers: 25s per question, 180s (3 mins) match duration
  team1TimeLeft: number;
  team2TimeLeft: number;
  matchTimeLeft: number;
  readonly defaultQuestionTime: number;
  readonly defaultMatchTime: number;

  // Level Progression System
  currentLevelId: number;
  unlockedLevels: number[];
  levelStars: Record<number, number>; // levelId -> 1..3 stars
  isLevelModalOpen: boolean;

  // Game control & Bot mode
  gamePhase: 'ready' | 'playing' | 'gameover';
  isBotMode: boolean;
  botThinking: boolean;
  winner: TeamId | 'draw' | null;
  winThreshold: number;
  difficulty: DifficultyLevel;
  allowedOperations: OperationType[];

  // Sound
  isMuted: boolean;

  // Actions
  setDifficulty: (level: DifficultyLevel) => void;
  toggleOperation: (op: OperationType) => void;
  toggleBotMode: (enabled?: boolean) => void;
  toggleSound: () => boolean;
  startGame: () => void;
  typeDigit: (team: TeamId, digit: string) => void;
  clearInput: (team: TeamId) => void;
  submitAnswer: (team: TeamId) => void;
  tickQuestionTimer: (team: TeamId) => void;
  tickMatchTimer: () => void;
  setRopePosition: (pos: number) => void;
  resetGame: () => void;

  // Level Actions
  selectLevel: (levelId: number) => void;
  nextLevel: () => void;
  toggleLevelModal: (open?: boolean) => void;
  goToHome: () => void;
}

const DEFAULT_QUESTION_TIME = 25; // 25 seconds per question
const DEFAULT_MATCH_TIME = 180;   // 3 minutes (180s) match duration
const ROPE_PULL_DELTA = 0.2;      // 5 net correct answers to win outright

export const useGameStore = create<GameState>((set, get) => ({
  team1Score: 0,
  team2Score: 0,
  team1Correct: 0,
  team2Correct: 0,
  team1Attempts: 0,
  team2Attempts: 0,

  team1Question: generateQuestionForLevel(1, 'medium'),
  team2Question: generateQuestionForLevel(1, 'medium'),

  team1Input: '',
  team2Input: '',

  team1Shake: false,
  team2Shake: false,

  team1Animation: 'idle',
  team2Animation: 'idle',

  ropePosition: 0,
  targetRopePosition: 0,

  team1TimeLeft: DEFAULT_QUESTION_TIME,
  team2TimeLeft: DEFAULT_QUESTION_TIME,
  matchTimeLeft: DEFAULT_MATCH_TIME,
  defaultQuestionTime: DEFAULT_QUESTION_TIME,
  defaultMatchTime: DEFAULT_MATCH_TIME,

  // Campaign level system - All 6 levels accessible
  currentLevelId: 1,
  unlockedLevels: [1, 2, 3, 4, 5, 6],
  levelStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  isLevelModalOpen: false,

  gamePhase: 'ready',
  isBotMode: true,
  botThinking: false,
  winner: null,
  winThreshold: 1.0,
  difficulty: 'medium',
  allowedOperations: ['add', 'sub', 'mult', 'div'],
  isMuted: false,

  setDifficulty: (difficulty: DifficultyLevel) => {
    const level = get().currentLevelId;
    set({
      difficulty,
      team1Question: generateQuestionForLevel(level, difficulty, get().allowedOperations),
      team2Question: generateQuestionForLevel(level, difficulty, get().allowedOperations),
    });
  },

  toggleOperation: (op: OperationType) => {
    const current = get().allowedOperations;
    let next: OperationType[];
    if (current.includes(op)) {
      if (current.length === 1) return;
      next = current.filter((o) => o !== op);
    } else {
      next = [...current, op];
    }
    const level = get().currentLevelId;
    set({
      allowedOperations: next,
      team1Question: generateQuestionForLevel(level, get().difficulty, next),
      team2Question: generateQuestionForLevel(level, get().difficulty, next),
    });
  },

  toggleBotMode: (enabled?: boolean) => {
    const nextVal = enabled !== undefined ? enabled : !get().isBotMode;
    set({ isBotMode: nextVal, botThinking: false, team2Input: '' });
  },

  toggleSound: () => {
    const nextMuted = sounds.toggleMute();
    set({ isMuted: nextMuted });
    return nextMuted;
  },

  selectLevel: (levelId: number) => {
    const { difficulty, allowedOperations } = get();
    set({
      currentLevelId: levelId,
      isLevelModalOpen: false,
      team1Question: generateQuestionForLevel(levelId, difficulty, allowedOperations),
      team2Question: generateQuestionForLevel(levelId, difficulty, allowedOperations),
    });
  },

  nextLevel: () => {
    const nextId = Math.min(6, get().currentLevelId + 1);
    get().selectLevel(nextId);
    get().startGame();
  },

  toggleLevelModal: (open?: boolean) => {
    set({ isLevelModalOpen: open !== undefined ? open : !get().isLevelModalOpen });
  },

  goToHome: () => {
    const { currentLevelId, difficulty, allowedOperations } = get();
    set({
      gamePhase: 'ready',
      isLevelModalOpen: false,
      team1Score: 0,
      team2Score: 0,
      team1Correct: 0,
      team2Correct: 0,
      team1Attempts: 0,
      team2Attempts: 0,
      team1Input: '',
      team2Input: '',
      ropePosition: 0,
      targetRopePosition: 0,
      winner: null,
      team1Question: generateQuestionForLevel(currentLevelId, difficulty, allowedOperations),
      team2Question: generateQuestionForLevel(currentLevelId, difficulty, allowedOperations),
    });
  },

  startGame: () => {
    const { difficulty, allowedOperations, currentLevelId } = get();
    set({
      team1Score: 0,
      team2Score: 0,
      team1Correct: 0,
      team2Correct: 0,
      team1Attempts: 0,
      team2Attempts: 0,
      team1Input: '',
      team2Input: '',
      team1Shake: false,
      team2Shake: false,
      team1Animation: 'idle',
      team2Animation: 'idle',
      ropePosition: 0,
      targetRopePosition: 0,
      team1TimeLeft: DEFAULT_QUESTION_TIME,
      team2TimeLeft: DEFAULT_QUESTION_TIME,
      matchTimeLeft: DEFAULT_MATCH_TIME,
      gamePhase: 'playing',
      botThinking: false,
      winner: null,
      team1Question: generateQuestionForLevel(currentLevelId, difficulty, allowedOperations),
      team2Question: generateQuestionForLevel(currentLevelId, difficulty, allowedOperations),
    });
  },

  typeDigit: (team: TeamId, digit: string) => {
    if (get().gamePhase !== 'playing') return;
    sounds.playKeypadTap();

    if (team === 'team1') {
      const current = get().team1Input;
      if (current.length >= 6) return;
      set({ team1Input: current + digit });
    } else {
      const current = get().team2Input;
      if (current.length >= 6) return;
      set({ team2Input: current + digit });
    }
  },

  clearInput: (team: TeamId) => {
    if (get().gamePhase !== 'playing') return;
    sounds.playKeypadTap();
    if (team === 'team1') {
      set({ team1Input: '' });
    } else {
      set({ team2Input: '' });
    }
  },

  submitAnswer: (team: TeamId) => {
    const state = get();
    if (state.gamePhase !== 'playing') return;

    const isTeam1 = team === 'team1';
    const inputStr = isTeam1 ? state.team1Input : state.team2Input;
    const question = isTeam1 ? state.team1Question : state.team2Question;

    if (inputStr.trim() === '') return;

    const userNum = parseInt(inputStr, 10);
    const isCorrect = userNum === question.answer;

    if (isCorrect) {
      sounds.playCorrect();
      sounds.playRopePull();

      // Team 1 pulls toward -1 (Left), Team 2 pulls toward +1 (Right)
      const pullDelta = isTeam1 ? -ROPE_PULL_DELTA : ROPE_PULL_DELTA;
      const newTargetRope = Math.max(-1.0, Math.min(1.0, Number((state.targetRopePosition + pullDelta).toFixed(2))));

      const newT1Score = isTeam1 ? state.team1Score + 100 : state.team1Score;
      const newT2Score = !isTeam1 ? state.team2Score + 100 : state.team2Score;
      const newT1Correct = isTeam1 ? state.team1Correct + 1 : state.team1Correct;
      const newT2Correct = !isTeam1 ? state.team2Correct + 1 : state.team2Correct;
      const newT1Attempts = isTeam1 ? state.team1Attempts + 1 : state.team1Attempts;
      const newT2Attempts = !isTeam1 ? state.team2Attempts + 1 : state.team2Attempts;

      const t1Anim: AnimationState = isTeam1 ? 'pull' : 'strain';
      const t2Anim: AnimationState = isTeam1 ? 'strain' : 'pull';

      let newPhase: 'playing' | 'gameover' = 'playing';
      let winner: TeamId | 'draw' | null = null;

      let unlockedLevels = state.unlockedLevels;
      const levelStars = { ...state.levelStars };

      if (newTargetRope <= -1.0) {
        newPhase = 'gameover';
        winner = 'team1';
        sounds.playVictory();

        // Calculate stars for clearing stage
        const accuracy = newT1Attempts > 0 ? (newT1Correct / newT1Attempts) * 100 : 100;
        let stars = 1;
        if (accuracy >= 85) stars = 3;
        else if (accuracy >= 65) stars = 2;

        levelStars[state.currentLevelId] = Math.max(levelStars[state.currentLevelId] || 0, stars);

        // Unlock next stage
        const nextStageId = state.currentLevelId + 1;
        if (nextStageId <= 6 && !unlockedLevels.includes(nextStageId)) {
          unlockedLevels = [...unlockedLevels, nextStageId];
        }
      } else if (newTargetRope >= 1.0) {
        newPhase = 'gameover';
        winner = 'team2';
        sounds.playVictory();
      }

      set({
        team1Score: newT1Score,
        team2Score: newT2Score,
        team1Correct: newT1Correct,
        team2Correct: newT2Correct,
        team1Attempts: newT1Attempts,
        team2Attempts: newT2Attempts,
        targetRopePosition: newTargetRope,
        team1Animation: t1Anim,
        team2Animation: t2Anim,
        gamePhase: newPhase,
        winner,
        unlockedLevels,
        levelStars,
        ...(isTeam1
          ? {
              team1Input: '',
              team1Question: generateQuestionForLevel(state.currentLevelId, state.difficulty, state.allowedOperations),
              team1TimeLeft: DEFAULT_QUESTION_TIME,
            }
          : {
              team2Input: '',
              team2Question: generateQuestionForLevel(state.currentLevelId, state.difficulty, state.allowedOperations),
              team2TimeLeft: DEFAULT_QUESTION_TIME,
            }),
      });

      setTimeout(() => {
        if (get().gamePhase === 'playing') {
          set({ team1Animation: 'idle', team2Animation: 'idle' });
        }
      }, 600);
    } else {
      sounds.playWrong();

      if (isTeam1) {
        set({
          team1Shake: true,
          team1Input: '',
          team1Attempts: state.team1Attempts + 1,
        });
        setTimeout(() => set({ team1Shake: false }), 450);
      } else {
        set({
          team2Shake: true,
          team2Input: '',
          team2Attempts: state.team2Attempts + 1,
        });
        setTimeout(() => set({ team2Shake: false }), 450);
      }
    }
  },

  tickQuestionTimer: (team: TeamId) => {
    const state = get();
    if (state.gamePhase !== 'playing') return;

    if (team === 'team1') {
      const nextTime = state.team1TimeLeft - 1;
      if (nextTime <= 0) {
        sounds.playMiss();
        set({
          team1TimeLeft: DEFAULT_QUESTION_TIME,
          team1Input: '',
          team1Shake: true,
          team1Attempts: state.team1Attempts + 1,
          team1Question: generateQuestionForLevel(state.currentLevelId, state.difficulty, state.allowedOperations),
        });
        setTimeout(() => set({ team1Shake: false }), 450);
      } else {
        set({ team1TimeLeft: nextTime });
      }
    } else {
      const nextTime = state.team2TimeLeft - 1;
      if (nextTime <= 0) {
        sounds.playMiss();
        set({
          team2TimeLeft: DEFAULT_QUESTION_TIME,
          team2Input: '',
          team2Shake: true,
          team2Attempts: state.team2Attempts + 1,
          team2Question: generateQuestionForLevel(state.currentLevelId, state.difficulty, state.allowedOperations),
        });
        setTimeout(() => set({ team2Shake: false }), 450);
      } else {
        set({ team2TimeLeft: nextTime });
      }
    }
  },

  tickMatchTimer: () => {
    const state = get();
    if (state.gamePhase !== 'playing') return;

    const nextMatchTime = state.matchTimeLeft - 1;
    if (nextMatchTime <= 0) {
      let winner: TeamId | 'draw' = 'draw';
      let unlockedLevels = state.unlockedLevels;
      const levelStars = { ...state.levelStars };

      if (state.targetRopePosition < -0.05 || state.team1Score > state.team2Score) {
        winner = 'team1';
        const accuracy = state.team1Attempts > 0 ? (state.team1Correct / state.team1Attempts) * 100 : 100;
        let stars = 1;
        if (accuracy >= 85) stars = 3;
        else if (accuracy >= 65) stars = 2;

        levelStars[state.currentLevelId] = Math.max(levelStars[state.currentLevelId] || 0, stars);

        const nextStageId = state.currentLevelId + 1;
        if (nextStageId <= 6 && !unlockedLevels.includes(nextStageId)) {
          unlockedLevels = [...unlockedLevels, nextStageId];
        }
      } else if (state.targetRopePosition > 0.05 || state.team2Score > state.team1Score) {
        winner = 'team2';
      }

      sounds.playVictory();
      set({
        matchTimeLeft: 0,
        gamePhase: 'gameover',
        winner,
        unlockedLevels,
        levelStars,
      });
    } else {
      set({ matchTimeLeft: nextMatchTime });
    }
  },

  setRopePosition: (pos: number) => {
    set({ ropePosition: pos });
  },

  resetGame: () => {
    get().startGame();
  },
}));
