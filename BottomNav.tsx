// Bottom Navigation Component
import { Home, Search, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { id: 'home' as TabType, icon: Home, label: 'Home' },
  { id: 'search' as TabType, icon: Search, label: 'Search' },
  { id: 'library' as TabType, icon: Library, label: 'Library' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-6 py-3">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-1 px-4 py-2"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon
                  size={24}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-[#D4AF37]' : 'text-gray-500'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-[#D4AF37]' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
