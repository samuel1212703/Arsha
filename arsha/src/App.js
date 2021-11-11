import "./App.css";
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  auth,
  provider,
  createReview,
  storeNewUser,
  getUserReviews,
  storeImage,
} from "./firebase/config";
import GoogleButton from "react-google-button";
import axios from "axios";
//import FuzzySearch from "react-fuzzy";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

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

function autoFill(setTitle, setSelectedImage, i) {
  setTitle(suggestionList[i].title);
  setSelectedImage(suggestionList[i].image);
}

async function setSuggestionList(searchQuery) {
  const movie_api_key = "01096f6ebe34f8db1ce6adc0d4ab0e10";
  const movie_image_url = "https://image.tmdb.org/t/p/w500";
  const url =
    "https://api.themoviedb.org/3/search/movie?api_key=" +
    movie_api_key +
    "&language=en-US&query=" +
    searchQuery.replace(" ", "%20") +
    "&page=1&include_adult=true";
  return axios.get(url).then(function (response) {
    const data = response.data.results;
    const suggestionUnformatted = [];
    for (var i = 0; i < 3; i++) {
      suggestionUnformatted.push({
        title: data[i].title,
        image: movie_image_url + data[i].poster_path,
        rating: data[i].vote_average,
      });
    }
    return Object.keys(suggestionUnformatted).sort(function (a, b) {
      return suggestionUnformatted.rating[a] - suggestionUnformatted.rating[b];
    });
  });
}

var suggestionList = [
  {
    id: 1,
    title: "",
    author: "",
    image: "",
    rating: "",
  },
  {
    id: 2,
    title: "",
    author: "",
    image: "",
    rating: "",
  },
  {
    id: 3,
    title: "",
    author: "",
    image: "",
    rating: "",
  },
];

var displayReviews = [
  {
    image: "https://image.tmdb.org/t/p/w500/k7uOoGUk1JiN3gfKefUj2kP3Vu6.jpg",
    title: "Vampire Hunter D.",
    reviewer: "Samuel Jakobsen",
    rating: "unknown",
  },
  {
    image: "https://image.tmdb.org/t/p/w500/k7uOoGUk1JiN3gfKefUj2kP3Vu6.jpg",
    title: "Vampire Hunter D.",
    reviewer: "Samuel Jakobsen",
    rating: "unknown",
  },
  {
    image: "https://image.tmdb.org/t/p/w500/k7uOoGUk1JiN3gfKefUj2kP3Vu6.jpg",
    title: "Vampire Hunter D.",
    reviewer: "Samuel Jakobsen",
    rating: "unknown",
  },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [rating, setRating] = useState(0);
  const [medium, setMedium] = useState("");

  const maxImageSizeBytes = 5000000;

  getUserReviews().then((product) => {
    if (product[0]) {
      displayReviews[0] = product[0];
    }
    if (product[1]) {
      displayReviews[1] = product[1];
    }
    if (product[2]) {
      displayReviews[2] = product[2];
    }
  });

  // // Search Query
  // const [searchQuery, setSearchQuery] = useState("");
  // if (searchQuery.length > 0) {
  //   suggestionList = setSuggestionList(searchQuery);
  // }

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
            <select
              name="mediums"
              id="mediums"
              onChange={(event) => setMedium(event.target.value)}
            >
              <option value="Album">Album</option>
              <option value="Song">Song</option>
              <option value="Movie">Movie</option>
              <option value="Artwork">Artwork</option>
              <option value="VideoGame">Video Game</option>
              <option value="Actor">Actor</option>
            </select>
            <p>Title</p>
            <div>
              {/* <FuzzySearch
              list={suggestionList}
              keys={["author", "title"]}
              width={430}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                console.log(searchQuery);
              }}
              onSelect={(newSelectedItem) => {
                autoFill(setTitle, setSelectedImage, newSelectedItem.id--);
              }}
              resultsTemplate={(props, state, styles, clickHandler) => {
                return state.results.map((val, i) => {
                  const style = {
                    backgroundColor: "white",
                  };
                  const imageStyle = {
                    width: "64px",
                    height: "64px",
                  };
                  return (
                    <div key={i} style={style} onClick={() => clickHandler(i)}>
                      <img src={val.image} style={imageStyle}></img>
                      {val.title}
                      <span style={{ float: "right", opacity: 0.5 }}>
                        by {val.author}
                      </span>
                    </div>
                  );
                });
              }}
            /> */}
            </div>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Blonde"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                // setSearchQuery(event.target.value);
              }}
            ></input>
            <p>Creator</p>
            <input
              type="text"
              id="creator"
              name="creator"
              placeholder="Frank Ocean"
              value={creator}
              onChange={(event) => {
                setCreator(event.target.value);
              }}
            ></input>
            <p>Rating</p>
            <input
              type="number"
              id="rating"
              name="rating"
              placeholder="9.15"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            ></input>
            <div id="reviewBottom">
              <button
                type="submit"
                id="submit-button"
                onClick={() => {
                  if (loggedIn) {
                    if ((title !== "") & (creator !== "") & (rating !== "")) {
                      if (selectedImage.size < maxImageSizeBytes) {
                        createReview(title, creator, rating, medium);
                        console.log(selectedImage);
                        storeImage(selectedImage, title, creator);
                        setTitle("");
                        setCreator("");
                        setRating(0);
                        window.alert("Review Submitted!");
                      } else {
                        window.alert(
                          "Image file too big. Must be under: " +
                            maxImageSizeBytes / 1000000 +
                            "MB"
                        );
                      }
                    } else {
                      window.alert(
                        "Fill out all information before submitting"
                      );
                    }
                  } else {
                    window.alert(
                      "Not logged in. Please sign in to submit a review"
                    );
                  }
                }}
              >
                Submit Review!
              </button>
            </div>
          </div>
        </div>
        <div className="contentContainer">
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
          <div className="carouselContainer">
            <Carousel>
              <div>
                <img src={displayReviews[0].image} />
                <p className="legend">
                  {displayReviews[0].title} - {displayReviews[0].rating}
                </p>
              </div>
              <div>
                <img src={displayReviews[1].image} />
                <p className="legend">{displayReviews[1].title}</p>
              </div>
              <div>
                <img src={displayReviews[2].image} />
                <p className="legend">{displayReviews[2].title}</p>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
