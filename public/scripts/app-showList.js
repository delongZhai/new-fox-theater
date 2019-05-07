var db = firebase.firestore();
var docRef = db.collection('shows');

// Variable for display of UI Element
var showList = document.getElementById("show-list");
var showDetail = document.getElementById("show-detail");
var btnGoBack = document.getElementById("go-back");

var btnEvent = document.getElementsByClassName("btn-event");

// Variable created inside show-detail 
// unused elements

var show_title = document.getElementById("show-title");
var show_describe = document.getElementById("show-describe");
var show_time = document.getElementById("show-time");
var show_day = document.getElementById("show-day");
var numShows = document.getElementsByClassName("col");
var show_date = document.getElementById("show-date");
var tier_chosen = document.getElementById("show-tier-select");
var ticket_quan = document.getElementById("ticketQuan");
var shoppingCart = document.getElementById("toShopCart");
var checkout = document.getElementById("checkout");


var arrEvent = [];
var selected_index, selectedEvent, day;

var week_day = {
    'Sunday': 0, 
    'Monday': 1, 
    'Tuesday': 2, 
    'Wednesday': 3, 
    'Thursday': 4, 
    'Friday': 5, 
    'Saturday': 6
};
var today = new Date();

function reassign_day(){
    switch (selectedEvent.Day) {
        case "Sunday":
          day = 0;
          break;
        case "Monday":
          day = 1;
          break;
        case "Tuesday":
           day = 2;
          break;
        case "Wednesday":
          day = 3;
          break;
        case "Thursday":
          day = 4;
          break;
        case "Friday":
          day = 5;
          break;
        case "Saturday":
          day = 6;
    }
}

function updateDate(sel){
    reassign_day();

    if(sel.options[sel.selectedIndex].value == "this_week"){
        show_date.innerHTML = moment().day(day).format("dddd, MMMM Do YYYY");
    }
    else if(sel.options[sel.selectedIndex].value == "next_week"){
        show_date.innerHTML = moment().day(day + 7).format("dddd, MMMM Do YYYY");
    }
    else if(sel.options[sel.selectedIndex].value == "two_weeks"){
        show_date.innerHTML = moment().day(day + 14).format("dddd, MMMM Do YYYY");
    }
    else if(sel.options[sel.selectedIndex].value == "Please select day:"){
        show_date.innerHTML = "";
    }
    else{
        console.log("something unexpected happen in updateDate()");
    }
}

// Get document from collection "shows"
db.collection("shows").where("onShowList", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // For each display assign them to the variable
            var eventObject = {
                'Title': doc.data().Title,
                'Description': doc.data().Description,
                'Day': doc.data().Day[0],
                "Time": doc.data().Time,
                "imgPath": doc.data().imgPath
            };
            arrEvent.push(eventObject);
            showList.innerHTML += add_show_to_html(eventObject);
        });
        set_id(btnEvent);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

