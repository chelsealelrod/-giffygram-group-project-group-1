import { getUsers } from '../data/provider.js';


document.addEventListener('click', clickEvent => {
  if (clickEvent.target.id === 'loginButton') {
    let foundUser = null;
    const usersArr = getUsers();

    const email = document.querySelector('input[name=\'email\']').value;
    const password = document.querySelector('input[name=\'password\']').value;

    for (const user of usersArr) {
      if (user.email === email && user.password === password) {
        foundUser = user;
      }
    }
    //if statement below says: foundUser is NOT of equal value or an equal type of null
    if (foundUser !== null) {
      // (method) Storage.setItem(key: string, value: string):
      localStorage.setItem('gg_user', foundUser.id);
      document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
    }
  }
});

export const LoginForm = () => {
  return `
  <div id="loginDisplay">
    <div class="login__div">
      <h1 id="login__header">Giffygram 🧸</h1>
    </div>

    <div class="loginForm">
        <form id="emailPasswordId">
            <fieldset>
                <label class='loginClass' for="email">Email:</label>
                <input id='email__id' type="text" name="email" autofocus placeholder="Email address" />
            </fieldset>
            <fieldset>
                <label class='loginClass' for="password">Password:</label>
                <input id='password__id' type="password" name="password" placeholder="Password" />
            </fieldset>
            <div id='loginBtnDiv'>
                <button id="loginButton">Login</button>
            </div>
        </form><br>
    </div>
  </div>
    `;
};
