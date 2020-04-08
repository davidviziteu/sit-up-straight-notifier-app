
/*
    Written by:
		David-Andrei Viziteu		(viziteu.david@gmail.com)
  UAIC, Faculty of Computer Science, APRIL 2020

*/
const { remote } = require('electron');
const mainProcess = remote.require('./main.js');

let interval = 0;
let lastSelected = 0;
let intervalId;
document.getElementById("0").addEventListener("click", set0min);
document.getElementById("1").addEventListener("click", set10min);
document.getElementById("2").addEventListener("click", set15min);
document.getElementById("3").addEventListener("click", set30min);

function markIt(id, tellBackend = true) {//unfortuantely it does more than just marking stuff, ran out of naming ideas again
    //this function is also called from backend sometimes, that's why i need the 2nd argument

    if (tellBackend)
        mainProcess.updateSelectedInterval(id); //updates tray

    let temp = document.getElementById(`active`);
    if (temp != null)
        temp.id = `${lastSelected}`;
    document.getElementById(`${id}`).id = `active`;
    lastSelected = id;

    clearInterval(intervalId);

    if (id == 0)
        interval = 0;
    else if (id == 1)
        interval = 10 * 60 * 1000; // 10 mins: 10 * 60 * (1 second) 
    else if (id == 2)
        interval = 15 * 60 * 1000;
    else if (id == 3)
        interval = 30 * 60 * 1000;

    if (interval) {
        intervalId = setInterval(() => {
            new Notification('sit up straight', {
                body: 'also, blink'
            });
        }
            , interval);
    }

}

//these functions could have been organised/done better

function set0min() {
    markIt(0);
    let myNotification = new Notification('Notifications off', {
        body: ''
    })
}

function set10min() {
    markIt(1);
    let myNotification = new Notification('Notifications every 10 mins', {
        body: ''
    })
}

function set15min() {
    markIt(2);
    let myNotification = new Notification('Notifications every 15 mins', {
        body: ''
    })
}

function set30min() {
    markIt(3);
    let myNotification = new Notification('Notifications every 30 mins', {
        body: ''
    })
}
