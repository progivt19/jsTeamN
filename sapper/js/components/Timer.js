class Timer {
    
    constructor(ms) {
        this.ms = ms;
        this.GetTimeElapsed = this.getTimeElapsed;
        this.el = this.generateEl("timer", "timer");
        this.Remove = this.remove;
    }

    generateEl(id, className) {
        let el = document.createElement("div");
        el.className = className;
        el.setAttribute("id", id);
        return el;
    }

    millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    get Value() {
        return this._value;
    }

    set Value(value){
        this._value = value;
    }

    Start() {
        this.StartTime = Date.now();
        this.isStarted = true;
        this.timerRunner = setInterval(this.updateValue.bind(this), "1000");
    }

    Stop() {
        this.isStarted = false;
        clearInterval(this.timerRunner);
    }

    updateValue() {
        if(this.Value <= 0) {
            const event  = new CustomEvent("TimeIsOver");
            document.dispatchEvent(event);
        }
        this.Value = this.ms - (Date.now() - this.StartTime);
        this.el.innerHTML = this.millisToMinutesAndSeconds(this._value);
    }

    getTimeElapsed() {
        const ms = Date.now() - this.StartTime;
        return  { 
            result: this.millisToMinutesAndSeconds(ms),
            mseconds:  ms
        };
    }

    remove() {
        this.isStarted && this.Stop();
        this.el && this.el.remove();
    }
}