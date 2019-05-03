var domListItems = document.getElementById("listItems");
var domTotal = document.getElementById("total");
var total = 0;
var paymentDetails;

// store credit card in four variable
var ccName = document.getElementById("CCname");
var ccExpi = document.getElementById("CCExp");
var ccCard = document.getElementById("CCnum");
var ccCVC = document.getElementById("CVC");
var ccSubmit = document.getElementById("ccSubmit");

ccSubmit.addEventListener('click', function(){
    if(verifyCCInput()){
        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            sessionStorage.setItem("paymentDetails", JSON.stringify({
                Cardholder: ccName.value,
                CardNumber: ccCard.value,
                CVC: ccCVC.value,
                Expiration: ccExpi.value
            }));
        } else {
            console.log("No web Storage support")
        }
    }
    else{
        alert("Please give full credit card information");
    }
});

function verifyCCInput(){
    if(ccName.value == "" || ccCVC.value == "" || ccCard.value == "" ||ccExpi.value == ""){
        return false;
    }   
    else{
        return true;
    }
}

function transition(){
    document.getElementById("confirm").style.display = 'none';
    document.getElementById("confirmed").style.display = 'block';
}

function confirm(){
    transition();
    db.collection("users")
    db.collection("users").doc(email).collection("bookedTickets").add({
        items: cartItemsArr
    })
    .then(function() {
        console.log("New items document is written in bookedTickets");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    remove();
    setTimeOut(function(){location.reload();})
}

window.onload = function(){
    paymentDetails = {
        displayItems: []
    };

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            db.collection("users").doc(email).collection("shoppingCart").doc("default").get()
            .then(function(doc){
                if(doc.exists){
                    for(var i = 1; i < doc.data().items.length; i++){
                        total += doc.data().items[i].itemSubtotal;
                        paymentDetails.displayItems.push(doc.data().items[i]);
                        domListItems.innerHTML += `<tr><td>${doc.data().items[i].ShowName}</td> <td>${doc.data().items[i].TierPrice}</td> <td>${doc.data().items[i].Quantity}</td><td><strong>$${doc.data().items[i].itemSubtotal}</strong></td><tr>`;
                    }
                } else{
                    console.log("Cannot get such document");
                } 
                document.getElementById("total").innerHTML= total;
                document.getElementById("totalPrice").innerHTML = total;
                paymentDetails.total = {
                        label: 'Total amount',
                        amount: { currency: 'USD', value : total}
                };
            });
        }
        else{
            domListItems.innerHTML = '<div class="alert alert-danger" role="alert">You are not Signed In</div>';
        }
    });
};