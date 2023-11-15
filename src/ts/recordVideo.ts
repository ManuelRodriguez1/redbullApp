import { alertMessage } from "./alertMessage";
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
    }).then(( data ) => {
        
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
