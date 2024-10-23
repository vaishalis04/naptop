import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'parking.innobimbinfotech.com',
  appName: 'Naptol',
  webDir: '../backendApi/public/dist/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
