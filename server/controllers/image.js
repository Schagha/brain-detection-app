const clarifaiJSONRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "89f2064ec9d34ad3b7a138b8202b2bbc";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "clarifai23";
  const APP_ID = "face-recognition";
  // Change these to whatever model and image URL you want to use
  // const MODEL_ID = "face-detection";
  // const MODEL_VERSION_ID = "dc7e46bc9124c5c8824be4822abe105";
  // const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions;
};

const handleApiCall = (req, res) => {
  const MODEL_ID = "face-detection";
  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    clarifaiJSONRequestOptions(req.body.input)
  )
  .then((response) => response.json())
  .then(data => res.json(data))
}


const hanleImage = (req, res, knex) => {
  const { id } = req.body;
  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
}

module.exports = {
  hanleImage,
  handleApiCall
}