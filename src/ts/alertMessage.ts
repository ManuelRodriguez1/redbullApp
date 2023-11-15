import Swal from "sweetalert2";

export const alertMessage = ( url: string ) => {
    screenLoading.classList.add('opacity-0')
    Swal.fire({
        allowOutsideClick: false,
        title: `<div class="w-28 h-28 border-[6px] border-[#0A2E89] rounded-full mx-auto flex justify-center items-center"><img src="../images/checkIcon.svg" /></div>
        <h2 class=" -mt-3 font-bold font-Adieu uppercase text-[26px] text-[#0A2E89]">Video finalizado</h2>`,
        html: `<p class="text-sm font-Adieu uppercase w-[363px] mx-auto text-[#0A2E89]">Presiona el botón de “enviar” para recibir el link de descarga en tu correo electrónico.</p>`,
        reverseButtons: true,
        showDenyButton: true,
        denyButtonText: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.72377 7.99118C2.55247 8.1462 2.4547 8.36642 2.45459 8.59745V14.3133C2.45549 14.5415 2.64032 14.7264 2.86859 14.7273H6.95459C7.18052 14.7273 7.36368 14.5441 7.36368 14.3182L7.36859 10.2273C7.36859 10.0013 7.55175 9.81818 7.77768 9.81818H10.2224C10.3323 9.81796 10.4377 9.86151 10.5154 9.9392C10.5931 10.0169 10.6366 10.1223 10.6364 10.2322V14.3182C10.6364 14.5441 10.8196 14.7273 11.0455 14.7273H15.1364C15.3623 14.7273 15.5455 14.5441 15.5455 14.3182V8.59745C15.5454 8.36642 15.4476 8.1462 15.2763 7.99118L9.2725 2.56009C9.11729 2.42152 8.8828 2.42152 8.72759 2.56009L2.72377 7.99118Z" fill="#000F1E"/>
         </svg>`,
        denyButtonColor: '#000f1e0d',
        confirmButtonText: `<span class="flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.63623 3.68181V14.3182C1.63623 14.5441 1.81939 14.7273 2.04532 14.7273H15.9544C16.1803 14.7273 16.3635 14.5441 16.3635 14.3182V3.68181C16.3635 3.45588 16.1803 3.27272 15.9544 3.27272H2.04532C1.81939 3.27272 1.63623 3.45588 1.63623 3.68181ZM14.0399 4.49999L8.99168 8.5909L3.9435 4.49999H14.0399ZM2.8635 13.5V5.20363L8.73805 9.92454C8.89031 10.0405 9.10124 10.0405 9.2535 9.92454L15.1362 5.19545V13.5H2.8635Z" fill="white"/>
        </svg>Enviar</span>`,
        confirmButtonColor: "#DB0A40",
        footer: `<p class="font-bull text-[#0A2E89] w-[275px] mx-auto text-xs">Espera de 10 a 20 minutos para recibir el link de descarga del video en tu correo electrónico.</p>`
      }).then(( result ) => {
        if ( result.isConfirmed ) {
            location.href = `mailto:youremail@here.com?subject=Video%20Red%20Bull&body=Download%20video%20here:%20${ url }`;
            Swal.fire({
                allowOutsideClick: false,
                title: `<div class="flex justify-center items-center"><img src="../images/sentIcon.svg" /></div>
                <h2 class=" -mt-3 font-bold font-Adieu uppercase text-[26px] text-[#0A2E89]">Link enviado</h2>`,
                html: `<p class="text-sm font-Adieu uppercase w-[363px] mx-auto text-[#0A2E89]">Comparte tu video en redes sociales usando el hashtag <span class="text-[#DD0841]">#redbullbatalla</span></p>`,
                confirmButtonText: `Finalizar`,
                confirmButtonColor: "#DB0A40",
                icon: false,
                footer: `<p class="font-bull text-[#0A2E89] w-[275px] mx-auto text-xs">Espera de 10 a 20 minutos para recibir el link de descarga del video en tu correo electrónico.</p>`
              })
        } else if( result.isDenied ) { 
            location.href = `/`
        }
      })
}