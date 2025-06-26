import { View, Text, TouchableOpacity, Alert, Dimensions, Image, Modal, TextInput, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';

const App = () => {

  const [scan, setScan] = useState(false);
  const scaner = useRef(null);
  const [dataScan, setDataScan] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [cambiarPath, setCambiarPath] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [cargando, setCargando] = useState(false);

  const onSuccess = async (e) => {
    setScan(false);
    setCargando(true);
    const qrString = e.data;
    console.log('QR String:', qrString);
    const bookingId = qrString.split(";").find(p => p.startsWith("BookingId:"))?.split(":")[1];
    const eventName = qrString.split(";").find(p => p.startsWith("Event:"))?.split(":")[1];
    const Date = qrString.split(";").find(p => p.startsWith("Date:"))?.split(":")[1];
    console.log('BookingId:', bookingId);

    setTimeout( async () => {
      setCargando(false);
      if (bookingId === null || bookingId === undefined || bookingId === '') {
        Alert.alert('Error ⚠️', 'El código QR no pertenece a Massivo.');
      } else {
        setDataScan(e.data);
        console.log('IP:', `https://${apiUrl}/api/Booking/${bookingId}/complete`);
        await axios.put(`https://${apiUrl}/api/Booking/${bookingId}/complete`)
        .then(function (response) {
          console.log(response.data);
      Alert.alert('Éxito ✅', 'Su reserva para el evento: ' + eventName + ' fue confirmada con éxito');
        }).catch(function (error) {
          console.log(error);
          Alert.alert('Error ⚠️', 'No se pudo completar la operación. Inténtalo de nuevo más tarde.');
        });
      }
    }, 2000);

  }

  useEffect(() => {
    console.log('API URL:', apiUrl);
  }, [apiUrl])



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      {cargando ?
        <ActivityIndicator animating={true} color={'#139aa0'} />
        :

        scan ?
          <QRCodeScanner
            onRead={onSuccess}
            ref={scaner}
            reactivate={true}
            showMarker={true}

            topContent={
              <>
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>Escanear código QR </Text>
              </>
            }
            bottomContent={
              <TouchableOpacity style={{ height: Dimensions.get('screen').height * 0.05, width: Dimensions.get('screen').width * 0.6, backgroundColor: '#139aa0', borderRadius: 15, borderWidth: 1, borderColor: 'gray', alignItems: 'center', justifyContent: 'center' }} onPress={() => setScan(false)}>
                <Text style={{ borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: '500' }}>Salir</Text>
              </TouchableOpacity>
            }
          />
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
            <>
              <TouchableOpacity onPress={() => setCambiarPath(true)} style={{ flex: 0.1, alignItems: 'flex-end', justifyContent: 'center' }}><Text style={{ fontSize: 50 }}>🛠️</Text></TouchableOpacity>
              <View style={{ flex: 0.5 }}>
                <Image source={require('./logo2.png')} style={{ resizeMode: 'contain', height: Dimensions.get('screen').height * 0.4, width: Dimensions.get('screen').width * 0.8 }} />
              </View>

              <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={{ height: Dimensions.get('screen').height * 0.05, width: Dimensions.get('screen').width * 0.6, backgroundColor: '#139aa0', borderRadius: 15, borderWidth: 1, borderColor: 'gray', alignItems: 'center', justifyContent: 'center' }} onPress={() => setScan(true)}>
                  <Text style={{ borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: '500' }}>Escanear QR</Text>
                </TouchableOpacity>
              </View>


              <Modal visible={cambiarPath} transparent={true} animationType="slide" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View onPress={() => Keyboard.dismiss()} style={{ height: Dimensions.get('screen').height * 0.8, width: Dimensions.get('screen').width * 0.8, justifyContent: 'center', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#F8F8F8', alignSelf: 'center', borderRadius: 20, borderWidth: 1, borderColor: 'black', marginVertical: 60 }}>
                  <Text style={{ fontSize: 20, fontWeight: '500', color: 'black' }}>Cambiar URL de la API</Text>
                  <TextInput value={inputValue} onChangeText={(text) => setInputValue(text)} style={{ width: '75%', height: '10%', maxHeight: 50, borderRadius: 10, borderWidth: 1, borderColor: 'black' }} />
                  <TouchableOpacity style={{ height: Dimensions.get('screen').height * 0.05, width: Dimensions.get('screen').width * 0.6, backgroundColor: '#139aa0', borderRadius: 15, borderWidth: 1, borderColor: 'gray', alignItems: 'center', justifyContent: 'center' }} onPress={() => { setCambiarPath(false); setApiUrl(inputValue); }}>
                    <Text style={{ borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: '500' }}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ height: Dimensions.get('screen').height * 0.05, width: Dimensions.get('screen').width * 0.6, backgroundColor: '#139aa0', borderRadius: 15, borderWidth: 1, borderColor: 'gray', alignItems: 'center', justifyContent: 'center' }} onPress={() => setCambiarPath(false)}>
                    <Text style={{ borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: '500' }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          </View>
      }
    </View>
  )
}

export default App