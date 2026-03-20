export function calculatePrizeSplits(totalPool: number, winnerCounts: { match5: number, match4: number, match3: number }) {
  return {
    prize5Match: winnerCounts.match5 > 0 ? (totalPool * 0.40) / winnerCounts.match5 : 0,
    prize4Match: winnerCounts.match4 > 0 ? (totalPool * 0.35) / winnerCounts.match4 : 0,
    prize3Match: winnerCounts.match3 > 0 ? (totalPool * 0.25) / winnerCounts.match3 : 0,
    rollover: winnerCounts.match5 === 0 ? (totalPool * 0.40) : 0
  };
}
