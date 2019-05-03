var db = firebase.firestore();

// Creating variable
var show_username = document.getElementById('profile-user-name');
var user, name, email, photoUrl, uid, emailVerified;
var itemArray = [];
var date = new Date();

// CONST variable: get signin and signout button into variable
const btnSignIn = document.getElementById('btn-signin');
const btnSignOut = document.getElementById('btn-signout');
const auth = firebase.auth();

// dom variable for booked_shows, and shopping_cart
var shopping_cart = document.getElementById("shoppingCart");
var booked_show = document.getElementById("bookedShow");

var cartItemsArr = [];

// add event listener
btnSignOut.addEventListener("click", function(){
    firebase.auth().signOut().then(function() {
        console.log("Sign-out successful.");
      }).catch(function(error) {
        console.log("cannot sign out");
      });
})

function reload(){
    location.reload();
}

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

        var dateString = String(date.getMonth()+1)+"/"+String(date.getDate())+"/"+String(date.getFullYear());
        if(isNewUser(user)){
            db.collection("users").doc(user.email).set({
                Email: user.email,
                Name: user.displayName,
                EmailVerified: user.emailVerified,
                photo: user.photoURL,
                dateAdded: dateString
            }, {merge:true})
                .then(function() {
                    console.log("User Document has been create");
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                }); 
            create_initial_shop_doc();
        }
        else{
            console.log("The user is not new");
            db.collection("users").doc(email).collection("shoppingCart").doc("default").get()
            .then(function(doc){
                if(doc.data().items.length > 1){
                    for(var i = 1; i < doc.data().items.length; i++){
                        cartItemsArr.push(doc.data().items[i]);
                    }
                }
            });
        }
        displayBookedTicket();
    }
}

function create_initial_shop_doc(){
    var shopRef = db.collection("users").doc(user.email).collection("shoppingCart").doc("default");
    shopRef.get().then(function(doc){
        if(!doc.exists){
            shopRef.set({
                items: [0]
            }, { merge: true }).then(function() {
                console.log("Shopping Cart Document has been create");
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            }); 
        }
    });
}

function displayShoppingCart(){
    db.collection("users").doc(email).collection("shoppingCart").doc("default").get()
    .then(function(doc){
        if (doc.exists) {
            var showClass = document.getElementsByClassName("shows").length;
            if(showClass === (doc.data().items.length - 1)){
                console.log("No Problem!");
            }
            else if((doc.data().items.length - 1 - showClass) > 1){
                // There are more document that's not added
                for(var i = 1; i < doc.data().items.length; i++){
                    add_items_ui(doc, i);
                }
            }
            else if((doc.data().items.length - 1 - showClass) == 1){
                shopping_cart.innerHTML = "";
                for(var i = 1; i <= doc.data().items.length; i++){
                    add_items_ui(doc, i);
                }
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function displayBookedTicket(){
    db.collection("users").doc(email).collection("bookedTickets").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            booked_show.innerHTML += `<div class="orders">
            <p>Shows for Order Number <br> ${doc.id}</p></div>`;
            for(var i = 0; i < doc.data().items.length; i++){
                booked_show.innerHTML += `<div class="shows"><h5>Title: ${doc.data().items[i].ShowName}</h5>
                <p>${doc.data().items[i].ShowDate} at ${doc.data().items[i].ShowTime}</p>
                <p>You bought <strong>${doc.data().items[i].Quantity}</strong> tickets </p></div>`;
            }
        });
    });
}

function add_items_ui(document, index){
    shopping_cart.innerHTML += `<div class="shows" id=${"show" + String(index)}>
    <h5>${document.data().items[index].ShowName}</h5>
    <p>${document.data().items[index].ShowDate} at ${document.data().items[index].ShowTime}</p>
    <p>${document.data().items[index].Quantity} with a price of $${document.data().items[index].TierPrice}</p>
    <p><strong>Subtotal:</strong> $${document.data().items[index].itemSubtotal}</p></div>`;
}

// Having problems with remove;
function remove(){
    db.collection("users").doc(email).collection("shoppingCart").doc("default").delete().then(function() {
        console.log("Document successfully deleted!");
        shopping_cart.innerHTML = "";
        create_initial_shop_doc();
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    // create the shopping cart default docment again
    create_initial_shop_doc();
}

function isNewUser(u){
    if(u.metadata.creationTime === u.metadata.lastSignInTime){
        return true;
    }
    else{
        return false;
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

function return_email(){
    return firebase.auth().currentUser.email;
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