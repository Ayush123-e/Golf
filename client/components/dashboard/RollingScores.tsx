import { createClient } from '@/lib/supabase';
import { Trophy, AlertCircle, History } from 'lucide-react';
import Link from 'next/link';
import RollingScoresClient from './RollingScoresClient';

export default async function RollingScores() {
  const supabase = await createClient();
  
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .order('played_at', { ascending: false })
    .limit(10);

  const currentScores = scores?.slice(0, 5) || [];
  const scoreCount = currentScores.length;
  const previousScores = scores?.slice(5, 10) || [];
  
  const currentAvg = currentScores.length > 0 
    ? currentScores.reduce((acc, s) => acc + s.score, 0) / currentScores.length 
    : 0;
    
  const previousAvg = previousScores.length > 0 
    ? previousScores.reduce((acc, s) => acc + s.score, 0) / previousScores.length 
    : 0;

  const trend = currentAvg > previousAvg ? 'up' : currentAvg < previousAvg ? 'down' : 'stable';
  
  const chartPoints = [...currentScores].reverse().map((s, i) => ({
    x: i * 25,
    y: 60 - (s.score / 45) * 50
  }));

  const pathD = chartPoints.length > 0 
    ? `M ${chartPoints[0].x} ${chartPoints[0].y} ${chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` 
    : '';

  return (
    <div className="px-6 py-6">
      <RollingScoresClient 
        initialScores={scores || []}
        scoreCount={scoreCount}
        trend={trend}
        pathD={pathD}
      />
    </div>
  );
}
