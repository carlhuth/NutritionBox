// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

//var offset = new Date().getTimezoneOffset();
//console.log(offset);
//console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
const now = new Date();
var year = now.getFullYear();
var month = now.getMonth()+1;
var date = now.getDate();

if (date <= 9) {
    date = '0' + date;
}

if (month <= 9) {
    month = '0' + month;
}

var today = year + "-" + month + "-" + date;
// View the output
    
function sign() {
        var age = document.getElementById('age'),
            dage = document.createDocumentFragment();
        for (var i = 16; i <= 80; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.appendChild(document.createTextNode(i));
            dage.appendChild(option);
        }
        age.appendChild(dage);

    }

jQuery(document).ready(function ($) {

    $("#btnlogin").click(function (event) {
        event.preventDefault();
        
        login();
    });

    $('#txtpassword').keypress(function (e) {
        if (e.which == 13) {
            $('#btnlogin').click();
        }
    });

    $("#btnsignup1").click(function (event) {
        event.preventDefault();

        signup1();
    });

    $('#pass2').keypress(function (e) {
        if (e.which == 13) {
            $('#btnsignup1').click();
        }
    });

    $("#btnsignup2").click(function (event) {
        event.preventDefault();

        signup2();
    });

});


var firedata = firebase.database();

function login() {

    var auth = firebase.auth();

    //get elements

    const txtEmail = document.getElementById('txtemail');
    const txtPassword = document.getElementById('txtpassword');
    const btnLogin = document.getElementById('btnlogin');

    //add login event
        //get email and pass

        const email = txtEmail.value;
        const pass = txtPassword.value;

        //sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            if (error) {
                document.getElementById('message').innerHTML = errorMessage;
            }

        });

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                console.log(user);
                window.location = "activity.html";
            }
            else {
                // No user is signed in.
                // document.getElementById("message").innerHTML = "Not a Member. <br/>Create an account to log in."
            }
        });


}

function signup1() {

    var auth = firebase.auth();

    //get elements

    const txtemail = document.getElementById('txtemail');
    const pass1 = document.getElementById('pass1');
    const pass2 = document.getElementById('pass2');
    const btnSignUp1 = document.getElementById('btnSignUp1');


    //add login event
        //get email and pass

        const email = txtemail.value;
        const p1 = pass1.value;
        const p2 = pass2.value;
      
        //sign up
        if (p1 == p2) {
            const promise = auth.createUserWithEmailAndPassword(email, p1);
            promise.catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                if (error) {
                    document.getElementById('message').innerHTML = errorMessage;
                }
            });

        }
        else {
            document.getElementById('message').innerHTML = "Password does not match in both fields. Re-enter passwords.";
        }




        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                window.location = "signup2.html";
                
            } else {
                // No user is signed in.
                // document.getElementById("message").innerHTML = "";
            }
        });


}

function signup2() {

    var auth = firebase.auth();

    //get elements

    const username = document.getElementById('username').value;
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const gender = document.querySelector('#gender:checked').value;
    const activity = document.getElementById('activity').value;
    var calcount = 0;

    //  Calulate calories to consume =======================================================

    if (gender == "Male") {
        calcount = Math.round((66.47 + (13.75 * weight) + (5.0 * height) - (6.75 * age)) * activity * 100) / 100;
    }
    else if (gender == "Female") {
        calcount = Math.round((665.09 + (9.56 * weight) + (1.84 * height) - (4.67 * age)) * activity * 100) / 100;
    }
    else if (gender == "Other") {
        calcount = Math.round((665.09 + (9.56 * weight) + (1.84 * height) - (4.67 * age)) * activity * 100) / 100;
    }
    
    //sign up
    

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            

            console.log(user.uid);

            if (user != null) {
                firedata.ref('users/' + user.uid).set({
                    Username: username,
                    Age: age,
                    Height: height,
                    Weight: weight,
                    Gender: gender,
                    ImageUrl: "images/cordova.png",
                    Calcount: calcount,
                    Activity: activity
                });
            }

            window.location = "activity.html";

        } else {
            // No user is signed in.
            // document.getElementById("message").innerHTML = "";
        }
    });


}


function logout() {

    
        firebase.auth().signOut().then(function () {
            console.log('Signed Out');
        }, function (error) {
            console.error('Sign Out Error', error);
        });


     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         // User is signed in.
         
       } else {
         // No user is signed in.
          window.location = "login.html";
         // document.getElementById("message").innerHTML = "";
        }
     });

}

