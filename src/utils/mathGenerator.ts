// Math Question Generator Utility - Multi-Category & Level-Based Progression

export type OperationType = 'add' | 'sub' | 'mult' | 'div';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type MathCategory =
  | 'arithmetic'
  | 'algebra'
  | 'powers'
  | 'geometry'
  | 'patterns'
  | 'fractions'
  | 'pemdas';

export interface MathQuestion {
  id: string;
  text: string;
  answer: number;
  category: MathCategory;
  topicName: string;
  badgeColor: string;
  hint?: string;
  operation?: OperationType;
  operandA?: number;
  operandB?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. ARITHMETIC GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
export function generateArithmetic(
  difficulty: DifficultyLevel = 'medium',
  allowedOps: OperationType[] = ['add', 'sub', 'mult', 'div']
): MathQuestion {
  const op = allowedOps[Math.floor(Math.random() * allowedOps.length)];
  let a = 1;
  let b = 1;
  let answer = 1;
  let symbol = '+';

  switch (op) {
    case 'add': {
      symbol = '+';
      if (difficulty === 'easy') {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
      } else if (difficulty === 'medium') {
        a = Math.floor(Math.random() * 25) + 5;
        b = Math.floor(Math.random() * 25) + 5;
      } else {
        a = Math.floor(Math.random() * 50) + 15;
        b = Math.floor(Math.random() * 50) + 15;
      }
      answer = a + b;
      break;
    }

    case 'sub': {
      symbol = '−';
      if (difficulty === 'easy') {
        const x = Math.floor(Math.random() * 9) + 1;
        const y = Math.floor(Math.random() * 9) + 1;
        a = Math.max(x, y);
        b = Math.min(x, y);
      } else if (difficulty === 'medium') {
        const x = Math.floor(Math.random() * 30) + 10;
        const y = Math.floor(Math.random() * 20) + 2;
        a = Math.max(x, y);
        b = Math.min(x, y);
      } else {
        const x = Math.floor(Math.random() * 70) + 25;
        const y = Math.floor(Math.random() * 50) + 10;
        a = Math.max(x, y);
        b = Math.min(x, y);
      }
      answer = a - b;
      break;
    }

    case 'mult': {
      symbol = '×';
      if (difficulty === 'easy') {
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 5) + 1;
      } else if (difficulty === 'medium') {
        a = Math.floor(Math.random() * 8) + 2;
        b = Math.floor(Math.random() * 8) + 2;
      } else {
        a = Math.floor(Math.random() * 11) + 2;
        b = Math.floor(Math.random() * 11) + 2;
      }
      answer = a * b;
      break;
    }

    case 'div': {
      symbol = '÷';
      if (difficulty === 'easy') {
        answer = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 4) + 2;
      } else if (difficulty === 'medium') {
        answer = Math.floor(Math.random() * 8) + 2;
        b = Math.floor(Math.random() * 7) + 2;
      } else {
        answer = Math.floor(Math.random() * 11) + 2;
        b = Math.floor(Math.random() * 10) + 2;
      }
      a = answer * b;
      break;
    }
  }

  const id = `q_arith_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    text: `${a} ${symbol} ${b}`,
    answer,
    category: 'arithmetic',
    topicName: 'ARITHMETIC',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    hint: 'Solve the equation',
    operation: op,
    operandA: a,
    operandB: b,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. PRE-ALGEBRA (SOLVE FOR X)
// ═══════════════════════════════════════════════════════════════════════════
export function generateAlgebra(difficulty: DifficultyLevel = 'medium'): MathQuestion {
  const type = Math.floor(Math.random() * 4);
  let text = '';
  let answer = 1;

  if (type === 0) {
    // a*x + b = c  (find x)
    const a = difficulty === 'easy' ? 2 : Math.floor(Math.random() * 4) + 2;
    const x = Math.floor(Math.random() * (difficulty === 'hard' ? 12 : 8)) + 2;
    const b = Math.floor(Math.random() * 15) + 2;
    const c = a * x + b;
    answer = x;
    text = `${a}x + ${b} = ${c} (x = ?)`;
  } else if (type === 1) {
    // a*x - b = c  (find x)
    const a = difficulty === 'easy' ? 2 : Math.floor(Math.random() * 4) + 2;
    const x = Math.floor(Math.random() * (difficulty === 'hard' ? 12 : 7)) + 3;
    const b = Math.floor(Math.random() * 12) + 2;
    const c = a * x - b;
    answer = x;
    text = `${a}x − ${b} = ${c} (x = ?)`;
  } else if (type === 2) {
    // a*x = c  (find x)
    const a = Math.floor(Math.random() * (difficulty === 'hard' ? 8 : 5)) + 3;
    const x = Math.floor(Math.random() * (difficulty === 'hard' ? 15 : 9)) + 2;
    const c = a * x;
    answer = x;
    text = `${a}x = ${c} (x = ?)`;
  } else {
    // x ÷ b = c (find x)
    const b = Math.floor(Math.random() * 4) + 2;
    const c = Math.floor(Math.random() * (difficulty === 'hard' ? 12 : 7)) + 3;
    answer = b * c;
    text = `x ÷ ${b} = ${c} (x = ?)`;
  }

  const id = `q_alg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    text,
    answer,
    category: 'algebra',
    topicName: 'PRE-ALGEBRA',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    hint: 'Find the unknown value of x',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. POWERS & SQUARE ROOTS
