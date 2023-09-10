import React, { Component } from "react";
import Navigation from "./components/navigation/Navigation";
import Logo from "./components/logo/Logo";
import Rank from "./components/rank/Rank";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/faceRecognition/FaceRecognition";
import Signin from "./components/signin/SignIn";
import Register from "./components/register/Register";
import ParticlesBg from "particles-bg";
import "./App.css";

// const clarifaiJSONRequestOptions = (imageUrl) => {
//   // Your PAT (Personal Access Token) can be found in the portal under Authentification
//   const PAT = "89f2064ec9d34ad3b7a138b8202b2bbc";
//   // Specify the correct user_id/app_id pairings
//   // Since you're making inferences outside your app's scope
//   const USER_ID = "clarifai23";
//   const APP_ID = "face-recognition";
//   // Change these to whatever model and image URL you want to use
//   // const MODEL_ID = "face-detection";
//   // const MODEL_VERSION_ID = "dc7e46bc9124c5c8824be4822abe105";
//   // const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
//   const IMAGE_URL = imageUrl;

//   const raw = JSON.stringify({
//     "user_app_id": {
//       "user_id": USER_ID,
//       "app_id": APP_ID
//     },
//     "inputs": [
//       {
//         "data": {
//           "image": {
//             "url": IMAGE_URL
//           }
//         }
//       }
//     ]
//   });

//   const requestOptions = {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Key ' + PAT
//     },
//     body: raw
//   };
//   return requestOptions;
// };

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  // componentDidMount() {
  //   fetch("http://localhost:3000/")
  //     .then((res) => res.json())
  //     .then(console.log);
  // }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    console.log('Input URL:', this.state.input);
    this.setState({ imageUrl: this.state.input });
    // const MODEL_ID = "face-detection";

    // fetch(
    //   "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    //   clarifaiJSONRequestOptions(this.state.input)
    // )
    fetch("http://localhost:3000/imageurl", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: this.state.input,
            }),
          })
      .then((response) => response.json())
      .then((response) => {
        console.log("hi", response);
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#380072" type="cobweb" bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
