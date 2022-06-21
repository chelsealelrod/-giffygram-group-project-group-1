import { saveGif } from '../data/provider.js';

// 🔻 GIF FORM THAT CREATES A NEW POST TO BE POSTED TO THE FEED 
//---------------------------------------------------------------
export const gifForm = () => {
  return `
  <form class="post__form">
  <h2 id="h2__gifPost"><b>Create New Post</b></h2>
    <div class="post__form__div">
        <fieldset id="gifPostForm">
          
          <div class="formFieldsDiv">
            <label class="gifPostLabels" for="title">Title:</label>
            <input id="titleLabel" type="text" name="title" autofocus placeholder="Title" />
          </div>
        
          <div class="formFieldsDiv">
            <label class="gifPostLabels" for="gifURL">GIF URL:</label>
            <input id="gifLabel" type="text" name="gifURL" placeholder="Use www.giphy.com" />
          </div>
          
          <div class="formFieldsDiv">
            <label class="gifPostLabels" for="postDescription">Post description:</label>
            <input id="descriptionLabel" type="text" name="postDescription" placeholder="Describe your post" />
          </div>

        </fieldset>
          <div id="saveCancelBtns">
            <button id="savePost">Save</button>
            <button id="cancelPost">Cancel</button>
          </div>
    </div>
  </form>`;
};

// SAVE POST BTN IN CREATE POST FORM
//-----------------------------------
document.addEventListener('click', e => {
  if (e.target.id==='savePost') {
    e.preventDefault();
    const formTitle=document.querySelector('input[name=\'title\']').value;
    const formImageURL=document.querySelector('input[name=\'gifURL\']').value;
    const formDescription=document.querySelector('input[name=\'postDescription\']').value;
    const longDate = Date(Date.now());
    const dateSplitAtYear = longDate.split(' 2021 '); 
    const formTimestamp = dateSplitAtYear[0] + ', 2021';
    const formUserId = parseInt(localStorage.getItem('gg_user'));

    const sendFormData={
      title:formTitle,
      imageURL:formImageURL,
      description:formDescription,
      senderId:formUserId,
      timestamp:formTimestamp
    };
    if (formTitle.length>0 && formImageURL.length>0 && formDescription.length>0) {
      saveGif(sendFormData);
      document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
    }
    else {
      console.log('Error: All fields must be filled out to save created post.');
    }

  }
});

// CANCEL POST BTN IN CREATE POST FORM
//--------------------------------------
document.addEventListener('click', e => {
  if (e.target.id==='cancelPost') {
    e.preventDefault();
    document.querySelector('.giffygram').dispatchEvent(new CustomEvent('stateChanged'));
  }
}
);
