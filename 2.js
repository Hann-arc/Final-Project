function shortArr(arr){
    let a = arr.length;

    for (let i = 0; i < a - 1 ; i++){
        for (let b = 0; b < a - i - 1; b++){
            if (arr[b] > arr[b + 1]){
                let temp = arr[b];
                arr[b] = arr[b + 1];
                arr[b + 1] = temp;
            }
        }
    }

    return arr;
}

let array = [20, 12, 35, 11, 17, 9, 58, 23, 69, 21];

let shotArray = shortArr(array);

console.log(shotArray);