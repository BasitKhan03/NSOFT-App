import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { MaterialIndicator } from 'react-native-indicators';
import { Camera } from 'expo-camera';
import { format } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

import CustomAlert from '../components/CustomAlert';

export default function CameraModal(props) {
    const [loading, setLoading] = useState(true);
    const [hasCameraPersmission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [location, setLocation] = useState({});
    const [address, setAddress] = useState([]);
    const [alert1, setAlert1] = useState(false);
    const [alert2, setAlert2] = useState(false);

    const cameraRef = useRef(null);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                setImage(data.uri);
            }
            catch (err) {
                console.log(err)
            }
        }
    };

    const done = async () => {
        if (image) {
            try {
                props.setImage(image);
                props.setCameraImage(image);
                setImage(null);
                props.toggleCameraModal();
            }
            catch (err) {
                console.log(err);
            }
        }
    };

    if (hasCameraPersmission === false) {
        return <Text>No access to camera</Text>
    };

    // useEffect(() => {
    //     const userLocation = async () => {
    //         try {
    //             let { status } = await Location.requestForegroundPermissionsAsync();

    //             if (status !== 'granted') {
    //                 toggleAlert2();
    //                 return;
    //             }

    //             let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: false });
    //             let address = await Location.reverseGeocodeAsync({
    //                 latitude: location.coords.latitude,
    //                 longitude: location.coords.longitude
    //             });

    //             setLocation({
    //                 latitude: location.coords.latitude,
    //                 longitude: location.coords.longitude,
    //                 latitudeDelta: 0.0922,
    //                 longitudeDelta: 0.0421
    //             });
    //             setAddress(address);
    //         }
    //         catch (err) {
    //             console.log(err);
    //         }
    //         finally {
    //             setLoading(false);
    //         }
    //     };

    //     userLocation();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            const userLocation = async () => {
                try {
                    setLoading(true);

                    let { status } = await Location.requestForegroundPermissionsAsync();

                    if (status !== 'granted') {
                        toggleAlert2();
                        return;
                    }
                    else {
                        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
                        let address = await Location.reverseGeocodeAsync(location.coords);

                        setLocation({
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        });
                        setAddress(address);
                    }
                }
                catch (err) {
                    console.log(err);
                }
                finally {
                    setLoading(false);
                }
            };

            userLocation();
        }, [])
    );

    const handlePunch = () => {
        if (Object.keys(location).length !== 0 && address.length !== 0) {
            props.from === 'clockin' ? props.setClockin(true) : props.setClockout(true);
            takePicture();
            setTimeout(() => {
                toggleAlert1();
            }, 1500);
        }
        else {
            toggleAlert2();
        }
    };

    const fetchLocation = async () => {
        try {
            setLoading(true);

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                toggleAlert2();
                return;
            }

            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: false });
            let address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setAddress(address);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    const toggleAlert1 = () => {
        setAlert1(!alert1);
    };

    const toggleAlert2 = () => {
        setAlert2(!alert2);
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', width: '100%', height: '100%', alignSelf: 'center', left: -18 }}>

                <View style={{ position: 'absolute', top: Platform.OS === 'android' ? 4 : 12, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingRight: 21 }}>
                    <TouchableOpacity onPress={() => props.toggleCameraModal()}>
                        <Ionicons name="arrow-back" size={27} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ right: 2, top: 1 }} onPress={() => { flash === Camera.Constants.FlashMode.off ? setFlash(Camera.Constants.FlashMode.torch) : setFlash(Camera.Constants.FlashMode.off) }}>
                        <Ionicons name="ios-flash-outline" size={23} color="black" />
                    </TouchableOpacity>
                </View>

                {!image && (<View style={{ alignSelf: 'center', width: 200, height: 200, borderRadius: 100, borderColor: 'gray', borderWidth: 0.2, overflow: 'hidden', marginTop: 25, elevation: 5 }}>
                    <Camera
                        style={{ flex: 1 }}
                        type={Camera.Constants.Type.front}
                        flashMode={flash}
                        aspect="stretch"
                        zoom={0}
                        ratio={'1:1'}
                        pictureSize={'1920x1080'}
                        autoFocus={Camera.Constants.AutoFocus.on}
                        playSoundOnCapture={false}
                        ref={cameraRef}
                    >
                    </Camera>
                </View>)}

                {image && (<View style={{ alignSelf: 'center', width: 200, height: 200, borderRadius: 100, borderColor: 'gray', borderWidth: 0.2, overflow: 'hidden', marginTop: 25, elevation: 5, backgroundColor: 'white' }}>
                    <Image source={{ uri: image }} style={styles.camera} />
                </View>)}

                <View style={{ flexDirection: 'row', marginTop: 22, alignItems: 'center', width: '100%', elevation: 10, shadowColor: 'gray', alignSelf: 'center', paddingVertical: 14, backgroundColor: '#2a52be', justifyContent: 'space-around' }}>
                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: 'whitesmoke' }}>{format(new Date(), 'hh:mm:ss a')}</Text>
                        <Text style={{ fontSize: 13.2, fontWeight: '700', marginTop: 1, color: 'white' }}>{format(new Date(), 'MMMM d, yyyy')}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ paddingVertical: 7, paddingHorizontal: 17, backgroundColor: 'white', borderRadius: 5, elevation: 2, left: -1 }} onPress={() => { handlePunch() }}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2, fontWeight: '700', color: '#13274F' }}>{t('attendance.punch')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ left: 17, top: 1 }} onPress={() => {
                            setImage(null);
                            fetchLocation();
                        }}>
                            <Ionicons name="ios-refresh-circle-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {alert1 && <CustomAlert msg1='Your attendance has been marked' msg2='Suceess!' alert={alert1} toggleAlert={toggleAlert1} toggleCameraModal={props.toggleCameraModal} opt='attendance' />}

                {alert2 && <CustomAlert msg1='No access to current location' msg2='Refresh!' alert={alert2} toggleAlert3={toggleAlert2} opt='attendanceError' />}

                <View style={{ width: '100%', height: '100%' }}>
                    <View style={{ width: '100%', alignSelf: 'center', height: '38%', elevation: 10, shadowColor: 'gray', borderRadius: 10, backgroundColor: 'white', paddingTop: 10, borderTopColor: 'gray', borderTopWidth: 0.2 }}>
                        <View style={{ marginBottom: 10 }}>
                            {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', justifyContent: 'center', top: 2 }}>
                                <Entypo name="location" size={17} color='red' style={{ top: 1, marginRight: 10 * 0.8 }} />
                                <Text style={{ fontSize: 15.2, fontWeight: "700", color: 'black', marginBottom: 3, top: 1 }}>{t('attendance.location')}</Text>
                            </View>)
                                :
                                (<View style={{ flexDirection: 'row', justifyContent: 'center', top: 2 }}>
                                    <Text style={{ fontSize: 15, fontWeight: "700", color: 'black', marginBottom: 3, top: 1 }}>{t('attendance.location')}</Text>
                                    <Entypo name="location" size={17} color='red' style={{ top: 1, marginLeft: 10 * 0.7 }} />
                                </View>)}

                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 14.2 : 13.5, fontWeight: "400", color: 'gray', textAlign: 'center', fontWeight: '400', marginTop: selectedLanguage === 'ar' ? 2 : undefined }}>{t('attendance.your-approx-location')}</Text>
                        </View>

                        {!loading && (<MapView
                            provider={PROVIDER_GOOGLE}
                            loadingEnabled={true}
                            style={{ width: '99%', height: '81%', alignSelf: 'center' }}
                            region={location}
                            scrollEnabled={false}>
                            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title='Marker' />
                        </MapView>)}

                        {loading && (
                            <View style={{ alignItems: 'center', alignSelf: 'center', top: -28 }}>
                                <MaterialIndicator color="#0066b2" size={38} />
                            </View>
                        )}
                    </View>

                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', elevation: 2, shadowColor: 'gray', alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 5, backgroundColor: 'white', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12.5, fontWeight: '700', color: 'darkblue' }}>{location.longitude ? parseFloat(location.longitude).toFixed(7) : 'N/a'} </Text>
                            <Text style={{ fontWeight: '400', fontSize: 12.2 }}>{t('attendance.longitude')} </Text>
                        </View>

                        <View style={{ height: 20, borderWidth: 0.5, borderColor: 'gray' }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12.5, fontWeight: '700', color: 'darkblue' }}>{location.latitude ? parseFloat(location.latitude).toFixed(7) : 'N/a'} </Text>
                            <Text style={{ fontWeight: '400', fontSize: 12.2 }}>{t('attendance.latitude')} </Text>
                        </View>
                    </View>)
                        :
                        (<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', elevation: 2, shadowColor: 'gray', alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 5, backgroundColor: 'white', justifyContent: 'space-around' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '400', fontSize: 13 }}>{t('attendance.latitude')} </Text>
                                <Text style={{ fontSize: 12.5, fontWeight: '700', color: 'darkblue' }}> {location.latitude ? parseFloat(location.latitude).toFixed(7) : 'N/a'}</Text>
                            </View>

                            <View style={{ height: 20, borderWidth: 0.5, borderColor: 'gray' }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '400', fontSize: 13 }}>{t('attendance.longitude')} </Text>
                                <Text style={{ fontSize: 12.5, fontWeight: '700', color: 'darkblue' }}> {location.longitude ? parseFloat(location.longitude).toFixed(7) : 'N/a'}</Text>
                            </View>
                        </View>)}

                    <View style={{ marginTop: 5, width: '100%', backgroundColor: 'white', elevation: 5, shadowColor: 'gray', paddingVertical: 10 }}>
                        {selectedLanguage === 'ar' && address.length === 0 && (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
                            {address.length === 0 && (<Text style={{ fontSize: 13, fontWeight: '400', color: 'darkblue' }}>{t('attendance.location-not-available')}</Text>)}
                            <Entypo name="location-pin" size={19} color='red' style={{ marginLeft: 2 }} />
                        </View>)}

                        {selectedLanguage === 'ar' && address.length > 0 && (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
                            <Entypo name="location-pin" size={20} color='red' style={{ marginRight: 2 }} />

                            {address.length > 0 && (<Text style={{ fontSize: 12.5, fontWeight: '400', color: 'darkblue' }}>
                                {address[0].name ? address[0].name + ', ' : ''}
                                {address[0].district ? address[0].district + ', ' : ''}
                                {address[0].city ? address[0].city + ', ' : ''}
                                {address[0].region ? address[0].region : ''}
                            </Text>)}
                        </View>)}

                        {selectedLanguage === 'en' && (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
                            <Entypo name="location-pin" size={20} color='red' style={{ marginRight: 2 }} />

                            {address.length > 0 && (<Text style={{ fontSize: 12.5, fontWeight: '400', color: 'darkblue' }}>
                                {address[0].name ? address[0].name + ', ' : ''}
                                {address[0].district ? address[0].district + ', ' : ''}
                                {address[0].city ? address[0].city + ', ' : ''}
                                {address[0].region ? address[0].region : ''}
                            </Text>)}

                            {address.length === 0 && (<Text style={{ fontSize: 12.5, fontWeight: '400', color: 'darkblue' }}>{t('attendance.location-not-available')}</Text>)}
                        </View>)}
                    </View>
                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'darkbrown',
        justifyContent: 'center',
        paddingBottom: 10
    },
    camera: {
        flex: 1,
        borderRadius: 10,
        transform: [{ scaleX: -1 }]
    },
    txt: {
        fontSize: 14.5,
        color: 'white',
        marginTop: 10 * 0.7
    }
})