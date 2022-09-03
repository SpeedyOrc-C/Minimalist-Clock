"use strict"

class Clock
{
    protected Hour: number
    protected Minute: number
    protected Second: number 
    protected UpdateUI: VoidFunction

    constructor()
    {
        this.Hour = 0
        this.Minute = 0
        this.Second = 0
    }

    UpdateTimeValue(date): void
    {
        this.Hour = date.getHours()
        this.Minute = date.getMinutes()
        this.Second = date.getSeconds()
        this.UpdateUI()
    }
}

class TextClock extends Clock
{
    private TextHour: HTMLElement
    private TextMinute: HTMLElement
    private TextSecond: HTMLElement
    private TextSeparators: NodeListOf<HTMLElement>

    constructor()
    {
        super()

        this.TextHour = document.querySelector('#text-clock-hour')!
        this.TextMinute = document.querySelector('#text-clock-minute')!
        this.TextSecond = document.querySelector('#text-clock-second')!
        this.TextSeparators = document.querySelectorAll('.text-clock-separator')

        this.UpdateUI = () =>
        {
            this.TextHour.innerText = Add0(this.Hour.toString())
            this.TextMinute.innerText = Add0(this.Minute.toString())
            this.TextSecond.innerText = Add0(this.Second.toString())
        }
    }

    SetSeparatorBlink(value)
    {
        this.TextSeparators.forEach(separator =>
            separator.setAttribute('blink', value ? '1' : '0')
        )
    }
}

class AnalogClock extends Clock
{
    private PivotHour: HTMLElement
    private PivotMinute: HTMLElement
    private PivotSecond: HTMLElement

    constructor()
    {
        super()

        this.PivotHour = document.querySelector('#analog-clock-hour-arm-pivot')!
        this.PivotMinute = document.querySelector('#analog-clock-minute-arm-pivot')!
        this.PivotSecond = document.querySelector('#analog-clock-second-arm-pivot')!

        this.UpdateUI = () =>
        {
            let angleSecond = this.Second * 6 + this.Minute * 360 + this.Hour * 4320
            let angleMinute = this.Minute * 6 + this.Second * 0.1
            let angleHour = this.Hour * 30 + this.Minute * 0.5 
            this.PivotSecond.style.transform = `rotate(${angleSecond-90}deg)`
            this.PivotMinute.style.transform = `rotate(${angleMinute-90}deg)`
            this.PivotHour.style.transform = `rotate(${angleHour-90}deg)`
        }
    }
}

class NixieClock extends Clock
{
    private TextHour: Nixie2Digits
    private TextMinute: Nixie2Digits
    private TextSecond: Nixie2Digits

    constructor()
    {
        super()

        this.TextHour = new Nixie2Digits(new NixieDigit(1), new NixieDigit(2))
        this.TextMinute = new Nixie2Digits(new NixieDigit(3), new NixieDigit(4))
        this.TextSecond = new Nixie2Digits(new NixieDigit(5), new NixieDigit(6))

        this.UpdateUI = () =>
        {
            this.TextHour.UpdateUI(this.Hour)
            this.TextMinute.UpdateUI(this.Minute)
            this.TextSecond.UpdateUI(this.Second)
        }
    }
}

class Nixie2Digits
{
    private Digit1: NixieDigit
    private Digit2: NixieDigit

    constructor(digit1: NixieDigit, digit2: NixieDigit)
    {
        this.Digit1 = digit1
        this.Digit2 = digit2
    }

    public UpdateUI(value: number): void
    {
        if (0 <= value && value <= 99)
        {
            if (value <= 9)
            {
                this.Digit1.UpdateUI(0)
                this.Digit2.UpdateUI(value)
            }
            else
            {
                this.Digit1.UpdateUI((value - value % 10)/10)
                this.Digit2.UpdateUI(value % 10)
            }
        }
    }
}

class NixieDigit
{
    private Tubes: Array<HTMLElement>

    constructor(digitNo: number)
    {
        this.Tubes = new Array()
        for (let tubeNo = 0; tubeNo <= 9; tubeNo++)
            this.Tubes.push(document.querySelector(`#digit${digitNo}>.tube${tubeNo}`)!)
    }

    public UpdateUI(value: number): void
    {
        this.Tubes.forEach(tube => tube.setAttribute('lit', '0'))
        if (0 <= value && value <= 9)
            this.Tubes[value].setAttribute('lit', '1')
    }

}

let Add0 = (s: string) => s.length == 1 ? '0' + s : s 

export { TextClock, AnalogClock, NixieClock }
