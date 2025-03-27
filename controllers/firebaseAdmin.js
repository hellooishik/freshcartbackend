const admin = require("firebase-admin");
import '../models/adminsdk'

// Path to your Firebase private key JSON (download from Firebase Console > Project Settings > Service Accounts)
const serviceAccount = require("../models/adminsdk");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freshcart-c3c42-default-rtdb.firebaseio.com"
});

module.exports = admin;
