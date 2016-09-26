var SIGN_IN_TEMPLATE = '<center><div class="container"><div id="signIn" class="four columns signIn"><div>E-mail</div><input class="u-full-width" type="email" id="email"><div>Password</div><input class="u-full-width" type="password" id="password"><br><button id="btnSignIn" class="button button-primary u-full-width">Login</button></div></div></center>';
var NO_LOGIN_HEAD = '<center><hr><a id="clickonlogin"><font color="#F8F8F0">login</font></a><hr><br></center>';
var LOGIN_HEAD = '<center><hr><a id="clickonstream"><font color="#AE81FF">stream</font></a> | <a id="clickonaddnew"><font color="#A6E22E">add</font></a> | <a id="clickonlogout"><font color="#75715E">logout</font></a><hr><br></center>';

//var UPLOAD_IMG = '<center><input type="file" value="upload" id="fileButton" accept="image/x-png, image/jpeg" /> <progress value="0" max="100" id="uploader">0%</progress></center>';
var UPLOAD_IMG = '<center><input type="file" value="upload" id="fileButton" accept="image/x-png, image/jpeg" /> <progress value="0" max="100" id="uploader">0%</progress></center><br><button id="canceladd" class="button button-primary u-full-width">Cancel</button>';

var MAIN_INFO = 'main info is here';

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
    var loginHead = document.createElement("div");

    var mainForm = document.getElementById('mainBody');
    var headmenu = document.getElementById('headmenu');
    
    

    firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {

                // ------------------------------------------------------------------- Logout button is hit

                container.remove();
                loginHead.remove();
                loginHead.innerHTML = LOGIN_HEAD;
                headmenu.appendChild(loginHead);
                var btnLogOut = document.getElementById('clickonlogout');
                    console.log(mainForm);

                    btnLogOut.addEventListener('click', e => {
                        firebase.auth().signOut();
                        //mainForm.remove();
                    });

                    // --------------------------------------------------------------- Add new button is hit

                    var btnAddNew = document.getElementById('clickonaddnew');
                    btnAddNew.addEventListener('click', e => {
                        //loginHead.remove();
                        //loginHead.innerHTML = UPLOAD_IMG;
                        mainForm.innerHTML = UPLOAD_IMG;
                        //mainForm.appendChild(loginHead);
                        
                        // ---------------------------------------------- Cancel button on Add screen is hit 

                        var btnCancelAdd = document.getElementById('canceladd');
                        btnCancelAdd.addEventListener('click', e =>{
                           mainForm.innerHTML = MAIN_INFO; 
                        });
                        

                        // ------------------------------------------------------------ Stream button is hit

                        var btnStream = document.getElementById('clickonstream');
                        btnStream.addEventListener('click', e =>{
                           mainForm.innerHTML = MAIN_INFO; 
                        });
                        
                

// ----------------------------------------------------------------------------------------- Load img to gs

var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');

fileButton.addEventListener('change', function(e){
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref('shots/' + file.name);
    var task = storageRef.put(file);
    task.on('state_changed',

        function progress(snapshot){
            var percentage = (snapshot.bytesTransferred /
            snapshot.totalBytes) * 100;
            uploader.value = percentage;

        },

        function error(err){
            alert("Error!");

        },

        function complete(){
            alert("Done!");

        }

        )
});

});

            } else {
                                
                // ---------------------------------------------------------------------- Login button is hit

                //loginHead.remove();
                loginHead.innerHTML = NO_LOGIN_HEAD;
                //mainForm.innerHTML = NO_LOGIN_HEAD;
                mainForm.innerHTML = MAIN_INFO;
                headmenu.appendChild(loginHead);
                var btnLogIn = document.getElementById('clickonlogin');
                btnLogIn.addEventListener('click', e => {
                        mainForm.innerHTML = SIGN_IN_TEMPLATE;
                        signIn(container,mainForm);
                        //loginHead.remove(); 
                        //container.remove();
                        //mainForm.remove();
                        //mainForm.innerHTML = SIGN_IN_TEMPLATE;
                        });
                   
            }

            mainForm.innerHTML = MAIN_INFO;
    });

// ----------------------------------------------------------------------------------------- Load img from gs

/*var storage = firebase.storage();
var storageRef = storage.ref();
var shotRef = storageRef.child('001.jpg');

  shotRef.getDownloadURL().then(function(url) {
    document.querySelector('img').src = url;

  }).catch(function(error) {
    console.error(error);
  });*/

}());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ----------------------------------------------------------------------------------------- Sign In Function

function signIn(container,mainForm) {

    //container.remove();
    //container.innerHTML = SIGN_IN_TEMPLATE;
    mainForm.appendChild(container);

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const btnSignIn = document.getElementById('btnSignIn');

    btnSignIn.addEventListener('click', e =>{

        const emailAddress = emailInput.value;
        const password = passwordInput.value;
        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(emailAddress, password);
        promise.catch(e => console.log(e.message));

    });

    //mainForm.innerHTML = MAIN_INFO;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////