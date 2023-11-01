
const progress: any = document.querySelectorAll('.proB') 
const iconArrow: any = document.querySelectorAll('.icon-arrow')
const iconCheck: any = document.querySelectorAll('.icon-check')
const _btnRec: any = document.querySelector('#rec')
const _btnStop: any = document.querySelector('#stop')

let isActive = false;
const duration = 20000; // Duración total (20 segundos)
let cont = -1;
const colors = ['#FFDB3E', '#EA3651', '#0442C5'];

const showIcons = ( i: number ) => {
  switch ( i ) {
    case 1:
        iconArrow[0].classList.add('opacity-0')
        iconArrow[1].classList.remove('opacity-0')
        iconCheck[0].classList.remove('opacity-0')
      break;

    case 2:
        iconArrow[1].classList.add('opacity-0')
        iconArrow[2].classList.remove('opacity-0')
        iconCheck[1].classList.remove('opacity-0')
      break;
    
    case 3:
        iconArrow[2].classList.add('opacity-0')
        iconCheck[2].classList.remove('opacity-0')
      break;
  }
}

const forceRedraw = (element: any) => {
    void element.offsetHeight;
}

const updateColorAndProgress = ( color: string ) => {

  progress[1].style.backgroundColor = color ;
  progress[0].style.borderColor = color;
  // Quitar las animaciones
  progress[1].classList.remove('barra-animada');
  progress[2].classList.remove('numbers');
  // Forzar redibujo
  forceRedraw(progress[1]);
  forceRedraw(progress[2]);

  progress[1].classList.add('barra-animada');
  progress[2].classList.add('numbers');
  
  return new Promise(( resolve: any ) => {
    
    const updateInterval = setInterval( () => {
      
      if( isActive ) { 
        cont = 0;
        clearInterval( updateInterval );
        return
      }

      cont++;
      
      if ( cont >= 20 ) {
        cont = 0;
        progress[1].classList.remove('barra-animada');
        progress[2].classList.remove('numbers');
        clearInterval( updateInterval );
        resolve();
        
      }
      
    }, 1000 );
    
  })

}

_btnRec.addEventListener("click", async (e: any) =>{
    e.preventDefault()
    isActive = false;
    _btnRec.disabled = true;

    iconArrow[0].classList.remove('opacity-0')
    
    for await (let i of colors.keys() ){
      if( isActive ) return
      showIcons( i );
      await updateColorAndProgress( colors[i] )
    }
    
    showIcons( 3 );
})

_btnStop.addEventListener("click", ( e: any ) => {
    e.preventDefault();

    _btnRec.disabled = false;
    isActive = true;
    updateColorAndProgress( colors[0] )

    cont = 0;
    progress[1].classList.remove('barra-animada');
    progress[2].classList.remove('numbers');
    iconArrow.forEach(( e: any ) => e.classList.add('opacity-0'))
    iconCheck.forEach(( e: any ) => e.classList.add('opacity-0'))

})



