var domListItems = document.getElementById("listItems");
var domTotal = document.getElementById("total");
var total = 0;

window.onload = function(){
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            db.collection("users").doc(email).collection("shoppingCart").doc("default").get()
            .then(function(doc){
                if(doc.exists){
                    for(var i = 1; i < doc.data().items.length; i++){
                        total += doc.data().items[i].itemSubtotal;
                        domListItems.innerHTML += `<li class="items"><div><strong>Show Title: </strong><i class="fas fa-trash"></i>${doc.data().items[i].ShowName}</div> <div><strong>Unit Price: </strong>${doc.data().items[i].TierPrice}</div><div><strong>Quantity: </strong>${doc.data().items[i].Quantity}</div> <div><strong>Subtotal is:</strong><h5>$${doc.data().items[i].itemSubtotal}</h5></div></li>`;
                    }
                } else{
                    console.log("Cannot get such document");
                } 
                document.getElementById("total").innerHTML= total;
            });
        }
        else{
            domListItems.innerHTML = '<div class="alert alert-danger" role="alert">You are not Signed In</div>';
        }
    });
};









