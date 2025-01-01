import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { FeedPage } from './pages/FeedPage';
import { DashboardPage } from './pages/DashboardPage';
import { achievements as initialAchievements } from './data/achievements';
import { rewards as availableRewards } from './data/rewards';
import { UserStats, Reward } from './types/rewards';
import './App.css';

export function App() {
  const [stats, setStats] = useState<UserStats>({
    points: 150,
    level: 1,
    posts: 5,
    comments: 12,
    likes: 45,
    shares: 8,
  });

  const [achievements] = useState(initialAchievements);
  const [rewards] = useState(availableRewards);

  const handleEngagement = (type: 'like' | 'comment' | 'share') => {
    setStats(prev => {
      const points = prev.points + (type === 'like' ? 1 : type === 'comment' ? 2 : 3);
      return {
        ...prev,
        points,
        level: Math.floor(points / 1000) + 1,
        [type === 'like' ? 'likes' : `${type}s`]: prev[type === 'like' ? 'likes' : `${type}s`] + 1,
      };
    });
  };

  const handleRedeem = (reward: Reward) => {
    if (stats.points >= reward.pointsCost) {
      setStats(prev => ({
        ...prev,
        points: prev.points - reward.pointsCost
      }));
      alert(`Successfully redeemed ${reward.name}!`);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 py-8">
        <Navigation />
        <Routes>
          <Route path="/" element={<FeedPage onEngagement={handleEngagement} />} />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                stats={stats}
                achievements={achievements}
                rewards={rewards}
                onRedeem={handleRedeem}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}