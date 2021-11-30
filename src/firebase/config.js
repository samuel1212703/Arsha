import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import slugify from "slugify";

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

export async function createReview(title, creator, rating, medium, reviewer) {
  title.replace(" ", "_");
  creator.replace(" ", "_");
  const userID = auth.currentUser.uid;
  const reveiwDoc = doc(
    collection(doc(collection(db, "users"), userID), "reviews"),
    slugify(title + "-" + creator).toLowerCase()
  );
  //console.log(await getImage(title, creator))
  const data = {
    userNum: await getCounter(),
    userID: userID,
    title: title,
    creator: creator,
    rating: rating,
    medium: medium,
    reviewer: reviewer,
    creationDate: new Date(),
    //image: await getImage(title, creator),
    slug: slugify(title + "-" + creator).toLowerCase(),
  };
  await setDoc(reveiwDoc, data);
  await incrementCounter();
}

export async function storeNewUser() {
  incrementCounter();
}

export async function getUserReviews(userID) {
  const reviewCol = collection(doc(collection(db, "users"), userID), "reviews");
  const reviewSnapshot = await getDocs(reviewCol);
  const reviews = [];
  reviewSnapshot.forEach((document) => {
    reviews.push(document.data());
  });
  return reviews;
}

export async function getAllUserFriendIDs() {
  const userID = auth.currentUser.uid;
  const friendCol = collection(doc(collection(db, "users"), userID), "friends");
  const friends = [];
  const friendSnapshot = await getDocs(friendCol);
  friendSnapshot.forEach((document) => {
    friends.push(document.id);
  });
  return friends;
}

export async function getCounter() {
  const infoRef = doc(collection(db, "users"), "info");
  const infoSnap = await getDoc(infoRef);
  if (!infoSnap.exists()) {
    console.log("No info document!");
  }
  return infoSnap.data().counter;
}

export async function incrementCounter() {
  const infoRef = doc(collection(db, "users"), "info");
  const infoSnap = await getDoc(infoRef);
  if (!infoSnap.exists()) {
    console.log("No info document!");
  }
  setDoc(infoRef, { counter: infoSnap.data().counter++ });
}

export async function addFriend(friendUserID) {
  const userID = auth.currentUser.uid;
  if (friendUserID !== userID) {
    console.log(friendUserID);
    const friendUserSnap = await getDoc(
      doc(collection(db, "users"), friendUserID)
    );
    console.log(friendUserSnap);
    if (friendUserSnap) {
      const userDoc = doc(collection(db, "users"), userID);
      const friends = doc(collection(userDoc, "friends"), friendUserID);
      setDoc(friends, { friendID: friendUserID });
      return "Friend added!";
    } else {
      return "No user with that user id";
    }
  } else {
    return "You cannot add yourself";
  }
}
