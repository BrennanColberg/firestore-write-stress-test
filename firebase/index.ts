const firebaseConfig = {
  apiKey: "AIzaSyAyklz_9eWP_mOdzPPXEnIC1pIj5isbEyY",
  authDomain: "firestore-write-stress-test.firebaseapp.com",
  projectId: "firestore-write-stress-test",
  storageBucket: "firestore-write-stress-test.appspot.com",
  messagingSenderId: "621701226836",
  appId: "1:621701226836:web:1747cdb150cae6aa65e8c1",
}

import firebase from "firebase/app"
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig)
export default firebase
