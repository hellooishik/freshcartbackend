const admin = require("firebase-admin");

const serviceAccount = require("../models/freshcart-c3c42-firebase-adminsdk-fbsvc-45c6fda566.json"); // Download from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
