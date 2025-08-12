import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/useStorage";
import { UserProfile, UserSettings } from "@/types/fitness";
import { User, Edit3, Save, Target, Bell, Scale, Ruler, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationService } from "@/services/notifications";

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const Profile = ({ userProfile, onUpdateProfile }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(userProfile);
  const [settings, setSettings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 2000, protein: calculateProteinNeeds(userProfile), calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });
  const [tempSettings, setTempSettings] = useState(settings);
  const { toast } = useToast();

  function calculateProteinNeeds(profile: UserProfile) {
    const multipliers = {
      sedentary: 0.8,
      light: 1.0,
      moderate: 1.2,
      active: 1.6,
      very_active: 2.0
    };
    return Math.round(profile.weight * multipliers[profile.activityLevel]);
  }

  const handleSaveProfile = () => {
    onUpdateProfile(editProfile);
    
    // Update protein goal based on new weight/activity
    const newProteinGoal = calculateProteinNeeds(editProfile);
    setTempSettings(prev => ({
      ...prev,
      goals: { ...prev.goals, protein: newProteinGoal }
    }));
    
    setIsEditing(false);
    toast({
      title: "Profile updated! ✓",
      description: "Your information has been saved",
    });
  };

  const handleSaveSettings = async () => {
    setSettings(tempSettings);
    
    if (tempSettings.notifications.gym) {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        await NotificationService.scheduleGymReminders();
      }
    } else {
      await NotificationService.cancelGymReminders();
    }
    
    toast({
      title: "Settings saved! ✓",
      description: "Your preferences have been updated",
    });
  };

  const updateGoal = (key: keyof typeof tempSettings.goals, value: string) => {
    const numValue = parseInt(value) || 0;
    setTempSettings(prev => ({
      ...prev,
      goals: { ...prev.goals, [key]: numValue }
    }));
  };

  const updateNotification = (key: keyof typeof tempSettings.notifications, value: boolean | number) => {
    setTempSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const getBMI = () => {
    const heightInM = userProfile.height / 100;
    return (userProfile.weight / (heightInM * heightInM)).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {/* Profile Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editProfile.name}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age">Age</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={editProfile.age}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Weight (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  step="0.1"
                  value={editProfile.weight}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-height">Height (cm)</Label>
                <Input
                  id="edit-height"
                  type="number"
                  value={editProfile.height}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select 
                value={editProfile.activityLevel}
                onValueChange={(value: UserProfile['activityLevel']) => setEditProfile(prev => ({ ...prev, activityLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Age</p>
                <p className="font-medium">{userProfile.age} years</p>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-medium">{userProfile.weight} kg</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Height</p>
                  <p className="font-medium">{userProfile.height} cm</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Activity Level</p>
                  <p className="font-medium capitalize">{userProfile.activityLevel.replace('_', ' ')}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">BMI</p>
                <p className="font-medium">{getBMI()}</p>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Recommended daily protein:</p>
              <p className="text-xl font-semibold text-primary">{calculateProteinNeeds(userProfile)}g</p>
            </div>
          </div>
        )}
      </Card>

      {/* Daily Goals */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Daily Goals</h2>
        </div>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="water-goal">Water Goal (ml)</Label>
            <Input
              id="water-goal"
              type="number"
              value={tempSettings.goals.water}
              onChange={(e) => updateGoal('water', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="protein-goal">Protein Goal (grams)</Label>
            <Input
              id="protein-goal"
              type="number"
              value={tempSettings.goals.protein}
              onChange={(e) => updateGoal('protein', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calories-goal">Calories Goal</Label>
            <Input
              id="calories-goal"
              type="number"
              value={tempSettings.goals.calories}
              onChange={(e) => updateGoal('calories', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Water Reminders</Label>
              <p className="text-sm text-muted-foreground">Get hourly hydration reminders</p>
            </div>
            <Switch
              checked={tempSettings.notifications.water}
              onCheckedChange={(checked) => updateNotification('water', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Protein Reminders</Label>
              <p className="text-sm text-muted-foreground">Get meal-time protein reminders</p>
            </div>
            <Switch
              checked={tempSettings.notifications.protein}
              onCheckedChange={(checked) => updateNotification('protein', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Gym Reminders</Label>
              <p className="text-sm text-muted-foreground">Daily reminder at 6:15 PM (Mon-Sat)</p>
            </div>
            <Switch
              checked={tempSettings.notifications.gym}
              onCheckedChange={(checked) => updateNotification('gym', checked)}
            />
          </div>

          {tempSettings.notifications.water && (
            <div className="space-y-2">
              <Label htmlFor="water-interval">Water Reminder Interval (hours)</Label>
              <Input
                id="water-interval"
                type="number"
                min="1"
                max="12"
                value={tempSettings.notifications.waterInterval}
                onChange={(e) => updateNotification('waterInterval', parseInt(e.target.value) || 1)}
              />
            </div>
          )}
        </div>
      </Card>

      <Button onClick={handleSaveSettings} className="w-full" size="lg">
        <Save className="w-4 h-4 mr-2" />
        Save Settings
      </Button>
    </div>
  );
};