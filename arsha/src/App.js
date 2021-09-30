import "./App.css";
import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "./firebase/config";
import GoogleButton from "react-google-button";

const UploadAndDisplayImage = () => {
	const [selectedImage, setSelectedImage] = useState(null);

	return (
		<div>
			<h1>Upload and Display Image usign React Hook's</h1>
			{selectedImage && (
				<div>
					<img
						alt="not fount"
						width={"250px"}
						src={URL.createObjectURL(selectedImage)}
					/>
					<br />
					<button onClick={() => setSelectedImage(null)}>Remove</button>
				</div>
			)}
			<br />

			<br />
			<input
				type="file"
				name="myImage"
				onChange={(event) => {
					console.log(event.target.files[0]);
					setSelectedImage(event.target.files[0]);
				}}
			/>
		</div>
	);
};

function signinPopup(auth, provider) {
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});
}

function App() {
	return (
		<div className="App">
			<h1>Arsha</h1>
			<GoogleButton
				id="google-signin"
				onClick={() => signinPopup(auth, provider)}
			/>
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
				<div className="mainContent"></div>
			</div>
		</div>
	);
}

export default App;
