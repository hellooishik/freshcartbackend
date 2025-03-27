const admin = require("firebase-admin"); 
const serviceAccount = require("../models/firebaseServiceAccountKey.json"); // Path to your service account key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freshcart-c3c42-default-rtdb.firebaseio.com", // Make sure this URL is correct
});

console.log("✅ Firebase initialized successfully.");

module.exports = admin;
