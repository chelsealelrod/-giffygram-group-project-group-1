/* eslint-disable eqeqeq */
import { getPosts, getUsers, getFavs } from '../data/provider.js';
 

const yearsArr = [2019,2020,2021];    

// HTML FOR FOOTERHTML() (REFACTORED --  ✅ NEW)
// -------------------------
export const footerHTML = () => {
  applicationState.usersArr = getUsers();
  applicationState.postsArr = getPosts();
  applicationState.favsArr = getFavs();
  applicationState.year19only = [];
  applicationState.year20only = [];
  applicationState.year21only = [];
  postsByYear(); //this function cannot be reached unless it's within a function that is being used/shown on the DOM
  return   `
    <footer class="footer">

      <div class="footerDiv">
        <p>Posts since</p>
        <select id="year__select">
          <option value='' selected>Choose Year</option>
          <option class="years__class">2021</option>
          <option class="years__class">2020</option>
          <option class="years__class">2019</option>
        </select>
      </div>

      <div class="footerDiv">
        <p>Posts by User</p>
        <select id="user__select">
            <option value='' selected>Choose User</option>
            ${applicationState.usersArr.map(user => {
    return `<option class="recipients" id="${user.id}" value="${user.id}">${user.name}</option>`;
  }).join('')}
        </select>
      </div>

      <div class="footerDiv">
        <p>Show only Favorites</p>
        <input name="favCheckbox" id="favCheckbox" type="checkbox"></input>
      </div>
    </footer> `;
};

const applicationState = {};

// POSTBYYEAR() FILTERS POSTS INTO PROPER APPLICATIONSTATE ARRAY
//---------------------------------------------------------------
const postsByYear = () => {
  const posts = applicationState.postsArr;
  

  posts.map(post => {
    const filter2019 = post.timestamp.slice(-4);
    if(filter2019 === '2019') {
      applicationState.year19only.push(post);
    }
  });

  posts.map(post => {
    const filter2020 = post.timestamp.slice(-4);
    if(filter2020 === '2020') {
      applicationState.year20only.push(post);
    }
  });

  posts.map(post => {
    const filter2021 = post.timestamp.slice(-4);
    if(filter2021 === '2021') {
      applicationState.year21only.push(post);
    }
  });
  // console.log(applicationState.year19only);
  // console.log(applicationState.year20only);
  // console.log(applicationState.year21only);
};



// FILTER FEED BY USER (REFACTORED -- ✅ NEW)
// -------------------------------------
document.addEventListener('change', e => {
  if (e.target.id === 'user__select') {
    e.preventDefault();
    
    const posts = applicationState.postsArr;
    const favs = applicationState.favsArr;
    const users = applicationState.usersArr;


    let htmlArr;
    let userMapArr;

    htmlArr = posts.map(post => {

      userMapArr = users.map(user => {

        if (document.getElementById('user__select').selectedIndex == `${user.id}` && document.getElementById('user__select').selectedIndex == `${post.senderId}`) {
        

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
           <p>Post by ${user.name} on ${post.timestamp}</p>
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
           <p>Post by ${user.name} on ${post.timestamp}</p>
         <div class="post__actions"> 
           <div id="favDiv--${post.id}"><button id="blackStarBtn--${post.id}" class="StarBtn">✩</button></div>
           <button id="trashBtn--${post.id}"  class="trashDeleteBtn">🗑</button>
            </div>
            `;
          }

        } //close selectedIndex getelementbyid
      }); //closes users map
      const joinUserPosts = userMapArr.join('');
      return joinUserPosts;
    }); //closes posts map
    
    const html = htmlArr.join(''); //MAYBE USE THE HTML ARR FOR COUNT OF POSTS IN A CERTAIN YEAR?
    document.querySelector('.post').innerHTML = html;
  } //begins if statement for e.target.id
}); //begins addEventListener


// MATCH POST SENDER ID TO USER ID TO FIND NAME FOR YEAR FILTER EVENT LISTENER 
//-----------------------------------------------------------------------------
const postUsername = (post, users) => {

  for (const user of users) {
    if (user.id === post.senderId) {
      return user.name;
    }
  }
};

// FILTER FEED BY YEAR ( REFACTORED -- ✅ NEW)
// ------------------------------------
document.addEventListener('change', e => { 
  if (e.target.id === 'year__select') {
    const favs = applicationState.favsArr;


    let htmlArr;
    let postJoinArr;

    htmlArr = yearsArr.map(year => {
      postJoinArr = applicationState.postsArr.map(post => {
        const postAuthor = postUsername(post, applicationState.usersArr);
        if (document.getElementById('year__select').value == year && post.timestamp.slice(-4) == year) {


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
           <p>Post by ${postAuthor} on ${post.timestamp}</p>
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
           <p>Post by ${postAuthor} on ${post.timestamp}</p>
         <div class="post__actions"> 
           <div id="favDiv--${post.id}"><button id="blackStarBtn--${post.id}" class="StarBtn">✩</button></div>
           <button id="trashBtn--${post.id}"  class="trashDeleteBtn">🗑</button>
            </div>
            `;
          }

        } // closes if statemement
      }); // closes postsArr map
      const joinedPosts = postJoinArr.join('');
      return joinedPosts;
    }); // closes yr map
    const html = htmlArr.join('');
    document.querySelector('.post').innerHTML = html;

  } //begins if statement for change element
});   











