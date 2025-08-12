import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { WaterTracker } from "@/components/WaterTracker";
import { ProteinTracker } from "@/components/ProteinTracker";
import { GymCalendar } from "@/components/GymCalendar";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { Profile } from "@/components/Profile";
import { Registration } from "@/components/Registration";
import { NavButton } from "@/components/NavButton";
import { useLocalStorage } from "@/hooks/useStorage";
import { UserProfile } from "@/types/fitness";
import { Home, Droplets, Zap, Calendar, Dumbbell, User } from "lucide-react";

type TabType = 'dashboard' | 'water' | 'protein' | 'workout' | 'profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

  // Show registration if no user profile exists
  if (!userProfile) {
    return <Registration onComplete={setUserProfile} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'water':
        return <WaterTracker />;
      case 'protein':
        return <ProteinTracker />;
      case 'workout':
        return <WorkoutTracker />;
      case 'profile':
        return <Profile userProfile={userProfile} onUpdateProfile={setUserProfile} />;
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
              icon={<Dumbbell className="w-5 h-5" />}
              label="Workout"
              isActive={activeTab === 'workout'}
              onClick={() => setActiveTab('workout')}
            />
            <NavButton 
              icon={<User className="w-5 h-5" />}
              label="Profile"
              isActive={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
