const defPredicate = () => true;

class Field {

    constructor(points, bombsAmount, height, width, className, timeMs) {
        this.Points = points;
        this.Height = height;
        this.Width = width;
        this.className = className;
        this.BombsAmount = bombsAmount;
        this.parentEl = document.getElementById("field");
        this.Timer = new Timer(timeMs);
        this.OpenedPointsCounter = 0;
        this.Clear = this.clear;
        this.init();
    }
    
    init() {
        if(this.FieldEl) {
            this.clear();
        }
        this.FieldEl = document.createElement("field");
        this.FieldEl.classList.add(this.className);
        this.parentEl.appendChild(this.FieldEl);
        this._visualize(this.FieldEl, this.Points);
        this.subscribe();
    }

    _visualize(fieldEl, points) {
        if(!points || !Array.isArray(points)) {
            return;
        }
        points.forEach(pointsRow => {
            if(!pointsRow || !Array.isArray(pointsRow)) {
                return;
            }
            pointsRow.forEach(p => fieldEl.appendChild(p.el));
        });
    }

    subscribe() {
        this.onPointOpenedBinded = this.onPointOpened.bind(this);
        document.addEventListener("Open", this.onPointOpenedBinded, true);
    }

    unSubscribe(){
        document.removeEventListener("Open", this.onPointOpenedBinded, true);
    }

    onPointOpened(e) {
        if(!this.Timer.isStarted) {
            this.Timer.Start();
        }
        this.OpenedPointsCounter++ && this.OpenedPointsCounter >= this.NumberOfPoints - this.BombsAmount && 
            this.Win();
        console.log("OpenedPointsCounter", this.OpenedPointsCounter);
        const point = e.detail &&  e.detail.point;
        if(point.NumberOfBombsArroud !== 0) {
            return;
            // nearByPoints = nearByPoints.filter(p => p.NumberOfBombsArroud === 0);
        }
        let nearByPoints = [];
        if(point) {
            nearByPoints = this.getNearByPointsArray(point, p=> p && !p.isOpened);
        }
        nearByPoints.forEach(p => p.Open());
        // this.openNearByPoints(point);
    }

    Win() {
        const result = this.Timer.GetTimeElapsed();
        this.Timer.Stop();
        const event = new CustomEvent("Win", { detail : {result} });
        document.dispatchEvent(event);
    }

    get NumberOfPoints() {
        return this.Width * this.Height;
    }

    openNearByPoints(point) {
        point.Open();
        if(point.NumberOfBombsArroud !== 0) {
            return;
            // nearByPoints = nearByPoints.filter(p => p.NumberOfBombsArroud === 0);
        }
        let nearByPoints = this.getNearByPointsArray(point);
        nearByPoints.forEach(p => this.openNearByPoints(p));
    }

    getNearByPointsArray(p, predicate) {
        predicate = predicate || this.defPredicate;
        let points = [];
        for(let y = p.y - 1; y <= p.y + 1; y++ ) {
            let pointR = this.Points[y];
            if(!pointR || !Array.isArray(pointR)) {
                continue;
            }
            for(let x = p.x - 1; x <= p.x + 1; x++ ) {
                let point = pointR[x];
                if(p.Equals(point)) {
                    continue;
                }
                if(predicate(point)) {
                    points.push(point);
                }
            }
        }
        return points;
    }

    clear() {
        this.unSubscribe();
        this.FieldEl && this.FieldEl.remove();
        this.Timer.Remove();
    }
}
