import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	getDoc,
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

export async function createReview(title, creator, rating) {
	const userID = auth.currentUser.uid;
	const reveiwDoc = doc(
		collection(doc(collection(db, "users"), userID), "reviews"),
		slugify(title).toLowerCase()
	);
	const data = {
		userNum: await getCounter(),
		userID: userID,
		title: title,
		creator: creator,
		rating: rating,
		creationDate: new Date(),
		slug: slugify(title).toLowerCase(),
	};
	await setDoc(reveiwDoc, data);
	await incrementCounter();
}

export async function storeNewUser() {
	//console.log(auth);
	//console.log(getAdditionalUserInfo(auth.currentUser.uid)["_tokenresponse"].isNewUser);
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

export async function getUsers() {}
