
export function store(key, val) {
    var obj = {};
    obj[key] = val
    chrome.storage.local.set(obj);

}

export async function retrieve(key) {
    const data = await chrome.storage.local.get(key);
    return data
}

export async function checkStorage(key) {
    var bool = false;
    const data = await chrome.storage.local.get(key);
    if(Object.keys(data).length ==1){
        bool= true
    }
    else{
        bool = false
    }
    return bool
}




