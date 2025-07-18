const fs = require('fs');
require('dotenv').config();

const environmentFile = process.env.NODE_ENV === 'production'
  ? './src/environments/environment.prod.ts'
  : './src/environments/environment.ts';

const environmentContent = `
export const environment = {
  production: ${true},
  API_URL: '${process.env.API_URL}',
  firebaseConfig: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

fs.writeFileSync(environmentFile, environmentContent);
console.log(`Environment file ${environmentFile} has been generated.`);