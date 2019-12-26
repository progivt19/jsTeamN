class Rating {
    constructor(storage, mode, onRender) {
        this.Storage = storage;
        this.Mode = mode;
        this.Clear = this.clear;
        this.initEl(onRender);
    }
    
    initEl(callback) {
        this.Storage.getTopScores(10, this.Mode.Id)
            .then( ratingList => {
                let sortable = [];
                for (let item in ratingList) {
                    sortable.push(ratingList[item]);
                }
                this.ratingList = sortable.sort((a, b) => a.mseconds - b.mseconds);
                this.el = this._generateDomEl();
                callback();
            });
    }

    clear() {
        const el = this.el;
        el && el.remove();
    }

    _generateDomEl() {
        let list = document.createElement("ul");
        list.classList.add("list-group");
        // table.innerHTML = this.getTableHeader();
        for(let item in this.ratingList) {
            // let row = table.insertRow();

            let li  = document.createElement("li");
            li.classList.add("rating-item");
            li.classList.add("list-group-item");
            li.classList.add("align-items-center");
            li.classList.add("justify-content-between");
            li.classList.add("d-flex");
            
            let liText = this.prepareLi(this.ratingList[item]);
            li.innerHTML = liText;

            let span = document.createElement("span");
            span.classList.add("badge");
            span.classList.add("badge-primary");
            span.classList.add("badge-pill");

            span.appendChild(document.createTextNode(this.prepareLiBage(this.ratingList[item])));
            li.appendChild(span);
            list.appendChild(li);
        }
        return list;
    }

    getTableHeader() {
        return `
        <tr>
            <th>user</th>
            <th>score</th> 
            <th>date</th>
        </tr>`
    }

    prepareLi(ratingItem) {
        const date = new Date(ratingItem.date);
        return `<b>${ratingItem.user}</b> ${ratingItem.result} ${date.toDateString() + date.toLocaleTimeString()}`;
    }

    prepareLiBage(ratingItem) {
        return `${ratingItem.result}`;
    }
    
}