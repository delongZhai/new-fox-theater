// Initialize Firebase
var config = {
    apiKey: "AIzaSyBenoOCjGP1QYLZPuDYPzXGlbdwlxT1RvQ",
    authDomain: "login-7d2d2.firebaseapp.com",
    databaseURL: "https://login-7d2d2.firebaseio.com",
    projectId: "login-7d2d2",
    storageBucket: "login-7d2d2.appspot.com",
    messagingSenderId: "616333953602"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}