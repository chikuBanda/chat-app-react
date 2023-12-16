importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js");

 //the Firebase config object 
const firebaseConfig = {
    apiKey: "AIzaSyCVbVqlIDagyYVOfjL1AitxYeVL4mesliA",
    authDomain: "fir-webrtc-a72f9.firebaseapp.com",
    projectId: "fir-webrtc-a72f9",
    storageBucket: "fir-webrtc-a72f9.appspot.com",
    messagingSenderId: "986783609113",
    appId: "1:986783609113:web:401fafd9e6fca979561588",
    measurementId: "G-CF2YYZMN62"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});