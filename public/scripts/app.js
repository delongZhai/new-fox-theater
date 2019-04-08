// var initApp = function(){
//     // The start method will wait until the DOM is loaded.
//     var ui = new firebaseui.auth.AuthUI(firebase.auth());

//     // Event Listeners
//     ui.start('#firebaseui-auth-container', get_authConfig());
//     // ui.disableAutoSignIn();

    
    
//     function get_authConfig(){
//         return {
//             callbacks: {
//                 // signInFailure callback must be provided to handle merge conflicts which
//                 // occur when an existing credential is linked to an anonymous user.
//                 signInFailure: function(error) {
//                     // For merge conflicts, the error.code will be
//                     // 'firebaseui/anonymous-upgrade-merge-conflict'.
//                     if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
//                     return Promise.resolve();
//                     }
//                     // The credential the user tried to sign in with.
//                     var cred = error.credential;
//                     // Copy data from anonymous user to permanent user and delete anonymous
//                     // user.
//                     // ...
//                     // Finish sign-in after data is copied.
//                     return firebase.auth().signInWithCredential(cred);
//                 },
//                 signInSuccessWithAuthResult: function(authResult, redirectUrl) {
//                     var user = authResult.user;
//                     var credential = authResult.credential;
//                     var isNewUser = authResult.additionalUserInfo.isNewUser;
//                     var providerId = authResult.additionalUserInfo.providerId;
//                     var operationType = authResult.operationType;
//                     // Do something with the returned AuthResult.
//                     // User successfully signed in.
//                     // Return type determines whether we continue the redirect automatically
//                     // or whether we leave that to developer to handle.
//                     return false;
//                 },
//                 uiShown: function() {
//                     // The widget is rendered.
//                     // Hide the loader.
//                     document.getElementById('loader').style.display = 'none';
//                 }
//             },
//             // Whether to upgrade anonymous users should be explicitly provided.
//             // The user must already be signed in anonymously before FirebaseUI is
//             // rendered.
//             autoUpgradeAnonymousUsers: true,
//             // Query parameter name for mode.
//             queryParameterForWidgetMode: 'mode',
//             // Query parameter name for sign in success url.
//             queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
//             // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//             signInFlow: 'popup',
//             signInOptions: [
//               // Leave the lines as is for the providers you want to offer your users.
//             //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//             //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//             //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//             //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
//             {
//                 provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
//                 // Whether the display name should be displayed in the Sign Up page.
//                 requireDisplayName: true
//             }
//             //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
//             ],
//             // Terms of service url.
//             tosUrl: '<your-tos-url>',
//             // Privacy policy url.
//             privacyPolicyUrl: '<your-privacy-policy-url>'
//         };
//     }
    
// });

// /**
//  * @return {string} The URL of the FirebaseUI standalone widget.
//  */
// function getWidgetUrl() {
//     return '/widget#recaptcha=' + getRecaptchaMode() + '&emailSignInMethod=' +
//         getEmailSignInMethod();
//   }

// /**
//  * Redirects to the FirebaseUI widget.
//  */
// var signInWithRedirect = function() {
// window.location.assign(getWidgetUrl());
// };

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
// firebase.auth().onAuthStateChanged(function(user) {
//     document.getElementById('loading').style.display = 'none';
//     document.getElementById('loaded').style.display = 'block';
//     user ? handleSignedInUser(user) : handleSignedOutUser();
// });

var btnProfile = document.getElementById('person');
var go_modal = document.getElementsByClassName('modal');
var go_modalContent = document.getElementsByClassName('modal-content');

btnProfile.addEventListener('click', function(){
    go_modal.style.display = "block";
    go_modalContent.style.display = "block";
});
