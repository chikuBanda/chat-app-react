// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVbVqlIDagyYVOfjL1AitxYeVL4mesliA",
  authDomain: "fir-webrtc-a72f9.firebaseapp.com",
  projectId: "fir-webrtc-a72f9",
  storageBucket: "fir-webrtc-a72f9.appspot.com",
  messagingSenderId: "986783609113",
  appId: "1:986783609113:web:401fafd9e6fca979561588",
  measurementId: "G-CF2YYZMN62"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)

const messaging = getMessaging(app)

const requestPermission = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      getToken(messaging, { vapidKey: "BJwxXNWuxRCGVX-bP9Ylis7X37HVaou9jUtWivePxmcZT-kNUOUmQTdM_zM3jAg-zNxmgkW3oivNoM93YsSHUPc" })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the ui if necessary
            // ..
            console.log('Client Token: ', currentToken);
          } else {
            // show permission request ui
            console.log('No registration token available. Request permission to generate one.')
          }
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
    } else {
      console.log("User Permission Denied.");
    }
  })
}

onMessage(messaging, (payload) => {
  console.log("FCM Message received", payload)
})


export { db, analytics, auth, messaging, requestPermission }