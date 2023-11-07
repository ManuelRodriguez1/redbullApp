import Swal from "sweetalert2";
// import { POST } from '../pages/api/shortUrl.json.ts'

// const audioPublicId = 'n8a4qzsxs1anb4j3nfbw'
// const imgPublicId = 'dz6cbwuny3pvgquexxuz'
// const videoPublicId = 'j6cgvsuxd6jzaou5dy4n'
// const colorTransparency = 'green'
// const _urlImage = `upload/c_pad,h_1350,w_1080/l_img:${ imgPublicId }/fl_layer_apply/l_video:videoAlpha:${  videoPublicId }/co_${ colorTransparency },e_make_transparent:15/fl_layer_apply/l_audio:audio:${ audioPublicId }/fl_layer_apply`
const _urlImage = `upload/t_rb`
const url: string = "https://api.cloudinary.com/v1_1/didbn5pv6/auto/upload";  
const formData = new FormData();
const timer: number = 62 //cantidad de seg 62

//https://res.cloudinary.com/didbn5pv6/video/upload/t_rb/v1698955341/qnpzjp17nfsl4vdi6lvc.mp4

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

    btnRec.classList.remove('bg-red-600')
    btnRec.classList.add('bg-gray-600')
    btnStop.classList.remove('bg-gray-600')
    btnStop.classList.add('bg-red-600')

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

    btnRec.classList.remove('bg-gray-600')
    btnRec.classList.add('bg-red-600')
    btnStop.classList.remove('bg-red-600')
    btnStop.classList.add('bg-gray-600')

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

        // shortUrl( _newUrl ) //TODO: Seguir probando
        alertMessage( _newUrl ) //? Para que Jaime lo pruebe
    });

}

const blobToFile = ( blob: Blob, filename: string = 'newVideo.mov') => {
    const b: any = blob
    b.lastModifiedDate = new Date();
    b.name = filename;
    return blob as File;
}

const shortUrl = async ( _url: any ) => {

    
    fetch(window.location+'api/shortUrl.json', {
        body: JSON.stringify({
            "domain": "l.rblab.io",
            "originalURL": _url
        })
    }).then( ( response ) => {
        console.log(response)
    })
    //    let resp = await POST( _url )
    //    console.log( resp )
}


const alertMessage = ( url: string ) => {
    screenLoading.classList.add('opacity-0')
    Swal.fire({
        title: 'Video Created',
        html: `Send your video by Email<br /><br /> <a href="mailto:youremail@here.com?subject=Video%20Red%20Bull&body=Download%20video%20here:%20${ url }" style='text-decoration: underline;'>Click here</a>`,
        icon: 'success',
      })
}
