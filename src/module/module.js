const sortListClass = function (obj) {
    let KQ = obj.sort(function(a, b){
        if (a.name < b.name) {return -1;}
        if (a.name > b.name) {return 1;}
        if (a.rank.toLowerCase() < b.rank.toLowerCase()) {return -1;}
        if (a.rank.toLowerCase() > b.rank.toLowerCase()) {return 1;}
        return 0;
    })
    return KQ
}
const sortListStudent = function (obj) {
    let KQ = obj.sort(function(a, b){
        function lastName (arr) {
            let idx = arr.lastIndexOf(' ')
            let kq = arr.slice(idx)
            return kq
        }
        if (lastName(a.name.toLowerCase()) < lastName(b.name.toLowerCase())) {return -1;}
        if (lastName(a.name.toLowerCase()) > lastName(b.name.toLowerCase())) {return 1;}
        return 0;
    })
    return KQ
}

export {
    sortListClass,
    sortListStudent
}