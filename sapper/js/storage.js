const config = {
    apiKey: "AIzaSyB_xPpHBimhxfbqSVMM3cSyQRjmkQKx55Y",
    authDomain: "saper-564b8.firebaseapp.com",
    databaseURL: "https://saper-564b8.firebaseio.com",
    projectId: "saper-564b8",
    storageBucket: "saper-564b8.appspot.com",
    messagingSenderId: "1004050185007"
};
  
class Storage {
    constructor() {
        firebase.initializeApp(config);
        this.db = firebase.database();
    }

    SaveResult(name, result) {
        result.date = Date.now();
        return this.getIPInfo().then( ({ip_address, city, country, latitude, longitude }) => 
                this.addUser(name, ip_address , {city, country, latitude, longitude}, result)
            );

    }

    getUserInfo(userName) {
        this.db.ref("users/" + userName).once("value")
            .then(function(snapshot) {
                var name = snapshot.child("name").val();
            });
    }

    getTopScores(amount, mode) {
        return this.getAllResultsByMode(mode).then(resultsSnapShot => {
            return resultsSnapShot.val();
        });
    }

    getAllResultsRef() {
        return firebase.database().ref("results");
    }

    getAllResultsByMode(mode) {
        return this.getAllResultsRef().orderByChild("mode").equalTo(mode).once("value");
    }

    getLastGames(amount) {

    }

    getMostActiveUsers(amount) {

    }

    addUser(userName, ip, location, result) {
        const usersRef = firebase.database().ref("users/" + userName);
        usersRef.once("value")
        .then(function(snapshot) {
            const record = {ip, location, date: Date.now()}
            if(!snapshot.exists()) {
                usersRef.set(record);
            }
            var newResultRef = firebase.database().ref("results").push();
            result.user = userName;
            return newResultRef.set(result);
        });
    }

    addGame(user, result, mode){

    }

    getIPInfo() {
       return fetch('https://ipfind.co/me?auth=50e887ce-e3bb-4f00-a9b9-667597db5539')
            .then(res => res.json());
    }
}