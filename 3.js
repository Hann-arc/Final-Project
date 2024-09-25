function pattrn(num){
    if (num % 2 === 0){
        console.log("Nomor harus ganjil!!")
        return;
    }


    const mid = Math.floor(num / 2);

    for (let i = 0; i < num; i++){
        let row = " ";

        if (i === 0 || i === mid || i === num - 1){
            for (let j = 0; j < num; j++){
                if (i === 0){
                    if (j === 0){
                        row += "* ";
                    }
                    else if (j === mid){
                        row += "* ";
                    }
                    else if (j === num -1){
                        row += "* "
                    }
                    else{
                        row += "# "
                    }
                }
                else if (i === mid){
                    if(j === mid){
                        row += "# "
                    }
                    else{
                        row += "* "
                    }
                }
                else {
                    if (j === num - 1){
                        row += "* "
                    }
                    else if (j === mid){
                        row += "* "
                    }
                    else if (j === 0){
                        row += "* "
                    }
                    else{
                        row += "# "
                    }
                }
            }
        }
        else{
            for (let j = 0; j < num; j++){
                if (j === mid){
                    row += "* "
                }
                else{
                    row += "# "
                }
            }
        }

        console.log(row)

    }
    
}

pattrn(5);
console.log("==============");
pattrn(7)
