// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDIeNu92FxfbK7JuLPkvsJwPN7Wsb-KT3o",
  authDomain: "davidahmadovdev.firebaseapp.com",
  projectId: "davidahmadovdev"
});

export const db = getFirestore();

// import * as firebase from "firebase/app";
// import {getFirestore} from "firebase/firestore";

// let config = {
//   apiKey: "AIzaSyDIeNu92FxfbK7JuLPkvsJwPN7Wsb-KT3o",
//   authDomain: "davidahmadovdev.firebaseapp.com",
//   databaseURL: "https://davidahmadovdev.firebaseio.com",
//   projectId: "davidahmadovdev",
//   storageBucket: "davidahmadovdev.appspot.com",
//   messagingSenderId: "51927438647",
//   appId: "1:51927438647:web:e6e0917275957edc"
// };

// const app = firebase.initializeApp(config);
// const fire = getFirestore();
// export default fire;