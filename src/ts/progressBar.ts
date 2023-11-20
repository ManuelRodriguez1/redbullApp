
const dots: any = document.querySelectorAll('.dots') 

const _btnRec: any = document.querySelector('#rec')
const _btnStop: any = document.querySelector('#stop')
const _beat1 = 21 //Segundos en el cambio del beat
const _beat2 = 17 //Segundos en el cambio del beat

let isActive = false;
let counter = 0;

_btnRec.addEventListener("click", async (e: any) =>{
    e.preventDefault()
    isActive = false;
    _btnRec.disabled = true;
    
    dots[0].classList.add("loader1")
    
    const interval = setInterval(() =>{
        if( isActive ) {
            counter = -1;
            clearInterval( interval );
        }

        counter++;
        if( counter >= _beat1 ){
            dots[1].classList.add("loader2")  
        }
        if( counter >= (_beat1 + _beat2) ){
            dots[2].classList.add("loader3")  
            counter = 0;
            clearInterval( interval );
        }
    }, 1000)

})

_btnStop.addEventListener("click", ( e: any ) => {
    e.preventDefault();

    dots[0].classList.remove("loader1");
    dots[1].classList.remove("loader2");
    dots[2].classList.remove("loader3");
    _btnRec.disabled = false;
    isActive = true;
    counter = 0;
})



