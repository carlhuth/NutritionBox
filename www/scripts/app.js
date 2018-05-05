



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
                    y += '<div id="food' + i + '" class="food"><div class="prodlink"><a href="#" id ="rsearch' + i + '" class = "rsearch">' + fact.name + '</a><a href="#" id="addfood" class="addbtn hide">+</a></div><div class="proddes hide" id="proddes'+i+'"><canvas id="canvas'+i+'" height="250"></canvas></div></div>';

                }


                output.innerHTML = y;

                
                $('.rsearch').on("click", function (event) {
                    event.preventDefault();
                    var par = $(this).parent();
                    var parent = par.parent().attr('id');
                    var i = parent.substring(4, 5);

                    par.next().toggleClass("hide");
                    par.find("a").toggleClass("changecolor");
                    par.find(".addbtn").toggleClass("hide");

                    if (par.next().hasClass("hide") == false) {
                        
                        var olddiv = document.getElementById("proddes" + i);
                        var newdiv;

                        var b = Math.round(data1.hits[i].fields.nf_calories * 100) / 100;
                        var c = Math.round(data1.hits[i].fields.nf_total_fat * 100) / 100;
                        var d = Math.round(data1.hits[i].fields.nf_cholesterol * 100) / 100;
                        var e = Math.round(data1.hits[i].fields.nf_total_carbohydrate * 100) / 100;
                        var f = Math.round(data1.hits[i].fields.nf_dietary_fiber * 100) / 100;
                        var g = Math.round(data1.hits[i].fields.nf_sugars * 100) / 100;
                        var h = Math.round(data1.hits[i].fields.nf_protein * 100) / 100;

                        if (olddiv) {
                            olddiv.parentNode.removeChild(olddiv);
                        }

                        newdiv = document.createElement('div');
                        newdiv.id = 'proddes' + i;
                        newdiv.className = 'proddes';
                        newdiv.innerHTML = '<div id="message'+i+'" class="message"></div><p class="pdata"><span>Calories:</span><span id="calval'+i+'">' + b + 'g</span></p><canvas id="canvas' + i + '" height="200"></canvas><br/><p class="pdata"><span>Cholesterol:</span><span>' + d + 'mg</span></p><p class="pdata"><span>Dietary Fiber:</span><span>' + f + 'g</span></p><p class="pdata"><span>Sugars:</span><span>' + g +'g</span></p>';
                        
                        par.parent().append(newdiv);

                        var ctx = document.getElementById("canvas" + i);
                        var data = {
                            datasets: [{
                                data: [e, h, c],
                                backgroundColor: [
                                    "#704F50",
                                    "#F0A979",
                                    "#F9F0AF",
                                ],
                                label: 'My dataset' // for legend
                            }],
                            labels: [
                                "Carbohydrate",
                                "Protein",
                                "Fat",
                            ]
                        };
                        var pieChart = new Chart(ctx, {
                            type: 'pie',
                            data: data,
                            options: {
                                tooltips: {
                                    callbacks: {
                                        label: function (tooltipItems, data) {
                                            return data.labels[tooltipItems.index] +
                                                " : " +
                                                data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] +
                                                ' g';
                                        }
                                    }
                                }
                            }
                        });
                    }

                    
                    
                    
                });

                $(".addbtn").click(function (event) {
                    event.preventDefault();
                    var par = $(this).parent();
                    var parent = par.parent().attr('id');
                    var i = parent.substring(4, 5);
                    console.log(i);
                    $(this).parent().next().find("#message" + i).html("<p>Food added to Log.<p>");
                    var food = $(this).parent().find("#rsearch" + i).html();
                    var calval = $(this).parent().next().find(".pdata #calval" + i).html();

                    console.log(food + " " + calval)

                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            // User is signed in.
                            
                            if (user != null) {
                                firedata.ref('users/' + user.uid + "/foodlog/"+today).push({
                                    Food: food,
                                    Cal: calval

                                });
                            }

                        } else {
                            // No user is signed in.
                            document.getElementById("message").innerHTML = "";
                        }
                    });
                });

               


            }



        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }



});

