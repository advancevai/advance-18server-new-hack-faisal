import { HistoryItem, Prediction, PredictionType } from '../types';

export const BIG: PredictionType = 'Big';
export const SMALL: PredictionType = 'Small';

export function isBigOrSmall(num: number): PredictionType {
  return num >= 5 ? BIG : SMALL;
}

export function digitRoot(num: number): number {
  let val = Math.abs(num);
  while (val >= 10) {
    val = String(val)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return val;
}

// Logic 1: Takes first 3 results (t + n - r) -> digit root -> >= 5 ? Big : Small
export function calculateLogic1(history: HistoryItem[]): Prediction | null {
  if (history.length < 3) return null;
  const [t, n, r] = history.slice(0, 3).map((item) => item.number);
  const diff = t + n - r;
  const root = digitRoot(Math.abs(diff));
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 1',
  };
}

// Logic 2: Takes first 3 results (t + n + r) -> digit root -> >= 5 ? Big : Small
export function calculateLogic2(history: HistoryItem[]): Prediction | null {
  if (history.length < 3) return null;
  const [t, n, r] = history.slice(0, 3).map((item) => item.number);
  const sum = t + n + r;
  const root = digitRoot(sum);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 2',
  };
}

// Logic 3: Takes 10 items, checks count of Big vs Small
export function calculateLogic3(history: HistoryItem[]): Prediction | null {
  if (history.length < 10) return null;
  const subset = history.slice(0, 10);
  let bigCount = 0;
  let smallCount = 0;
  subset.forEach((item) => {
    if (isBigOrSmall(item.number) === BIG) bigCount++;
    else smallCount++;
  });

  if (bigCount === smallCount) {
    const sum = subset.reduce((acc, item) => acc + item.number, 0);
    const root = digitRoot(sum);
    return {
      type: root >= 5 ? BIG : SMALL,
      calcNumber: root,
      logicName: 'Logic 3',
    };
  }

  return {
    type: bigCount > smallCount ? BIG : SMALL,
    calcNumber: bigCount > smallCount ? bigCount : smallCount,
    logicName: 'Logic 3',
  };
}

// Logic 4: Takes 10 items: sum(Big) - sum(Small) -> digit root
export function calculateLogic4(history: HistoryItem[]): Prediction | null {
  if (history.length < 10) return null;
  const subset = history.slice(0, 10);
  let bigSum = 0;
  let smallSum = 0;
  subset.forEach((item) => {
    if (isBigOrSmall(item.number) === BIG) bigSum += item.number;
    else smallSum += item.number;
  });
  const diff = bigSum - smallSum;
  const root = digitRoot(Math.abs(diff));
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 4',
  };
}

// Logic 5: Takes 10 items: sum(Big) + sum(Small) -> digit root
export function calculateLogic5(history: HistoryItem[]): Prediction | null {
  if (history.length < 10) return null;
  const subset = history.slice(0, 10);
  let bigSum = 0;
  let smallSum = 0;
  subset.forEach((item) => {
    if (isBigOrSmall(item.number) === BIG) bigSum += item.number;
    else smallSum += item.number;
  });
  const sum = bigSum + smallSum;
  const root = digitRoot(sum);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 5',
  };
}

// Logic 6: Takes 10 items: sum(Big) - sum(Small) -> digit root
export function calculateLogic6(history: HistoryItem[]): Prediction | null {
  if (history.length < 10) return null;
  const subset = history.slice(0, 10);
  let bigSum = 0;
  let smallSum = 0;
  subset.forEach((item) => {
    if (isBigOrSmall(item.number) === BIG) bigSum += item.number;
    else smallSum += item.number;
  });
  const diff = bigSum - smallSum;
  const root = digitRoot(Math.abs(diff));
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 6',
  };
}

// Logic 7: Takes first 4 items: sum -> digit root
export function calculateLogic7(history: HistoryItem[]): Prediction | null {
  if (history.length < 4) return null;
  const sum = history.slice(0, 4).reduce((acc, item) => acc + item.number, 0);
  const root = digitRoot(sum);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 7',
  };
}

// Logic 8: Takes last 4 digits of period number
export function calculateLogic8(
  history: HistoryItem[],
  period: string
): Prediction | null {
  const digits = period
    .slice(-4)
    .split('')
    .map(Number)
    .filter((d) => d !== 0);

  if (digits.length === 0) {
    if (history.length === 0) return null;
    const num = history[0].number;
    return {
      type: num >= 5 ? BIG : SMALL,
      calcNumber: num,
      logicName: 'Logic 8',
    };
  }

  if (digits.length === 1) {
    const num = digits[0];
    return {
      type: num >= 5 ? BIG : SMALL,
      calcNumber: num,
      logicName: 'Logic 8',
    };
  }

  const prod = digits.reduce((acc, curr) => acc * curr, 1);
  const root = digitRoot(prod);
  const result = Math.abs(prod - root) % 10;
  return {
    type: result >= 5 ? BIG : SMALL,
    calcNumber: result,
    logicName: 'Logic 8',
  };
}

