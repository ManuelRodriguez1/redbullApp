import Swal from "sweetalert2";

const _urlImage = `upload/t_rb`
const url: string = "https://api.cloudinary.com/v1_1/didbn5pv6/auto/upload";  
const formData = new FormData();
const timer: number = 62 //cantidad de seg 62

const screenLoading: any = document.querySelector('#screenLoading');
const videoRef: any = document.querySelector('#videoRecording');
const audioSource: string = '';
const videoSource: string = '';
const btnRec: any = document.querySelector('#rec')
const btnStop: any = document.querySelector('#stop')

let chunks: any[] = [];
let streamRecorderRef: any = '';
let streamRef = new MediaStream();
let audio: any = document.getElementById("beat");
let _newUrl: string = '';
let counter: number = 1;
let _isActive: boolean = false;



( async () => {
        
    const gotStream = ( stream: MediaStream ) => {
        streamRef = stream
        if ( videoRef ) {
            videoRef.srcObject = stream
        }
    }

    const getStream = async () => {
        if (streamRef) {
            streamRef.getTracks().forEach( (track: any) => track.stop() )
        }
        const constraints = {
            audio: { deviceId: audioSource !== '' ? { exact: audioSource } : undefined},
            video: { deviceId: videoSource !== '' ? { exact: videoSource } : undefined}
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia( constraints )
            gotStream( stream )
        } catch (error: any) {
            console.log(error)
        }
    }
    
    await getStream()
})()

btnRec.addEventListener("click", ( e: any ) =>{
    e.preventDefault();

    _isActive = false;

    btnRec.classList.remove('bg-[#DB0A40]')
    btnRec.classList.remove('border-[#DB0A40]')
    btnRec.classList.add('bg-[#ffffff0d]')
    btnRec.classList.add('border-[#ffffff33]')

    btnStop.classList.remove('bg-[#ffffff0d]')
    btnStop.classList.remove('border-[#ffffff33]')
    btnStop.classList.add('bg-[#DB0A40]')
    btnStop.classList.add('border-[#DB0A40]')

    if ( !streamRef ) return;
    
    streamRecorderRef = new MediaRecorder( streamRef );
    streamRecorderRef.start();
    streamRecorderRef.ondataavailable = ( e: BlobEvent ) => {
        if ( chunks ) {
            chunks.push( e.data )
        }
    }
    const loader = document.getElementById('loader');
    loader?.classList.add('loader');
    loader?.classList.remove('opacity-0');
    audio.play();
    timerInit();
    
})

btnStop.addEventListener("click", ( e: any ) => {
    e.preventDefault();

    btnRec.classList.remove('bg-[#ffffff0d]')
    btnRec.classList.remove('border-[#ffffff33]')
    btnRec.classList.add('bg-[#DB0A40]')
    btnRec.classList.add('border-[#DB0A40]')
    
    btnStop.classList.remove('bg-[#DB0A40]')
    btnStop.classList.remove('border-[#DB0A40]')
    btnStop.classList.add('bg-[#ffffff0d]')
    btnStop.classList.add('border-[#ffffff33]')

    chunks = [];
    streamRecorderRef = '';
    _newUrl = '';
    counter = 1;
    _isActive = true;

    audioControls()

})

const timerInit = () => {

    const intervalTimer = setInterval( () => {
        
        if( _isActive ) {
            clearInterval( intervalTimer ); 
            return
        }

        counter++
        if ( counter == timer ) {
            clearInterval( intervalTimer )
            stopRecording()
            audioControls()
        }
    }, 1000)
}

const stopRecording = () =>{
    streamRecorderRef.stop()
    setTimeout(() => {
        recording()
    }, 1000);
}

const audioControls = () => {
    audio.pause()
    audio.currentTime = 0
}

const recording = () => {
      if ( chunks.length == 0 ) return
      const blob = new Blob( 
        chunks, 
        { 
            type: 'video/x-matroska;codecs=avc1,opus',
            // type: 'video/mp4;codecs=avc1',
        })
        // setDownloadLink( URL.createObjectURL(blob) )
        uploadFile( blob )
        chunks = []
}

const uploadFile = ( blob: Blob ) => {

    formData.append("file", blobToFile( blob ));
    formData.append("upload_preset", "zt69ebf3");
    screenLoading.classList.remove('opacity-0')


    fetch(url, {
        method: "POST",
        body: formData
    }).then(( response ) => {
        return response.text();
    }).then(async ( data ) => {
        
        const { secure_url } = JSON.parse( data )
        const newUrl = secure_url.split('upload')
        _newUrl = newUrl[0]+_urlImage+newUrl[1]
        
        alertMessage( _newUrl ) 
        btnStop.click();
        
    });

}

const blobToFile = ( blob: Blob, filename: string = 'newVideo.mov') => {
    const b: any = blob
    b.lastModifiedDate = new Date();
    b.name = filename;
    return blob as File;
}


const alertMessage = async ( url: string ) => {
    screenLoading.classList.add('opacity-0')
    
    setTimeout(() => {
        const qrImage: any = document.querySelector('.qrCode');
        new QRCode(qrImage, {
            text: url,
          });
    }, 1000);

    Swal.fire({
        allowOutsideClick: false,
        title: `<div class="w-28 h-28 border-[6px] border-[#0A2E89] rounded-full mx-auto flex justify-center items-center"><img src="../images/checkIcon.svg" /></div>
        <h2 class=" -mt-3 font-bold font-Adieu uppercase text-[26px] text-[#0A2E89]">Video finalizado</h2>`,
        html: `<p class="text-sm font-Adieu uppercase w-[363px] mx-auto text-[#0A2E89]">Presiona el botón de “enviar” para recibir el link de descarga en tu correo electrónico.</p>
        <div class="flex justify-center mt-8"><div class="qrCode w-32 h-32" ></div></div>`,
        reverseButtons: true,
        showDenyButton: true,
        denyButtonText: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.72377 7.99118C2.55247 8.1462 2.4547 8.36642 2.45459 8.59745V14.3133C2.45549 14.5415 2.64032 14.7264 2.86859 14.7273H6.95459C7.18052 14.7273 7.36368 14.5441 7.36368 14.3182L7.36859 10.2273C7.36859 10.0013 7.55175 9.81818 7.77768 9.81818H10.2224C10.3323 9.81796 10.4377 9.86151 10.5154 9.9392C10.5931 10.0169 10.6366 10.1223 10.6364 10.2322V14.3182C10.6364 14.5441 10.8196 14.7273 11.0455 14.7273H15.1364C15.3623 14.7273 15.5455 14.5441 15.5455 14.3182V8.59745C15.5454 8.36642 15.4476 8.1462 15.2763 7.99118L9.2725 2.56009C9.11729 2.42152 8.8828 2.42152 8.72759 2.56009L2.72377 7.99118Z" fill="#000F1E"/>
         </svg>`,
        denyButtonColor: '#000f1e0d',
        confirmButtonText: `<span class="flex gap-2 items-center">Finalizar</span>`,
        confirmButtonColor: "#DB0A40",
        footer: `<p class="font-bull text-[#0A2E89] w-[275px] mx-auto text-xs">Espera de 10 a 20 minutos para recibir el link de descarga del video en tu correo electrónico.</p>`
      })
}