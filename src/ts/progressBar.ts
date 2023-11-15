
const dots: any = document.querySelectorAll('.dots') 

const _btnRec: any = document.querySelector('#rec')
const _btnStop: any = document.querySelector('#stop')

let isActive = false;
let counter = 0;

_btnRec.addEventListener("click", async (e: any) =>{
    e.preventDefault()
    isActive = false;
    _btnRec.disabled = true;
    
    dots[0].classList.add("loader")
    
    const interval = setInterval(() =>{
        if( isActive ) {
            counter = -1;
            clearInterval( interval );
        }

        counter++;
        if( counter >= 20 ){
            dots[1].classList.add("loader")  
        }
        if( counter >= 40 ){
            dots[2].classList.add("loader")  
            counter = 0;
            clearInterval( interval );
        }
    }, 1000)

})

_btnStop.addEventListener("click", ( e: any ) => {
    e.preventDefault();

    dots.forEach( ( i: any ) => i.classList.remove("loader") );
    _btnRec.disabled = false;
    isActive = true;
    counter = 0;
})



