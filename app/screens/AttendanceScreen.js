import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Modal from "react-native-modal";

import HeaderNav from '../components/HeaderNav';
import CameraModal from '../components/CameraModal';
import Footer from '../components/Footer';

export default function AttendanceScreen({ navigation, userData }) {
    const [clockin, setClockin] = useState(false);
    const [clockout, setClockout] = useState(false);
    const [from, setFrom] = useState('');
    const [image, setImage] = useState(null);
    const [cameraImage, setCameraImage] = useState(null);
    const [cameraModal, setCameraModal] = useState(false);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const currentDate = new Date();
    const formattedDate = format(currentDate, "MMM, EEEE dd");

    const greetingMessage = () => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        let greeting = t('attendance.good-morning');

        if (currentHour >= 12 && currentHour < 17) {
            greeting = t('attendance.good-afternoon');
        } else if (currentHour >= 17) {
            greeting = t('attendance.good-evening');
        }

        return greeting;
    };

    const toggleCameraModal = () => {
        setCameraModal(!cameraModal);
    };

    useFocusEffect(
        React.useCallback(() => {
            setClockin(false);
            setClockout(false);
        }, [])
    );

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>

                <View style={{
                    backgroundColor: cameraModal ? 'white' : 'rgba(220,224,241,0.95)', elevation: 10, shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 1000
                }}>
                    <HeaderNav from='attendance' label={t('attendance.manual-punch')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                <Modal style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', top: Platform.OS === 'android' ? 0 : 15, left: 0 }} animationType="fade" transparent={true} visible={cameraModal} onBackdropPress={toggleCameraModal} onRequestClose={toggleCameraModal} onBackButtonPress={toggleCameraModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <CameraModal toggleCameraModal={toggleCameraModal} navigation={navigation} setImage={setImage} setCameraImage={setCameraImage} setClockin={setClockin} setClockout={setClockout} from={from} />
                    </View>
                </Modal>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: 35, width: '100%', marginLeft: 30 }}>
                        <View style={{ flex: 1, marginRight: selectedLanguage === 'ar' ? 55 : undefined }}>
                            <Text style={{ fontSize: 21, fontWeight: 700, marginBottom: 1 }}>{greetingMessage()},</Text>
                            <Text style={{ fontSize: 21, marginBottom: 8.5, fontWeight: 700, textAlign: selectedLanguage === 'ar' ? 'right' : 'left' }}>{userData.firstName} <Text style={{ color: 'red' }}>{userData.lastName.charAt(0).toUpperCase()}</Text>{userData.lastName.slice(1).toLowerCase()}</Text>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 14.5 : 13.5, color: 'gray', fontWeight: selectedLanguage === 'ar' ? '500' : '400' }}>{clockin ? t('attendance.end') : t('attendance.begin')}</Text>
                        </View>
                    </View>


                    <View style={{ width: '87%', backgroundColor: 'white', elevation: 2, shadowColor: 'gray', borderRadius: 5, alignSelf: 'center', paddingTop: 15, paddingBottom: 20, paddingHorizontal: 17, marginTop: 27 }}>
                        <View>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 15.5 : 14, color: 'darkblue', fontWeight: '500' }}>{t('attendance.today')},</Text>
                            <Text style={{ fontSize: 12.5, color: 'gray', fontWeight: '400', marginTop: 2, left: 1, textAlign: selectedLanguage === 'ar' ? 'right' : 'left' }}>{formattedDate}</Text>
                        </View>

                        <View style={{ width: '55%', marginTop: 20, alignSelf: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 12, fontWeight: '600', color: '#13274F' }}>{clockin ? t('attendance.marked') : t('attendance.not-marked')}</Text>
                        </View>

                        <View style={{ position: 'absolute', right: selectedLanguage === 'ar' ? undefined : 20, left: selectedLanguage === 'ar' ? 20 : undefined, top: 10 }}>
                            <Image source={require('../assets/clock.jpg')} style={{ width: 100, height: 100 }} />
                        </View>

                        <TouchableOpacity style={{ marginTop: 22, width: '100%', paddingVertical: 9, backgroundColor: clockin ? '#AEAEAE' : '#00308F', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => {
                            toggleCameraModal();
                            setFrom('clockin');
                        }} disabled={clockin ? true : false}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 12.2, fontWeight: '500', color: 'white' }}>{t('attendance.clock-in')}</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{ width: '87%', backgroundColor: 'white', elevation: 2, shadowColor: 'gray', borderRadius: 5, alignSelf: 'center', paddingTop: 15, paddingBottom: 20, paddingHorizontal: 17, marginTop: 28 }}>
                        <View>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 15.5 : 14, color: 'darkblue', fontWeight: '500' }}>{t('attendance.today')},</Text>
                            <Text style={{ fontSize: 12.5, color: 'gray', fontWeight: '400', marginTop: 2, left: 1, textAlign: selectedLanguage === 'ar' ? 'right' : 'left' }}>{formattedDate}</Text>
                        </View>

                        <View style={{ width: '55%', marginTop: 20, alignSelf: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 12, fontWeight: '600', color: '#13274F' }}>{clockout ? t('attendance.marked') : t('attendance.not-marked')}</Text>
                        </View>

                        <View style={{ position: 'absolute', right: selectedLanguage === 'ar' ? undefined : 20, left: selectedLanguage === 'ar' ? 20 : undefined, top: 10 }}>
                            <Image source={require('../assets/clock.jpg')} style={{ width: 100, height: 100 }} />
                        </View>

                        {!clockin && (<View style={{ marginTop: 22, width: '100%', paddingVertical: 9, backgroundColor: '#AEAEAE', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 12.2, fontWeight: '500', color: 'white' }}>{t('attendance.clock-out')}</Text>
                        </View>)}

                        {clockin && (<TouchableOpacity style={{ marginTop: 22, width: '100%', paddingVertical: 9, backgroundColor: clockout ? '#AEAEAE' : '#00308F', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => {
                            toggleCameraModal();
                            setFrom('clockout');
                        }} disabled={clockout ? true : false}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 12.2, fontWeight: '500', color: 'white' }}>{t('attendance.clock-out')}</Text>
                        </TouchableOpacity>)}
                    </View>


                    <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                        <Footer />
                    </View>

                </ScrollView>
            </View>
        </>
    )
}