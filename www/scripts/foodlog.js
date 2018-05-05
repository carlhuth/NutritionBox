


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
        $('#reader').addClass('hide');
        $('#myProgress').addClass('hide');
        $('#totalcal').addClass('hide');
        $('#addition').addClass('hide');
        
    }
    else {
        $('#reader').removeClass('hide');
        $('#myProgress').removeClass('hide');
        $('#totalcal').removeClass('hide');
        $('#addition').removeClass('hide');
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
var cal;
var reader = document.getElementById("reader");
var totalcal = document.getElementById("totalcal");

read();

function read() {

    var auth = firebase.auth();
    var y = '';
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
                        var cal = childSnapshot.val().Cal;
                        var mod = cal.substring(0, cal.length - 1);
                        
                        var ch = childKey;
                        
                        y += '<div class="foodlist"><div class="hide" id="ch">'+ch+'</div><div class="foodlink"><a href="#" id="rsearch" class="rsearch">' + food + '</a><a href="#" id="delete" class="icon-cross delbtn"></a></div><p>Calories: ' + cal +'</p></div>';
                        z += Number(mod);
                        
                        k++;

                                                
                    });

                    if (k > 0) {
                        reader.innerHTML = y;
                    }
                    else {
                        if (sub >= today) {
                            reader.innerHTML = '<div id="note" class="note">Food Log is empty.<br/>Add food by searching below.</div >'
                        }
                        else {
                            reader.innerHTML = '<div id="note" class="note">Food Log is empty.</div >'
                        }
                        
                    }

                    if (sub >= today) {
                        console.log("yes");
                        $("#addition").removeClass("hide");
                        $(".delbtn").removeClass("hide");
                    }
                    else {
                        console.log("no");
                        $("#addition").addClass("hide");
                        $(".delbtn").addClass("hide");
                    }
                    
                    firedata.ref('users/' + user.uid).once('value', function (snapshot) {

                        cal = snapshot.val().Calcount;

                    });

                    totalcal.innerHTML = "<p>Required Calories to maintain weight<span class='highlight'>" + cal +"g</span></p><p>Total Calories consumed<span class='highlight'>" + z.toFixed(2) + "g</span></h3>";

                    calculate();
                    
                    $(".delbtn").click(function (event) {
                        event.preventDefault();

                        var p = $(this).parent();
                        var par = p.parent().find("#ch").html();

                        console.log(par)

                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                // User is signed in.

                                if (user != null) {
                                    firebase.database().ref('users/' + user.uid + "/foodlog/" + sub + '/' + par).remove();
                                }
                                read();
                                

                            } else {
                                // No user is signed in.
                                document.getElementById("message").innerHTML = "";
                            }
                        });
                    });

                    

                    function calculate() {
                        var c = Number(cal);
                        var elem = document.getElementById("myBar");
                        var over = document.getElementById("over");
                        var prog = document.getElementById("myProgress");
                        var per = ((z / c) * 100).toFixed(0);
                        console.log(per);
                        var width = per;

                        if (width >= 100) {
                            var w = (width - 100);
                            var x = (100 - w);
                            over.style.width = w + '%';
                            
                            elem.style.width = x + '%';
                            elem.innerHTML = width + '%';
                        } else {
                            elem.style.width = width + '%';
                            elem.innerHTML = width + '%';
                            over.style.width = '0%';
                            over.innerHTML = '';
                        }
                    }

                    
                });

            
            }

        } else {
            // No user is signed in.
            document.getElementById("message").innerHTML = "";
        }
    });



}






// API Fetching =====================================================


jQuery(document).ready(function ($) {

    var firedata = firebase.database(); /* global firebase*/

    display();

    function display() {

        $("#btn").click(function (event) {
            event.preventDefault();
            let input = document.getElementById('input_item');
            let x = input.value;
            console.log(x);

            product(x);
        });

        $('#input_item').keypress(function (e) {
            if (e.which == 13) {
                $('#btn').click();
            }
        });



    }



    function product(x) {
        let url = "https://api.nutritionix.com/v1_1/search/" + x + "?results=0:20&fields=*&appId=fea379e3&appKey=88b5764074c5dfed8c5572cb118f48f7";
        sendRequest(url);
    }


    function sendRequest(url) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let data1 = JSON.parse(xmlhttp.responseText);

                let fact = {};
                let y = '';
                let output = document.getElementById('output');

                var n = 3;

                if (data1.total_hits == 0) {
                    alert("Searched item does not exist.");
                }
                else if (data1.total_hits < 3) {
                    n = data1.total_hits;
                }
                else {
                    n = 3;
                }



                for (let i = 0; i < n; i++) {

                    var a = data1.hits[i].fields.item_name;
                    var b = Math.round(data1.hits[i].fields.nf_calories * 100) / 100;
                    var c = Math.round(data1.hits[i].fields.nf_total_fat * 100) / 100;
                    var d = Math.round(data1.hits[i].fields.nf_cholesterol * 100) / 100;
                    var e = Math.round(data1.hits[i].fields.nf_total_carbohydrate * 100) / 100;
                    var f = Math.round(data1.hits[i].fields.nf_dietary_fiber * 100) / 100;
                    var g = Math.round(data1.hits[i].fields.nf_sugars * 100) / 100;
                    var h = Math.round(data1.hits[i].fields.nf_protein * 100) / 100;

                    fact.name = data1.hits[i].fields.item_name;
                    y += '<div id="food' + i + '" class="food"><div class="prodlink"><a href="#" id ="rsearch' + i + '" class = "rsearch">' + fact.name + '</a><a href="#" id="addfood" class="addbtn">+</a></div><p id="calval'+i+'">Calories: <span>' + b +'g</span></p></div>';

                }


                output.innerHTML = y;

                $(".addbtn").click(function (event) {
                    event.preventDefault();
                    var par = $(this).parent();
                    var parent = par.parent().attr('id');
                    var i = parent.substring(4, 5);
                    console.log(i);
                    $(this).parent().next().find("#message" + i).html("<p>Food added to Log.<p>");
                    var food = par.find("#rsearch" + i).html();
                    var calval = par.parent().find("#calval" + i+" span").html();

                    console.log(food + " " + calval)

                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            // User is signed in.

                            if (user != null) {
                                firedata.ref('users/' + user.uid + "/foodlog/" + sub).push({
                                    Food: food,
                                    Cal: calval

                                });
                                read();
                            }

                        } else {
                            // No user is signed in.
                            
                        }
                    });
                });




            }



        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }



});

