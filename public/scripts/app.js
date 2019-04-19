// Creating variable
var show_username = document.getElementById('profile-user-name');
var user, name, email, photoUrl, uid, emailVerified;


// CONST variable: get signin and signout button into variable
const btnSignIn = document.getElementById('btn-signin');
const btnSignOut = document.getElementById('btn-signout');
const auth = firebase.auth();

// add event listener
btnSignOut.addEventListener("click", function(){
    firebase.auth().signOut().then(function() {
        console.log("Sign-out successful.");
      }).catch(function(error) {
        console.log("cannot sign out");
      });
})

//Handle Account Status
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        btnSignIn.style.display = "none";
        document.getElementById('btn-profile').style.visibility = "visible";
        user = firebase.auth().currentUser;
        getCurrentUser(user);
        updateName(name);
    }
    else{
        console.log("not logged in");
        btnSignIn.style.display = "block";
        document.getElementById('btn-profile').style.visibility = "hidden";
    }
});

// functions
function handle_signin(){
    window.open("./auth.html",
    "_blank",
    "width=500,height=400");
}

// The user's ID, unique to the Firebase project. Do NOT use
// this value to authenticate with your backend server, if
// you have one. Use User.getToken() instead.
function getCurrentUser(user){
    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  
    }
    else{
        console.log('There is no current user');
    }
}

function updateName(name){
    if(name == "null"){
        var user_name = prompt("How shall we address you?");
        // Change the username in btn-group class
        var conca_user_name = "<strong>" + user_name + "</strong>";
        show_username.innerHTML = conca_user_name;
        // update name in firebase auth
        user.updateProfile({
            displayName: user_name,
        }).then(function() {
            // Update successful.
            console.log("update successful");
        }).catch(function(error) {
            console.log("An error happened.");
        });
    }
    else{
        show_username.innerHTML = "<strong>"+ firebase.auth().currentUser.displayName + "</strong>";
    }
}



// Todo: send a verification email, otherwise user name is not identified
// for sending an email, we will use
// var actionCodeSettings = {
//   url: 'https://login-7d2d2.firebaseapp.com/'
// };
// firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
//     .then(function() {
//       // Verification email sent.
//     })
//     .catch(function(error) {
//       // Error occurred. Inspect error.code.
//     });