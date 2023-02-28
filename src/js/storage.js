
export function store(key, val) {
    var obj = {};
    obj[key] = val
    chrome.storage.sync.set(obj);

}

export async function retrieve(key) {
    const data = await chrome.storage.sync.get(key);
    return data
}

export async function checkStorage(key) {
    var bool = false;
    const data = await chrome.storage.sync.get(key);
    if(Object.keys(data).length ==0){
        bool= false
    }
    else{
        bool = true
    }
    return bool
}




