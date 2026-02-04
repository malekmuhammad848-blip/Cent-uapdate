// Cent - Premium Music Streaming App
// Main Application Entry Point

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import FullPlayer from './components/FullPlayer';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';
import { usePlayerStore } from './store/playerStore';
import type { TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { currentTrack } = usePlayerStore();

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'library':
        return <LibraryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="relative min-h-screen bg-black font-sans text-white antialiased">
      {/* Background gradient effect */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-champagne/5 blur-3xl" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mini Player */}
      {currentTrack && !isPlayerOpen && (
        <MiniPlayer onExpand={() => setIsPlayerOpen(true)} />
      )}

      {/* Full Screen Player */}
      <FullPlayer 
        isOpen={isPlayerOpen} 
        onClose={() => setIsPlayerOpen(false)} 
      />

      {/* Bottom Navigation */}
      {!isPlayerOpen && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
