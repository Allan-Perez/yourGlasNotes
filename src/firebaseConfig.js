import firebase from 'firebase'
import 'firebase/firestore'
// Firebas config
var firebaseConfig = {
  apiKey: "AIzaSyApqR39Ep9VN7jTbsR-iOt8rK358vf5sEc",
  authDomain: "yourglasnotes.firebaseapp.com",
  databaseURL: "https://yourglasnotes.firebaseio.com",
  projectId: "yourglasnotes",
  storageBucket: "yourglasnotes.appspot.com",
  messagingSenderId: "338652020413",
  appId: "1:338652020413:web:a94bb63878ceaf8749c1d4",
  measurementId: "G-RCF319DB0Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    //timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    postsCollection,
    commentsCollection,
    likesCollection
}
