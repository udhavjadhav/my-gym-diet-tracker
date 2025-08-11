import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/useStorage";
import { UserSettings } from "@/types/fitness";
import { Settings as SettingsIcon, Bell, Target, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationService } from "@/services/notifications";

export const Settings = () => {
  const [settings, setSettings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 2000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });

  const [tempSettings, setTempSettings] = useState(settings);
  const { toast } = useToast();

  const handleSave = async () => {
    setSettings(tempSettings);
    
    // Handle gym notifications
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

  useEffect(() => {
    // Setup notifications on component mount if enabled
    if (settings.notifications.gym) {
      NotificationService.requestPermissions().then(hasPermission => {
        if (hasPermission) {
          NotificationService.scheduleGymReminders();
        }
      });
    }
  }, []);

  const updateGoal = (key: keyof typeof tempSettings.goals, value: string) => {
    const numValue = parseInt(value) || 0;
    setTempSettings(prev => ({
      ...prev,
      goals: { ...prev.goals, [key]: numValue }
    }));
  };

  const updateNotification = (key: keyof typeof tempSettings.notifications, value: boolean | number | string[]) => {
    setTempSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

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
              placeholder="2000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="protein-goal">Protein Goal (grams)</Label>
            <Input
              id="protein-goal"
              type="number"
              value={tempSettings.goals.protein}
              onChange={(e) => updateGoal('protein', e.target.value)}
              placeholder="150"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calories-goal">Calories Goal</Label>
            <Input
              id="calories-goal"
              type="number"
              value={tempSettings.goals.calories}
              onChange={(e) => updateGoal('calories', e.target.value)}
              placeholder="2000"
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
              <Label htmlFor="water-notifications">Water Reminders</Label>
              <p className="text-sm text-muted-foreground">Get hourly hydration reminders</p>
            </div>
            <Switch
              id="water-notifications"
              checked={tempSettings.notifications.water}
              onCheckedChange={(checked) => updateNotification('water', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="protein-notifications">Protein Reminders</Label>
              <p className="text-sm text-muted-foreground">Get meal-time protein reminders</p>
            </div>
            <Switch
              id="protein-notifications"
              checked={tempSettings.notifications.protein}
              onCheckedChange={(checked) => updateNotification('protein', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="gym-notifications">Gym Reminders</Label>
              <p className="text-sm text-muted-foreground">Daily reminder at 6:15 PM (Mon-Sat)</p>
            </div>
            <Switch
              id="gym-notifications"
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

      {/* App Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">About GymTracker</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>Built with React + Capacitor for cross-platform mobile support</p>
          <p>Your fitness data is stored locally on your device</p>
        </div>
      </Card>

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary/60"
        size="lg"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Settings
      </Button>
    </div>
  );
};