import "./App.css";
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, createReview, storeNewUser } from "./firebase/config";
import GoogleButton from "react-google-button";
import axios from "axios";

function signinPopup(auth, provider, setLoggedIn) {
  signInWithPopup(auth, provider)
    .then((result) => {
      setLoggedIn(true);
      storeNewUser();
      console.log(result);
    })
    .catch((error) => {
      console.log("Could not sign in!");
      console.log(error);
    });
}

function signout(auth, setLoggedIn) {
  signOut(auth)
    .then(() => {
      console.log(auth);
      console.log("signed out");
      setLoggedIn(false);
    })
    .catch((error) => {
      console.log("Could not sign out: " + error);
    });
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [rating, setRating] = useState(0);
  this.state = { suggestionList: {} };
  const [searchQuery, setSearchQuery] = useState("");

  if (searchQuery.length > 3) {
    const movie_api_key = "01096f6ebe34f8db1ce6adc0d4ab0e10";
    const movie_image_url = "https://image.tmdb.org/t/p/w500";
    const url = (
      "https://api.themoviedb.org/3/search/movie?api_key=" +
      movie_api_key +
      "&language=en-US&query=" +
      searchQuery +
      "&page=1&include_adult=true"
    ).replace(" ", "%20");
    axios.get(url).then(function (response) {
      const data = response.data.results;
      const suggestionUnformatted = [];
      for (var i = 0; i < 3; i++) {
        suggestionUnformatted.push({
          title: data[i].title,
          image: movie_image_url + data[i].poster_path,
          rating: data[i].vote_average,
        });
      }
      const suggestionFormatted = Object.keys(suggestionUnformatted).sort(
        function (a, b) {
          return suggestionUnformatted[a] - suggestionUnformatted[b];
        }
      );
      this.setState({ suggestionList: suggestionFormatted });
	  console.log(this.state);
    });
  }

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
          {/* getUsers().map((user) => {
            <div>{user.name}</div>;
          }) */}
        </div>
        <div className="mainContent">
          <div id="reviewImageContainer">
            <div>
              {selectedImage && (
                <div>
                  <img
                    id="reviewImage"
                    alt="Imagefile"
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
            <p>Medium</p>
            <select name="mediums" id="mediums">
              <option value="Album">Album</option>
              <option value="Song">Song</option>
              <option value="Movie">Movie</option>
              <option value="Artwork">Artwork</option>
              <option value="VideoGame">Video Game</option>
              <option value="Actor">Actor</option>
            </select>
            <p>Title</p>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Blonde"
              onChange={(event) => {
                setTitle(event.target.value);
                setSearchQuery(event.target.value);
              }}
            ></input>
            <p>Creator</p>
            <input
              type="text"
              id="creator"
              name="creator"
              placeholder="Frank Ocean"
              onChange={(event) => setCreator(event.target.value)}
            ></input>
            <p>Rating</p>
            <input
              type="number"
              id="rating"
              name="rating"
              placeholder="9.15"
              onChange={(event) => setRating(event.target.value)}
            ></input>
            <div id="reviewBottom">
              <button
                type="submit"
                id="submit-button"
                onClick={() => {
                  if (loggedIn) {
                    createReview(title, creator, rating);
                  } else {
                    window.alert(
                      "Not logged in. Please sign in to submit a review"
                    );
                    // Must be signed in message
                  }
                }}
              >
                Submit Review!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
