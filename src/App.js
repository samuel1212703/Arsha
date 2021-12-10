import "./App.less";
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
import {
  Layout,
  Progress,
  Button,
  Slider,
  Input,
  Avatar,
  Row,
  Col,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { generate } from "@ant-design/colors";

const { Search } = Input;
const { Header, Content } = Layout;

// Generate dark color palettes by a given color
const colors = generate("#1890ff", {
  theme: "dark",
  backgroundColor: "#141414",
});

function signinPopup(setLoggedIn) {
  setPersistence(auth, inMemoryPersistence).then(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setLoggedIn(true);
      if (result._tokenResponse.isNewUser !== null) {
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

async function getAllFriendReviews() {
  var finalReviews = [];
  const friendIDs = await getAllUserFriendIDs();
  friendIDs.push(auth.currentUser.uid);
  for (const id of friendIDs) {
    var userReviews = await getUserReviews(id);
    for (const review of userReviews) {
      finalReviews.push(review);
    }
  }
  return finalReviews;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [rating, setRating] = useState(9.15);
  const [medium, setMedium] = useState("Album");
  const [displayReviews, setDisplayReviews] = useState([]);
  const [friendUserID, setFriendUserID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (loggedIn) {
      getAllFriendReviews().then((result) => {
        console.log(result);
        setDisplayReviews(result);
      });
    }
  }, [loggedIn, searchTerm]);

  const headerStyle = {
    backgroundColor: colors[0],
    color: colors[9],
  };

  const supStyle = {
    backgroundColor: colors[2],
    color: colors[1],
    padding: 15,
  };

  const inputStyle = {
    borderRadius: 5,
    width: 200,
    margin: "3px",
  };

  const sliderStyle = {
    width: "50%",
    margin: "auto",
  };

  const colStyle = {
    borderRadius: 10,
    padding: 25,
    backgroundColor: colors[1],
    marginBottom: 15,
  };

  const submitButtonStyle = {
    color: colors[1],
    backgroundColor: "#ffe818",
    marginBottom: 15,
  };

  const reviewCollectionStyle = {
    maxHeight: "100%",
    overflow: "auto",
  };

  const reviewItemStyle = {
    borderRadius: 10,
    backgroundColor: colors[2],
    border: "2px solid" + colors[0],
  };

  const buttonStyle = {
    backgroundColor: colors[0],
  };

  const bodyStyle = { minHeight: "100vh" };

  return (
    <div className="App">
      <Layout style={bodyStyle}>
        <Header style={headerStyle}>
          <h1>Arsha</h1>
        </Header>
        <Layout>
          <Content style={supStyle}>
            {loggedIn ? (
              <div>
                <p style={{ color: colors[0] }}>
                  <strong>
                    <Avatar size={32} icon={<UserOutlined />} />
                    {auth.currentUser.displayName} - {auth.currentUser.uid}
                  </strong>
                </p>
                <Button
                  style={buttonStyle}
                  onClick={() => signout(setLoggedIn)}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div>
                <GoogleButton
                  id="google-signin"
                  onClick={() => signinPopup(setLoggedIn)}
                />
              </div>
            )}
            <Row>
              <Col
                xs={{ span: 24 }}
                lg={{ span: 12 }}
                style={(colStyle)}
              >
                <div className="mainContent">
                  <div id="reviewImageContainer"></div>
                  <div id="reviewTextContainer">
                    <h4>Medium</h4>
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
                    <h4>Title</h4>
                    <Input
                      style={inputStyle}
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Blonde"
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                      }}
                    ></Input>
                    <h4>Creator</h4>
                    <Input
                      style={inputStyle}
                      type="text"
                      id="creator"
                      name="creator"
                      placeholder="Frank Ocean"
                      value={creator}
                      onChange={(event) => {
                        setCreator(event.target.value);
                      }}
                    ></Input>
                    <h4>Rating</h4>
                    <Input
                      style={inputStyle}
                      type="number"
                      id="rating"
                      name="rating"
                      placeholder="9.15"
                      min={1}
                      max={10}
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                    ></Input>
                    <Slider
                      style={sliderStyle}
                      min={1}
                      max={10}
                      step={0.01}
                      value={rating}
                      onChange={(event) => setRating(event)}
                    />
                    <div id="reviewBottom">
                      <Button
                        style={submitButtonStyle}
                        type="submit"
                        id="submit-button"
                        onClick={() => {
                          if (loggedIn) {
                            if (
                              (title !== "") &
                              (creator !== "") &
                              (rating !== "")
                            ) {
                              if (
                                title.length < 250 &&
                                creator.length < 250 &&
                                rating < 10 &&
                                rating > 1
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
                                  "Invalid entries (title and creator below 250 characters, and rating between 1 and 10)"
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
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col
                xs={{ span: 24 }}
                lg={{ span: 12 }}
                style={(colStyle)}
              >
                <div>
                  <Row>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <Search
                        placeholder="Add friend by ID"
                        onSearch={(event) => {
                          setFriendUserID(event);
                          if (friendUserID !== "") {
                            addAFriend(loggedIn, friendUserID);
                          }
                        }}
                        style={inputStyle}
                      />
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <Search
                        placeholder="Enter medium, title, creator"
                        onSearch={(event) => setSearchTerm(event)}
                        style={inputStyle}
                      />
                    </Col>
                  </Row>
                  <div id="review-col" style={reviewCollectionStyle}>
                    {displayReviews
                      .filter((review) => {
                        if (
                          searchTerm === "" ||
                          review.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          review.reviewer
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          review.creator
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ) {
                          return review;
                        }
                      })
                      .map((review, i) => {
                        return (
                          <div
                            key={i}
                            className="review-box"
                            style={reviewItemStyle}
                          >
                            <h3 key={i} className="legend">
                              {review.title} - {review.rating}
                            </h3>
                            <p>
                              {review.reviewer} - {review.creator} -{" "}
                              {review.medium}
                            </p>
                            <Progress
                              style={sliderStyle}
                              percent={(review.rating * 10).toFixed(1)}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>

      {/* <h1>Arsha</h1>
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
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Blonde"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  ></Input>
                  <p>Creator</p>
                  <Input
                    type="text"
                    id="creator"
                    name="creator"
                    placeholder="Frank Ocean"
                    value={creator}
                    onChange={(event) => {
                      setCreator(event.target.value);
                    }}
                  ></Input>
                  <p>Rating</p>
                  <Input
                    type="number"
                    id="rating"
                    name="rating"
                    placeholder="9.15"
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                  ></Input>
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
                  <Input
                    id="searchBar"
                    type="text"
                    placeholder="Enter medium, title, creator..."
                    onChange={(event) => setSearchTerm(event.target.value)}
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
                  <Input
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
                {displayReviews
                  .filter((review) => {
                    if (searchTerm === "") {
                      return review;
                    } else if (
                      review.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      review.reviewer
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      review.creator
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return review;
                    }
                  })
                  .map((review, i) => {
                    return (
                      <div key={i} className="review-box">
                        <h3 key={i} className="legend">
                          {review.title} - {review.rating}
                        </h3>
                        <p>
                          {review.reviewer} - {review.creator}
                        </p>
                        <Progress percent={review.rating * 10} />
                      </div>
                    );
                  })}
              </div>
            </Col>
          </div>
        </Row>
      </Container> */}
    </div>
  );
}

export default App;