// Logic 9: Takes last 4 digits of period, prod - root -> root
export function calculateLogic9(
  history: HistoryItem[],
  period: string
): Prediction | null {
  const digits = period
    .slice(-4)
    .split('')
    .map(Number)
    .filter((d) => d !== 0);

  if (digits.length === 0) {
    if (history.length === 0) return null;
    const num = history[0].number;
    return {
      type: num >= 5 ? BIG : SMALL,
      calcNumber: num,
      logicName: 'Logic 9',
    };
  }

  if (digits.length === 1) {
    const num = digits[0];
    return {
      type: num >= 5 ? BIG : SMALL,
      calcNumber: num,
      logicName: 'Logic 9',
    };
  }

  const prod = digits.reduce((acc, curr) => acc * curr, 1);
  const root = digitRoot(prod);
  const diff = Math.abs(prod - root);
  const finalRoot = digitRoot(diff);
  return {
    type: finalRoot >= 5 ? BIG : SMALL,
    calcNumber: finalRoot,
    logicName: 'Logic 9',
  };
}

// Logic 10: abs(Logic1 - Logic2)
export function calculateLogic10(history: HistoryItem[]): Prediction | null {
  const l1 = calculateLogic1(history);
  const l2 = calculateLogic2(history);
  if (!l1 || !l2) return null;
  const diff = Math.abs(l1.calcNumber - l2.calcNumber);
  const root = digitRoot(diff);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 10',
  };
}

// Logic 11: Logic1 + Logic2
export function calculateLogic11(history: HistoryItem[]): Prediction | null {
  const l1 = calculateLogic1(history);
  const l2 = calculateLogic2(history);
  if (!l1 || !l2) return null;
  const sum = l1.calcNumber + l2.calcNumber;
  const root = digitRoot(sum);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 11',
  };
}

// Logic 12: abs(Logic1 - Logic2)
export function calculateLogic12(history: HistoryItem[]): Prediction | null {
  const l1 = calculateLogic1(history);
  const l2 = calculateLogic2(history);
  if (!l1 || !l2) return null;
  const diff = Math.abs(l1.calcNumber - l2.calcNumber);
  const root = digitRoot(diff);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 12',
  };
}

// Logic 13: Logic5 + Logic6
export function calculateLogic13(history: HistoryItem[]): Prediction | null {
  const l5 = calculateLogic5(history);
  const l6 = calculateLogic6(history);
  if (!l5 || !l6) return null;
  const sum = l5.calcNumber + l6.calcNumber;
  const root = digitRoot(sum);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 13',
  };
}

// Logic 14: abs(Logic5 - Logic6)
export function calculateLogic14(history: HistoryItem[]): Prediction | null {
  const l5 = calculateLogic5(history);
  const l6 = calculateLogic6(history);
  if (!l5 || !l6) return null;
  const diff = Math.abs(l5.calcNumber - l6.calcNumber);
  const root = digitRoot(diff);
  return {
    type: root >= 5 ? BIG : SMALL,
    calcNumber: root,
    logicName: 'Logic 14',
  };
}

// Logic 15: VIP Prediction (Majority vote of logic 1 through 14)
export function calculateLogic15(
  history: HistoryItem[],
  period: string
): Prediction | null {
  const predictions = [
    calculateLogic1(history),
    calculateLogic2(history),
    calculateLogic3(history),
    calculateLogic4(history),
    calculateLogic5(history),
    calculateLogic6(history),
    calculateLogic7(history),
    calculateLogic8(history, period),
    calculateLogic9(history, period),
    calculateLogic10(history),
    calculateLogic11(history),
    calculateLogic12(history),
    calculateLogic13(history),
    calculateLogic14(history),
  ];

  let bigs = 0;
  let smalls = 0;
  predictions.forEach((p) => {
    if (p) {
      if (p.type === BIG) bigs++;
      else smalls++;
    }
  });

  return {
    type: bigs >= smalls ? BIG : SMALL,
    calcNumber: bigs >= smalls ? bigs : smalls,
    logicName: 'VIP Prediction',
  };
}

