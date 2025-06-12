const clock = document.getElementById('clock');

let timeInterval = null;

function updateClock(menuName) {
    if (menuName.toLowerCase() == 'clock') {
        clock.innerHTML = `Please wait...`;
        timeInterval = setInterval(() => {
            const { hours, minutes, seconds } = getCurrentTime();
            clock.innerHTML = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    } else if (menuName.toLowerCase() == 'stopwatch') {
        if (timeInterval) {
            clearInterval(timeInterval);
        }
        clock.innerHTML = `<div class="stopwatch-controls">
            <button id="startStopwatch">Start</button>
            <button id="stopStopwatch">Stop</button>
            <button id="resetStopwatch">Reset</button>
            </div>`;
    } else {
        if (timeInterval) {
            clearInterval(timeInterval);
        }
        clock.innerHTML = `<span class="menu">${menuName}</span>`;
    }
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return { hours, minutes, seconds };
}

const menu = document.getElementsByClassName('nav-link');

for (let i = 0; i < menu.length; i++) {
    menu[i].addEventListener('click', function(e) {
        const menuText = e.target.dataset.menu;
        Array.from(menu).forEach(element => {
            if (element.dataset.menu === menuText) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
        updateClock(menuText);
    });
}

// Initial click to set the default active menu
document.addEventListener('DOMContentLoaded', () => {
    const activeMenu = document.querySelector('.nav-link.active');
    if (activeMenu) {
        updateClock(activeMenu.dataset.menu);
    }
});

// stopwatch functionality
let stopwatchInterval = null;
function startStopwatch() {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    stopwatchInterval = setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
        clock.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopStopwatch() {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
    clock.innerHTML = `<span class="menu">Stopwatch</span>`;
}

function resetStopwatch() {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
    clock.innerHTML = `<span class="menu">Stopwatch</span>`;
}

function toggleStopwatch(action) {
    if (action === 'start') {
        startStopwatch();
    } else if (action === 'stop') {
        stopStopwatch();
    } else if (action === 'reset') {
        resetStopwatch();
    }
}

// Add event listeners for stopwatch buttons
document.getElementById('startStopwatch')?.addEventListener('click', () => toggleStopwatch('start'));
document.getElementById('stopStopwatch')?.addEventListener('click', () => toggleStopwatch('stop'));
document.getElementById('resetStopwatch')?.addEventListener('click', () => toggleStopwatch('reset'));

