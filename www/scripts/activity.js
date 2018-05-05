


// page is now ready, initialize the calendar...
$('#calendar').fullCalendar({
    // put your options and callbacks here
    header: {
        left: 'prev, next today',
        center: 'title',
        right: 'basicDay,month'
    },
    selectable: true,
    selectHelper: true,
    editable: true,
    eventLimit: true,
    dayClick: function (date) {
        call(date);
    }

});

$('#calendar').fullCalendar('changeView', 'basicDay');

var moment = $('#calendar').fullCalendar('getDate');
var sub = moment.format().substr(0, 10);
console.log(sub);

$('#calendar .fc-view-container .fc-basicDay-view table tbody').html('');

$('#calendar button').click(function () {
    change();
});

function change() {
    var moment = $('#calendar').fullCalendar('getDate');
    sub = moment.format().substr(0, 10);
    console.log(sub);

    $('#calendar .fc-view-container .fc-basicDay-view table tbody').html('');

    if ($('#calendar .fc-view-container div').attr('class') == "fc-view fc-month-view fc-basic-view") {
        $('#exercise').addClass('hide');
        
    }
    else {
        $('#exercise').removeClass('hide');
        
        read();
    }

}


function call(date) {
    $('#calendar').fullCalendar('changeView', 'basicDay');
    $('#calendar').fullCalendar('gotoDate', date);
    change();
}

$('td[data-date="2018-01-28"]').addClass("high");



var firedata = firebase.database(); /* global firebase*/

var exer1 = document.getElementById("exer1");
var exer2 = document.getElementById("exer2");
var totalcal1 = document.getElementById("totalcal1");
var totalcal2 = document.getElementById("totalcal2");


$('.ename').on("click", function (event) {
    event.preventDefault();
    $(this).parent().find('.edetails').toggleClass('hide');
    $(this).toggleClass("changecolor");
    if ($(this).find("img").attr('src') == "images/down.png") {
        $(this).find("img").attr('src', 'images/up.png');
    }
    else {
        $(this).find("img").attr('src', 'images/down.png');
    }
    read();
});

function read() {

    var auth = firebase.auth();
    var cal;
    var z = 0;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var k = 0;
            if (user != null) {
                firedata.ref('users/' + user.uid + "/foodlog/" + sub).once('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {

                        var childKey = childSnapshot.key;
                        var food = childSnapshot.val().Food;
                        var calo = childSnapshot.val().Cal;
                        var mod = calo.substring(0, calo.length - 1);
                        
                        var ch = childKey;

                        z += Number(mod);

                        k++;


                    });

                    z = z.toFixed(2);
                    firedata.ref('users/' + user.uid).once('value', function (snapshot) {
                        var calburn;
                        var walkTime;
                        var runTime;
                        var distance;
                        var m, n;
                        cal = snapshot.val().Calcount;
                        weight = snapshot.val().Weight;
                        console.log(cal);

                        if (z > cal) {
                            calburn = (z - cal).toFixed(2);
                        }
                        else {
                            calburn = 0;
                        }
                        totalcal1.innerHTML = "<p>Required Calories<span class='highlight'>" + cal + "g</span></p><p>Calories Consumed<span class='highlight'>" + z + "g</span></p><p>Calories to Burn<span class='highlight'>" + calburn + "g</span></p>";

                        walkTime = Math.round((calburn / (4.0877 * weight)) * 60);
                        runTime = Math.round((calburn / (23.75 * weight)) * 60);
                        distance = Math.round(calburn / (0.95 * weight));

                        console.log(walkTime + " " + runTime);

                        if (walkTime < 60)
                            m = walkTime + 'min';
                        else
                            m = Math.floor(walkTime / 60) + 'hr ' + walkTime % 60 + 'min';

                        if (runTime < 60)
                            n = runTime + 'min';
                        else
                            n = Math.floor(runTime / 60) + 'hr' + runTime % 60 + 'min';

                        exer1.innerHTML = "<h2>Exercises</h2><div id='note' class='note hide'></div><div class='data'><div class='same'><p>Walking</p><p>" + m + "</p></div><div class='same det'><p>Walking Speed</p><p>1 Km/hr</p></div></div><div class='data'><div class='same'><p>Running</p><p>" + n + "</p></div><div class='same det'><p>Running Speed</p><p>8 Km/hr</p></div><div class='same det'><p>Distance Run</p><p>" + distance + " km</p></div></div>";

                        if (calburn == 0) {
                            $('#exer1 .note').removeClass('hide');
                            $('#exer1 .note').html("You need to eat and add more food to your log.");
                            if (sub >= today) {
                                $('#exer1 .note').removeClass('hide');
                            }
                            else {
                                $('#exer1 .note').addClass('hide');
                            }
                        }
                        else {
                            $('#exer1 .note').addClass('hide');
                        }
                    });

                    firedata.ref('users/' + user.uid).once('value', function (snapshot) {
                        var calburn;
                        var walkTime;
                        var runTime;
                        var distance;
                        var m, n;
                        cal = snapshot.val().Calcount;
                        weight = snapshot.val().Weight;
                        console.log(cal);

                        if (z > cal) {
                            calburn = (z - cal + 1100).toFixed(2);
                        }
                        else {
                            if (z > (cal - 1100)) {
                                calburn = (z - (cal - 1100)).toFixed(2)
                            }
                            else {
                                calburn = 0;
                            }
                            
                        }

                        totalcal2.innerHTML = "<p>Required Calories<span class='highlight'>" + cal + "g</span></p><p>Calories Consumed<span class='highlight'>" + z + "g</span></p><p>Calories to Burn<span class='highlight'>" + calburn + "g</span></p>";

                        walkTime = Math.round((calburn / (4.0877 * weight)) * 60);
                        runTime = Math.round((calburn / (23.75 * weight)) * 60);
                        distance = Math.round(calburn / (0.95 * weight));

                        console.log(walkTime + " " + runTime);

                        if (walkTime < 60)
                            m = walkTime + 'min';
                        else
                            m = Math.floor(walkTime / 60) + 'hr ' + walkTime % 60 + 'min';

                        if (runTime < 60)
                            n = runTime + 'min';
                        else
                            n = Math.floor(runTime / 60) + 'hr' + runTime % 60 + 'min';

                        exer2.innerHTML = "<h2>Exercises</h2><div id='note' class='note hide'></div><div class='data'><div class='same'><p>Walking</p><p>" + m + "</p></div><div class='same det'><p>Walking Speed</p><p>1 Km/hr</p></div></div><div class='data'><div class='same'><p>Running</p><p>" + n + "</p></div><div class='same det'><p>Running Speed</p><p>8 Km/hr</p></div><div class='same det'><p>Distance Run</p><p>" + distance + " km</p></div></div>";

                        if (calburn == 0) {
                            $('#exer2 .note').removeClass('hide');
                            $('#exer2 .note').html("You need to eat and add more food to your log.");
                            if (sub >= today) {
                                $('#exer2 .note').removeClass('hide');
                            }
                            else {
                                $('#exer2 .note').addClass('hide');
                            }
                        }
                        else {
                            $('#exer2 .note').addClass('hide');
                        }
                    });

                });


            }

        } else {
            // No user is signed in.
            document.getElementById("message").innerHTML = "";
        }
    });



}
