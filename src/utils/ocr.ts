import MLKitOcr from 'react-native-mlkit-ocr'

export const performOCR = async (imagePath: string): Promise<string[]> => {
    try {
        const result = await MLKitOcr.detectFromFile(imagePath)
        return result.map(item => item.text)
    } catch (error) {
        console.error('OCR 실패 : ', error)
        return []
    }
}