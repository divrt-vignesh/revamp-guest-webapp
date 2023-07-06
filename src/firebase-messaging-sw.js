// /* eslint-disable no-console */

// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here. Other Firebase libraries
// // are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// var firebaseConfig = {
//   apiKey: "AIzaSyBVkxGud4165cGPw1NSvMSUzmkGbxACwa8",
//   authDomain: "pinabox-configurator.firebaseapp.com",
//   databaseURL: "https://pinabox-configurator.firebaseio.com",
//   projectId: "pinabox-configurator",
//   storageBucket: "pinabox-configurator.appspot.com",
//   messagingSenderId: "1034662290158",
//   appId: "1:1034662290158:web:be05153ad51e4b2444c9ff",
//   measurementId: "G-4FL9KQXMV7"
// };

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