function profile() {
    var firedata = firebase.database(); /* global firebase*/

    read();

    function read() {

        

        var username = document.getElementById("username");
        var age = document.getElementById("age");
        var height = document.getElementById("height");
        var weight = document.getElementById("weight");
        var gender = document.getElementById("gender");
        var activity = document.getElementById("activity");
        var calories = document.getElementById("calories");

        var auth = firebase.auth();


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.

                console.log(user.uid);

                if (user != null) {
                    firedata.ref('users/' + user.uid).once('value', function (snapshot) {

                       
                        username.innerHTML = snapshot.val().Username;
                        age.innerHTML = snapshot.val().Age;
                        height.innerHTML = snapshot.val().Height+" cm";
                        weight.innerHTML = snapshot.val().Weight+" kg";
                        gender.innerHTML = snapshot.val().Gender;
                        activity.innerHTML = snapshot.val().Activity;
                        calories.innerHTML = snapshot.val().Calcount+"g";
                        path = snapshot.val().ImageUrl;
                        document.getElementById('profile').innerHTML = '<img src="' + path + '" />';

                    });
                }

            } else {
                // No user is signed in.
                document.getElementById("message").innerHTML = "";
            }
        });



    }
}

function profileEdit1() {

    var age = document.getElementById('age'),
        dage = document.createDocumentFragment();
    for (var i = 16; i <= 80; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.appendChild(document.createTextNode(i));
        dage.appendChild(option);
    }
    age.appendChild(dage);

    var firedata = firebase.database(); /* global firebase*/

    read();

    function read() {



        var username = document.getElementById("username");
        var age = document.getElementById("age");
        var height = document.getElementById("height");
        var weight = document.getElementById("weight");
        var gender = document.getElementById("gender");
        var activity = document.getElementById("activity");

        var auth = firebase.auth();


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.

                console.log(user.uid);

                if (user != null) {
                    firedata.ref('users/' + user.uid).once('value', function (snapshot) {


                        username.value = snapshot.val().Username;
                        age.value = snapshot.val().Age;
                        height.value = snapshot.val().Height;
                        weight.value = snapshot.val().Weight;
                        gender.value = snapshot.val().Gender;
                        activity.value = snapshot.val().Activity;

                    });
                }

            } else {
                // No user is signed in.
                document.getElementById("message").innerHTML = "";
            }
        });



    }
}


function done() {

    var firedata = firebase.database(); /* global firebase*/
        
        var username = document.getElementById("username").value;
        var age = document.getElementById("age").value;
        var height = document.getElementById("height").value;
        var weight = document.getElementById("weight").value;
        var gender = document.getElementById("gender").value;
        var activity = document.getElementById("activity").value;

        var auth = firebase.auth();

        var calcount = 0;

        //  Calulate calories to consume =======================================================

        if (gender == "Male") {
            calcount = Math.round((66.47 + (13.75 * weight) + (5.0 * height) - (6.75 * age)) * activity * 100) / 100;
        }
        else if (gender == "Female") {
            calcount = Math.round((665.09 + (9.56 * weight) + (1.84 * height) - (4.67 * age)) * activity * 100) / 100;
        }
        else if (gender == "Other") {
            calcount = Math.round((665.09 + (9.56 * weight) + (1.84 * height) - (4.67 * age)) * activity * 100) / 100;
        }


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                

                console.log(user.uid);

                if (user != null) {
                    firedata.ref('users/' + user.uid + '/Username').set(username);
                    firedata.ref('users/' + user.uid + '/Age').set(age);
                    firedata.ref('users/' + user.uid + '/Height').set(height);
                    firedata.ref('users/' + user.uid + '/Weight').set(weight);
                    firedata.ref('users/' + user.uid + '/Gender').set(gender);
                    firedata.ref('users/' + user.uid + '/Activity').set(activity);
                    firedata.ref('users/' + user.uid + '/Calcount').set(calcount);

                }

                window.location = "profile.html";

            } else {
                // No user is signed in.
                // document.getElementById("message").innerHTML = "";
            }
        });
    
}

function editImage() {

    var firedata = firebase.database(); /* global firebase*/
    
    var auth = firebase.auth();

    $("#upload:hidden").trigger('click');

    var upload = document.getElementById("upload");

    upload.addEventListener('change', function (e) {
        var file = e.target.files[0];
        
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                
                var storageRef = firebase.storage().ref(user.uid + '/' + file.name);
                var uploadTask = storageRef.put(file);
                console.log(storageRef.fullPath);

                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    
                }, function (error) {
                    // Handle unsuccessful uploads
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    if (user != null) {
                        firedata.ref('users/' + user.uid + '/ImageUrl').set(downloadURL);
                    }
                    profileImage();

                    console.log(downloadURL);
                });

                

            } else {
                // No user is signed in.
                // document.getElementById("message").innerHTML = "";
            }
        });
    })
    
    



}


function profileImage() {

    var firedata = firebase.database(); /* global firebase*/

    var auth = firebase.auth();
    var path;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            firedata.ref('users/' + user.uid).once('value', function (snapshot) {


                path = snapshot.val().ImageUrl;
                document.getElementById('profile').innerHTML = '<img src="'+path+'" />';
            });
            
                

            

        } else {
            // No user is signed in.
            // document.getElementById("message").innerHTML = "";
        }
    });


    




}


