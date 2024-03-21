import React, { useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, ScrollView, Keyboard, Platform } from 'react-native';
import { Ionicons, Octicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SkypeIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ setUserToken, setUserData }) {
    const refPassword = useRef();
    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();
    const { username, setUsername, password, setPassword, loading, setLoading, invalid, setInvalid, invalidText, setInvalidText, error, setError, show, setShow, handleLogin } = useAuth();

    Keyboard.addListener('keyboardDidHide', () => {
        Keyboard.dismiss();
        setShow(false);
    });

    useFocusEffect(
        React.useCallback(() => {
            setUsername('');
            setPassword('');
            setUserToken(null);
            setLoading(false);
            setUserData(prevState => ({
                ...prevState,
                employeeID: '',
                employeeCode: '',
                firstName: '',
                lastName: '',
                accessGroup: '',
                picture: null
            }));
            setInvalid(false);
            setInvalidText('');
        }, [])
    );

    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#7297f8' }}>
                    <ImageBackground source={require('../assets/background1.png')} resizeMode="contain" style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '72%', position: 'absolute', top: 20, opacity: 0.7 }} />

                    <View style={{ width: '100%', alignItems: 'center', marginTop: -40 }}>
                        <Image source={require('../assets/logo.png')} style={{ width: 132, height: 132 }} />
                    </View>

                    <View style={{ width: '100%', alignItems: 'center' }}>

                        <Text style={{ fontSize: 22, marginBottom: 15, color: 'white', fontWeight: 700, marginTop: -18 }}>{t('login.main-heading')}</Text>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 15 : 15.2, color: 'whitesmoke', marginBottom: 35, width: selectedLanguage === 'ar' ? '78%' : '75%', textAlign: 'center' }}>
                            {t('login.sub-heading')}
                        </Text>

                        <View style={{ width: '80%' }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginBottom: 10, borderRadius: 5, paddingHorizontal: 12 }}>
                                <Ionicons name="person-outline" size={17} color="gray" />
                                <TextInput style={{ backgroundColor: 'white', fontSize: selectedLanguage === 'ar' ? 13.5 : 14, width: '80%', paddingLeft: 13, width: '90%', paddingVertical: 10, textAlign: 'left' }}
                                    value={username}
                                    placeholder={t('login.username')}
                                    onSubmitEditing={() => { refPassword.current.focus(); Keyboard.dismiss; }}
                                    blurOnSubmit={false}
                                    onChangeText={(text) => { setUsername(text.trim().toString()); setError(prevState => ({ ...prevState, usernameErr: false })); setInvalid(false); }}
                                />
                                {error.usernameErr && <MaterialIcons style={{ right: 13 }} name="error-outline" size={15} color="red" />}
                                <View style={{ width: 4, height: Platform.OS === 'android' ? 48 : 38, backgroundColor: 'red', position: 'absolute', right: 0, borderRadius: 5 }} />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginBottom: 17, borderRadius: 5, paddingHorizontal: 12 }}>
                                <Ionicons name="lock-closed-outline" size={17} color="gray" />
                                <TextInput style={{ backgroundColor: 'white', fontSize: selectedLanguage === 'ar' ? 13.5 : 14, width: '80%', paddingLeft: 13, width: '80%', paddingVertical: 10 }}
                                    value={password}
                                    placeholder={t('login.password')}
                                    secureTextEntry={show ? false : true}
                                    ref={refPassword}
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={(text) => { setPassword(text.trim().toString()); setError(prevState => ({ ...prevState, passwordErr: false })); setInvalid(false); }}
                                />
                                {error.passwordErr && <MaterialIcons style={{ right: -13.5 }} name="error-outline" size={15} color="red" />}
                                {!error.passwordErr && <TouchableOpacity style={{ position: 'absolute', right: 15, height: '100%', width: 25, top: Platform.OS === 'android' ? 0 : -5 }} onPress={() => setShow(!show)}>
                                    <Octicons name={show === false ? 'eye-closed' : 'eye'} size={17} color="#949494" style={{ alignSelf: 'center', top: 16 }} />
                                </TouchableOpacity>}
                                <View style={{ width: 4, height: Platform.OS === 'android' ? 48 : 38, backgroundColor: 'red', position: 'absolute', right: 0, borderRadius: 5 }} />
                            </View>

                            {selectedLanguage === 'ar' ? (<View>
                                {invalid && <View style={{ marginBottom: 23, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', color: 'whitesmoke', marginRight: 5, fontSize: 13.5 }}>{invalidText}</Text>
                                    <Feather name="alert-triangle" size={14} color="whitesmoke" />
                                </View>}
                            </View>)
                                :
                                (<View>
                                    {invalid && <View style={{ marginBottom: 23, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Feather name="alert-triangle" size={14} color="whitesmoke" />
                                        <Text style={{ textAlign: 'center', color: 'whitesmoke', marginLeft: 5, fontSize: 13.5 }}>{invalidText}</Text>
                                    </View>}
                                </View>)}

                            <TouchableOpacity style={{ backgroundColor: '#222', padding: 15, borderRadius: 5, alignItems: 'center', }} onPress={() => { handleLogin() }}>
                                <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 13.5 : 14 }}>{t('login.sign-in-now')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ color: 'white', textDecorationLine: 'underline' }}>{t('login.forgot-your-password')}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>

                {loading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <View style={{ alignItems: 'center', top: -20 }}>
                            <SkypeIndicator color="#ffffff" size={40} />
                        </View>
                    </View>
                )}
            </ScrollView>
        </>
    )
}