// Logic 16: Streak analysis & distribution
export function calculateLogic16(history: HistoryItem[]): Prediction | null {
  if (history.length < 5) return null;
  const numbers = history
    .slice(0, Math.min(10, history.length))
    .map((item) => item.number);
  const bigCount = numbers.filter((n) => n >= 5).length;
  const smallCount = numbers.length - bigCount;

  let streak = 1;
  const firstType = isBigOrSmall(numbers[0]);
  for (
    let i = 1;
    i < numbers.length && isBigOrSmall(numbers[i]) === isBigOrSmall(numbers[i - 1]);
    i++
  ) {
    streak++;
  }

  let predictedType: PredictionType;
  let calcNum: number;

  if (bigCount >= 7) {
    predictedType = SMALL;
    calcNum = bigCount;
  } else if (smallCount >= 7) {
    predictedType = BIG;
    calcNum = smallCount;
  } else if (streak >= 3) {
    predictedType = firstType === BIG ? SMALL : BIG;
    calcNum = streak;
  } else {
    predictedType = numbers[0] >= 5 ? SMALL : BIG;
    calcNum = numbers[0];
  }

  return {
    type: predictedType,
    calcNumber: calcNum,
    logicName: 'Logic 16',
  };
}

// Logic 17: Pattern Recognition (Markov chain + sequence matching)
export function calculateLogic17(history: HistoryItem[]): Prediction | null {
  if (history.length < 10) return null;
  const sequence = history
    .slice(0, Math.min(15, history.length))
    .map((item) => (item.number >= 5 ? 'big' : 'small'));

  const patterns: { prediction: string; confidence: number }[] = [];

  // Pattern 1: 3-period mirror match
  if (
    sequence.length >= 6 &&
    sequence[0] === sequence[3] &&
    sequence[1] === sequence[4] &&
    sequence[2] === sequence[5]
  ) {
    patterns.push({ prediction: sequence[0], confidence: 98 });
  }

  // Pattern 2: Triple streak reversal
  if (
    sequence.length >= 3 &&
    sequence[0] === sequence[1] &&
    sequence[1] === sequence[2]
  ) {
    patterns.push({
      prediction: sequence[0] === 'big' ? 'small' : 'big',
      confidence: 97,
    });
  }

  // Pattern 3: Window frequency analysis
  const recentWindow = sequence.slice(0, 10);
  const freq: Record<string, number> = {};
  recentWindow.forEach((val) => {
    freq[val] = (freq[val] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(freq));
  const dominant = Object.keys(freq).find((k) => freq[k] === maxFreq);
  if (dominant) {
    patterns.push({ prediction: dominant, confidence: 90 });
  }

  // Pattern 4: Markov transition
  if (sequence.length >= 15) {
    const transitions: Record<string, { big: number; small: number }> = {
      big: { big: 0, small: 0 },
      small: { big: 0, small: 0 },
    };
    for (let i = 1; i < sequence.length; i++) {
      transitions[sequence[i - 1]][sequence[i] as 'big' | 'small']++;
    }
    const current = sequence[0];
    const totalTransitions =
      transitions[current].big + transitions[current].small;
    if (totalTransitions > 0) {
      const pBig = transitions[current].big / totalTransitions;
      patterns.push({
        prediction: pBig > 0.5 ? 'big' : 'small',
        confidence: 97,
      });
    }
  }

  if (patterns.length === 0) return null;

  const scoreMap: Record<string, number> = {};
  patterns.forEach((p) => {
    scoreMap[p.prediction] = (scoreMap[p.prediction] || 0) + p.confidence;
  });

  const maxScore = Math.max(...Object.values(scoreMap));
  const chosen = Object.keys(scoreMap).find((k) => scoreMap[k] === maxScore);
  const totalScore = Object.values(scoreMap).reduce((acc, s) => acc + s, 0);
  const normalizedNum = Math.round((maxScore / totalScore) * 9);

  return {
    type: chosen === 'big' ? BIG : SMALL,
    calcNumber: normalizedNum,
    logicName: 'Logic 17',
  };
}

// Calculate all 17 predictions
export function calculateAllPredictions(
  history: HistoryItem[],
  period: string
): (Prediction | null)[] {
  return [
    calculateLogic1(history),
    calculateLogic2(history),
    calculateLogic3(history),
    calculateLogic4(history),
    calculateLogic5(history),
    calculateLogic6(history),
    calculateLogic7(history),
    calculateLogic8(history, period),
    calculateLogic9(history, period),
    calculateLogic10(history),
    calculateLogic11(history),
    calculateLogic12(history),
    calculateLogic13(history),
    calculateLogic14(history),
    calculateLogic15(history, period),
    calculateLogic16(history),
    calculateLogic17(history),
  ];
}
