function hitungBarang(quality, quantity){
    let harga ;
    let potHarga;


    switch(quality){
        case 'A':
            harga = 4550
            if (quantity > 13){
                potHarga = 231;
            }
            else{
                potHarga = 0;
            }
        break;
        case 'B':
            harga = 5330
            if (quantity > 7){

                potHarga = (23 / 100) * harga
            }
            else{
                potHarga = 0;
            }
        break;
        case 'C':
            harga = 8653;
            potHarga = 0;
        break;
        default:
            return 0
    }

   let totalHargaBarang = harga * quantity ;
   let totalPotongan = potHarga * quantity;
   let totalBayar = totalHargaBarang - totalPotongan;


   console.log(` - Total harga barang : ${totalHargaBarang}`);
   console.log(` - Total potongan : ${totalPotongan}`);
   console.log(` - Total yang harus dibayar : ${totalBayar}`);
   console.log("=======================================")

}

hitungBarang('A', 14);
hitungBarang('B', 8);
hitungBarang('C', 2);