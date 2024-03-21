import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

export default function LeaveApprovalModal(props) {
    const [option, setOption] = useState(null);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    return (
        <>
            <Modal style={{ flex: 0, top: '32.5%', width: '68%', height: '25%', alignSelf: 'center', elevation: 30, borderRadius: 17, backgroundColor: 'white', shadowColor: 'gray' }} animationType="fade" transparent={true} visible={props.alert} onBackButtonPress={props.toggleAlert} onBackdropPress={props.toggleAlert}>

                <View style={{ position: 'absolute', top: 0, width: '100%', height: 40, backgroundColor: '#ADD8E6', borderTopLeftRadius: 17, borderTopRightRadius: 17 }} />

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ top: -7, width: 40, height: 40, backgroundColor: 'white', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../assets/tap.png')} style={{ width: 32, height: 32, top: 2 }} />
                    </View>

                    <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center', top: -9 }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 12.2, fontWeight: selectedLanguage === 'ar' ? '600' : '400', color: 'gray', top: 9 }}>{t('leaveapproval.set-leave-status')}</Text>

                        {selectedLanguage === 'ar' ? (<View style={{ alignItems: 'center', justifyContent: 'center', top: 6, width: '100%', height: 65 }}>
                            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} onPress={() => { setOption(2); }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#002D62', marginRight: 10 }}>{t('leaveapproval.approve')}</Text>
                                <View style={{ borderRadius: 50, height: option === 2 ? 12 : 11, width: option === 2 ? 12 : 11, borderWidth: 0.8, borderColor: option === 2 ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                    {option === 2 && <View style={{ borderRadius: 50, height: 10, width: 10, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ marginTop: 3, width: '100%', alignSelf: 'center', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} onPress={() => { setOption(3); }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#002D62', marginRight: 10, right: -5 }}>{t('leaveapproval.reject')}</Text>
                                <View style={{ borderRadius: 50, height: option === 3 ? 12 : 11, width: option === 3 ? 12 : 11, borderWidth: 0.8, borderColor: option === 3 ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center', right: -7 }}>
                                    {option === 3 && <View style={{ borderRadius: 50, height: 10, width: 10, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                                </View>
                            </TouchableOpacity>
                        </View>)
                            :
                            (<View style={{ alignItems: 'center', justifyContent: 'center', top: 5, width: '100%', height: 65 }}>
                                <TouchableOpacity style={{ width: '100%', alignSelf: 'center', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} onPress={() => { setOption(2); }}>
                                    <View style={{ borderRadius: 50, height: option === 2 ? 12 : 11, width: option === 2 ? 12 : 11, borderWidth: 0.8, borderColor: option === 2 ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                        {option === 2 && <View style={{ borderRadius: 50, height: 10, width: 10, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                                    </View>
                                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#002D62', marginLeft: 10 }}>{t('leaveapproval.approve')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ marginTop: 3, width: '100%', alignSelf: 'center', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} onPress={() => { setOption(3); }}>
                                    <View style={{ borderRadius: 50, height: option === 3 ? 12 : 11, width: option === 3 ? 12 : 11, borderWidth: 0.8, borderColor: option === 3 ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center', left: -5 }}>
                                        {option === 3 && <View style={{ borderRadius: 50, height: 10, width: 10, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                                    </View>
                                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#002D62', marginLeft: 10, left: -5 }}>{t('leaveapproval.reject')}</Text>
                                </TouchableOpacity>
                            </View>)}
                    </View>

                    <View style={{ width: '85%', flexDirection: 'row', justifyContent: 'center', top: selectedLanguage === 'ar' ? 1 : 0 }}>
                        <TouchableOpacity style={{ width: 125, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, opacity: option === null ? 0.85 : 1 }} onPress={() => { option !== null && props.updateLeaveStatus(option); }} disabled={option === null}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: selectedLanguage === 'ar' ? '600' : '500' }}>{t('leaveapproval.save')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </>
    )
}