import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { WaterTracker } from "@/components/WaterTracker";
import { ProteinTracker } from "@/components/ProteinTracker";
import { GymCalendar } from "@/components/GymCalendar";
import { Settings } from "@/components/Settings";
import { NavButton } from "@/components/NavButton";
import { Home, Droplets, Zap, Calendar, Settings as SettingsIcon } from "lucide-react";

type TabType = 'dashboard' | 'water' | 'protein' | 'gym' | 'settings';

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
      case 'gym':
        return <GymCalendar />;
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
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-1">
            <NavButton 
              icon={<Home className="w-5 h-5" />}
              label="Home"
              isActive={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavButton 
              icon={<Droplets className="w-5 h-5" />}
              label="Water"
              isActive={activeTab === 'water'}
              onClick={() => setActiveTab('water')}
            />
            <NavButton 
              icon={<Zap className="w-5 h-5" />}
              label="Protein"
              isActive={activeTab === 'protein'}
              onClick={() => setActiveTab('protein')}
            />
            <NavButton 
              icon={<Calendar className="w-5 h-5" />}
              label="Gym"
              isActive={activeTab === 'gym'}
              onClick={() => setActiveTab('gym')}
            />
            <NavButton 
              icon={<SettingsIcon className="w-5 h-5" />}
              label="Settings"
              isActive={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
