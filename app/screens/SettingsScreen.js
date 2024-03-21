import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Feather, Ionicons, Octicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { SkypeIndicator } from 'react-native-indicators';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderNav from '../components/HeaderNav';
import CustomAlert from '../components/CustomAlert';

export default function SettingsScreen({ navigation, setUserToken, userData }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [alert, setAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [btn, setBtn] = useState(selectedLanguage);
    const [active, setActive] = useState('');

    const [customErrIndicator, setCustomErrIndicator] = useState(false);
    const [customError, setCustomError] = useState('');
    const [error, setError] = useState({
        currentErr: false,
        newErr: false,
        confirmErr: false
    });

    const refNew = useRef();
    const refConfirm = useRef();

    const { t } = useTranslation();
    const { changeLanguage } = useLanguage();
    const { selectedLanguage } = useLanguage();

    Keyboard.addListener('keyboardDidHide', () => {
        Keyboard.dismiss();
        setShow1(false);
        setShow2(false);
        setShow3(false);
    });

    const loadSelectedLanguage = async () => {
        try {
            const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
            if (storedLanguage) {
                setActive(storedLanguage);
                setBtn(storedLanguage);
            }
        } catch (error) {
            console.error('Error loading language from AsyncStorage:', error);
        }
    };

    const handleChangePassword = () => {
        Keyboard.dismiss();
        setShow1(false);
        setShow2(false);
        setShow3(false);
        setCustomErrIndicator(false);
        setCustomError('');

        if (currentPassword === '' || newPassword === '' || confirmPassword == '') {
            if (currentPassword === '') {
                setError(prevState => ({ ...prevState, currentErr: true }));
            }
            if (newPassword === '') {
                setError(prevState => ({ ...prevState, newErr: true }));
            }
            if (confirmPassword === '') {
                setError(prevState => ({ ...prevState, confirmErr: true }));
            }
        }

        else if (newPassword !== confirmPassword) {
            setCustomErrIndicator(true);
            setCustomError('Password do not match!')
        }

        else {
            setAlert(true);
        }
    }

    const handleChangeLanguage = () => {
        setLoading(true);

        async function changeLang() {
            await changeLanguage(btn === 'en' ? 'en' : 'ar');
            try {
                await AsyncStorage.setItem('selectedLanguage', btn);
            } catch (error) {
                console.error('Error saving language to AsyncStorage:', error);
            }

            setShow1(false);
            setShow2(false);
            setShow3(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError(prevState => ({
                ...prevState,
                currentErr: false,
                newErr: false,
                confirmErr: false
            }));
            setCustomErrIndicator(false);
            setCustomError('');
        }

        setTimeout(() => {
            changeLang();
        }, 1000);

        setTimeout(() => {
            setLoading(false);
            loadSelectedLanguage();
        }, 1500);
    }

    useFocusEffect(
        React.useCallback(() => {
            loadSelectedLanguage();
            setBtn(selectedLanguage);
            setShow1(false);
            setShow2(false);
            setShow3(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError(prevState => ({
                ...prevState,
                currentErr: false,
                newErr: false,
                confirmErr: false
            }));
            setCustomErrIndicator(false);
            setCustomError('');
        }, [])
    );

    return (
        <>
            {selectedLanguage === 'ar' ? (<View style={{ flex: 1, backgroundColor: '#eef0f8' }}>

                <View style={styles.scroll}>
                    <HeaderNav from='settings' label={t('settings.settings')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                    <View style={{ marginTop: 35, marginLeft: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 28 }}>
                        <Text style={{ fontSize: 14.5, fontWeight: '600', color: 'black', marginRight: 8 }}>{t('settings.change-password')}</Text>
                        <AntDesign name="Safety" size={16} color="black" />
                    </View>

                    <View style={{ backgroundColor: 'white', width: '85%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', paddingTop: 15, paddingBottom: 20, marginTop: 16 }}>

                        <View style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 2 }}>

                            <Ionicons name="lock-closed-outline" size={15} color="gray" />
                            <TextInput
                                style={{
                                    backgroundColor: '#eef0f8',
                                    fontSize: 13.2,
                                    width: '80%',
                                    paddingLeft: 11,
                                    width: '80%',
                                    paddingVertical: 8.2
                                }}
                                value={currentPassword}
                                placeholder={t('settings.current-password')}
                                secureTextEntry={show1 ? false : true}
                                onSubmitEditing={() => { refNew.current.focus(); Keyboard.dismiss; }}
                                blurOnSubmit={false}
                                onChangeText={(text) => { setCurrentPassword(text.trim()); setError(prevState => ({ ...prevState, currentErr: false })); setCustomErrIndicator(false); setCustomError(''); }}
                            />
                            {error.currentErr && <MaterialIcons style={{ right: -20 }} name="error-outline" size={15} color="red" />}
                            {!error.currentErr && <TouchableOpacity style={{ position: 'absolute', right: 15, height: '100%', width: 25 }} onPress={() => setShow1(!show1)}>
                                <Octicons name={show1 === false ? 'eye-closed' : 'eye'} size={15.5} color="#949494" style={{ alignSelf: 'center', top: 16 }} />
                            </TouchableOpacity>}
                        </View>

                        <View style={{ borderBottomWidth: 0.7, borderColor: '#2a52be', width: '83%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 17 }} />

                        {customErrIndicator && <View style={{ marginTop: 12, marginBottom: 9, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Feather name="alert-triangle" size={13} color="#BF0000" />
                            <Text style={{ textAlign: 'center', color: '#BF0000', marginLeft: 5, fontSize: 12.5 }}>{customError}</Text>
                        </View>}

                        <View style={{ borderBottomWidth: 0.7, borderColor: '#2a52be', width: '83%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 3 }} />

                        <View style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 17 }}>

                            <Feather name="lock" size={14} color="gray" />
                            <TextInput
                                style={{
                                    backgroundColor: '#eef0f8',
                                    fontSize: 13.2,
                                    width: '80%',
                                    paddingLeft: 12,
                                    width: '80%',
                                    paddingVertical: 8.2
                                }}
                                value={newPassword}
                                placeholder={t('settings.new-password')}
                                secureTextEntry={show2 ? false : true}
                                ref={refNew}
                                onSubmitEditing={() => { refConfirm.current.focus(); Keyboard.dismiss; }}
                                blurOnSubmit={false}
                                onChangeText={(text) => { setNewPassword(text.trim()); setError(prevState => ({ ...prevState, newErr: false })); setCustomErrIndicator(false); setCustomError(''); }}
                            />
                            {error.newErr && <MaterialIcons style={{ right: -20 }} name="error-outline" size={15} color="red" />}
                            {!error.newErr && <TouchableOpacity style={{ position: 'absolute', right: 15, height: '100%', width: 25 }} onPress={() => setShow2(!show2)}>
                                <Octicons name={show2 === false ? 'eye-closed' : 'eye'} size={15.5} color="#949494" style={{ alignSelf: 'center', top: 16 }} />
                            </TouchableOpacity>}
                        </View>

                        <View style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 13 }}>

                            <Feather name="lock" size={14} color="gray" />
                            <TextInput
                                style={{
                                    backgroundColor: '#eef0f8',
                                    fontSize: 13.2,
                                    width: '80%',
                                    paddingLeft: 12,
                                    width: '80%',
                                    paddingVertical: 8.2
                                }}
                                value={confirmPassword}
                                placeholder={t('settings.confirm-password')}
                                secureTextEntry={show3 ? false : true}
                                ref={refConfirm}
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(text) => { setConfirmPassword(text.trim()); setError(prevState => ({ ...prevState, confirmErr: false })); setCustomErrIndicator(false); setCustomError(''); }}
                            />
                            {error.confirmErr && <MaterialIcons style={{ right: -20 }} name="error-outline" size={15} color="red" />}
                            {!error.confirmErr && <TouchableOpacity style={{ position: 'absolute', right: 15, height: '100%', width: 25 }} onPress={() => setShow3(!show3)}>
                                <Octicons name={show3 === false ? 'eye-closed' : 'eye'} size={15.5} color="#949494" style={{ alignSelf: 'center', top: 16 }} />
                            </TouchableOpacity>}
                        </View>

                        {alert && <CustomAlert msg1='Your Password has been changed' msg2='Login again !' alert={alert} setUserToken={setUserToken} opt='changepassword' />}

                        <TouchableOpacity style={{ backgroundColor: '#222', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', marginTop: 22 }} onPress={() => handleChangePassword()}>
                            <Text style={{ color: 'white', fontSize: 13.5, fontWeight: '500' }}>{t('settings.update')}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ marginTop: 32, marginLeft: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 30 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', marginRight: 7.5 }}>{t('settings.language-preference')}</Text>
                        <Ionicons name="language-outline" size={18} color="black" />
                    </View>

                    <View style={{ backgroundColor: 'white', width: '85%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', paddingTop: 19, paddingBottom: 18, marginTop: 16 }}>

                        <TouchableOpacity
                            style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 11 }}
                            onPress={() => {
                                setBtn('en');
                            }
                            }>
                            <View style={{ borderRadius: 50, height: btn === 'en' ? 13 : 12, width: btn === 'en' ? 13 : 12, borderWidth: 0.8, borderColor: btn === 'en' ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                {btn === 'en' && <View style={{ borderRadius: 50, height: 11, width: 11, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                            </View>
                            <Text style={{ fontSize: 13, marginLeft: 12, color: 'black' }}>English {active !== 'ar' && <Text style={{ fontSize: 12.2, color: 'gray' }}> (default)</Text>}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 11, marginTop: 14 }}
                            onPress={() => {
                                setBtn('ar');
                            }}
                        >
                            <View style={{ borderRadius: 50, height: btn === 'ar' ? 13 : 12, width: btn === 'ar' ? 13 : 12, borderWidth: 0.8, borderColor: btn === 'ar' ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                {btn === 'ar' && <View style={{ borderRadius: 50, height: 11, width: 11, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                            </View>
                            <Text style={{ fontSize: 14.5, marginLeft: 12, top: -2, color: 'black' }}>عربي</Text>{active === 'ar' && <Text style={{ fontSize: 12.2, color: 'gray' }}>  (default)</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: '#1DA1F2', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', marginTop: 20 }} onPress={() => handleChangeLanguage()}>
                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 13.5 }}>{t('settings.save')}</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>

                {loading && (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={{ alignItems: 'center', top: -20 }}>
                        <SkypeIndicator color="#ffffff" size={40} />
                    </View>
                </View>
                )}
            </View>)

                :

                (<View style={{ flex: 1, backgroundColor: '#eef0f8' }}>

                    <View style={styles.scroll}>
                        <HeaderNav from='settings' label={t('settings.settings')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                        <View style={{ marginTop: 35, width: '100%', marginLeft: 30, flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="Safety" size={16} color="black" />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', marginLeft: 5 }}>{t('settings.change-password')}</Text>
                        </View>

                        <View style={{ backgroundColor: 'white', width: '85%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', paddingTop: 15, paddingBottom: 20, marginTop: 16 }}>

                            <View style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 2 }}>

                                <Ionicons name="lock-closed-outline" size={15} color="gray" />
                                <TextInput
                                    style={{
                                        backgroundColor: '#eef0f8',
                                        fontSize: 13,
                                        width: '80%',
                                        paddingLeft: 11,
                                        width: '80%',
                                        paddingVertical: 8.2
                                    }}
                                    value={currentPassword}
                                    placeholder={t('settings.current-password')}
                                    secureTextEntry={show1 ? false : true}
                                    onSubmitEditing={() => { refNew.current.focus(); Keyboard.dismiss; }}
                                    blurOnSubmit={false}
                                    onChangeText={(text) => { setCurrentPassword(text.trim()); setError(prevState => ({ ...prevState, currentErr: false })); setCustomErrIndicator(false); setCustomError(''); }}
                                />
                                {error.currentErr && <MaterialIcons style={{ right: -20 }} name="error-outline" size={15} color="red" />}
                                {!error.currentErr && <TouchableOpacity style={{ position: 'absolute', right: 15, height: '100%', width: 25 }} onPress={() => setShow1(!show1)}>
                                    <Octicons name={show1 === false ? 'eye-closed' : 'eye'} size={15.5} color="#949494" style={{ alignSelf: 'center', top: 16 }} />
                                </TouchableOpacity>}
                            </View>

                            <View style={{ borderBottomWidth: 0.7, borderColor: '#2a52be', width: '83%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 17 }} />

                            {customErrIndicator && <View style={{ marginTop: 12, marginBottom: 9, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Feather name="alert-triangle" size={13} color="#BF0000" />
                                <Text style={{ textAlign: 'center', color: '#BF0000', marginLeft: 5, fontSize: 12.5 }}>{customError}</Text>
                            </View>}

                            <View style={{ borderBottomWidth: 0.7, borderColor: '#2a52be', width: '83%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 3 }} />

                            <View style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 17 }}>

                                <Feather name="lock" size={14} color="gray" />
                                <TextInput
                                    style={{
                                        backgroundColor: '#eef0f8',
                                        fontSize: 13,
                                        width: '80%',
                                        paddingLeft: 12,
                                        width: '80%',
                                        paddingVertical: 8.2
                                    }}
                                    value={newPassword}
                                    placeholder={t('settings.new-password')}
                                    secureTextEntry={show2 ? false : true}
                                    ref={refNew}
                                    onSubmitEditing={() => { refConfirm.current.focus(); Keyboard.dismiss; }}
                                    blurOnSubmit={false}
                                    onChangeText={(text) => { setNewPassword(text.trim()); setError(prevState => ({ ...prevState, newErr: false })); setCustomErrIndicator(false); setCustomError(''); }}
                                />
                                {error.newErr && <MaterialIcons style={{ right: -20 }} name="error-outline" size={15} color="red" />}
                                {!error.newErr && <TouchableOpacity style={{ position: 'absolute', right: 15, height: '100%', width: 25 }} onPress={() => setShow2(!show2)}>
                                    <Octicons name={show2 === false ? 'eye-closed' : 'eye'} size={15.5} color="#949494" style={{ alignSelf: 'center', top: 16 }} />
                                </TouchableOpacity>}
                            </View>

                            <View style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 13 }}>

                                <Feather name="lock" size={14} color="gray" />
                                <TextInput
                                    style={{
                                        backgroundColor: '#eef0f8',
                                        fontSize: 13,
                                        width: '80%',
                                        paddingLeft: 12,
                                        width: '80%',
                                        paddingVertical: 8.2
                                    }}
                                    value={confirmPassword}
                                    placeholder={t('settings.confirm-password')}
                                    secureTextEntry={show3 ? false : true}
                                    ref={refConfirm}
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={(text) => { setConfirmPassword(text.trim()); setError(prevState => ({ ...prevState, confirmErr: false })); setCustomErrIndicator(false); setCustomError(''); }}
                                />
                                {error.confirmErr && <MaterialIcons style={{ right: -20 }} name="error-outline" size={15} color="red" />}
                                {!error.confirmErr && <TouchableOpacity style={{ position: 'absolute', right: 15, height: '100%', width: 25 }} onPress={() => setShow3(!show3)}>
                                    <Octicons name={show3 === false ? 'eye-closed' : 'eye'} size={15.5} color="#949494" style={{ alignSelf: 'center', top: 16 }} />
                                </TouchableOpacity>}
                            </View>

                            {alert && <CustomAlert msg1='Your Password has been changed' msg2='Login again !' alert={alert} setUserToken={setUserToken} opt='changepassword' />}

                            <TouchableOpacity style={{ backgroundColor: '#222', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', marginTop: 22 }} onPress={() => handleChangePassword()}>
                                <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '400' }}>{t('settings.update')}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={{ marginTop: 32, width: '100%', marginLeft: 30, flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="language-outline" size={18} color="black" />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', marginLeft: 6 }}>{t('settings.language-preference')}</Text>
                        </View>

                        <View style={{ backgroundColor: 'white', width: '85%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', paddingTop: 19, paddingBottom: 18, marginTop: 16 }}>

                            <TouchableOpacity
                                style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 11 }}
                                onPress={() => {
                                    setBtn('en');
                                }
                                }>
                                <View style={{ borderRadius: 50, height: btn === 'en' ? 13 : 12, width: btn === 'en' ? 13 : 12, borderWidth: 0.8, borderColor: btn === 'en' ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                    {btn === 'en' && <View style={{ borderRadius: 50, height: 11, width: 11, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                                </View>
                                <Text style={{ fontSize: 13, marginLeft: 12, color: 'black' }}>English {active !== 'ar' && <Text style={{ fontSize: 12.2, color: 'gray' }}> (default)</Text>}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ backgroundColor: '#eef0f8', width: '88%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 11, marginTop: 14 }}
                                onPress={() => {
                                    setBtn('ar');
                                }}
                            >
                                <View style={{ borderRadius: 50, height: btn === 'ar' ? 13 : 12, width: btn === 'ar' ? 13 : 12, borderWidth: 0.8, borderColor: btn === 'ar' ? '#00BFFF' : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                    {btn === 'ar' && <View style={{ borderRadius: 50, height: 11, width: 11, borderWidth: 1, borderColor: 'white', backgroundColor: '#00BFFF' }} />}
                                </View>
                                <Text style={{ fontSize: 14.5, marginLeft: 12, top: -2, color: 'black' }}>عربي</Text>{active === 'ar' && <Text style={{ fontSize: 12.2, color: 'gray' }}>  (default)</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: '#1DA1F2', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', marginTop: 20 }} onPress={() => handleChangeLanguage()}>
                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 12.5 }}>{t('settings.save')}</Text>
                            </TouchableOpacity>

                        </View>

                    </ScrollView>

                    {loading && (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <View style={{ alignItems: 'center', top: -20 }}>
                            <SkypeIndicator color="#ffffff" size={40} />
                        </View>
                    </View>
                    )}
                </View>)}
        </>
    )
}

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'rgba(220,224,241,0.95)',
        elevation: 10,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000
    },
})