

export function store(key,obj) {
    console.log("storage function working");
    let values = JSON.stringify(obj);
    localStorage.setItem(key, values);
}

export function retreive(key){
    if(localStorage.getItem(key) != null){
        return JSON.parse(localStorage.getItem(key));
        }
    else{
        return false;
        }
}



