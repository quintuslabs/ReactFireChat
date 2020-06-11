import firebase from "firebase";

const config = {
  apiKey: "AIzaSyB8XclrCFpyQ-g7i2-ykn7HSubXu6GddIA",
  authDomain: "fir-chat-677e8.firebaseapp.com",
  databaseURL: "https://fir-chat-677e8.firebaseio.com",
  projectId: "fir-chat-677e8",
  storageBucket: "fir-chat-677e8.appspot.com",
  messagingSenderId: "1090889211366",
  appId: "1:1090889211366:web:16d189a0af8362d6464a27",
};
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true,
});

export const myFirebase = firebase;
export const myFirestore = firebase.firestore();
export const myStorage = firebase.storage();
