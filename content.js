
let satirSayisi = document.querySelectorAll('#dgListe > tbody > tr').length;

for(i=2;i<=satirSayisi;++i){
    
    console.log(`dgListe_chkYarimGun_${i-2}`);
let devamsizlik = document.querySelector("#dgListe > tbody > tr:nth-child("+i+") > td:nth-child(10)").textContent.replace(/\n/g, '');
let arr =String(devamsizlik).split(',');
var index=0;

if(arr[0]=='\xa0')
{
    index=0;

}
else
{index=arr.length;}


console.log(index);

if(index>0&&index<7){
    document.getElementById(`dgListe_chkYarimGun_${i-2}`).checked=true;
    document.getElementById(`dgListe_chkTamGun_${i-2}`).checked=false;

}else if(index>6){


    document.getElementById(`dgListe_chkYarimGun_${i-2}`).checked=false;
    document.getElementById(`dgListe_chkTamGun_${i-2}`).checked=true;

}else{
    document.getElementById(`dgListe_chkYarimGun_${i-2}`).checked=false;
    document.getElementById(`dgListe_chkTamGun_${i-2}`).checked=false;

 
}

}


