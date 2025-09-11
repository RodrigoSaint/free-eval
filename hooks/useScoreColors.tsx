import { useMemo } from "preact/hooks";
import { EvalGroupThreshold, getDefaultThreshold } from '../core/eval.ts';

export function useScoreColors(threshold?: EvalGroupThreshold) {
  return useMemo(() => {
    const thresholds = threshold || getDefaultThreshold();
    
    const getScoreColor = (score: number) => {
      if (score >= thresholds.goodScore) return 'text-green-600';
      if (score >= thresholds.averageScore) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreIcon = (score: number) => {
      if (score >= thresholds.goodScore) return (
        <svg className="size-3 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m8 14 4-4 4 4"/>
        </svg>
      );
      if (score >= thresholds.averageScore) return (
        <svg className="size-3 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m10 8 4 4-4 4"/>
        </svg>
      );
      return (
        <svg className="size-3 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m16 14-4-4-4 4"/>
        </svg>
      );
    };

    const isPassingScore = (score: number) => {
      return score >= thresholds.averageScore;
    };

    return {
      getScoreColor,
      getScoreIcon,
      isPassingScore,
      threshold: thresholds
    };
  }, [threshold]);
}