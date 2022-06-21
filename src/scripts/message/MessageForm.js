/* eslint-disable indent */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import { getUsers, postMsg, getMsgs } from '../data/provider.js';

const applicationState = {};

//PSEUDOCODE INSTRUCTIONS FOR THIS COMPONENT
//--------------------------------------------
//✅ 1: Make message form!
//✅ 2: View message form to appear upon CLICK event of message icon & disappear when clicked again
//✅ 3: Need to make recipients list
//✅ 4: Need current user's id
//✅ 5: Need to register the recipient, message, date & current user to "send to API" as object
//✅ 6: Need fetch request of GET for messages, and need getMessages function for getting all messages
//✅ 7: Need fetch request for POST method of new "send to API" object after the send btn is pressed
//✅ 8: Need to send "send to API" object as argument in invoked function and properly post to API
//✅ 9: Afterwards, the API should be able to fetch all messages for the current user and send to DOM on Messages page for Display
//✅ 10: View homepage btn from Messages Displayed
//OPTIONAL-- 11: After recipient opens message, (in read:false) the read key should have a new value of true. That will have to be done in a PATCH request to modify the existing read key 

//📝 DIRECT MSG FORM 
//----------------
export const msgForm = () => {
  const recipients = getUsers();

  return `
  <form id="whole__form">
  <div id="form__div">

    <h2 id="h2__directMsg"><b>Direct Message</b></h2>
     <div id="directMsgDiv"> 
      <div id="recipients__id">
          <label id="" class="" for="recipients__label">Recipient:</label>
              <select style="width: 200px; height: 20px" id="recipientDropDown">
                  <option value="" selected> Select Recipient:</option>
                  ${recipients.map(recipient => {
      return `<option class="recipients" id="${recipient.id}" value="${recipient.id}">${recipient.name}</option>`;
    }).join('')}
              </select>
      </div>

      <div id="message__div">
          <label class="message__label" for="message__label">Message:</label>
              <textarea placeholder="Message to friend" type="text" name="message" class="input"></textarea>
      </div>

      <div id="message__btns">
          <button class="svBtn" id="saveBtn">Send</button>
          <button class="cnclBtn" id="cancelBtn">Cancel</button>
      </div>
    </div>
  </div>
  </form>
    `;
};

  
  // 📝 OPEN & CLOSE FORM FOR DIRECT MSG CLICK EVENTLISTENER
  //--------------------------------------------------------
  let x = 0; //counting the button clicks
  
  document.addEventListener('click', e => {
    
    //x % 2 == 0 matches the remainder of 0 to the value or type of 0
    if (e.target.id === 'create_msg') {
      e.preventDefault();
      x++; //increments button clicks x=x+1
      console.log(x);
      //% Remainder operator; x when divided by 2, has a remainder the value or type of 0
      //EX: 4/2 = 2 Remainder 0
      if (x % 2 !== 0) {
        document.getElementById('emptyDiv').innerHTML = msgForm(); //VISIBLE FORM
      } else if (x % 2 == 0) {
        document.getElementById('emptyDiv').innerHTML = '<div id="msgFormDiv"></div>'; //EMPTY DIV
      }
    }
  });


// 📬 DIRECT MSG HTML FOR DOM DISPLAY
//-------------------------------------
const currentUser = parseInt(localStorage.getItem('gg_user'));

export const directMsgHTML = () => {
  const msgs = getMsgs();
  const allUsers = getUsers();
  let senderFound = '';
  let recipientFound = '';
  let html;
  applicationState.userName = [];

  html = msgs.map(msg => { 
    
    senderFound = allUsers.find(user => {
      return user.id === msg.senderId;
    });
  
    recipientFound = allUsers.find(user => {
      return user.id === msg.recipientId;
    });
  
    
    if (msg.recipientId === currentUser) {
     applicationState.userName = recipientFound.name; //placed inside so that the username remains updated
   return `
        <div class="msgContainer">
          <div class="msgBody">
            <p id="recipientFoundParagraph">To ${recipientFound.name}</p>
            <p>From ${senderFound.name} on ${msg.date}</p>
            <p><em>${msg.text}</em></p><br>       
          </div>
       </div>
         `;
   }
  }).join('');
  
  let topDiv = `
  <div id="welcome__id">
   <p id="welcome__p"><b> Welcome to your Mailbox, ${applicationState.userName}!</b></p>
  </div>`;

  let homeBtn = `
  <div id="returnDiv">
    <button id="returnHomeBtn">Return Home</button>
  </div>`;

  localStorage.setItem('directMessageInUse', 'true');  // 👀

  return topDiv + html + homeBtn;
  };

  // 📬 OPEN ALL DIRECT MSGS FOR CURRENT USER CLICK EVENTLISTENER
  //--------------------------------------------------------------
  document.addEventListener('click', e => {
    if (e.target.id === 'all_msgs') {
      e.preventDefault();
      document.getElementById('directMsgView').innerHTML = directMsgHTML();

    }
  });
  
// OPEN/CLOSE DURING DIRECT MSG VIEW
//-----------------------------------
  let y = 0; //counting the button clicks
  
  document.addEventListener('click', e => {

    //x % 2 == 0 matches the remainder of 0 to the value or type of 0
    if (e.target.id === 'create_msg') {

      if (localStorage.getItem('directMessageInUse') === 'true') { // 👀

        e.preventDefault();
        y++; //increments button clicks x=x+1
        console.log(x);
        //% Remainder operator; x when divided by 2, has a remainder the value or type of 0
        //EX: 4/2 = 2 Remainder 0
        if (y % 2 !== 0) {
          document.getElementById('dirMsgFormView').innerHTML = msgForm(); //VISIBLE FORM
        } else if (y % 2 == 0) {
          document.getElementById('dirMsgFormView').innerHTML = '<div id="msgFormDiv"></div>'; //EMPTY DIV
        }
      }

    }
  });

  // RECIPIENT OPTION SELECT CHANGE EVENTLISTENER
  //-----------------------------------------------
  let recipientId;
  
  document.addEventListener('change', e => {
    if (e.target.id === 'recipientDropDown') {
      const recipientSelect = document.getElementById('recipientDropDown').value;
      recipientId = parseInt(recipientSelect);
    }
  });


// SAVE BTN IN MESSAGE FORM EVENTLISTENER
//---------------------------------------
document.addEventListener('click', clickEvent => {
  if (clickEvent.target.id === 'saveBtn') {
    clickEvent.preventDefault();

    const messageToSend = document.querySelector('textarea[name=\'message\']').value;
    const longDate = Date(Date.now());
    const dateSplitAtYear = longDate.split(' 2021 '); 
    const dateUponSubmit = dateSplitAtYear[0] + ', 2021'; 
    const currentUserId = parseInt(localStorage.getItem('gg_user'));

    const sendToAPI = {
      senderId: currentUserId,
      recipientId,
      text: messageToSend,
      date: dateUponSubmit          
    };

    if (recipientId && messageToSend.length > 0) {
      postMsg(sendToAPI).then(() => {
        document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
        alert('Your message has been sent successfully!');
      }); 
    } else {
      console.log('❌ User must select recipient & enter message text into form field');
      alert('Please select and complete all fields to submit your message successfully');
    }
  }
});


//CANCEL BTN IN MESSAGE FORM EVENTLISTENER
//------------------------------------------
document.addEventListener('click', e => {
  if (e.target.id === 'cancelBtn') {
    e.preventDefault();
    document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
  }
});

