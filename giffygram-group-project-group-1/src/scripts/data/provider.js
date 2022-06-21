const apiURL = 'http://localhost:4000';
const applicationElement = document.querySelector('.giffygram');


const applicationState = {
  currentUser: {},
  feed: {
    chosenUser: null,
    displayFavorites: false,
    displayMessages: false
  },
  users: [],
  favorites: [],
  posts: [],
  messages: []
};

//FETCH & GET USERS ARRAY
//----------------------------
export const fetchUsers = () => {
  return fetch(`${apiURL}/users`)
    .then(response => response.json())
    .then(
      (usersFromApi) => {
        applicationState.users = usersFromApi;
      });
};

export const getUsers = () => {
  return applicationState.users.map(user => ({...user}));
};

//FETCH & GET FAVORITES ARRAY
//----------------------------
export const fetchFavs = () => {
  return fetch(`${apiURL}/favorites`)
    .then(response => response.json())
    .then(
      (favsFromAPI) => {
        applicationState.favorites = favsFromAPI
      }
    )
}

export const getFavs = () => {
  return applicationState.favorites.map(fav => ({...fav}))
}


//MESSAGES FROM API FETCH REQUEST & POST REQUEST
//-----------------------------------------------
export const fetchMsgs = () => {
  return fetch(`${apiURL}/messages`)
    .then(res => res.json())
    .then((msgsFromAPI) => {
      applicationState.messages = msgsFromAPI
    });
};

export const getMsgs = () => {
  return applicationState.messages.map(msg => ({...msg}))
}

export const postMsg = (msgToPost) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify(msgToPost)
  }

  return fetch(`${apiURL}/messages`, fetchOptions)
  .then(res => res.json())
  .then(() => {
    applicationElement.dispatchEvent(new CustomEvent('stateChanged'))
  })
};

//SAVE GIF TO API USING POST METHOD
//----------------------------------------
export const saveGif = (userSubmittedGif) => {
  const postGif = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userSubmittedGif)
  }

  return fetch(`${apiURL}/posts`, postGif)
  .then(response => response.json())
  .then(() => {
    applicationElement.dispatchEvent(new CustomEvent("stateChanged"))
  })
}

//FETCH & GET POSTS 
//------------------
export const fetchPosts = () => {
  return fetch(`${apiURL}/posts`)
    .then(res => res.json())
    .then((postsFromAPI) => {
      applicationState.posts = postsFromAPI
    });
};

export const getPosts = () => {
  return applicationState.posts.map(post => ({...post}))
}

// DELETE POST
// ----------------
export const deletePost = (id) => {
  return fetch(`${apiURL}/posts/${id}`, { method: "DELETE"})
    .then(
      () => {
        console.log('A post has been deleted!');
        applicationElement.dispatchEvent(new CustomEvent("stateChanged"));
      }
    )
}

// SAVE FAV POST TO FAVORITES ARRAY API
//---------------------------------------
export const saveFavPost = (favPost) => {
  const favPostToSend = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(favPost)
  }

  return fetch(`${apiURL}/favorites`, favPostToSend)
  .then(response => response.json())
  .then(() => {
    applicationElement.dispatchEvent(new CustomEvent("stateChanged"))
    
  })
}

// DELETE FAV
// ----------------
export const deleteFav = (id) => {
  return fetch(`${apiURL}/favorites/${id}`, { method: "DELETE"})
    .then(
      () => {
        console.log('A post has been unstarred and removed from the favorites API');
        // applicationElement.dispatchEvent(new CustomEvent("stateChanged"));
      }
    )
}