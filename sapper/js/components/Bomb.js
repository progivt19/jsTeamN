class Bomb extends Point {
    Open() {
        this._isOpened = true;
        this.el.classList.add("opened");
        this.el.innerHTML = "Bomb";
        const event = new  CustomEvent('Boom', this);
        document.dispatchEvent(event);
    }

    set NumberOfBombsArroud(value) {}
    
}