import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2";

export const RecordVideo = () => {

    const url: string = "https://api.cloudinary.com/v1_1/didbn5pv6/auto/upload";        
    const formData = new FormData();
    const timer: number = 60 //cantidad de seg

    const [isRecording, setIsRecording] = useState<boolean>( false )
    const [timesUp, setTimesUp] = useState<number>( 0 )
    let audio: any = ''
    
    

    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const streamRecorderRef = useRef<MediaRecorder | null>(null)

    const [downloadLink, setDownloadLink] = useState<string>("")

    const [audioSource, setAudioSource] = useState<string>('')
    const [videoSource, setVideoSource] = useState<string>('')

    const chunks = useRef<any[]>([]);
    
    const startRecording = () =>{
        const loader = document.getElementById('loader')
        loader?.classList.add('loader')
        loader?.classList.remove('opacity-0')
        
        if ( isRecording ) return
        if ( !streamRef.current ) return
        streamRecorderRef.current = new MediaRecorder( streamRef.current )
        streamRecorderRef.current.start()
        streamRecorderRef.current.ondataavailable = ( e: BlobEvent ) => {
            if ( chunks.current ) {
                chunks.current.push( e.data )
            }
        }
        setIsRecording( true )
        audio.play()
        timerInit()
        
    }

    const timerInit = () => {
        let counter: number = 1
        const intervalTimer = setInterval( () => {
            counter++
            if ( counter == timer ) {
                clearInterval( intervalTimer )
                stopRecording()
                audioControls()
            }
            setTimesUp(((counter*100)/timer))
        }, 1000)
    }

    const stopRecording = () =>{
        if ( !streamRecorderRef.current ) return 
        streamRecorderRef.current.stop()
        setIsRecording( false )
    }

    const audioControls = () => {
        audio.pause()
        audio.currentTime = 0
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
            setDownloadLink( secure_url )
        });


    }

    const blobToFile = ( blob: Blob, filename: string = 'newVideo.mp4') => {
        const b: any = blob
        b.lastModifiedDate = new Date();
        b.name = filename;
        return blob as File;
    }

    useEffect(() => {

        (async () => {
            audio = document.getElementById("beat")

            const gotStream = ( stream: MediaStream ) => {
                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            }

            const getStream = async () => {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach( track => track.stop() )
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
      
    }, [])
    
    useEffect(() => {
      if ( isRecording ) return
      if ( chunks.current.length == 0 ) return

      const blob = new Blob( 
        chunks.current, 
        { 
            type: 'video/x-matroska;codecs=avc1,opus',
        })
        // setDownloadLink( URL.createObjectURL(blob) )
        uploadFile( blob )
        chunks.current = []
    }, [ isRecording ])
    
    useEffect(() => {
        if ( downloadLink == "" ) return
      Swal.fire({
        title: 'Video Created',
        html: `Send your video by Email<br /><br /> <a href="mailto:youremail@here.com?subject=Video%20Redbull&body=Download%20video%20here:%20${ downloadLink }" style='text-decoration: underline;'>Click here</a>`,
        icon: 'success',

      })
    }, [ downloadLink ])
    

    return (
        <>  

            <div className="absolute w-11/12 h-5 left-1/2 bottom-44 -translate-x-2/4 rounded-xl overflow-hidden">
                {/* <div className="h-full bg-blue-500 transition ease-linear" style={{ width: `50%` }}></div> */}
                <span id="loader"
                    className="block opacity-0 relative h-full w-full border border-white border-solid rounded-[10px] overflow-hidden"></span>
            </div>
            <video ref={ videoRef } className="h-screen w-screen object-cover" autoPlay muted></video>
            <audio id="beat" controls className="hidden">
                <source type="audio/mp3" src="./beat_mix.mp3" />
            </audio>

            <div className="border border-red-600 rounded-full p-1 fixed left-1/2 -translate-x-2/4 bottom-6 grid align-middle hover:border-none">
                <button 
                    className="bg-red-600 rounded-full w-16 h-16 hover:bg-red-300 hover:w-[68px] hover:h-[68px] transition ease-out"
                    onClick={ startRecording } disabled={ isRecording }></button>
            </div>
            {/* <button onClick={ stopRecording } disabled={ !isRecording }>Stop</button> */}
            
            {/* <a href={ downloadLink } download="file.mp4"> Download </a> */}
            
        </>
    )
}
