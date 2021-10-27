import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import * as admin from "firebase-admin";
import { async } from "@firebase/util";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
const db = getFirestore();

export async function createReview(title, creator, rating) {
  const userID = auth.currentUser.uid;
  const reveiwDoc = doc(
    collection(doc(collection(db, "users"), userID), "reviews"),
    title
  );
  const data = {
    userID: userID,
    title: title,
    creator: creator,
    rating: rating,
    creationDate: new Date(),
  };
  await setDoc(reveiwDoc, data);
}

export async function storeNewUser(){
	console.log(auth);
	console.log(getAdditionalUserInfo(auth.currentUser.uid)["_tokenresponse"].isNewUser);
}

export async function getUsers() {
  const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    getAuth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          console.log("user", userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log("Error listing users:", error);
      });
  };
  // Start listing users from the beginning, 1000 at a time.
  return listAllUsers();
}
