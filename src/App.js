import "./App.css";
import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import {
  auth,
  provider,
  createReview,
  storeNewUser,
  getUserReviews,
  addFriend,
  getAllUserFriendIDs,
} from "./firebase/config";
import GoogleButton from "react-google-button";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Container, Row, Col } from "react-grid-system";

function signinPopup(setLoggedIn) {
  setPersistence(auth, inMemoryPersistence).then(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setLoggedIn(true);
      if(result._tokenResponse.isNewUser !== null){
        storeNewUser(result);
      }
    } catch (error) {
      window.alert("Could not sign in. We apologize");
    }
  });
}

function signout(setLoggedIn) {
  signOut(auth)
    .then(() => {
      setLoggedIn(false);
    })
    .catch((error) => {
      window.alert("Could not sign out. We apologize");
    });
}

async function addAFriend(loggedIn, friendID) {
  if (loggedIn) {
    window.alert(await addFriend(friendID));
  } else {
    window.alert("Need to be logged in to add a friend");
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [rating, setRating] = useState(0);
  const [medium, setMedium] = useState("Album");
  const [displayReviews, setDisplayReviews] = useState([]);
  const [friendUserID, setFriendUserID] = useState("");
  const [noFriends, setNoFriends] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      getAllUserFriendIDs().then((friend) => {
        if (friend[0] != null) {
          getUserReviews(friend[0]).then((reviews) => {
            reviews.forEach((review, i) => {
              var newDisplayReviews = displayReviews;
              newDisplayReviews[i] = review;
              setDisplayReviews(newDisplayReviews);
            });
          });
        } else {
          setNoFriends(true);
        }
      });
    }
  });

  return (
    <div className="App">
      <h1>Arsha</h1>
      {loggedIn ? (
        <div>
          <p>
            {auth.currentUser.displayName} - {auth.currentUser.uid}
          </p>
          <button onClick={() => signout(setLoggedIn)}>Sign out</button>
        </div>
      ) : (
        <GoogleButton
          id="google-signin"
          onClick={() => signinPopup(setLoggedIn)}
        />
      )}
      <Container>
        <Row>
          <div className="mainPage">
            <Col md={12} lg={6}>
              <div className="mainContent">
                <div id="reviewImageContainer"></div>
                <div id="reviewTextContainer">
                  <p>Medium</p>
                  <select
                    name="mediums"
                    id="mediums"
                    value={medium}
                    onChange={(event) => {
                      setMedium(event.target.value);
                    }}
                  >
                    <option value="Album">Album</option>
                    <option value="Game">Game</option>
                    <option value="Movie">Movie</option>
                  </select>
                  <p>Title</p>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Blonde"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
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
                          if (
                            (title !== "") &
                            (creator !== "") &
                            (rating !== "")
                          ) {
                            createReview(
                              title,
                              creator,
                              rating,
                              medium,
                              auth.currentUser.displayName
                            );
                            setTitle("");
                            setCreator("");
                            setRating(0);
                            window.alert("Review Submitted!");
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
            </Col>
            <Col md={12} lg={6}>
              <div className="contentContainer">
                <div className="search-bars">
                  <input
                    id="searchBar"
                    type="text"
                    placeholder="Enter medium, title, creator"
                  />
                  <button id="searchButton">
                    <img
                      className="searchImage"
                      src="images/search-icon.png"
                      alt="Search icon"
                    />
                  </button>
                </div>
                <div className="search-bars">
                  <input
                    id="friendSearchBar"
                    type="text"
                    value={friendUserID}
                    placeholder="Enter user id"
                    onChange={(event) => setFriendUserID(event.target.value)}
                  />
                  <button
                    id="searchButton"
                    onClick={() => {
                      if (friendUserID !== "") {
                        addAFriend(loggedIn, friendUserID);
                      }
                    }}
                  >
                    <img
                      className="searchImage"
                      src="images/plus-icon.png"
                      alt="Search icon"
                    />
                  </button>
                </div>
                {displayReviews.map((review, i) => {
                  return (
                    <div key={i} className="review-box">
                      <h3 key={i} className="legend">
                        {review.title} - {review.rating}
                      </h3>
                      <p>
                        {review.reviewer} - {review.creator}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Col>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default App;
