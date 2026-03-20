export function calculateMatches(userScores: number[], drawNumbers: number[]) {
  const matches = userScores.filter(score => drawNumbers.includes(score));
  return matches.length;
}
