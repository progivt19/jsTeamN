class Point {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = this.generateId(this.x, this.y);
        this.el = this._generateDomEl(this.id, "point");
        this.Subscribe();
        this._isOpened = false;
        this._numberOfBombsArroud = 0;
    }

    static isPoint(point) {
        return point && point instanceof Point;
    }

    Equals(point) {
        return Point.isPoint(point) ? point.x === this.x && point.y === this.y : false;
    }

    get NumberOfBombsArroud() { 
        return this._numberOfBombsArroud;
    }

    set NumberOfBombsArroud(value) {
        this._numberOfBombsArroud = value;
        this._updateElValue();
    }

    get IsOpened() {
        return this._isOpened;
    }

    _updateElValue() {
        this.el.innerHTML = "<p>" + this._numberOfBombsArroud + "</p>";
    }

    _generateDomEl(id, className) {
        let el = document.createElement("div");
        el.className = className;
        el.setAttribute("id", id);
        // el.innerHTML = id;
        return el;
    }

    Subscribe() {
        this.el.addEventListener("click", this.Open.bind(this));
        this.el.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.el.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.el.addEventListener("contextmenu", this.onRightButtonClicked.bind(this));
    }

    generateId(x, y) {
        return x + "_" + y;
    }

    Open(e) {
        if(this._isOpened || this._isFlaged) {
            return;
        }
        this._isOpened = true;
        this.el.classList.add("opened");
        const event = new  CustomEvent("Open", {"detail": {point: this}});
        document.dispatchEvent(event);
    }

    onMouseDown(e) {
        this.clickTime = 1000;
        this.clickWaiter = setInterval(() => {
            this.clickTime -= 100;
            if(this.clickTime < 0) {
                this.Flag();
                clearInterval(this.clickWaiter);
            }
        }, 100);
        console.log("onMouseDown", e);
    }

    onMouseUp(e) {
        clearInterval(this.clickWaiter);
        console.log("onMouseUp", e);
    }

    onRightButtonClicked(e) {
        if(e.which === 3) {
            e.preventDefault();
            this.Flag();
        }
    }

    Flag() {
        if(this._isOpened) {
            return;
        }
        this._isFlaged = !this._isFlaged;
        this._isFlaged ? this.el.classList.add("flag") : this.el.classList.remove("flag");
    }

    isNearByPoint(point) {
        return Point.isPoint(point) && !this.Equals(point) && 
            point.x <= this.x+1 && point.x >= this.x-1 && 
            point.y <= this.y+1 && point.y >= y-1;
    }
}

