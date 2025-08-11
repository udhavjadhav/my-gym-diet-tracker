import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { WaterTracker } from "@/components/WaterTracker";
import { ProteinTracker } from "@/components/ProteinTracker";
import { Settings } from "@/components/Settings";
import { NavButton } from "@/components/NavButton";
import { Home, Droplets, Zap, Settings as SettingsIcon } from "lucide-react";

type TabType = 'dashboard' | 'water' | 'protein' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'water':
        return <WaterTracker />;
      case 'protein':
        return <ProteinTracker />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto flex">
          <NavButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavButton>
          
          <NavButton
            active={activeTab === 'water'}
            onClick={() => setActiveTab('water')}
          >
            <Droplets className="w-5 h-5" />
            <span>Water</span>
          </NavButton>
          
          <NavButton
            active={activeTab === 'protein'}
            onClick={() => setActiveTab('protein')}
          >
            <Zap className="w-5 h-5" />
            <span>Protein</span>
          </NavButton>
          
          <NavButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </NavButton>
        </div>
      </div>
    </div>
  );
};

export default Index;
