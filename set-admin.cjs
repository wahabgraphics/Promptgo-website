const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json'); // Firebase Console > Project Settings > Service Accounts se download karein

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'KkgK4JuusnSWRszK38tLkYAbW9cw1'; // Aapki UID jo Firebase Console mein dikh rahi thi

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set successfully!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error setting custom claim:', error);
  });