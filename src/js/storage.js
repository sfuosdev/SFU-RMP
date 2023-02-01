
export function store(key, val) {
    var obj = {};
    obj[key] = val
    chrome.storage.local.set(obj);

}

export function retrieve(key) {
    const data =  await chrome.storage.local.get(key);
    return data
}

export function checkStorage(key) {
   const bool = true
    chrome.storage.local.get(key, function (obj) {
        if(Object.keys(obj).length==0){
            bool = false
        }
        else{
            bool = true
        }
    });
    return bool
}




