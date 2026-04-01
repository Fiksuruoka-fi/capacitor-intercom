import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fi.foodello.intercom.example',
  appName: 'Intercom Example',
  webDir: 'dist',
  plugins: {
    Intercom: {
      // Set real keys here for native auto-initialization.
      // Leave these blank if you want to initialize at runtime via loadWithKeys().
      iosApiKey: '',
      iosAppId: '',
      androidApiKey: '',
      androidAppId: '',
    },
  },
};

export default config;
