
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import BetEntry from '@/components/BetEntry';
import BetHistory from '@/components/BetHistory';
import Analytics from '@/components/Analytics';
import Profile from '@/components/Profile';
import Tutorial from '@/components/Tutorial';

const Index = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if tutorial has been completed
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bet-entry" element={<BetEntry />} />
          <Route path="/bet-history" element={<BetHistory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
      
      <Tutorial 
        isOpen={showTutorial}
        onComplete={handleTutorialComplete}
      />
    </div>
  );
};

export default Index;
