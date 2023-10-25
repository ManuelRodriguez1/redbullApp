import Swal from "sweetalert2";

const _urlImage = 'upload/l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGlkYm41cHY2L2ltYWdlL3VwbG9hZC92MTY5ODI0NTk5MC9zYW1wbGVzL3JlYnVsbC9tYXJjb1JlZGJ1bGxfYzRhajJsLnBuZw==/fl_layer_apply/l_audio:v1698247701:audio:beat_mix_cttg7q/fl_layer_apply'
const url: string = "https://api.cloudinary.com/v1_1/didbn5pv6/auto/upload";  
const formData = new FormData();
const timer: number = 60; //cantidad de seg

const videoRef: any = document.querySelector('video');
const audioSource: string = '';
const videoSource: string = '';

let chunks: any[] = [];
let streamRecorderRef: any = '';
let streamRef = new MediaStream();
let audio: any = document.getElementById("beat");
let _newUrl: string = '';

( async () => {
        
    const gotStream = ( stream: MediaStream ) => {
        console.log('gotStream')
        streamRef = stream
        if ( videoRef ) {
            videoRef.srcObject = stream
        }
    }

    const getStream = async () => {
        console.log('getStream')
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

document.querySelector('button')
    ?.addEventListener("click", (e) =>{
        e.preventDefault();

        console.log('StartRecording')

        if ( !streamRef ) return;
        
        streamRecorderRef = new MediaRecorder( streamRef );
        streamRecorderRef.start();
        streamRecorderRef.ondataavailable = ( e: BlobEvent ) => {
            console.log(e)
            if ( chunks ) {
                chunks.push( e.data )
            }
        }
        console.log('clases')
        const loader = document.getElementById('loader');
        loader?.classList.add('loader');
        loader?.classList.remove('opacity-0');
        audio.play();
        timerInit();
    
})

const timerInit = () => {
    let counter: number = 1
    const intervalTimer = setInterval( () => {
        counter++
        if ( counter == timer ) {
            clearInterval( intervalTimer )
            stopRecording()
            audioControls()
        }
    }, 1000)
}

const stopRecording = () =>{
    console.log('stop recording')
    // console.log(!!streamRecorderRef)
    // if ( !!!streamRecorderRef ) return 
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
    console.log(chunks.length)
      if ( chunks.length == 0 ) return
        console.log('UseEffect Recording')
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
      
    console.log('UploadFile')

    fetch(url, {
        method: "POST",
        body: formData
    }).then(( response ) => {
        
        console.log('uploading')
        return response.text();
    }).then(( data ) => {
        
        const { secure_url } = JSON.parse( data )
        const newUrl = secure_url.split('upload')
        _newUrl = newUrl[0]+_urlImage+newUrl[1]
        alertMessage()
        // setDownloadLink( newUrl[0]+_urlImage+newUrl[1] )
    });

}

const blobToFile = ( blob: Blob, filename: string = 'newVideo.mov') => {
    const b: any = blob
    b.lastModifiedDate = new Date();
    b.name = filename;
    return blob as File;
}

const alertMessage = () => {
    Swal.fire({
        title: 'Video Created',
        html: `Send your video by Email<br /><br /> <a href="mailto:youremail@here.com?subject=Video%20Redbull&body=Download%20video%20here:%20${ _newUrl }" style='text-decoration: underline;'>Click here</a>`,
        icon: 'success',
      })
}