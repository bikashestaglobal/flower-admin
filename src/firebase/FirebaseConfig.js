import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDgXdcvrB8Jkp19SsJXvStHu4C_W-C30y8",
  authDomain: "development-c0cb8.firebaseapp.com",
  projectId: "development-c0cb8",
  storageBucket: "development-c0cb8.appspot.com",
  messagingSenderId: "719022147266",
  appId: "1:719022147266:web:1c2e21c809c2d2bb205d5b",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
