var d = require('domain').create();
d.on('error', function(err){
    // this is because there is no '.env'
    // on PROD, no worries
});
d.run(function(){
    // Allow for environment variable usage
    require('dotenv').config();
});

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
