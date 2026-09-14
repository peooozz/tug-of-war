// Unit tests for Math Generator Engine
import { generateQuestion, type DifficultyLevel, type OperationType } from '../src/utils/mathGenerator.ts';

function runTests() {
  console.log('Running mathGenerator unit tests...');
  let totalTests = 0;
  let passedTests = 0;

  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  const operations: OperationType[] = ['add', 'sub', 'mult', 'div'];

  // Test 1: Verify all operations generate correct answers
  for (const diff of difficulties) {
    for (const op of operations) {
      for (let i = 0; i < 25; i++) {
        totalTests++;
        const q = generateQuestion(diff, [op]);

        // Check operands and answer
        let expected = 0;
        if (op === 'add') expected = q.operandA + q.operandB;
        if (op === 'sub') expected = q.operandA - q.operandB;
        if (op === 'mult') expected = q.operandA * q.operandB;
        if (op === 'div') expected = Math.floor(q.operandA / q.operandB);

        if (q.answer !== expected) {
          throw new Error(`Failed on ${diff} ${op}: ${q.text} expected ${expected}, got ${q.answer}`);
        }

        // Subtraction should never produce negative numbers
        if (op === 'sub' && q.answer < 0) {
          throw new Error(`Negative subtraction result: ${q.text} = ${q.answer}`);
        }

        // Division should always be integer with zero remainder
        if (op === 'div' && q.operandA % q.operandB !== 0) {
          throw new Error(`Division has remainder: ${q.operandA} / ${q.operandB}`);
        }

        // Division by zero check
        if (op === 'div' && q.operandB === 0) {
          throw new Error(`Division by zero encountered in ${q.text}`);
        }

        passedTests++;
      }
    }
  }

  // Test 2: Independence check - 2 generated questions should not be identical references
  const q1 = generateQuestion('medium');
  const q2 = generateQuestion('medium');
  totalTests++;
  if (q1.id === q2.id) {
    throw new Error('IDs should be unique');
  }
  passedTests++;

  console.log(`All ${passedTests} / ${totalTests} mathGenerator unit tests PASSED cleanly!`);
}

runTests();
