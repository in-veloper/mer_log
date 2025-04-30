import { useEffect, useRef, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Camera, CameraPermissionStatus, useCameraDevice } from "react-native-vision-camera"
import { performOCR } from "../utils/ocr"
import { launchImageLibrary } from "react-native-image-picker"

const CaptureScreen = () => {
    const camera = useRef<Camera>(null)
    const device = useCameraDevice('back')
    const [hasPermission, setHasPermission] = useState(false)

    useEffect(() => {
        (async () => {
            const permission: CameraPermissionStatus = await Camera.requestCameraPermission()
            setHasPermission(permission === 'granted')
        })()
    }, [])

    const handleCapture = async () => {
        if(!camera.current) return

        try {
            const photo = await camera.current.takePhoto()
            console.log('사진 저장 위치 : ', photo.path)

            const result = await performOCR(photo.path)
            console.log('OCR 결과 : ', result)

            if(result.length === 0) {
                Alert.alert('인식 실패', '텍스트를 인식하지 못했습니다')
            }else{
                Alert.alert('인식 성공', result.join('\n'))
            }
        } catch (error) {
            console.error('촬영 또는 OCR 실패 : ', error)
        }
    }

    const handleSelectFromGallery = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 1
            })

            if(result.didCancel || !result.assets || result.assets.length === 0) {
                console.log('사용자가 선택을 취소했거나 결과 없음')
                return
            }

            const imageUri = result.assets[0].uri
            if(!imageUri) return

            console.log('선택된 이미지 : ', imageUri)

            const ocrResult = await performOCR(imageUri)
            
            if(ocrResult.length === 0) {
                Alert.alert('인식 실패', '텍스트를 인식하지 못했습니다')
            }else{
                Alert.alert('OCR 결과', ocrResult.join('\n'))
            }
        } catch (error) {
            console.error('갤러리 이미지 선택 오류 : ', error)
        }
    }

    if(!device || !hasPermission) {
        return (
            <View style={styles.center}>
                <Text>카메라 권한이 필요합니다</Text>
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            />
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.galleryButton} onPress={handleSelectFromGallery}>
                    <Text style={styles.buttonText}>🖼 갤러리</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                    <Text style={styles.buttonText}>📷 촬영</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CaptureScreen

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    buttonRow: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 20,
    },
    galleryButton: {
        backgroundColor: '#555',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: '#227dbd',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
})