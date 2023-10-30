
function startProgressBar() {
    
    const progressBar: any= document.getElementById('progress-bar');
    const progressText: any = document.getElementById('progress-text');
    const progressContainer: any = document.getElementById('progress-container');
    
    

    function updateColorAndProgress(color:any) {
      progressBar.style.backgroundColor = color ;
      progressContainer.style.borderColor = color;
      progressBar.style.width = '0%';
      progressText.textContent = '0%';

      return new Promise((resolve:any) => {
        let width = 1; // Inicializa en 1 para evitar división por cero
        const interval = 10; // Intervalo de actualización (milisegundos)
        const duration = 20000; // Duración total (20 segundos)
        const totalUpdates = duration / interval;
        const increment = 100 / totalUpdates;

        const updateInterval = setInterval(() => {
          width += increment;
          progressBar.style.width = width + '%';
          progressText.textContent = Math.round(width) + '%';

          if (width >= 100) {
            clearInterval(updateInterval);
            resolve();
          }
        }, interval);
      });
    }

    async function runColorCycle() {
      const colors = ['#FFDB3E', '#EA3651', '#0442C5'];
      const svg1: any = document.getElementById('svg1');
      const svg2: any = document.getElementById('svg2');
      const svg3: any = document.getElementById('svg3');
      const svg11: any = document.getElementById('svg11');
      const svg22: any = document.getElementById('svg22');
      const svg33: any = document.getElementById('svg33');

        svg1.style.opacity = "1";
        svg2.style.opacity = "0";
        svg3.style.opacity = "0";
        svg11.style.opacity = "0";
        svg22.style.opacity = "0";
        svg33.style.opacity = "0";
      for (let i = 0; i < colors.length; i++) {
        await updateColorAndProgress(colors[i]);
      if(i == 1){
        svg1.style.opacity = "0";
        svg2.style.opacity = "0";
        svg3.style.opacity = "1";
        svg11.style.opacity = "1";
        svg22.style.opacity = "1";
        svg33.style.opacity = "0";
          //  svg1.src="image2.jpg"
           // document.getElementById('progressDiv2').src="image2.jpg";
        console.log('2');
        }else if(i == 2){
            svg1.style.opacity = "0";
            svg2.style.opacity = "0";
            svg3.style.opacity = "0";
            svg11.style.opacity = "1";
            svg22.style.opacity = "1";
            svg33.style.opacity = "1";
            console.log('3');
           // document.getElementById('progressDiv3').src="image2.jpg";
        }else{
            console.log('4');
            svg1.style.opacity = "0";
            svg2.style.opacity = "1";
            svg3.style.opacity = "0";
            svg11.style.opacity = "1";
            svg22.style.opacity = "0";
            svg33.style.opacity = "0";
        }
      
      }
      // Detener el ciclo después de un ciclo completo de colores
    }

    runColorCycle();
  }

  document.querySelector('button')
    ?.addEventListener("click", (e) =>{
      e.preventDefault()
      startProgressBar()
    })