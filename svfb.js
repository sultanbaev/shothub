var SIGN_IN_TEMPLATE = '<center><div class="container"><div id="signIn" class="four columns signIn"><div>E-mail</div><input class="u-full-width" type="email" id="email"><div>Password</div><input class="u-full-width" type="password" id="password"><br><button id="btnSignIn" class="button button-primary u-full-width">Login</button></div></div></center>';
var NO_LOGIN_HEAD = '<center><hr><a id="clickonlogin"><font color="#F8F8F0">login</font></a><hr><br></center>';
var LOGIN_HEAD = '<center><hr><font color="#AE81FF">stream</font> | <font color="#F92672">favorites</font> | <font color="#A6E22E">add</font> | <a id="clickonlogout"><font color="#75715E">logout</font></a><hr><br></center>';

// got it!
// add to favorites (N)

// inappropriate
// make a complaint (M)

// show translation (X comments)

// imdb | kinopoisk

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function () {
    
    // ---------------------------------------------------------------------------------- Initialize Firebase
    const config = {
    apiKey: "AIzaSyAcnyNPASW9asiPP8HyE41dmUDE9lT_Mww",
    authDomain: "shothub-e534f.firebaseapp.com",
    databaseURL: "https://shothub-e534f.firebaseio.com",
    storageBucket: "shothub-e534f.appspot.com",
    messagingSenderId: "336312298206"
    };
    firebase.initializeApp(config);

    // --------------------------------------------------------------------------------- Main html containers
    var container = document.createElement("div");
    var mainForm = document.getElementById('mainBody');
    var div1 = document.getElementById('div1');
    var loginHead = document.createElement("div");
    

    firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                // ------------------------------------------------------------------------------------ Login
                container.remove();
                loginHead.remove();
                loginHead.innerHTML = LOGIN_HEAD;
                div1.appendChild(loginHead);
                var btnLogOut = document.getElementById('clickonlogout');
                    console.log(mainForm);
                    // Listener for Auth (sessions)
                    btnLogOut.addEventListener('click', e => {
                        firebase.auth().signOut();
                    });
            } else {
                                
                // -------------------------------------------------------------------------------- No login
                loginHead.remove();
                loginHead.innerHTML = NO_LOGIN_HEAD;
                div1.appendChild(loginHead);
                var btnLogIn = document.getElementById('clickonlogin');
                btnLogIn.addEventListener('click', e => {
                        signIn(container,mainForm);
                        loginHead.remove();
                        });
                   
            }
    });

// ----------------------------------------------------------------------------------------- Load img from gs
var storage = firebase.storage();
var storageRef = storage.ref();
var shotRef = storageRef.child('001.jpg');

  shotRef.getDownloadURL().then(function(url)                             {
    document.querySelector('img').src = url;

  }).catch(function(error) {
    console.error(error);
  });

}());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sign In Function
function signIn(container,mainForm) {
    // Get Elements
    container.remove();
    container.innerHTML = SIGN_IN_TEMPLATE;
    mainForm.appendChild(container);

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const btnSignIn = document.getElementById('btnSignIn');

    // Add Event Listener
    btnSignIn.addEventListener('click', e =>{
        // Get email & pass
        const emailAddress = emailInput.value;
        const password = passwordInput.value;
        const auth = firebase.auth();

        // Sig In
        const promise = auth.signInWithEmailAndPassword(emailAddress, password);
        promise.catch(e => console.log(e.message));

    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initializes FriendlyChat.
function FriendlyChat() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');
  this.submitImageButton = document.getElementById('submitImage');
  this.imageForm = document.getElementById('image-form');
  this.mediaCapture = document.getElementById('mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  this.messageInput.addEventListener('change', buttonTogglingHandler);

  // Events for image upload.
  this.submitImageButton.addEventListener('click', function() {
    this.mediaCapture.click();
  }.bind(this));
  this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
FriendlyChat.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Saves a new message on the Firebase DB.
FriendlyChat.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var currentUser = this.auth.currentUser;
    // Add a new message entry to the Firebase Database.
    this.messagesRef.push({
      name: currentUser.displayName,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function() {
      // Clear message text field and SEND button state.
      FriendlyChat.resetMaterialTextfield(this.messageInput);
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

// Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
FriendlyChat.prototype.setImageUrl = function(imageUri, imgElement) {
  // If the image is a Firebase Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
FriendlyChat.prototype.saveImageMessage = function(event) {
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }

  // Check if the user is signed-in
  if (this.checkSignedInWithMessage()) {

    // We add a message with a loading icon that will get updated with the shared image.
    var currentUser = this.auth.currentUser;
    this.messagesRef.push({
      name: currentUser.displayName,
      imageUrl: FriendlyChat.LOADING_IMAGE_URL,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function(data) {

      // Upload the image to Firebase Storage.
      var uploadTask = this.storage.ref(currentUser.uid + '/' + Date.now() + '/' + file.name)
          .put(file, {'contentType': file.type});
      // Listen for upload completion.
      uploadTask.on('state_changed', null, function(error) {
        console.error('There was an error uploading a file to Firebase Storage:', error);
      }, function() {

        // Get the file's Storage URI and update the chat message placeholder.
        var filePath = uploadTask.snapshot.metadata.fullPath;
        data.update({imageUrl: this.storage.ref(filePath).toString()});
      }.bind(this));
    }.bind(this));
  }
};