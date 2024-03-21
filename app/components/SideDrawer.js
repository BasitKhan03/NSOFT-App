import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Switch } from 'react-native-paper';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarIndicator } from 'react-native-indicators';
import { DrawerContentScrollView, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SideDrawer({ navigation, userData, setUserData, setUserToken, ...props }) {
    const { t } = useTranslation();
    const { changeLanguage } = useLanguage();
    const { selectedLanguage } = useLanguage();

    const isDrawerOpen = useDrawerStatus() === 'open';

    const [isSwitchOn, setIsSwitchOn] = useState(selectedLanguage === 'ar');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isDrawerOpen) {
            setIsSwitchOn(selectedLanguage === 'ar');
        }
    }, [isDrawerOpen, selectedLanguage]);

    const onToggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn);
        setLoading(true);

        async function changeLang() {
            navigation.closeDrawer();
            await changeLanguage(isSwitchOn ? 'en' : 'ar');
        }

        setTimeout(() => {
            changeLang();
        }, 500)

        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }

    const handleLogout = async () => {
        try {
            setUserToken(null);
            setUserData(prevState => ({
                ...prevState,
                employeeID: '',
                employeeCode: '',
                firstName: '',
                lastName: '',
                picture: null
            }));
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('password');
            console.log('Logout')
        }
        catch (exception) {
            console.log(exception)
        }
    }

    return (
        <>
            <View style={{ flex: 1 }}>

                <LinearGradient
                    colors={['rgba(114, 151, 248, 0.9)', '#ffffff']}
                    start={{ x: 0.1, y: 0.05 }}
                    end={{ x: 0.2, y: 1 }}
                    style={{ flex: 1 }}
                >

                    <View style={{ alignItems: 'center', marginTop: 58, marginBottom: 24 }}>
                        <View style={{ width: 110, height: 110, borderRadius: 60, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                            {userData.accessGroup === 1 ? <Image source={require('../assets/demo-user.png')} style={{ width: 58, height: 58, borderRadius: 50 }} /> : (userData.picture === null ? <Image source={require('../assets/demo-user.png')} style={{ width: 58, height: 58, borderRadius: 50 }} /> :
                                <Image source={require('../assets/user2.jpg')} style={{ width: 110, height: 110, borderRadius: 60, zIndex: 10 }} />)}
                        </View>
                        <Text style={{ fontSize: 19, fontWeight: '700', marginBottom: 4, color: 'white', marginTop: 8 }}>{userData.firstName + ' ' + userData.lastName}</Text>
                        <Text style={{ color: '#F5F5F5', fontSize: 14.8, fontWeight: '500', top: -0.5 }}>{userData.employeeCode}</Text>
                    </View>

                    <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false} contentContainerStyle={{ top: -34, width: 250, alignSelf: 'center' }}>
                        <DrawerItemList navigation={navigation} {...props} />
                    </DrawerContentScrollView>

                    <View style={{ marginTop: 15, marginBottom: 23 }}>
                        <View style={{ width: '85%', marginVertical: 8, borderBottomWidth: Platform.OS === 'android' ? 0.7 : 1, borderBottomColor: '#6CB4EE', alignSelf: 'center', borderStyle: 'dashed' }} />

                        <View style={{ marginTop: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around', width: '70%', alignSelf: 'center', marginBottom: 4, left: -10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', left: -7 }}>
                                <Ionicons name="language-outline" size={20} color="#13274F" />
                                <Text style={{ fontSize: 13, fontWeight: '500', marginLeft: 11, color: '#13274F' }}>Language</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 1 }}>
                                <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color='#00BFFF' style={{ transform: Platform.OS === 'android' ? [{ scale: 0.82 }] : [{ scale: 0.72 }], top: Platform.OS === 'android' ? 1.5 : 1.7 }} />
                                <Text style={{ fontSize: 14.5, fontWeight: '700', marginLeft: 12, color: isSwitchOn ? '#0066b2' : 'gray', left: isSwitchOn ? -10 : -12, fontWeight: isSwitchOn ? '500' : '600' }}>عربي</Text>
                            </View>
                        </View>

                        <View style={{ width: '85%', marginVertical: 8, borderBottomWidth: Platform.OS === 'android' ? 0.7 : 1, borderBottomColor: '#6CB4EE', alignSelf: 'center', borderStyle: 'dashed' }} />

                        <TouchableOpacity style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', marginLeft: 28, marginBottom: 7 }} onPress={() => handleLogout()}>
                            <Feather name="power" size={17} color='#52555A' />
                            <View style={{ marginLeft: 14 }}>
                                <Text style={{ fontSize: 13.2, color: '#52555A', fontWeight: '600' }}>{t('drawer.logout')}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{ width: '85%', marginVertical: 8, borderBottomWidth: Platform.OS === 'android' ? 0.7 : 1, borderBottomColor: '#D17842', alignSelf: 'center', borderStyle: 'dashed' }} />

                        <View style={{ marginTop: 7, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 1 }}>
                            <AntDesign name="copyright" size={12} color='darkblue' />
                            <Text style={{ fontSize: 11, color: 'darkblue', marginLeft: 5 }}>{t('drawer.copyright-2023')}</Text>
                        </View>
                    </View>

                </LinearGradient>

                {loading && (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(30, 70, 150, 0.3)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={{ alignItems: 'center', top: -15 }}>
                        <BarIndicator color="#ffffff" size={19} count={5} />
                    </View>
                </View>
                )}
            </View>
        </>
    )
}