import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0ae68242c776482b9a7378ba08970a2b',
  appName: 'AquaID - Fish Identification',
  webDir: 'dist',
  server: {
    url: 'https://0ae68242-c776-482b-9a73-78ba08970a2b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    },
    Filesystem: {
      permissions: ['writeExternalStorage', 'readExternalStorage']
    }
  }
};

export default config;