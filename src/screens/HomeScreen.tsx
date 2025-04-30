import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RootStackParamList } from "../navigation/types"

const dummyData = [
    { id: '1', name: '명동칼국수', address: '서울 중구' },
    { id: '2', name: '용산쭈꾸미', address: '대전광역시 유성구 용산동' }
]

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.addr}>{item.address}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>내 맛집 리스트</Text>
            <FlatList
                data={dummyData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Capture')}>
                <Ionicons name="camera" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    card: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    name: { 
        fontSize: 18, 
        fontWeight: '600' 
    },
    addr: { 
        fontSize: 14, 
        color: '#555' 
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#227dbd',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
})