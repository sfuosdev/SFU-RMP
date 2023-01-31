
export function store(key, val) {
    var obj = {};
    obj[key] = val
    chrome.storage.local.set(obj, function() {
        console.log("Saves to storage",obj);
    });

}

export function retrieve(key) {
    chrome.storage.local.get(key, function (obj) {
        console.log("returned js object ", obj);
    });
}

export function checkStorage(key) {
   
    chrome.storage.local.get(key, function (obj) {
        if(Object.keys(obj).length==0){
            console.log("false")
            return false
        }
        else{
            console.log("true")
            return true
        }
    });
}




