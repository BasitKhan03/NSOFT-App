import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Entypo } from '@expo/vector-icons';
import { WaveIndicator, SkypeIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import ProfileInfo from '../components/ProfileInfo';
import LeavesInfo from '../components/LeavesInfo';
import Footer from '../components/Footer';

export default function ProfileScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [profile, setProfile] = useState([]);
    const [image, setImage] = useState(null);
    const [accessGroup, setAccessGroup] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const pageYOffset = contentOffset.y;
        pageYOffset > 30 ? setScroll(true) : setScroll(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response1 = await axios.post(`${CURRENT_HOST}/api/employee/${userData.employeeID}`, null, {
                    headers: {
                        'Authorization': `bearer ${userToken}`
                    }
                });
                setProfile(response1.data);

                const response2 = await axios.post(`${CURRENT_HOST}/api/employee/access/${response1.data[0].access_group_AccessGroupId}`, null, {
                    headers: {
                        'Authorization': `bearer ${userToken}`
                    }
                });
                setAccessGroup(response2.data);

                console.log('Verified... (Profile)');

                setTimeout(() => {
                    setLoading(false);
                }, 1500)
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 1000)
            }
        }

        fetchData();
    }, []);

    // ----|| Function for selecting image from gallery using ImagePicker ||---->
    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
        catch (error) {
            console.log(error);
            setImage(null);
        }
    };

    const convertImageToBase64 = async (imageUri) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return base64;
    };

    const uploadImage = async () => {
        try {
            // const base64Image = await convertImageToBase64(image);
            // const imageData = base64Image.split(',')[1];

            setImageLoading(true);

            const filename = image.substring(image.lastIndexOf('/') + 1);

            const requestData = {
                EmployeeId: userData.employeeID,
                image: filename,
            };

            const axiosConfig = {
                headers: {
                    'Authorization': `bearer ${userToken}`,
                },
            };

            const response = await axios.post(`${CURRENT_HOST}/api/employee/uploadprofilepicture/${userData.employeeID}`, requestData, axiosConfig);

            if (response.status === 200) {
                console.log('Image uploaded successfully.');
            } else {
                console.log('Image upload failed. Status:', response.status);
            }

            setTimeout(() => {
                setImageLoading(false);
                setImage(null);
            }, 2000);
        }
        catch (error) {
            console.error('Error uploading image:', error);
            setImageLoading(false);
            setImage(null);
        }
    };

    const getAccessGroupName = (accessGroupInitials) => {
        switch (accessGroupInitials) {
            case 'HR':
                return 'Human Resource';
            case 'LM':
                return 'Line Manager';
            case 'EMP':
                return 'Employee';
            default:
                return 'Unknown';
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setImage(null);
        }, [])
    );

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>
                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='profile' label={t('profile.profile')} navigation={navigation} />
                </View>

                {profile.length > 0 && accessGroup.length > 0 && <ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false}>

                    <View style={{ backgroundColor: '#007bff', alignItems: 'center', position: 'relative' }}>
                        {userData.accessGroup === 1 ? <Image source={require('../assets/demo-user.png')} style={{ width: '100%', height: 270, opacity: 0.5, resizeMode: 'cover' }} /> : (userData.picture === null ? <Image source={require('../assets/demo-user.png')} style={{ width: '100%', height: 270, opacity: 0.5, resizeMode: 'cover' }} /> :
                            <Image source={require('../assets/user2.jpg')} style={{ width: '100%', height: 270, opacity: 0.4, resizeMode: 'cover' }} />)}

                        <View style={{ alignItems: 'center', position: 'absolute', top: 27 }}>

                            <TouchableOpacity style={{ elevation: 5, backgroundColor: 'whitesmoke', width: 142, height: 142, borderRadius: 80, justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>

                                {image !== null ? (<Image source={{ uri: image }} style={{ width: 141, height: 141, borderRadius: 80 }} />) : (userData.accessGroup === 1 ? <Image source={require('../assets/demo-user.png')} style={{ width: 100, height: 100, borderRadius: 80 }} /> : (userData.picture === null ? <Image source={require('../assets/demo-user.png')} style={{ width: 100, height: 100, borderRadius: 80 }} /> :
                                    <Image source={require('../assets/user2.jpg')} style={{ width: 141, height: 141, borderRadius: 80 }} />))}

                                <View style={{ width: 28, height: 28, borderRadius: 100, backgroundColor: image ? '#8A9A5B' : '#318CE7', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: -6, bottom: 10, zIndex: 1100, }}>
                                    <Entypo name="plus" size={19} color='white' />
                                </View>

                            </TouchableOpacity>

                            <Text style={{ fontSize: 23, fontWeight: '700', color: 'white', marginTop: 11, marginBottom: 2 }}>{profile[0].first_name + ' ' + profile[0].last_name}</Text>
                            <Text style={{ fontSize: 15.5, color: 'white', top: 1, fontWeight: '500' }}>{profile[0].employee_code}</Text>

                        </View>
                    </View>

                    {image === null ? (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', paddingVertical: 16 }}>
                            {selectedLanguage !== 'ar' ? (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline' }}>
                                <Feather name="user" size={18} color="#13274F" />
                                <Text style={{ fontSize: 14.2, fontWeight: '700', marginBottom: 4, marginLeft: 5, color: '#13274F' }}>{t('profile.user-type')}  |  </Text>
                                <Text style={{ fontSize: 13.8, color: 'gray', fontWeight: '600' }}>{getAccessGroupName(accessGroup[0].name.substring(8))}</Text>
                            </View>)
                                : (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline' }}>
                                    <Text style={{ fontSize: 14, color: 'gray', fontWeight: '600' }}>{getAccessGroupName(accessGroup[0].name.substring(8))}</Text>
                                    <Text style={{ fontSize: 14.5, fontWeight: '700', marginBottom: 4, marginRight: 6, color: '#13274F' }}>{t('profile.user-type')}  |  </Text>
                                    <Feather name="user" size={18} color="#13274F" />
                                </View>)}
                        </View>
                    ) : (
                        selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 80 }}>
                            <TouchableOpacity style={{ backgroundColor: '#318CE7', width: 80, paddingVertical: 6, borderRadius: 5, alignItems: 'center' }} onPress={() => uploadImage()}>
                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 13.2 }}>{t('profile.save')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: '#D22B2B', width: 80, paddingVertical: 6, borderRadius: 5, alignItems: 'center' }} onPress={() => setImage(null)}>
                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 13 }}>{t('profile.cancel')}</Text>
                            </TouchableOpacity>
                        </View>)
                            : (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 80 }}>
                                <TouchableOpacity style={{ backgroundColor: '#D22B2B', width: 80, paddingVertical: 6, borderRadius: 5, alignItems: 'center' }} onPress={() => setImage(null)}>
                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 13.5 }}>{t('profile.cancel')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ backgroundColor: '#318CE7', width: 80, paddingVertical: 6, borderRadius: 5, alignItems: 'center' }} onPress={() => uploadImage()}>
                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 13.5 }}>{t('profile.save')}</Text>
                                </TouchableOpacity>
                            </View>)
                    )}

                    <View style={{ marginTop: 24 }}>
                        <ProfileInfo profile={profile} selectedLanguage={selectedLanguage} />
                    </View>

                    <View style={{ marginTop: 24, marginBottom: 40 }}>
                        <LeavesInfo profile={profile} selectedLanguage={selectedLanguage} />
                    </View>

                    <Footer />

                </ScrollView>}

                {imageLoading && (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={{ alignItems: 'center', top: -20 }}>
                        <SkypeIndicator color="#ffffff" size={40} />
                    </View>
                </View>
                )}

                {loading && (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(30, 70, 150, 0.8)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    {selectedLanguage === 'ar' ? (<View style={{ alignItems: 'center', top: -13 }}>
                        <WaveIndicator color="#ffffff" size={50} />
                        <View style={{ top: -337, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{t('loading.getting-things-ready')} !</Text>
                            <Text style={{ color: 'white', fontWeight: '700', fontSize: 13.5, top: 5, left: -1 }}>{t('loading.please-wait')} ....</Text>
                        </View>
                    </View>)
                        :
                        (<View style={{ alignItems: 'center', top: -10 }}>
                            <WaveIndicator color="#ffffff" size={50} />
                            <View style={{ top: -337, alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 14.5 }}>{t('loading.getting-things-ready')}!</Text>
                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 13.5, top: 2, left: 2 }}>{t('loading.please-wait')} ....</Text>
                            </View>
                        </View>)}
                </View>
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'rgba(220, 224, 241, 0.95)',
        elevation: 10,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000
    }
})