// ═══════════════════════════════════════════════════════════════════════════
export function generatePowers(difficulty: DifficultyLevel = 'medium'): MathQuestion {
  const type = Math.floor(Math.random() * 4);
  let text = '';
  let answer = 1;

  if (type === 0) {
    // Square: a² = ?
    const maxA = difficulty === 'easy' ? 7 : difficulty === 'medium' ? 12 : 16;
    const a = Math.floor(Math.random() * (maxA - 2)) + 3;
    answer = a * a;
    text = `${a}² = ?`;
  } else if (type === 1) {
    // Cube: a³ = ?
    const a = Math.floor(Math.random() * (difficulty === 'hard' ? 5 : 4)) + 2; // 2 - 5
    answer = a * a * a;
    text = `${a}³ = ?`;
  } else if (type === 2) {
    // Square root: √N = ?
    const roots = difficulty === 'easy' ? [4, 9, 16, 25, 36] : [25, 36, 49, 64, 81, 100, 121, 144];
    const c = roots[Math.floor(Math.random() * roots.length)];
    answer = Math.round(Math.sqrt(c));
    text = `√${c} = ?`;
  } else {
    // Composite: √N + b = ?
    const roots = [16, 25, 36, 49, 64, 81, 100];
    const c = roots[Math.floor(Math.random() * roots.length)];
    const b = Math.floor(Math.random() * 12) + 3;
    answer = Math.round(Math.sqrt(c)) + b;
    text = `√${c} + ${b} = ?`;
  }

  const id = `q_pow_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    text,
    answer,
    category: 'powers',
    topicName: 'POWERS & ROOTS',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    hint: 'Compute exponent or root',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. GEOMETRY & ANGLES
// ═══════════════════════════════════════════════════════════════════════════
export function generateGeometry(difficulty: DifficultyLevel = 'medium'): MathQuestion {
  const type = Math.floor(Math.random() * 4);
  let text = '';
  let answer = 1;

  if (type === 0) {
    // Square Area: Side a
    const a = Math.floor(Math.random() * (difficulty === 'hard' ? 12 : 8)) + 3;
    answer = a * a;
    text = `Square side = ${a}  Area = ?`;
  } else if (type === 1) {
    // Rectangle Area: a × b
    const a = Math.floor(Math.random() * 8) + 3;
    const b = Math.floor(Math.random() * 7) + 2;
    answer = a * b;
    text = `Rect ${a} × ${b}  Area = ?`;
  } else if (type === 2) {
    // Rectangle Perimeter: 2*(a + b)
    const a = Math.floor(Math.random() * 9) + 4;
    const b = Math.floor(Math.random() * 7) + 2;
    answer = 2 * (a + b);
    text = `Rect ${a} by ${b}  Perimeter = ?`;
  } else {
    // Missing Triangle Angle: A + B + ? = 180°
    const a = Math.floor(Math.random() * 5) * 10 + 30; // 30, 40, 50, 60, 70
    const b = Math.floor(Math.random() * 4) * 10 + 40; // 40, 50, 60, 70
    answer = 180 - (a + b);
    text = `Triangle: ${a}°, ${b}°, ?°`;
  }

  const id = `q_geo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    text,
    answer,
    category: 'geometry',
    topicName: 'GEOMETRY',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    hint: 'Recall geometric formulas',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. NUMBER PATTERNS & SEQUENCES
// ═══════════════════════════════════════════════════════════════════════════
export function generatePatterns(difficulty: DifficultyLevel = 'medium'): MathQuestion {
  const type = Math.floor(Math.random() * 4);
  let text = '';
  let answer = 1;

  if (type === 0) {
    // Double series: a, 2a, 4a, 8a, ?
    const a = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    answer = a * 16;
    text = `${a}, ${a * 2}, ${a * 4}, ${a * 8}, ?`;
  } else if (type === 1) {
    // Arithmetic step: a, a+d, a+2d, a+3d, ?
    const d = Math.floor(Math.random() * (difficulty === 'hard' ? 8 : 5)) + 3;
    const a = Math.floor(Math.random() * 10) + 1;
    answer = a + d * 4;
    text = `${a}, ${a + d}, ${a + d * 2}, ${a + d * 3}, ?`;
  } else if (type === 2) {
    // Decreasing series: a, a-d, a-2d, a-3d, ?
    const d = Math.floor(Math.random() * 5) + 3;
    const start = d * 5 + Math.floor(Math.random() * 10);
    answer = start - d * 4;
    text = `${start}, ${start - d}, ${start - d * 2}, ${start - d * 3}, ?`;
  } else {
    // Growing step (+1, +2, +3, +4): a, a+1, a+3, a+6, a+10, ?
    const a = Math.floor(Math.random() * 4) + 1;
    answer = a + 15;
    text = `${a}, ${a + 1}, ${a + 3}, ${a + 6}, ${a + 10}, ?`;
  }

  const id = `q_pat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    text,
    answer,
    category: 'patterns',
    topicName: 'PATTERNS',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    hint: 'Find the sequence rule',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. FRACTIONS & PERCENTAGES OF WHOLE
// ═══════════════════════════════════════════════════════════════════════════
export function generateFractions(difficulty: DifficultyLevel = 'medium'): MathQuestion {
  const type = Math.floor(Math.random() * 4);
  let text = '';
  let answer = 1;

  if (type === 0) {
    // 1/2 of N
    const n = (Math.floor(Math.random() * (difficulty === 'hard' ? 40 : 25)) + 6) * 2;
    answer = n / 2;
    text = `1/2 of ${n} = ?`;
  } else if (type === 1) {
    // 1/4 of N or 3/4 of N
    const k = Math.random() > 0.5 ? 1 : 3;
    const n = (Math.floor(Math.random() * (difficulty === 'hard' ? 20 : 12)) + 3) * 4;
    answer = (k * n) / 4;
    text = `${k}/4 of ${n} = ?`;
  } else if (type === 2) {
    // 10% or 20% of N
    const pct = Math.random() > 0.5 ? 10 : 20;
    const n = (Math.floor(Math.random() * 15) + 3) * (pct === 10 ? 10 : 5);
    answer = Math.round((pct / 100) * n);
    text = `${pct}% of ${n} = ?`;
  } else {
    // 25% or 50% of N
    const pct = Math.random() > 0.5 ? 25 : 50;
    const n = (Math.floor(Math.random() * 15) + 4) * (pct === 25 ? 4 : 2);
    answer = Math.round((pct / 100) * n);
    text = `${pct}% of ${n} = ?`;
  }

  const id = `q_frac_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    text,
    answer,
    category: 'fractions',
    topicName: 'FRACTIONS & %',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/30',
    hint: 'Calculate fraction of quantity',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. ORDER OF OPERATIONS (PEMDAS)
// ═══════════════════════════════════════════════════════════════════════════
export function generatePEMDAS(_difficulty: DifficultyLevel = 'medium'): MathQuestion {
  const type = Math.floor(Math.random() * 4);
  let text = '';
  let answer = 1;

  if (type === 0) {
    // a + b × c
    const a = Math.floor(Math.random() * 12) + 2;
    const b = Math.floor(Math.random() * 6) + 2;
    const c = Math.floor(Math.random() * 6) + 2;
    answer = a + b * c;
    text = `${a} + ${b} × ${c} = ?`;
  } else if (type === 1) {
    // a × b − c
    const a = Math.floor(Math.random() * 7) + 3;
    const b = Math.floor(Math.random() * 6) + 2;
    const c = Math.floor(Math.random() * 10) + 2;
    answer = a * b - c;
    text = `${a} × ${b} − ${c} = ?`;
  } else if (type === 2) {
    // (a − b) × c
    const x = Math.floor(Math.random() * 8) + 4;
    const y = Math.floor(Math.random() * 3) + 1;
    const c = Math.floor(Math.random() * 6) + 2;
    const diff = x - y;
    answer = diff * c;
    text = `(${x} − ${y}) × ${c} = ?`;
  } else {
    // a + b ÷ c
    const c = Math.floor(Math.random() * 4) + 2;
    const quotient = Math.floor(Math.random() * 6) + 2;
    const b = c * quotient;
    const a = Math.floor(Math.random() * 12) + 3;
    answer = a + quotient;
    text = `${a} + ${b} ÷ ${c} = ?`;
  }

  const id = `q_pem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    text,
    answer,
    category: 'pemdas',
    topicName: 'PEMDAS',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    hint: 'Multiplication & division before addition',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MASTER QUESTION GENERATOR FOR CAMPAIGN LEVELS
// ═══════════════════════════════════════════════════════════════════════════
export function generateQuestionForLevel(
  levelId: number = 1,
  difficulty: DifficultyLevel = 'medium',
  allowedOps: OperationType[] = ['add', 'sub', 'mult', 'div']
): MathQuestion {
  switch (levelId) {
    case 1:
      // Level 1: Rookie Turf (Pure Arithmetic Warmup)
      return generateArithmetic(difficulty, allowedOps);

    case 2: {
      // Level 2: Speed Gym (PEMDAS & Order of Operations)
      const roll = Math.random();
      return roll < 0.65 ? generatePEMDAS(difficulty) : generateArithmetic(difficulty, ['mult', 'div', 'add']);
    }

    case 3: {
      // Level 3: Power Tower (Powers & Square Roots)
      const roll = Math.random();
      return roll < 0.65 ? generatePowers(difficulty) : generateArithmetic(difficulty, ['mult', 'div']);
    }

    case 4: {
      // Level 4: Shape Colosseum (Geometry & Fractions)
      const roll = Math.random();
      return roll < 0.55 ? generateGeometry(difficulty) : generateFractions(difficulty);
    }

    case 5: {
      // Level 5: Algebra Champions (Solve for X & Patterns)
      const roll = Math.random();
      return roll < 0.60 ? generateAlgebra(difficulty) : generatePatterns(difficulty);
    }

    case 6:
    default: {
      // Level 6: Grand Titan Boss (All Topics Mixed Showdown)
      const categories: MathCategory[] = ['algebra', 'powers', 'geometry', 'patterns', 'fractions', 'pemdas', 'arithmetic'];
      const chosen = categories[Math.floor(Math.random() * categories.length)];
      switch (chosen) {
        case 'algebra': return generateAlgebra(difficulty);
        case 'powers': return generatePowers(difficulty);
        case 'geometry': return generateGeometry(difficulty);
        case 'patterns': return generatePatterns(difficulty);
        case 'fractions': return generateFractions(difficulty);
        case 'pemdas': return generatePEMDAS(difficulty);
        case 'arithmetic':
        default: return generateArithmetic(difficulty, allowedOps);
      }
    }
  }
}

// Backward-compatible default question generator
export function generateQuestion(
  difficulty: DifficultyLevel = 'medium',
  allowedOps: OperationType[] = ['add', 'sub', 'mult', 'div']
): MathQuestion {
  return generateArithmetic(difficulty, allowedOps);
}
