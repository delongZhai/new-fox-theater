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

function updateDate(selectObj){
    reassign_day();
    var val = this.value;  

    if(val == "this_week"){
        show_date.innerHTML += moment().day(day).format("dddd, MMMM Do YYYY");
    }
    if(val == "next_week"){
        show_date.innerHTML += moment().day(day + 7).format("dddd, MMMM Do YYYY");
    }
    if(val == "two_weeks"){
        show_date.innerHTML += moment().day(day + 14).format("dddd, MMMM Do YYYY");
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
                "Time": doc.data().Time
            };
            arrEvent.push(eventObject);
            showList.innerHTML += add_show_to_html(eventObject);
        });
        set_id(btnEvent);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

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

function clearField(input) {
    if(input.value != "")
       input.value="";
};

function load_show(e){
    var showIndex = e.slice(-1);
    selectedEvent = arrEvent[showIndex];
    show_title.innerHTML = arrEvent[showIndex].Title;
    show_describe.innerHTML = arrEvent[showIndex].Description;
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
    return `<div class="col-4">
    <h2>${e.Title}</h2>
    <p>${e.Description}</p>
    <em>Available on ${e.Day} at ${e.Time}</em>
    <button type="button" class="btn btn-primary btn-event" onclick="load_show(this.id); continue_to_details(); ">SHOP</button>
    </div>`;
}

function handle_ui_reverse(){
    // display for show details and go back button disappear
    showDetail.style.display = 'none';
    btnGoBack.style.display = 'none';
    // display for show list appears
    showList.style.display = 'block';

    function removeOptions(selectbox)
    {
        for(var i = selectbox.options.length - 1 ; i >= 0 ; i--)
        {
            selectbox.remove(i);
        }
    }

    removeOptions(show_day);
    document.getElementById("tier1").checked = false;
    document.getElementById("tier2").checked = false;
    document.getElementById("tier3").checked = false;

    document.getElementById('ticketQuan').value = "";
}

function handle_ui_progress(){
    // display for show list disappears
    showList.style.display = 'none';
    // display for show details and go back button appear
    showDetail.style.display = 'block';
    btnGoBack.style.display = 'block';
}

