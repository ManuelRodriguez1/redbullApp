import { useEffect, useState } from 'react'

export const Devices = () => {

    const [audioSource, setAudioSource] = useState<string>('')
    const [videoSource, setVideoSource] = useState<string>('')
    const [audioSourceOptions, setAudioSourceOptions] = useState<Record<string, string>[]>([])
    const [videoSourceOptions, setVideoSourceOptions] = useState<Record<string, string>[]>([])

    useEffect(() => {
        
        (async () => {
            const getDevices = () => {
                return navigator.mediaDevices.enumerateDevices();
            }
        
            const gotDevices = (deviceInfos: MediaDeviceInfo[]) => {
                const audioSourceOptions = []
                const videoSourceOptions = []
        
                for( const deviceInfo of deviceInfos ) {
                    if ( deviceInfo.kind === 'audioinput' ) {
                        audioSourceOptions.push({
                            value: deviceInfo.deviceId,
                            label: deviceInfo.label || `Microphone ${ deviceInfo.deviceId }`
                        })
                    }else if ( deviceInfo.kind === 'videoinput' ){
                        videoSourceOptions.push({
                            value: deviceInfo.deviceId,
                            label: deviceInfo.label || `Camera ${ deviceInfo.deviceId }`
                        })
                    }
                }
                setAudioSourceOptions( audioSourceOptions )
                setVideoSourceOptions( videoSourceOptions )
            }
        
            const mediaDevices = await getDevices()
            gotDevices( mediaDevices )
        })()

    }, [])
    

  return (
    
    <>
        <select name="" id="videoSource" value={ videoSource } onChange={ () => {} }>
                { videoSourceOptions.map( option => (
                    <option key={ option.value } value={ option.value }>
                        { option.label }
                    </option>
                )) }
            </select>
            <select name="" id="audioSource" value={ audioSource } onChange={ () => {} }>
            { audioSourceOptions.map( option => (
                    <option key={ option.value } value={ option.value }>
                        { option.label }
                    </option>
                )) }
            </select>
    </>
  )
}
