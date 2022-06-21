/* eslint-disable no-console */
/* eslint-disable eqeqeq */
import { fetchUsers, getMsgs, getPosts, getUsers, getFavs, deletePost, saveFavPost, deleteFav } from './data/provider.js';
import { gifForm } from './feed/PostList.js';
import { footerHTML } from './nav/Footer.js';
import { msgForm, directMsgHTML } from './message/MessageForm.js'; //must be imported or else it doesn't get loaded into browser scripts to reference

let msgs; //invoked getMsgs() inside this variable inside Giffygram()

const applicationState = {
  userMgs: [],
  postsArr: [],
  usersArr: [],
  favPosts: []
};

// FUNCTION TO MATCH NAME TO POST FOR ALL POSTS FUNCTION
//------------------------------------------------------
const postUsername = (post) => {
  const allUsers = getUsers();
  applicationState.usersArr = getUsers();

  for (const user of allUsers) {
    if (user.id === post.senderId) {
      return user.name;
    }
  }
};

//MAIN FEED ALL POSTS FUNCTION FOR GIFFYGRAM MAIN PAGE
//------------------------------------------------------
const allPosts = () => {
  applicationState.postsArr = getPosts();
  const posts = applicationState.postsArr;
  applicationState.favPosts = getFavs();
  const favs = applicationState.favPosts;

  let htmlArr; 
  

  htmlArr = posts.map(post => {
    const postUser = postUsername(post);

    const isFavPost = favs.map(fav => {
      if (post.id === fav.postId) {
        return true;
      } 
    });

    if (isFavPost.includes(true)) {
      return  `
        <div id="entirePost--${post.id}">
        <h2 class="post__title">${post.title}</h2>
        <img class="post__image" src="${post.imageURL}"></img>
     <div class="post__description">${post.description}</div>
       <p>Post by ${postUser} on ${post.timestamp}</p>
     <div class="post__actions"> 
       <div id="favDiv--${post.id}"><button id="goldStarBtn--${post.id}" class="StarBtn">⭐️</button></div>
       <button id="trashBtn--${post.id}"  class="trashDeleteBtn">🗑</button>
        </div>
        `;
    } else {
      return  `
        <div id="entirePost--${post.id}">
        <h2 class="post__title">${post.title}</h2>
        <img class="post__image" src="${post.imageURL}"></img>
     <div class="post__description">${post.description}</div>
       <p>Post by ${postUser} on ${post.timestamp}</p>
     <div class="post__actions"> 
       <div id="favDiv--${post.id}"><button id="blackStarBtn--${post.id}" class="StarBtn">✩</button></div>
       <button id="trashBtn--${post.id}"  class="trashDeleteBtn">🗑</button>
        </div>
        `;
    }
    
  });
  const html = htmlArr.join('');
  return html;
};

//SEND FAVORITE POSTID AND USERID TO API WHEN POST IS STARRED
//------------------------------------------------------------
document.addEventListener('click', e => {
  if (e.target.id.startsWith('blackStarBtn--')) {
    e.preventDefault();

    const postIdString = e.target.id.split('--')[1];
    const postIdInt = parseInt(postIdString);
        
    let userFound;

    applicationState.postsArr.map(post => {
      if (post.id === postIdInt) {
        userFound = post.senderId;
      }
    });

    const favHold = {
      userId: userFound,
      postId: postIdInt
    };

    saveFavPost(favHold);
  } 
});

// //SEND UNFAVORITE ID TO API WHEN GOLD START IS CLICKED TO DELETE FROM FAVORITES API (✅ NEW)
// //-------------------------------------------------------------------------------------
document.addEventListener('click', e => {
  if (e.target.id.startsWith('goldStarBtn--')) {
    e.preventDefault();

    let favId;
    const postIdString = e.target.id.split('--')[1];

    applicationState.favPosts.map(fav => {
      if (fav.postId == postIdString) {
        favId = fav.id;
      }
    });
        
    document.getElementById(`favDiv--${postIdString}`).innerHTML = `<button id="blackStarBtn--${postIdString}" class="StarBtn">✩</button>`;
    deleteFav(parseInt(favId));
  }
});


