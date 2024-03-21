import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

export default function LeaveManagementModal(props) {
    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    return (
        <>
            <Modal style={{ flex: 0, top: '32.5%', width: '68%', height: '23%', alignSelf: 'center', elevation: 30, borderRadius: 17, backgroundColor: 'white', shadowColor: 'gray' }} animationType="fade" transparent={true} visible={props.alert} onBackButtonPress={props.toggleAlert} onBackdropPress={props.toggleAlert}>

                <View style={{ position: 'absolute', top: 0, width: '100%', height: 40, backgroundColor: '#ADD8E6', borderTopLeftRadius: 17, borderTopRightRadius: 17 }} />

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ top: -19, width: 40, height: 40, backgroundColor: 'white', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/bin.png')} style={{ width: 29, height: 29 }} />
                    </View>

                    {props.from === 'deleteType' && (<View style={{ width: '90%', alignItems: 'center', justifyContent: 'center', top: -7.5 }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 13 : 12.5, fontWeight: '700', color: '#002D62' }}>{t('leavemanagement.delete-leave-type-modal')}</Text>
                        <Text style={{ fontSize: 12.2, fontWeight: '400', color: 'gray', top: 4 }}>'{props.item.LeaveTypeText}'</Text>
                    </View>)}

                    {props.from === 'deleteReason' && (<View style={{ width: '90%', alignItems: 'center', justifyContent: 'center', top: -7.5 }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 13 : 12.5, fontWeight: '700', color: '#002D62' }}>{t('leavemanagement.delete-leave-reason-modal')}</Text>
                        <Text style={{ fontSize: 12.2, fontWeight: '400', color: 'gray', top: 4 }}>'{props.item.LeaveReasonText}'</Text>
                    </View>)}

                    <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-evenly', top: 17, paddingHorizontal: 3 }}>
                        <TouchableOpacity style={{ width: '40%', backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.toggleAlert() }}>
                            <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 12.5 : 12.2, fontWeight: selectedLanguage === 'ar' ? '600' : '500' }}>{t('leavemanagement.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '40%', backgroundColor: '#D22B2B', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.handleDelete(); props.toggleAlert(); }}>
                            <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 12.5 : 12.2, fontWeight: selectedLanguage === 'ar' ? '600' : '500' }}>{t('leavemanagement.delete')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </>
    )
}