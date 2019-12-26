class FieldGenrator {

    constructor() {
        this.generate = this._generate;
        this.fieldEl = document.getElementById("field");
    }
    
    _generate({ fieldWidth, fieldHeight, fieldClassName, bombsAmount, time }) {
        let bombedPoints = this._generateBombedPointsArray(fieldWidth, fieldHeight, bombsAmount);
        const points = this._generatePoints(fieldWidth, fieldHeight, bombedPoints);
        return new Field(points, bombsAmount, fieldWidth, fieldWidth, fieldClassName, time);
    }


    _generatePoints(width, height, bombedPoints) {
        let points = [];
        for(let h = 1; h <= height; h++){
            for(let w = 1; w <= width; w++) {
                let p;
                if(bombedPoints.some(p => p.x === w && p.y === h)) {
                    p = new Bomb(w, h);
                } else {
                    p = new Point(w, h);
                }
                if(!points[h]) {
                    points[h] = [];
                }
                points[h][w] = p;
            }
        }
        this._fillNumberOfBombs(points);
        return points;
    }

    //TODO : rewrite optimized
   _fillNumberOfBombs(points) {
        if(!points || !Array.isArray(points)) {
            return;
        }
        points.forEach((pointsRow, index) => {
            if(!pointsRow || !Array.isArray(pointsRow)) {
                throw new Exception(`${index} elemnt in points Array is not valid`);
            }
            pointsRow.forEach(p => {
                for(let y = p.y - 1; y <= p.y + 1; y++ ) {
                    let pointR = points[y];
                    if(!pointR || !Array.isArray(pointR)) {
                        continue;
                    }
                    for(let x = p.x - 1; x <= p.x + 1; x++ ) {
                        let point = pointR[x];
                        if(p.Equals(point)) {
                            continue;
                        }
                        if(point instanceof Bomb){
                            p.NumberOfBombsArroud += 1;
                        }
                    }
                }
            });
        });
    }

  _generateBombedPointsArray(maxX, maxY, bombsAmount) {
        let bombedPoints = [];
        let pointAdded = false;
        for (let i=0; i < bombsAmount; i++){ 
            do {
                var x = this._getRandomInt(1, maxX);
                var y = this._getRandomInt(1, maxY);
                if(!bombedPoints.some(p => p.x === x && p.y === y)) {
                    bombedPoints.push({x, y});
                    pointAdded = true;
                } 
            } while (!pointAdded);
            pointAdded = false;
        }
        return bombedPoints;
    }

    _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
}