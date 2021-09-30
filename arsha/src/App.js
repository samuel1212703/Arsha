import "./App.css";
import React from "react";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import firebase from "./firebase/config";

const auth = getAuth();

function App() {
	return (
		<div className="App">
			<h1>Arsha</h1>
			<button onClick={signInWithRedirect}></button>
			<div className="mainPage">
				<div className="sideBar">
					<input type="text" placeholder="Search.." />
				</div>
				<div className="mainContent"></div>
			</div>
		</div>
	);
}

export default App;
