
import React from 'react';
import BetEntryHeader from '@/components/BetEntryHeader';
import BetEntryForm from '@/components/BetEntryForm';
import BetQuickStats from '@/components/BetQuickStats';

const BetEntry = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <BetEntryHeader />
      <BetEntryForm />
      <BetQuickStats />
    </div>
  );
};

export default BetEntry;
