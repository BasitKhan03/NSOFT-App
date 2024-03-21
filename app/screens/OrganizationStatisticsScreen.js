import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Text, RefreshControl } from 'react-native';
import { Feather, Entypo } from '@expo/vector-icons';
import { WaveIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import OrganizationChart from '../components/OrganizationChart';
import OrganizationAttendancePieChart from '../components/OrganizationAttendancePieChart';
import Footer from '../components/Footer';

export default function OrganizationStatisticsScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [stats, setStats] = useState([]);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setPageLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response = await axios.post(`${CURRENT_HOST}/api/employee/organizationstats/${userData.employeeID}`, null, axiosConfig);
                if (response.data && response.data.length > 0) {
                    setStats(response.data);
                }
                else {
                    setStats([{ TotalAbsentUsers: 0, TotalActiveUsers: 1, TotalLateUsers: 0, TotalOnLeaveUsers: 0, TotalOnTimeUsers: 0, TotalPresentUsers: 0, TotalRegisteredUsers: 1 }]);
                }
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000)
            }
            finally {
                setTimeout(() => {
                    setPageLoading(false);
                }, 1200)
            }
        };

        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setCurrentTime(getCurrentDateTime());
        }, [])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setCurrentTime(getCurrentDateTime());

        const fetchData = async () => {
            try {
                setPageLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response = await axios.post(`${CURRENT_HOST}/api/employee/organizationstats/${userData.employeeID}`, null, axiosConfig);
                if (response.data && response.data.length > 0) {
                    setStats(response.data);
                }
                else {
                    setStats([{ TotalAbsentUsers: 0, TotalActiveUsers: 1, TotalLateUsers: 0, TotalOnLeaveUsers: 0, TotalOnTimeUsers: 0, TotalPresentUsers: 0, TotalRegisteredUsers: 1 }]);
                }
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000)
            }
            finally {
                setRefreshing(false);
                setPageLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const pageYOffset = contentOffset.y;
        pageYOffset > 30 ? setScroll(true) : setScroll(false);
    };

    const getCurrentDateTime = () => {
        const options = {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const currentDateTime = new Date();

        return formatter.format(currentDateTime);
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>
                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='dashboard' selectedLanguage={selectedLanguage} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                {!pageLoading && stats.length > 0 && (<ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#318CE7"]} />}>

                    <View style={{ marginTop: 23, backgroundColor: 'white', elevation: 2, shadowColor: 'gray', borderRadius: 5, width: '87%', alignSelf: 'center', paddingVertical: 16, paddingBottom: 22 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Feather name="users" size={17} color="black" style={{ marginLeft: 18 }} />
                                <Text style={{ fontSize: 14.2, fontWeight: '700', marginLeft: 9 }}>{t('organizationstats.organization')}</Text>
                            </View>

                            <View style={{ width: '55%' }}>
                                <Text style={{ fontSize: 11, color: 'gray', textAlign: 'right' }}>{currentTime}</Text>
                            </View>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <View style={{ width: '67%' }}>
                                    <Text style={{ fontSize: 11, color: 'gray', textAlign: 'left' }}>{currentTime}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: selectedLanguage === 'ar' ? 15 : 14.2, fontWeight: '700', marginRight: 10 }}>{t('organizationstats.organization')}</Text>
                                    <Feather name="users" size={17} color="black" style={{ marginRight: 18 }} />
                                </View>
                            </View>)}

                        <View style={{ width: '87%', alignSelf: 'center', borderBottomWidth: 0.5, borderBottomColor: '#D17842', borderStyle: 'dashed', marginTop: 9 }} />

                        {selectedLanguage !== 'ar' ? (<View style={{ width: '88%', borderColor: 'gray', borderWidth: 0.2, borderStyle: 'dashed', alignSelf: 'center', marginTop: 17, paddingVertical: 7, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="user" size={16} color='#848884' />
                            <Text style={{ fontSize: 13, color: '#848884', marginLeft: 6 }}>{userData.firstName + ' ' + userData.lastName}</Text>
                        </View>)
                            :
                            (<View style={{ width: '88%', borderColor: 'gray', borderWidth: 0.2, borderStyle: 'dashed', alignSelf: 'center', marginTop: 17, paddingVertical: 7, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ fontSize: 13, color: '#848884', marginRight: 7 }}>{userData.firstName + ' ' + userData.lastName}</Text>
                                <Feather name="user" size={16} color='#848884' />
                            </View>)}
                    </View>

                    <View style={{ marginTop: 22 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                            <View style={{ backgroundColor: 'white', width: '48%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 15, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <OrganizationChart count={stats[0].TotalRegisteredUsers} label={t('organizationstats.registered-users')} subLabel={t('organizationstats.total')} color="#CD7F32" selectedLanguage={selectedLanguage} />
                            </View>
                            <View style={{ backgroundColor: 'white', width: '48%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 15, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <OrganizationChart count={stats[0].TotalActiveUsers} label={t('organizationstats.active-users')} subLabel={t('organizationstats.total')} color="#8A9A5B" selectedLanguage={selectedLanguage} />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                            <View style={{ backgroundColor: 'white', width: '48%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 15, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <OrganizationChart count={stats[0].TotalPresentUsers} label={t('organizationstats.present')} subLabel={t('organizationstats.today')} color="#7297f8" selectedLanguage={selectedLanguage} />
                            </View>
                            <View style={{ backgroundColor: 'white', width: '48%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 15, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <OrganizationChart count={stats[0].TotalAbsentUsers} label={t('organizationstats.absent')} subLabel={t('organizationstats.today')} color="#FF0000" selectedLanguage={selectedLanguage} />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                            <View style={{ backgroundColor: 'white', width: '48%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 15, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <OrganizationChart count={2} label={t('organizationstats.cards-registered')} subLabel={t('organizationstats.total')} color="#DAA520" selectedLanguage={selectedLanguage} />
                            </View>
                            <View style={{ backgroundColor: 'white', width: '48%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 15, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <OrganizationChart count={97} label={t('organizationstats.fingers-registered')} subLabel={t('organizationstats.total')} color="#C9A9A6" selectedLanguage={selectedLanguage} />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 35, marginBottom: 13 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ marginBottom: 19, width: '100%', marginLeft: 27, flexDirection: 'row', alignItems: 'center' }}>
                            <Entypo name="pie-chart" size={14} color="#2b4757" style={{ marginRight: 5.5 }} />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757' }}>{t('organizationstats.attendance-graphical-view')}</Text>
                        </View>)
                            :
                            (<View style={{ marginBottom: 19, marginLeft: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 35 }}>
                                <Text style={{ fontSize: 14.5, fontWeight: 700, color: '#2b4757' }}>{t('organizationstats.attendance-graphical-view')}</Text>
                                <Entypo name="pie-chart" size={14} color="#2b4757" style={{ marginLeft: 7 }} />
                            </View>)}

                        <OrganizationAttendancePieChart stats={stats} selectedLanguage={selectedLanguage} />
                    </View>

                    <Footer />

                </ScrollView>)}

                {pageLoading && (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(30, 70, 150, 0.8)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
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
        backgroundColor: 'rgba(220,224,241,0.95)',
        elevation: 10,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000
    }
})