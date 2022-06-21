/* eslint-disable no-console */
import { GiffyGram } from './GiffyGram.js';
import { LoginForm } from './auth/Login.js';
// import { filterPostsByYr } from './footer.js';
import { fetchMsgs, fetchUsers, fetchPosts, fetchFavs } from './data/provider.js';


const entirePageForGiffygram = document.querySelector('.giffygram');

export const renderApp = () => {
  //parseInt(localStorage.getItem('gg_user')) is linked to 
  //(localStorage.setItem('gg_user', foundUser.id)) from login.js
  
  const user = parseInt(localStorage.getItem('gg_user'));

  if (user) {
    fetchUsers().then(() => {
      fetchMsgs().then(() => {
        fetchPosts().then(() => {
          fetchFavs().then(() => {
            entirePageForGiffygram.innerHTML = GiffyGram();
          });  
        });  
      });
    });
  } else {
    fetchUsers().then(() => {
      entirePageForGiffygram.innerHTML = LoginForm();
    });
  }
}; 

renderApp();

entirePageForGiffygram.addEventListener('stateChanged', () => {
  renderApp();
});

//RETURN HOME UPON CLICK OF TITLE
//--------------------------------
document.addEventListener('click', e => {
  if (e.target.id === 'home__feed') {
    console.log('Click is registered for home button');
    localStorage.removeItem('directMessageInUse');  // 👀    
    document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
  }
});

//RETURN HOME UPON CLICK OF RETURN HOME BTN
//--------------------------------
document.addEventListener('click', e => {
  if (e.target.id === 'returnHomeBtn') {
    console.log('Click is registered for home button');
    localStorage.removeItem('directMessageInUse');  // 👀
    document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
    // document.getElementById('.post').innerHTML = function(); //need main feed function;
  }
});