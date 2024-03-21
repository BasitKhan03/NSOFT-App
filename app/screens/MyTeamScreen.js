import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { Feather, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { WaveIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import TeamChart from '../components/TeamChart';
import TeamAttendancePieChart from '../components/TeamAttendancePieChart';
import TeamMembersTable from '../components/TeamMembersTable';
import Footer from '../components/Footer';

export default function MyTeamScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [teamCount, setTeamCount] = useState([]);
    const [teamPercentage, setTeamPercentage] = useState([]);
    const [teamLeavesPercentage, setTeamLeavesPercentage] = useState([]);
    const [teamDetails, setTeamDetails] = useState([]);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response1 = await axios.post(`${CURRENT_HOST}/api/employee/teamcount/${userData.employeeID}`, null, axiosConfig);
                setTeamCount(response1.data);

                const response2 = await axios.post(`${CURRENT_HOST}/api/employee/teamattendancepercentage/${userData.employeeID}`, null, axiosConfig);
                setTeamPercentage(response2.data);

                const response3 = await axios.post(`${CURRENT_HOST}/api/employee/teamleavespercentage/${userData.employeeID}`, null, axiosConfig);
                setTeamLeavesPercentage(response3.data);

                const response4 = await axios.post(`${CURRENT_HOST}/api/employee/teamdetails/${userData.employeeID}`, null, axiosConfig);
                setTeamDetails(response4.data);
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 1000)
            }
            finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1500)
            }
        }

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

        async function fetchData() {
            try {
                setLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response1 = await axios.post(`${CURRENT_HOST}/api/employee/teamcount/${userData.employeeID}`, null, axiosConfig);
                setTeamCount(response1.data);

                const response2 = await axios.post(`${CURRENT_HOST}/api/employee/teamattendancepercentage/${userData.employeeID}`, null, axiosConfig);
                setTeamPercentage(response2.data);

                const response3 = await axios.post(`${CURRENT_HOST}/api/employee/teamleavespercentage/${userData.employeeID}`, null, axiosConfig);
                setTeamLeavesPercentage(response3.data);

                const response4 = await axios.post(`${CURRENT_HOST}/api/employee/teamdetails/${userData.employeeID}`, null, axiosConfig);
                setTeamDetails(response4.data);
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 1000)
            }
            finally {
                setRefreshing(false);
                setLoading(false);
            }
        }

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

    const generateExcel = () => {
        let wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(teamDetails);

        XLSX.utils.book_append_sheet(wb, ws, "Employee Details", true)

        const base64 = XLSX.write(wb, { type: "base64" });
        const filename = FileSystem.documentDirectory + "team-details.xlsx";
        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(async () => {
            Sharing.shareAsync(filename);
        })
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>

                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='dashboard' selectedLanguage={selectedLanguage} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                {teamCount.length > 0 && teamPercentage.length > 0 && teamLeavesPercentage.length > 0 && teamDetails.length > 0 && (<ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#318CE7"]} />}>

                    <View style={{ marginTop: 23, backgroundColor: 'white', elevation: 2, shadowColor: 'gray', borderRadius: 5, width: '87%', alignSelf: 'center', paddingVertical: 16, paddingBottom: 22 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Feather name="users" size={17} color="black" style={{ marginLeft: 18 }} />
                                <Text style={{ fontSize: 14.2, fontWeight: '700', marginLeft: 9 }}>{t('myteam.my-team')}</Text>
                            </View>

                            <View style={{ width: '61%' }}>
                                <Text style={{ fontSize: 11, color: 'gray', textAlign: 'right' }}>{currentTime}</Text>
                            </View>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <View style={{ width: '70%' }}>
                                    <Text style={{ fontSize: 11, color: 'gray', textAlign: 'left' }}>{currentTime}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: selectedLanguage === 'ar' ? 15 : 14.2, fontWeight: '700', marginRight: 10 }}>{t('myteam.my-team')}</Text>
                                    <Feather name="users" size={17} color="black" style={{ marginRight: 18 }} />
                                </View>
                            </View>)}

                        <View style={{ width: '87%', alignSelf: 'center', borderBottomWidth: 0.5, borderBottomColor: '#D17842', borderStyle: 'dashed', marginTop: 9 }} />

                        <View style={{ marginTop: 15, marginLeft: 0 }}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 12.5, fontWeight: '700', color: '#3457D5', textAlign: 'center' }}>{t('myteam.attendance-supervisor')}</Text>
                        </View>

                        {selectedLanguage !== 'ar' ? (<View style={{ width: '88%', borderColor: 'gray', borderWidth: 0.45, borderStyle: 'dashed', alignSelf: 'center', marginTop: 10, paddingVertical: 7, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="user" size={15} color='#848884' />
                            <Text style={{ fontSize: 12.5, color: '#848884', marginLeft: 6 }}>{userData.firstName + ' ' + userData.lastName}</Text>
                        </View>)
                            :
                            (<View style={{ width: '88%', borderColor: 'gray', borderWidth: 0.45, borderStyle: 'dashed', alignSelf: 'center', marginTop: 10, paddingVertical: 7, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ fontSize: 12.5, color: '#848884', marginRight: 7 }}>{userData.firstName + ' ' + userData.lastName}</Text>
                                <Feather name="user" size={15} color='#848884' />
                            </View>)}
                    </View>

                    <View style={{ marginTop: 22 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                            <View style={{ backgroundColor: 'white', width: '31%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <TeamChart count={teamCount[0].Present !== null ? parseInt(teamCount[0].Present) : 0} label={t('myteam.present')} subLabel={t('myteam.today')} color="#7297f8" selectedLanguage={selectedLanguage} />
                            </View>
                            <View style={{ backgroundColor: 'white', width: '31%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <TeamChart count={teamCount[0].Absent !== null ? parseInt(teamCount[0].Absent) : 0} label={t('myteam.absent')} subLabel={t('myteam.today')} color="red" selectedLanguage={selectedLanguage} />
                            </View>
                            <View style={{ backgroundColor: 'white', width: '31%', paddingVertical: 11, paddingBottom: 17, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                <TeamChart count={teamCount[0].Leaves !== null ? parseInt(teamCount[0].Leaves) : 0} label={t('myteam.leave')} subLabel={t('myteam.today')} color="gray" selectedLanguage={selectedLanguage} />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 35 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ marginBottom: 19, width: '100%', marginLeft: 27, flexDirection: 'row', alignItems: 'center' }}>
                            <Entypo name="pie-chart" size={14} color="#2b4757" style={{ marginRight: 5.5 }} />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757' }}>{t('myteam.attendance-graphical-view')}</Text>
                        </View>)
                            :
                            (<View style={{ marginBottom: 19, marginLeft: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 35 }}>
                                <Text style={{ fontSize: 14.5, fontWeight: 700, color: '#2b4757' }}>{t('myteam.attendance-graphical-view')}</Text>
                                <Entypo name="pie-chart" size={14} color="#2b4757" style={{ marginLeft: 7 }} />
                            </View>)}

                        <TeamAttendancePieChart present={teamPercentage[0].CollectivePresentPercentage !== null ? parseInt(teamPercentage[0].CollectivePresentPercentage) : 0} absent={teamPercentage[0].CollectiveAbsentPercentage !== null ? parseInt(teamPercentage[0].CollectiveAbsentPercentage) : 0} leave={teamLeavesPercentage[0].CollectiveLeavesPercentage !== null ? parseInt(teamLeavesPercentage[0].CollectiveLeavesPercentage) : 0} late={teamPercentage[0].CollectiveLatePercentage !== null ? parseInt(teamPercentage[0].CollectiveLatePercentage) : 0} earlyout={teamPercentage[0].CollectiveEarlyOutPercentage !== null ? parseInt(teamPercentage[0].CollectiveEarlyOutPercentage) : 0} selectedLanguage={selectedLanguage} />
                    </View>

                    <View style={{ marginTop: 1 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ marginBottom: 20, width: '100%', marginLeft: 27, flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="user" size={14} color="#2b4757" style={{ marginRight: 6.5 }} />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757' }}>{t('myteam.tagged-employees')}</Text>
                        </View>)
                            :
                            (<View style={{ marginBottom: 20, marginLeft: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 35 }}>
                                <Text style={{ fontSize: 14.5, fontWeight: 700, color: '#2b4757' }}>{t('myteam.tagged-employees')}</Text>
                                <FontAwesome name="user" size={14} color="#2b4757" style={{ marginLeft: 7 }} />
                            </View>)}

                        <TeamMembersTable details={teamDetails} />
                    </View>

                    <View style={{ marginTop: 7, marginBottom: 50 }}>
                        <View style={{ width: '87%', backgroundColor: 'white', paddingVertical: 14, paddingHorizontal: 20, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', flexDirection: 'row', justifyContent: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 7, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: selectedLanguage === 'ar' ? 0 : 10, marginLeft: selectedLanguage === 'ar' ? 10 : 0, flexDirection: 'row' }} onPress={() => generateExcel()}>
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: '500', marginRight: 6 }}>{t('myteam.export-sheet')}</Text>
                                <MaterialCommunityIcons name="microsoft-excel" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Footer />

                </ScrollView>)}

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
        backgroundColor: 'rgba(220,224,241,0.95)',
        elevation: 10,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000
    }
})