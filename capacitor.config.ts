import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tmutimes.app',
  appName: 'TMU Times',
  webDir: 'build',
  server: {
    // Allow HTTP connections (for development)
    cleartext: true,
    // Allow loading from local network
    allowNavigation: ['192.168.0.111:5000', '10.0.2.2:5000']
  }
};

export default config;
