const clockContainer = document.getElementById('clock-container');

let timeInterval = null;
let stopwatchInterval = null;
let timerInterval = null;

let stopWatchTime = '0.00';

// ===== Utility Functions ===== //
function updateClockContainer(htmlContent) {
    clockContainer.innerHTML = htmlContent;
}

function clearAllIntervals() {
    clearInterval(timeInterval);
    // clearInterval(stopwatchInterval);
    clearInterval(timerInterval);
    timeInterval = timerInterval = null;
}

function getCurrentTime() {
    const now = new Date();
    return {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0')
    };
}

// ===== Clock Menu Change ===== //
function changeClockMenu(menuName) {
    const name = menuName.toLowerCase();
    clearAllIntervals();

    if (name === 'clock') {
        updateClockContainer(`Please wait...`);
        timeInterval = setInterval(() => {
            const { hours, minutes, seconds } = getCurrentTime();
            updateClockContainer(`${hours}:${minutes}:${seconds}`);
        }, 1000);
    } else if (name === 'stopwatch') {
        updateClockContainer(generateStopwatchUI());
    } else {
        updateClockContainer(`<span class="menu">${menuName}</span>`);
    }
}

// ===== Menu Navigation Event Listener ===== //
document.querySelectorAll('.nav-link').forEach(menuItem => {
    menuItem.addEventListener('click', (e) => {
        const menuText = e.target.dataset.menu;
        document.querySelectorAll('.nav-link').forEach(el => {
            el.classList.toggle('active', el.dataset.menu === menuText);
        });
        changeClockMenu(menuText);
    });
});

// ===== Load Default Menu on Page Load ===== //
document.addEventListener('DOMContentLoaded', () => {
    const activeMenu = document.querySelector('.nav-link.active');
    if (activeMenu) {
        changeClockMenu(activeMenu.dataset.menu);
    }
});

// ===== Stopwatch ===== //
function generateStopwatchUI() {
    return `
        <div class="stopwatch-display p-3">${stopWatchTime}</div>
        <div class="stopwatch-controls">
            <button class="btn btn-primary" id="startStopwatch">Start</button>
            <button class="btn btn-danger" id="stopStopwatch">Stop</button>
            <button class="btn btn-success" id="resetStopwatch">Reset</button>
        </div>
    `;
}

function stopwatch() {
    let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;

    function updateDisplay() {
        const display = document.querySelector('.stopwatch-display');
        if (display) {
            display.innerHTML = formatStopwatchTime({ hours, minutes, seconds, milliseconds });
        }
    }

    function storeStopwatchTime() {
        stopWatchTime = formatStopwatchTime({ hours, minutes, seconds, milliseconds });
    }
    
    return {
        start: () => {
            if (stopwatchInterval) return;
            stopwatchInterval = setInterval(() => {
                milliseconds++;
                if (milliseconds >= 100) { milliseconds = 0; seconds++; }
                if (seconds >= 60) { seconds = 0; minutes++; }
                if (minutes >= 60) { minutes = 0; hours++; }
                updateDisplay();
            }, 10);
        },
        stop: () => {
            clearInterval(stopwatchInterval);
            stopwatchInterval = null;
            storeStopwatchTime();
        },
        reset: () => {
            clearInterval(stopwatchInterval);
            stopwatchInterval = null;
            milliseconds = seconds = minutes = hours = 0;
            updateDisplay();
            storeStopwatchTime();
        }
    };
}

function formatStopwatchTime({ hours, minutes, seconds, milliseconds }) {
    if (hours) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    } else if (minutes) {
        return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    } else {
        return `${seconds}.${String(milliseconds).padStart(2, '0')}`;
    }
}

// Stopwatch Controller
const stopwatchControl = stopwatch();
clockContainer.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'startStopwatch':
            stopwatchControl.start();
            break;
        case 'stopStopwatch':
            stopwatchControl.stop();
            break;
        case 'resetStopwatch':
            stopwatchControl.reset();
            break;
    }
});
