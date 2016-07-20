require('dotenv').config();
var firebase = require('firebase');

// Initialize Firebase
const FIREBASE_CONFIG = {
  serviceAccount: {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY
  },
  databaseURL: process.env.DATABASE_URL
};
 
var app = firebase.initializeApp(FIREBASE_CONFIG);

module.exports = app;