// OLD CODE BELOW; HERE FOR LATER REFERENCE
//   if (document.getElementById('user__select').selectedIndex === 1) {
//     applicationState.usersArr.map(user => {
//       postsByUserFilteredArr(user); //invoked here to use users.map method
//       if (user.id === 1) {

//         document.querySelector('.post').innerHTML = 
//        `
//       <div class="filtered__post">${applicationState.user1Filtered.map(post => {
//   return `
//           <h2 class="post__title">${post.title}</h2>
//            <img class="post__image" src="${post.imageURL}"></img>
//         <div class="post__description">${post.description}</div>
//           <p>Post by ${user.name} on ${post.timestamp}</p>
//           <div class="post__actions"> 
//           <div id="favDiv--${post.id}"><button id="blackStarBtn--${post.id}" class="StarBtn">✩</button></div>
//           <button id="trashBtn--${post.id}"  class="trashDeleteBtn">🗑</button>
//         </div>
//     `;
// }).join('')}
//       </div>`;




//   if (document.getElementById('year__select').value === '2021') {
//     document.querySelector('.post').innerHTML = `
//     <div class="filtered__post">${applicationState.year21only.map(yr21post => {
//   const postAuthor = postUsername(yr21post, applicationState.usersArr);
//   return `
//         <h2 class="post__title">${yr21post.title}</h2>
//          <img class="post__image" src="${yr21post.imageURL}"></img>
//       <div class="post__description">${yr21post.description}</div>
//         <p>Post by ${postAuthor} on ${yr21post.timestamp}</p>
//         <div class="post__actions"> 
//         <div id="favDiv--${yr21post.id}"><button id="blackStarBtn--${yr21post.id}" class="StarBtn">✩</button></div>
//         <button id="trashBtn--${yr21post.id}"  class="trashDeleteBtn">🗑</button>
//       </div>
//   `;
// }).join('')} 
//     </div>`;
//   }

//   if (document.getElementById('year__select').value === '2020'){
//     document.querySelector('.post').innerHTML = `
//     <div class="filtered__post">${applicationState.year20only.map(yr20post => {
//   const postAuthor = postUsername(yr20post, applicationState.usersArr);
//   return `
//       <h2 class="post__title">${yr20post.title}</h2>
//       <img class="post__image" src="${yr20post.imageURL}"></img>
//       <div class="post__description">${yr20post.description}</div>
//       <p>Post by ${postAuthor} on ${yr20post.timestamp}</p>
//       <div class="post__actions"> 
//       <div id="favDiv--${yr20post.id}"><button id="blackStarBtn--${yr20post.id}" class="StarBtn">✩</button></div>
//       <button id="trashBtn--${yr20post.id}"  class="trashDeleteBtn">🗑</button>
//       </div>
//     `;
// }).join('')} 
//     </div>`;
//   }

//   if (document.getElementById('year__select').value === '2019') {
//     document.querySelector('.post').innerHTML = `
//     <div class="filtered__post">${applicationState.year19only.map(yr19post => {
//   const postAuthor = postUsername(yr19post, applicationState.usersArr);
//   return `
//       <h2 class="post__title">${yr19post.title}</h2>
//       <img class="post__image" src=${yr19post.imageURL}"></img>
//       <div class="post__description">${yr19post.description}</div>
//       <p>Post by ${postAuthor} on ${yr19post.timestamp}</p>
//       <div class="post__actions"> 
//       <div id="favDiv--${yr19post.id}"><button id="blackStarBtn--${yr19post.id}" class="StarBtn">✩</button></div>
//       <button id="trashBtn--${yr19post.id}"  class="trashDeleteBtn">🗑</button>
//       </div>`;
// }).join('')} 
//     </div>`;
//   }