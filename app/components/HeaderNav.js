import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';

export default function HeaderNav(props) {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const statusBarHeight = Constants.statusBarHeight;

    return (
        <>
            {props.from === 'dashboard' ?
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS === 'android' ? statusBarHeight * 1.2 : statusBarHeight, paddingHorizontal: 20, height: 75 }}>

                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={24.5} color="blue" />
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginLeft: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5 }}>
                            <TextInput style={{ marginLeft: 10, padding: 0, fontSize: 16, flex: 1, fontSize: props.selectedLanguage === 'ar' ? 15.2 : 14, right: props.selectedLanguage === 'ar' ? 2 : undefined }} placeholder={t('dashboard.search')} />
                            <TouchableOpacity style={{ marginLeft: 10 }}>
                                <Ionicons name="search" size={21} color="lightblue" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={{ marginLeft: 14 }} onPress={() => props.navigation.navigate('profile')}>
                        <View style={{ width: 38, height: 38, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                            {props.accessGroup === 1 ? <Image source={require('../assets/demo-user.png')} style={{ width: 27, height: 27, borderRadius: 20 }} /> : (props.picture === null ? <Image source={require('../assets/demo-user.png')} style={{ width: 27, height: 27, borderRadius: 20 }} /> :
                                <Image source={require('../assets/user2.jpg')} style={{ width: 36, height: 36, borderRadius: 20 }} />)}
                        </View>
                    </TouchableOpacity>

                </View>
                :
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS === 'android' ? statusBarHeight * 1.2 : statusBarHeight, paddingHorizontal: 20, height: 58 }}>

                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={24.5} color="blue" />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1B2936' }}>{props.label}</Text>
                    </View>

                    {props.from !== 'profile' ?
                        (<TouchableOpacity style={{ marginLeft: props.dashboard ? 14 : 0 }} onPress={() => props.navigation.navigate('profile')}>
                            <View style={{ width: 38, height: 38, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                                {props.accessGroup === 1 ? <Image source={require('../assets/demo-user.png')} style={{ width: 27, height: 27, borderRadius: 20 }} /> : (props.picture === null ? <Image source={require('../assets/demo-user.png')} style={{ width: 27, height: 27, borderRadius: 20 }} /> :
                                    <Image source={require('../assets/user2.jpg')} style={{ width: 36, height: 36, borderRadius: 20 }} />)}
                            </View>
                        </TouchableOpacity>)
                        :
                        (<TouchableOpacity style={{ marginLeft: props.dashboard ? 14 : 0 }} onPress={() => props.navigation.navigate('settings')}>
                            <Ionicons name="settings-outline" size={21.5} color="#1B2936" style={{ marginLeft: props.profile ? 0 : 1 }} />
                        </TouchableOpacity>)
                    }
                </View>
            }
        </>
    )
}
