const filter = (arr) => {
    const res = [];
    arr.forEach(ele => {
        if(ele < 5)
            res.push(ele);
    });
    return res;
}

export default{
    filter
}