const addShoppingCart = function(){
    if(firebase.auth().currentUser){
        var user_id = return_email();
        var tierPrice = checkSelectedTier();
        var itemSubtotal = tierPrice * ticket_quan.value;
    
        db.collection("users").doc(user_id).collection("shoppingCart").doc("default")
        .update({
            items: firebase.firestore.FieldValue.arrayUnion({
                ShowName: selectedEvent.Title,
                ShowDate: show_date.innerHTML,
                ShowTime: selectedEvent.Time,
                TierPrice: tierPrice,
                Quantity: ticket_quan.value,
                itemSubtotal: itemSubtotal
            })
        })
        .then(function() {
            console.log("New items document is written");
            reset_tier();
            document.getElementById("alert-addCart").style.display = "block";
            setTimeout(function(){ document.getElementById("alert-addCart").style.display = "none"; }, 4000);
            for(var i = 0; i < 10; i++){
                if(sessionStorage.getItem(`cartItem${i}`) === null){
                    sessionStorage.setItem(`cartItem${i}`, JSON.stringify({
                        ShowName: selectedEvent.Title,
                        ShowDate: show_date.innerHTML,
                        ShowTime: selectedEvent.Time,
                        TierPrice: tierPrice,
                        Quantity: ticket_quan.value,
                        itemSubtotal: itemSubtotal  
                    }));
                    break;
                }
                else{
                    continue;
                }
            }
            ticket_quan.value = "";
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
    else{
        document.getElementById("alert-primary").style.display = "block";
        setTimeout(function(){document.getElementById("alert-primary").style.display = "none";}, 4000);
    }
};



function return_email(){
    return firebase.auth().currentUser.email;
}

function checkSelectedTier(){
    var tier_price;
    if(document.getElementById("tier1").checked){
        tier_price = document.getElementById("tier1").value;
    }
    else if(document.getElementById("tier2").checked){
        tier_price = document.getElementById("tier2").value;
    }
    else if(document.getElementById("tier3").checked){
        tier_price = document.getElementById("tier3").value;
    }
    return tier_price;
}


function continue_to_details(){
    handle_ui_progress();
    show_day.innerHTML += flourish_with_date();
}

function get_selected_day_in_number(){
    var dayArr = Object.keys(week_day);
    for(var i =0; i <dayArr.length; i++){
        if(selectedEvent.Day == dayArr[i]){
            return i;
        }
        else{
            continue;
        }
    }
}

function flourish_with_date(){
    // If the day of the show is in future, output this week's <<selectedEvent.Day>>
    // If the day of the show for this week has passed, output next week's <<selectedEvent.Day>>
    var today_day = today.getDay();
    var show_day = get_selected_day_in_number();

    if(today_day > show_day || today_day == 0){
        return `<option value="next_week"> Next ${selectedEvent.Day} </option><option value="two_weeks">${selectedEvent.Day} Two weeks after</option>`;
    }
    else if(today_day <= show_day){
        console.log("day in this week");
        return `<option value="this_week"> This ${selectedEvent.Day} </option><option value="next_week"> Next ${selectedEvent.Day} </option>`;
    }
    else{
        console.log("unforeseen");
    }
}


function load_show(e){
    var showIndex = e.slice(-1);
    selectedEvent = arrEvent[showIndex];
    show_title.innerHTML = arrEvent[showIndex].Title;
    show_describe.innerHTML = arrEvent[showIndex].Description;
    document.getElementById("get-path").src = arrEvent[showIndex].imgPath;
    show_time.innerHTML = "You selected" + " at " + arrEvent[showIndex].Time;
    selected_index = showIndex;
}

function set_id(e){
    for(var i = 0; i < e.length; i++){
        var idName = "event" + String(i);
        e[i].setAttribute("id", idName);
    }
}

function add_show_to_html(e){
    // TODO: return HTML code for every show that has a value of true on onShowList
    return `<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
    <img class="show1" src="${e.imgPath}"  width="350px" height="350px">
    <div class="overlay">
    <p class="text">${e.Description}</p>
    </div>
    <h4 class="title">${e.Title}</h4>
    <p>Available on ${e.Day}</p>
    <p>AT ${e.Time}</p>
    <button type="button" class="btn btn-primary btn-event buy-btn" onclick="load_show(this.id); continue_to_details(); ">SHOP</button>
    </div>`;
}

function handle_ui_reverse(){
    // display for show details and go back button disappear
    showDetail.style.display = 'none';
    btnGoBack.style.display = 'none';
    // display for show list appears
    showList.style.display = 'block';
    document.getElementById("alert-primary").style.display = "none";
    document.getElementById("alert-addCart").style.display = "none";


    removeOptions(show_day);
    reset_tier();

    document.getElementById('ticketQuan').value = "";
    show_date.innerHTML = "";
}

function removeOptions(selectbox){
    for(var i = selectbox.options.length - 1 ; i >= 1 ; i--)
    {
        selectbox.remove(i);
    }
}

function reset_tier(){
    document.getElementById("tier1").checked = false;
    document.getElementById("tier2").checked = false;
    document.getElementById("tier3").checked = false;
}

function handle_ui_progress(){
    // display for show list disappears
    showList.style.display = 'none';
    // display for show details and go back button appear
    showDetail.style.display = 'block';
    btnGoBack.style.display = 'block';
}






