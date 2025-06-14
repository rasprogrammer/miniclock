const clockContainer = document.getElementById('clock-container');

let timeInterval = null;
let stopwatchInterval = null;
let timerInterval = null;

let stopWatchTime = '0.00';
let clockTime = null;

const timerStore = {
    timerTime: null,
    timerTimeEvent: null,
    finishTime: '00:00:00'
}



// ===== Utility Functions ===== //
function updateClockContainer(htmlContent) {
    clockContainer.innerHTML = htmlContent;
}

function clearAllIntervals() {
    // clearInterval(timeInterval);
    // clearInterval(stopwatchInterval);
    // clearInterval(timerInterval);
    // timeInterval = null;
}

function getCurrentTime() {
    const now = new Date();
    return {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0')
    };
}

function storeCurrentTime() {
    const { hours, minutes, seconds } = getCurrentTime();
    clockTime = `${hours}:${minutes}:${seconds}`;
}

// ===== Clock Menu Change ===== //
function changeClockMenu(menuName) {
    const name = menuName.toLowerCase();
    clearAllIntervals();

    if (name === 'clock') {
        if (timeInterval) {
            clearInterval(timeInterval);
            timeInterval = null;
        }
        updateClockContainer(generateClockUI());
        timeInterval = setInterval(() => {
            updateClockTimeUI();
        }, 1000);
    } else if (name === 'stopwatch') {
        updateClockContainer(generateStopwatchUI());
    } else if (name === 'timer') {
        if (!timerStore.timerTime || timerStore.timerTime === timerStore.finishTime) {
            timerStore.timerTime = null; // Reset timerTime if it was finished
            updateClockContainer(setTimerUI());
        } else {
            updateClockContainer(setTimerUI());
            const [tmrhour, tmrminute, tmrsecond] = timerStore.timerTime.split(":");
            if (timerStore.timerTimeEvent === 'start') {
                const timerControl = timer({tmrhour, tmrminute, tmrsecond});
                timerControl.start();
            } else if (timerStore.timerTimeEvent === 'stop') {
                const timerControl = timer({tmrhour, tmrminute, tmrsecond});
                timerControl.stop();
            }
        }
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

// ===== Clock UI  ===== //
function generateClockUI() {
    storeCurrentTime();
    return `
        <div class="row">
            <div class="col-12 text-center">
                <div class="clock-display p-3">${clockTime}</div>
            </div>
        </div>
    `;
}

function updateClockTimeUI() {
    storeCurrentTime();
    const clockBox = document.querySelector('.clock-display');
    if (!clockBox) return;
    clockBox.innerHTML = clockTime;
}

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
        // Stopwatch
        case 'startStopwatch':
            stopwatchControl.start();
            break;
        case 'stopStopwatch':
            stopwatchControl.stop();
            break;
        case 'resetStopwatch':
            stopwatchControl.reset();
            break;
                
        // Timer
        case 'startTimer':
            let tmrhour = '00', tmrminute = '00', tmrsecond = '00';
            if (timerStore.timerTime === null) {
                tmrhour = document.getElementById('tmrhour').value;
                tmrminute = document.getElementById('tmrminute').value;
                tmrsecond = document.getElementById('tmrsecond').value;
            } else if (timerStore.timerTime !== timerStore.finishTime){
                [tmrhour, tmrminute, tmrsecond] = timerStore.timerTime.split(":");
            } else {
                return;
            }
            if (tmrhour === '00' && tmrminute === '00' && tmrsecond === '00') {
                alert('Please set a valid timer duration.');
                return;
            }
            const timerControl = timer({tmrhour, tmrminute, tmrsecond});
            timerControl.start();
            timerStore.timerTimeEvent = 'start';
            break;

        case 'stopTimer':
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            timerStore.timerTimeEvent = 'stop';
            break;
            
        case 'resetTimer':
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            timerStore.timerTime = null; // Reset timerTime when stopped
            updateClockContainer(setTimerUI());
            break;
        
        
    }
});


// Timer  (timer time length)
const hoursTimer = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'));
const minutesTimer = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));
const secondsTimer = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));

function timer({tmrhour, tmrminute, tmrsecond}) {
    let tmrhours = tmrhour;
    let tmrminutes = tmrminute;
    let tmrseconds = tmrsecond;

    function updateTimerDisplay() {
        const timerbox = document.getElementById('timerbox');
        if (!timerbox) return;
        timerbox.innerHTML = formatTimerTime({tmrhours, tmrminutes, tmrseconds});
    }

    function storeTimerTime() {
        timerStore.timerTime = formatTimerTime({tmrhours, tmrminutes, tmrseconds});
    }
    
    return {
        start: () => {
            if (timerInterval) return;
            timerInterval = setInterval(() => {
                if (tmrseconds > 0) {
                    tmrseconds--;
                    storeTimerTime();
                } else if (tmrminutes > 0) {
                    tmrminutes--;
                    tmrseconds = 59;
                    storeTimerTime();
                } else if (tmrhours > 0) {
                    tmrhours--;
                    tmrminutes = 59;
                    tmrseconds = 59;
                    storeTimerTime();
                } else {
                    playAudio();
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                updateTimerDisplay();
            }, 1000);
        },
        stop: () => {
            clearInterval(timerInterval);
        }, 
        reset: () => {
            clearInterval(timerInterval);
            timerInterval = null;
            updateClockContainer(setTimerUI());
        }

    }

}

function formatTimerTime({ tmrhours, tmrminutes, tmrseconds }) {
    return `${tmrhours}:${String(tmrminutes).padStart(2, '0')}:${String(tmrseconds).padStart(2, '0')}`;
}

function setTimerUI() {
    return `
        <div class="row m-2">
            <div class="col" id="timerbox">
                ${!timerStore.timerTime || timerStore.timerTime === timerStore.finishTime ? setTimerInputs() : timerStore.timerTime}
            </div>
        </div>
        <div class="row m-4">
            <div class="col">
                <button type="button" class="btn btn-primary" id="startTimer"> Start </button>
                <button type="button" class="btn btn-danger" id="stopTimer"> Stop </button>
                <button type="button" class="btn btn-danger" id="resetTimer"> Reset </button>
            </div>
        </div>
    `;
}

function setTimerInputs() {
    return `
        <div class="row">
            <div class="col-4">
                <label for="tmrhour" class="tmrlabel"> Hours :</label>
                <select class="form-select" id="tmrhour">
                    ${hoursTimer.map((ele) => `<option value="${ele}">${ele}</option>`)}
                </select>
            </div>
            <div class="col-4">
                <label for="tmrminute" class="tmrlabel"> Minutes :</label>
                <select class="form-select" id="tmrminute">
                    ${minutesTimer.map((ele) => `<option value="${ele}">${ele}</option>`)}
                </select>
            </div>
            <div class="col-4">
                <label for="tmrsecond" class="tmrlabel"> Seconds :</label>
                <select class="form-select" id="tmrsecond">
                    ${secondsTimer.map((ele) => `<option value="${ele}">${ele}</option>`)}
                </select>
            </div>
        </div>`;
}

// Play Audio Function
function playAudio() {
    const ring = new Audio('./audio/timer.mp3');
    ring.play();
}