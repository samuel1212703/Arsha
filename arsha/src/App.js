import "./App.css";
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, createReview } from "./firebase/config";
import GoogleButton from "react-google-button";

function signinPopup(auth, provider, setLoggedIn) {
	signInWithPopup(auth, provider)
		.then((result) => {
			setLoggedIn(true);
			console.log(auth);
		})
		.catch((error) => {});
}

function signout(auth, setLoggedIn) {
	signOut(auth)
		.then(() => {
			console.log(auth);
			// Sign-out successful.
			console.log("signed out");
			setLoggedIn(false);
		})
		.catch((error) => {
			// An error happened.
		});
}

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [title, setTitle] = useState(null);
	const [creator, setCreator] = useState(null);
	const [rating, setRating] = useState(null);

	return (
		<div className="App">
			<h1>Arsha</h1>
			{loggedIn ? (
				<div>
					<p>{auth.currentUser.displayName}</p>
					<button onClick={() => signout(auth, setLoggedIn)}>Sign out</button>
				</div>
			) : (
				<GoogleButton
					id="google-signin"
					onClick={() => signinPopup(auth, provider, setLoggedIn)}
				/>
			)}

			<div className="mainPage">
				<div className="sideBar">
					<input
						id="searchBar"
						type="text"
						placeholder="Enter user name or id"
					/>
					<button id="searchButton">
						<img id="searchImage" src="images/search-icon.png" />
					</button>
				</div>
				<div className="mainContent">
					<div id="reviewImageContainer">
						<div>
							{selectedImage && (
								<div>
									<img
										id="reviewImage"
										alt="Review Image"
										width={"250px"}
										src={URL.createObjectURL(selectedImage)}
									/>
									<button onClick={() => setSelectedImage(null)}>Remove</button>
								</div>
							)}
							<input
								type="file"
								name="myImage"
								onChange={(event) => {
									setSelectedImage(event.target.files[0]);
								}}
							/>
						</div>
					</div>
					<div id="reviewTextContainer">
						<form>
							<p>Title</p>
							<input
								type="text"
								id="title"
								name="title"
								onChange={(event) => setTitle(event.target.value)}
							></input>
							<p>Creator</p>
							<input
								type="text"
								id="creator"
								name="creator"
								onChange={(event) => setCreator(event.target.value)}
							></input>
							<p>Rating</p>
							<input
								type="number"
								id="rating"
								name="rating"
								onChange={(event) => setRating(event.target.value)}
							></input>
							<div id="reviewBottom">
								<button
									type="submit"
									id="submit-button"
									onClick={() => createReview(title, creator, rating)}
								>
									Submit Review!
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
