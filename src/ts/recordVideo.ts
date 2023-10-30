import Swal from "sweetalert2";

const audioPublicId = 'n8a4qzsxs1anb4j3nfbw'
const imgPublicId = 'dz6cbwuny3pvgquexxuz'
const videoPublicId = 'j6cgvsuxd6jzaou5dy4n'
const _urlImage = `upload/c_pad,h_1350,w_1080/l_img:${ imgPublicId }/fl_layer_apply/l_video:videoAlpha:${  videoPublicId }/co_green,e_make_transparent:14/fl_layer_apply/l_audio:audio:${ audioPublicId }/fl_layer_apply`
const url: string = "https://api.cloudinary.com/v1_1/didbn5pv6/auto/upload";  
const formData = new FormData();
const timer: number = 10; //cantidad de seg

//https://res.cloudinary.com/didbn5pv6/video/upload/c_pad,h_1350,w_1080/l_img:dz6cbwuny3pvgquexxuz/fl_layer_apply/l_video:videoAlpha:j6cgvsuxd6jzaou5dy4n/co_green,e_make_transparent:14/fl_layer_apply/l_audio:audio:svipo909nrnmilfpeqiw/fl_layer_apply/v1698266224/gphk9ynqlw7uaflee6io.mp4


const videoRef: any = document.querySelector('#videoRecording');
const audioSource: string = '';
const videoSource: string = '';

let chunks: any[] = [];
let streamRecorderRef: any = '';
let streamRef = new MediaStream();
let audio: any = document.getElementById("beat");
let _newUrl: string = '';

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

document.querySelector('button')
    ?.addEventListener("click", (e) =>{
        e.preventDefault();

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

    fetch(url, {
        method: "POST",
        body: formData
    }).then(( response ) => {
        return response.text();
    }).then(( data ) => {
        
        const { secure_url } = JSON.parse( data )
        const newUrl = secure_url.split('upload')
        _newUrl = newUrl[0]+_urlImage+newUrl[1]

        shortUrl( _newUrl )
    });

}

const blobToFile = ( blob: Blob, filename: string = 'newVideo.mov') => {
    const b: any = blob
    b.lastModifiedDate = new Date();
    b.name = filename;
    return blob as File;
}

const shortUrl = ( _url: string ) => {
    const _newUrl = `https://ulvis.net/api.php?url=${ _url }&private=1&type=json`
    // const _newUrl = `https://ulvis.net/api.php?url=`
    console.log(_newUrl)
    fetch( _newUrl, {
        // method: 'POST',
        // headers: new Headers({
        //     'Content-Type': 'application/json',
        //     'Access-Control-Allow-Origin': '*',
        // }),
        // body: _url
    }).then( (  data: any ) => {
        console.log( data )
            // const { url } = data
            // alertMessage( url );
        })

}


const alertMessage = ( url: string ) => {
    Swal.fire({
        title: 'Video Created',
        html: `Send your video by Email<br /><br /> <a href="mailto:youremail@here.com?subject=Video%20Redbull&body=Download%20video%20here:%20${ url }" style='text-decoration: underline;'>Click here</a>`,
        icon: 'success',
      })
}