//EXPORT GIFFYGRAM NAV BAR, MAIN FEED AND FOOTER
//------------------------------------------------
export const GiffyGram = () => {
  msgs = getMsgs();
  

  return `
  <div class="navigation">
    <h1 id="home__feed" class="navigation__name">Giffygram 🧸</h1>
      <div class="navigation__item">
        <button type="button" id="create_msg">✍️</button>
        <button type="button" id="all_msgs">${msgCount()}</button>
        <a id="logout" class="navigation__logout" href="">Logout</a>
      </div>
  </div>

  <div id="dirMsgFormView"></div>
  <div id="directMsgView">
    <div id="emptyDiv"></div>

    <div id="formToPost">
      <button type="button" id="openPostForm" class="gif__to__post"><b>Have a gif to post?</b></button>
    </div>
  
    <section class="post">

    ${allPosts()}

    </section>
 
    ${footerHTML()}
  </div>
  `;
};

//LOGOUT AND RETURN TO LOGIN PAGE
//--------------------------------
document.addEventListener('click', e => {
  if (e.target.id === 'logout') {
    fetchUsers().then(() => {
      // entirePageForGiffygram.innerHTML = LoginForm(); this is redundant
      localStorage.setItem('gg_user', null);
      localStorage.removeItem('directMessageInUse');  // 👀
      document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
    });
  }
});

//OPEN FORM TO POST
//------------------
document.addEventListener('click', e => {
  if (e.target.id === 'openPostForm') {
    document.getElementById('formToPost').innerHTML = gifForm();
  }
});

// DIRECT MSG COUNT ON DIRECT MSG LINK
//---------------------------------------
const msgCount = () => {
  const currentUser = parseInt(localStorage.getItem('gg_user'));
  applicationState.userMgs = []; //placed this here so the array refreshes
  msgs.map(msg => {
    if (msg.recipientId === currentUser) {
      applicationState.userMgs.push(msg);
    }
  });
  return applicationState.userMgs.length;
};

//DELETE POST 
//--------------
document.addEventListener('click', click => {
  if (click.target.id.startsWith('trashBtn--')) {
    const postToDeleteId = click.target.id.split('--')[1];
    deletePost(parseInt(postToDeleteId));
  }
});

//SHOW ONLY FAVORITED POSTS ON CHECKBOX CHANGE (✅ NEW)
//--------------------–––---––--–––––––––––––––––––––––––
document.addEventListener('change', e => {
  if (e.target.id === ('favCheckbox')) {
    if (document.querySelector('#favCheckbox').checked) {
    
      let htmlArr;
      let userMapArr;

      htmlArr = applicationState.postsArr.map(post => {
        userMapArr = applicationState.usersArr.map(user => {

          const isFavPost = applicationState.favPosts.map(fav => {
            if (post.id === fav.postId && user.id === fav.userId) {
              return true;
            } 
          }); //close favs.map

          if (isFavPost.includes(true)) {
            return  `
        <div id="entirePost--${post.id}">
        <h2 class="post__title">${post.title}</h2>
        <img class="post__image" src="${post.imageURL}"></img>
     <div class="post__description">${post.description}</div>
       <p>Post by ${user.name} on ${post.timestamp}</p>
     <div class="post__actions"> 
       <div id="favDiv--${post.id}"><button id="goldStarBtn--${post.id}" class="StarBtn">⭐️</button></div>
       <button id="trashBtn--${post.id}"  class="trashDeleteBtn">🗑</button>
        </div>
        `;
          } 

        }); //close users map
        const joinPosts = userMapArr.join('');
        return joinPosts;
      }); //close posts map

      const html = htmlArr.join('');
      document.querySelector('.post').innerHTML = html;
    } else { //begins if statement for e.target.checked
      document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
    } 
  }
});




// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

//OLD CODE BELOW -- MATCH FAV POST TO FAVS ARRAY FROM API
// const matchFavs = () => {
//   const favs = applicationState.favPosts;
//   const posts = applicationState.postsArr;

//   favs.map(fav => {
//     posts.map(post => {
//       if (post.id === fav.postId) {
//         console.log('matchFavs function works');
//         document.getElementById(`favDiv--${post.id}`).innerHTML = `<button id="goldStarBtn--${post.id}" class="StarBtn">⭐️</button>`;
//       }
//     });
//   });
  
// };