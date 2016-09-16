var SIGN_IN_TEMPLATE = '<center><div class="container"><div id="signIn" class="four columns signIn"><div>E-mail</div><input class="u-full-width" type="email" id="email"><div>Password</div><input class="u-full-width" type="password" id="password"><br><button id="btnSignIn" class="button button-primary u-full-width">Login</button></div></div></center>';

(function () {
    
    // Initialize Firebase
    const config = {
    apiKey: "AIzaSyAcnyNPASW9asiPP8HyE41dmUDE9lT_Mww",
    authDomain: "shothub-e534f.firebaseapp.com",
    databaseURL: "https://shothub-e534f.firebaseio.com",
    storageBucket: "shothub-e534f.appspot.com",
    messagingSenderId: "336312298206"
    };
    firebase.initializeApp(config);

    // Main html containers
    var container = document.createElement("div");
    var mainForm = document.getElementById('mainBody');
    var btnLogOut = document.getElementById('clickonlogout');
    console.log(mainForm);
    // Listener for Auth (sessions)
    btnLogOut.addEventListener('click', e => {
        firebase.auth().signOut();
    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                console.log('blh'); /////////////////
            } else {
                signIn(container,mainForm);   
            }
    });


    
}());

<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

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

        // Add Listener for Auth
        /*firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                leanManage(container,mainForm);
            } else {
                // Not Loggeed In !
                console.log('not logged in');
            }
        });*/

    });
}



    // Log Out

<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->