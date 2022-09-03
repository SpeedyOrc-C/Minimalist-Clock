"use strict";
class Clock {
    constructor() {
        this.Hour = 0;
        this.Minute = 0;
        this.Second = 0;
    }
    UpdateTimeValue(date) {
        this.Hour = date.getHours();
        this.Minute = date.getMinutes();
        this.Second = date.getSeconds();
        this.UpdateUI();
    }
}
function Leading0(s) {
    if (s.length == 1)
        return '0' + s;
    return s;
}
class TextClock extends Clock {
    constructor() {
        super();
        this.textHour = document.querySelector('#text-clock-hour');
        this.textMinute = document.querySelector('#text-clock-minute');
        this.textSecond = document.querySelector('#text-clock-second');
        this.textSeparators = document.querySelectorAll('.text-clock-separator');
        this.UpdateUI = () => {
            this.textHour.innerText = Leading0(this.Hour.toString());
            this.textMinute.innerText = Leading0(this.Minute.toString());
            this.textSecond.innerText = Leading0(this.Second.toString());
        };
    }
    SetSeparatorBlink(value) {
        this.textSeparators.forEach(separator => separator.setAttribute('blink', value ? '1' : '0'));
    }
}
class AnalogClock extends Clock {
    constructor() {
        super();
        this.PivotHour = document.querySelector('#analog-clock-hour-arm-pivot');
        this.PivotMinute = document.querySelector('#analog-clock-minute-arm-pivot');
        this.PivotSecond = document.querySelector('#analog-clock-second-arm-pivot');
        this.UpdateUI = () => {
            let angleSecond = this.Second * 6 + this.Minute * 360 + this.Hour * 4320;
            let angleMinute = this.Minute * 6 + this.Second * 0.1;
            let angleHour = this.Hour * 30 + this.Minute * 0.5;
            this.PivotSecond.style.transform = `rotate(${angleSecond - 90}deg)`;
            this.PivotMinute.style.transform = `rotate(${angleMinute - 90}deg)`;
            this.PivotHour.style.transform = `rotate(${angleHour - 90}deg)`;
        };
    }
}
class NixieClock extends Clock {
    constructor() {
        super();
        this.TextHour = new Nixie2Digits(new NixieDigit(1), new NixieDigit(2));
        this.TextMinute = new Nixie2Digits(new NixieDigit(3), new NixieDigit(4));
        this.TextSecond = new Nixie2Digits(new NixieDigit(5), new NixieDigit(6));
        this.UpdateUI = () => {
            this.TextHour.UpdateUI(this.Hour);
            this.TextMinute.UpdateUI(this.Minute);
            this.TextSecond.UpdateUI(this.Second);
        };
    }
}
class Nixie2Digits {
    constructor(digit1, digit2) {
        this.Digit1 = digit1;
        this.Digit2 = digit2;
    }
    UpdateUI(value) {
        if (0 <= value && value <= 99) {
            if (value <= 9) {
                this.Digit1.UpdateUI(0);
                this.Digit2.UpdateUI(value);
            }
            else {
                this.Digit1.UpdateUI((value - value % 10) / 10);
                this.Digit2.UpdateUI(value % 10);
            }
        }
    }
}
class NixieDigit {
    constructor(digitNo) {
        this.Tubes = new Array();
        for (let tubeNo = 0; tubeNo <= 9; tubeNo++)
            this.Tubes.push(document.querySelector(`#digit${digitNo}>.tube${tubeNo}`));
    }
    UpdateUI(value) {
        this.Tubes.forEach(tube => tube.setAttribute('lit', '0'));
        if (0 <= value && value <= 9)
            this.Tubes[value].setAttribute('lit', '1');
    }
}
export { TextClock, AnalogClock, NixieClock };
