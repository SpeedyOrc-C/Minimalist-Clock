"use strict";
import { TextClock, AnalogClock, NixieClock } from './clocks.js';
let textClock = new TextClock();
let analogClock = new AnalogClock();
let nixieClock = new NixieClock();
let audioTick = document.querySelector('#audio-tick');
let config = {
    'play-tick': false,
};
function UpdateForEachSecond() {
    let timeNow = Date.now();
    let dateNow = new Date(timeNow);
    let timeRemainToNextSecondInMillisecond = 1000 - timeNow % 1000;
    setTimeout(UpdateForEachSecond, timeRemainToNextSecondInMillisecond);
    textClock.UpdateTimeValue(dateNow);
    analogClock.UpdateTimeValue(dateNow);
    nixieClock.UpdateTimeValue(dateNow);
    if (config['play-tick']) {
        audioTick.play();
    }
}
UpdateForEachSecond();
function UpdateForEachHalfSecond() {
    let timeNow = Date.now();
    let timeRemainToNextHalfSecondInMillisecond = 500 - timeNow % 500;
    setTimeout(UpdateForEachHalfSecond, timeRemainToNextHalfSecondInMillisecond);
    textClock.SetSeparatorBlink(((timeNow - timeNow % 1000) / 1000) % 2 == 1);
}
UpdateForEachHalfSecond();
let checkboxPlayTick = document.querySelector('#checkbox-play-tick');
checkboxPlayTick.addEventListener('click', ev => config['play-tick'] = checkboxPlayTick.checked);
