window.addEventListener('load', function(){
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var uiConfig = {
        'signInSuccessUrl': '/',
        'callbacks': {
            'signInSuccess': function(user, credential, redirectUrl) {
            if (window.opener) {
                // The widget has been opened in a popup, so close the window
                // and return false to not redirect the opener.
                window.close();
                return false;
            } else {
                // The widget has been used in redirect mode, so we redirect to the signInSuccessUrl.
                return true;
            }
            }
        },
        'signInOptions': [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // Whether the display name should be displayed in the Sign Up page.
            requireDisplayName: true
        }
        ],
        // Terms of service url.
        'tosUrl': '<your-tos-url>',
        // Privacy policy url.
        'privacyPolicyUrl': '<your-privacy-policy-url>'
    };

    ui.start('#firebaseui-auth-container', uiConfig);

    //Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            window.location = 'index.html'; //After successful login, user will be redirected to home.html
        }
    });
});

