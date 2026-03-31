import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fi.foodello.intercom.example',
  appName: 'Intercom Example',
  webDir: 'dist',
  plugins: {
    Intercom: {
      // Set your keys here or via loadWithKeys() at runtime
      iosApiKey: 'ios_sdk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      iosAppId: 'your_app_id',
      androidApiKey: 'android_sdk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      androidAppId: 'your_app_id',
    },
  },
};

export default config;
