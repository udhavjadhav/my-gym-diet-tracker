import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9d9008db9fff40b996184c03ea4e7cc1',
  appName: 'GymTracker',
  webDir: 'dist',
  server: {
    url: 'https://9d9008db-9fff-40b9-9618-4c03ea4e7cc1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;