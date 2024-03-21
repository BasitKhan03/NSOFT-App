import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { BarIndicator, WaveIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import LatestAttendanceTable from '../components/LatestAttendanceTable';
import CircularChart from '../components/CircularChart';
import EventsTable from '../components/EventsTable';
import HolidaysTable from '../components/HolidaysTable';
import AttendancePieChart from '../components/AttendancePieChart';
import LeavesSummaryChart from '../components/LeavesSummaryChart';
import Footer from '../components/Footer';

export default function DashboardScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [leavesLoading, setLeavesLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [campus, setCampus] = useState('');
    const [latestAttendance, setLatestAttendance] = useState([{ time_in: ' ', time_out: ' ', terminal_in: ' ', terminal_out: ' ' }]);
    const [presentPercentage, setPresentPercentage] = useState([{ PresentPercentage: 0 }]);
    const [absentPercentage, setAbsentPercentage] = useState([{ AbsentPercentage: 0 }]);
    const [latePercentage, setLatePercentage] = useState([{ LatePercentage: 0 }]);
    const [earlyOutPercentage, setEarlyOutPercentage] = useState([{ EarlyOutPercentage: 0 }]);
    const [leavesPercentage, setLeavesPercentage] = useState([{ LeavesPercentage: 0 }]);
    const [leavesSummary, setLeavesSummary] = useState([{ LeavesAccepted: 0, LeavesApplied: 0, Month: 0 }]);

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
                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response1 = await axios.post(`${CURRENT_HOST}/api/employee/latestattendance/${userData.employeeID}`, null, axiosConfig);
                if (response1.data && response1.data.length > 0) {
                    setLatestAttendance(response1.data);
                } else {
                    setLatestAttendance([{ time_in: ' ', time_out: ' ', terminal_in: ' ', terminal_out: ' ' }]);
                }


                const requests = [
                    axios.post(`${CURRENT_HOST}/api/employee/presentpercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/absentpercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/latepercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/earlyoutpercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/leavespercentage/${userData.employeeID}`, null, axiosConfig),
                ];

                const responses = await axios.all(requests);

                setPresentPercentage(responses[0].data);
                setAbsentPercentage(responses[1].data);
                setLatePercentage(responses[2].data);
                setEarlyOutPercentage(responses[3].data);
                setLeavesPercentage(responses[4].data);


                const response2 = await axios.post(`${CURRENT_HOST}/api/employee/leavessummary/${userData.employeeID}`, null, axiosConfig);
                if (response2.data && response2.data.length > 0) {
                    setLeavesSummary(response2.data);
                } else {
                    setLeavesSummary([{ LeavesAccepted: 0, LeavesApplied: 0, Month: 0 }])
                }


                const response3 = await axios.post(`${CURRENT_HOST}/api/employee/campus/${userData.employeeID}`, null, axiosConfig);
                setCampus(response3.data);
            }
            catch (error) {
                setTimeout(() => {
                    setUserToken(null);
                }, 2000)
            }
            finally {
                console.log('Verified... (Dashboard)');
                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            }
        }

        fetchData();
    }, [userToken, userData]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         async function fetchData() {
    //             try {
    //                 setLoading(true);

    //                 const axiosConfig = {
    //                     headers: {
    //                         'Authorization': `bearer ${userToken}`,
    //                     },
    //                 };

    //                 const response1 = await axios.post(`${CURRENT_HOST}/api/employee/latestattendance/${userData.employeeID}`, null, axiosConfig);
    //                 if (response1.data && response1.data.length > 0) {
    //                     setLatestAttendance(response1.data);
    //                 } else {
    //                     setLatestAttendance([{ time_in: ' ', time_out: ' ', terminal_in: ' ', terminal_out: ' ' }]);
    //                 }

    //                 const requests = [
    //                     axios.post(`${CURRENT_HOST}/api/employee/presentpercentage/${userData.employeeID}`, null, axiosConfig),
    //                     axios.post(`${CURRENT_HOST}/api/employee/absentpercentage/${userData.employeeID}`, null, axiosConfig),
    //                     axios.post(`${CURRENT_HOST}/api/employee/latepercentage/${userData.employeeID}`, null, axiosConfig),
    //                     axios.post(`${CURRENT_HOST}/api/employee/earlyoutpercentage/${userData.employeeID}`, null, axiosConfig),
    //                     axios.post(`${CURRENT_HOST}/api/employee/leavespercentage/${userData.employeeID}`, null, axiosConfig),
    //                 ];

    //                 const responses = await axios.all(requests);

    //                 setPresentPercentage(responses[0].data);
    //                 setAbsentPercentage(responses[1].data);
    //                 setLatePercentage(responses[2].data);
    //                 setEarlyOutPercentage(responses[3].data);
    //                 setLeavesPercentage(responses[4].data);

    //                 const response2 = await axios.post(`${CURRENT_HOST}/api/employee/leavessummary/${userData.employeeID}`, null, axiosConfig);
    //                 if (response2.data && response2.data.length > 0) {
    //                     setLeavesSummary(response2.data);
    //                 } else {
    //                     setLeavesSummary([{ LeavesAccepted: 0, LeavesApplied: 0, Month: 0 }])
    //                 }

    //                 console.log('Verified... (Dashboard)');

    //                 setTimeout(() => {
    //                     setLoading(false);
    //                 }, 2000)
    //             }
    //             catch (error) {
    //                 setTimeout(() => {
    //                     setUserToken(null);
    //                 }, 2000)
    //             }
    //         }

    //         fetchData();
    //     }, [userToken, userData])
    // );

    useFocusEffect(
        React.useCallback(() => {
            setLeavesLoading(true);

            async function fetchLeaves() {
                try {
                    const axiosConfig = {
                        headers: {
                            'Authorization': `bearer ${userToken}`,
                        },
                    };

                    const response = await axios.post(`${CURRENT_HOST}/api/employee/leavessummary/${userData.employeeID}`, null, axiosConfig);

                    if (response.data && response.data.length > 0) {
                        setLeavesSummary(response.data);
                    } else {
                        setLeavesSummary([{ LeavesAccepted: 0, LeavesApplied: 0, Month: 0 }])
                    }
                }
                catch (e) {
                    console.log(e);
                    setTimeout(() => {
                        setUserToken(null);
                    }, 2000);
                }
                finally {
                    setLeavesLoading(false);
                }
            }

            fetchLeaves();
        }, [userToken, userData])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        async function fetchData() {
            try {
                setLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response1 = await axios.post(`${CURRENT_HOST}/api/employee/latestattendance/${userData.employeeID}`, null, axiosConfig);
                if (response1.data && response1.data.length > 0) {
                    setLatestAttendance(response1.data);
                } else {
                    setLatestAttendance([{ time_in: ' ', time_out: ' ', terminal_in: ' ', terminal_out: ' ' }]);
                }


                const requests = [
                    axios.post(`${CURRENT_HOST}/api/employee/presentpercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/absentpercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/latepercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/earlyoutpercentage/${userData.employeeID}`, null, axiosConfig),
                    axios.post(`${CURRENT_HOST}/api/employee/leavespercentage/${userData.employeeID}`, null, axiosConfig),
                ];

                const responses = await axios.all(requests);

                setPresentPercentage(responses[0].data);
                setAbsentPercentage(responses[1].data);
                setLatePercentage(responses[2].data);
                setEarlyOutPercentage(responses[3].data);
                setLeavesPercentage(responses[4].data);


                const response2 = await axios.post(`${CURRENT_HOST}/api/employee/leavessummary/${userData.employeeID}`, null, axiosConfig);
                if (response2.data && response2.data.length > 0) {
                    setLeavesSummary(response2.data);
                } else {
                    setLeavesSummary([{ LeavesAccepted: 0, LeavesApplied: 0, Month: 0 }]);
                }

                console.log('Verified... (Dashboard)');
            }
            catch (error) {
                setTimeout(() => {
                    setUserToken(null);
                }, 2000)
            }
            finally {
                setRefreshing(false);
                setLoading(false);
            }
        }

        fetchData();
    }, [userToken, userData]);

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>

                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='dashboard' selectedLanguage={selectedLanguage} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                {!loading &&
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#318CE7"]} />}>

                        {/* -----Greeting Code----- */}
                        <View style={{ marginTop: 22, marginBottom: 22.5, width: selectedLanguage !== 'ar' && '100%', marginLeft: selectedLanguage !== 'ar' && 30, marginRight: selectedLanguage === 'ar' && 32 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 22, fontWeight: 700, marginBottom: selectedLanguage === 'ar' ? 2 : 1 }}>{t('dashboard.welcome')}</Text>
                                <Text style={{ fontSize: selectedLanguage === 'ar' ? 21.2 : 22, marginBottom: selectedLanguage === 'ar' ? 8 : 8.5, fontWeight: 700, textAlign: selectedLanguage === 'ar' ? 'right' : 'left' }}>{userData.firstName} <Text style={{ color: 'red' }}>{userData.lastName.charAt(0).toUpperCase()}</Text>{userData.lastName.slice(1).toLowerCase()}</Text>
                                <Text style={{ fontSize: selectedLanguage === 'ar' ? 14.5 : 14, color: 'gray', fontWeight: '700' }}>{t('dashboard.campus')} | <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 14, color: 'gray', fontWeight: 400 }}>{campus[0].CampusCode}</Text></Text>
                            </View>
                        </View>
                        {/* -----Greeting Code End----- */}


                        {/* -----Latest Attendace Code----- */}
                        <View style={{ marginTop: 12 }}>
                            <LatestAttendanceTable attendance={latestAttendance} selectedLanguage={selectedLanguage} />
                        </View>
                        {/* -----Latest Attendace Code End----- */}


                        {/* -----Circular Chart Code----- */}
                        <View style={{ marginTop: 30 }}>

                            <View style={{ marginBottom: 9, width: selectedLanguage !== 'ar' && '100%', marginLeft: 28 }}>
                                <Text style={{ fontSize: selectedLanguage === 'ar' ? 14.5 : 14, fontWeight: 700, color: '#2b4757', marginRight: selectedLanguage === 'ar' ? 35 : undefined }}>{t('dashboard.attendance-summary')}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 30 }}>
                                <View style={{ backgroundColor: 'white', width: '47%', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                    <CircularChart percent={presentPercentage[0].PresentPercentage !== null ? parseInt(presentPercentage[0].PresentPercentage) : 0} label={t('dashboard.present')} color="#7297f8" selectedLanguage={selectedLanguage} />
                                </View>
                                <View style={{ backgroundColor: 'white', width: '47%', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                    <CircularChart percent={absentPercentage[0].AbsentPercentage !== null ? parseInt(absentPercentage[0].AbsentPercentage) : 0} label={t('dashboard.absent')} color="red" selectedLanguage={selectedLanguage} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 30 }}>
                                <View style={{ backgroundColor: 'white', width: '47%', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                    <CircularChart percent={latePercentage[0].LatePercentage !== null ? parseInt(latePercentage[0].LatePercentage) : 0} label={t('dashboard.late')} color="darkorange" selectedLanguage={selectedLanguage} />
                                </View>
                                <View style={{ backgroundColor: 'white', width: '47%', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
                                    <CircularChart percent={earlyOutPercentage[0].EarlyOutPercentage !== null ? parseInt(earlyOutPercentage[0].EarlyOutPercentage) : 0} label={t('dashboard.early-out')} color="#C08261" selectedLanguage={selectedLanguage} />
                                </View>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <CircularChart percent={leavesPercentage.length !== 0 ? parseInt(leavesPercentage[0].LeavesPercentage) : 0} label={t('dashboard.leave')} option='Leave' color="gray" selectedLanguage={selectedLanguage} />
                            </View>
                        </View>
                        {/* -----Circular Chart Code End----- */}


                        {/* -----Events Code----- */}
                        <View style={{ marginTop: 35 }}>
                            <View style={{ marginBottom: 17, width: selectedLanguage !== 'ar' && '100%', marginLeft: 27 }}>
                                <Text style={{ fontSize: selectedLanguage === 'ar' ? 14.5 : 14, fontWeight: 700, color: '#2b4757', marginRight: selectedLanguage === 'ar' ? 35 : undefined }}>{t('dashboard.upcoming-events')}</Text>
                            </View>

                            <EventsTable selectedLanguage={selectedLanguage} />
                        </View>
                        {/* -----Events Code End----- */}


                        {/* -----Holidays Code----- */}
                        <View style={{ marginTop: 36 }}>
                            <View style={{ marginBottom: 17, width: selectedLanguage !== 'ar' && '100%', marginLeft: 27 }}>
                                <Text style={{ fontSize: selectedLanguage === 'ar' ? 14.5 : 14, fontWeight: 700, color: '#2b4757', marginRight: selectedLanguage === 'ar' ? 35 : undefined }}>{t('dashboard.upcoming-holidays')}</Text>
                            </View>

                            <HolidaysTable selectedLanguage={selectedLanguage} />
                        </View>
                        {/* -----Holidays Code End----- */}


                        {/* -----Attendance Pie Chart----- */}
                        <View style={{ marginTop: 42 }}>
                            {selectedLanguage !== 'ar' ? (<View style={{ marginBottom: 19, width: '100%', marginLeft: 27, flexDirection: 'row', alignItems: 'center' }}>
                                <Entypo name="pie-chart" size={14} color="#2b4757" style={{ marginRight: 5.5 }} />
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757' }}>{t('dashboard.attendance-graphical-view')}</Text>
                            </View>)
                                :
                                (<View style={{ marginBottom: 19, marginLeft: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 35 }}>
                                    <Text style={{ fontSize: 14.5, fontWeight: 700, color: '#2b4757' }}>{t('dashboard.attendance-graphical-view')}</Text>
                                    <Entypo name="pie-chart" size={14} color="#2b4757" style={{ marginLeft: 7 }} />
                                </View>)}

                            <AttendancePieChart present={presentPercentage[0].PresentPercentage !== null ? parseInt(presentPercentage[0].PresentPercentage) : 0} absent={absentPercentage[0].AbsentPercentage !== null ? parseInt(absentPercentage[0].AbsentPercentage) : 0} leave={leavesPercentage.length !== 0 ? parseInt(leavesPercentage[0].LeavesPercentage) : 0} late={latePercentage[0].LatePercentage !== null ? parseInt(latePercentage[0].LatePercentage) : 0} selectedLanguage={selectedLanguage} />
                        </View>
                        {/* -----Attendance Pie Chart End----- */}


                        {/* -----Leaves Summary Chart----- */}
                        <View style={{ marginTop: selectedLanguage === 'ar' ? 4 : 3, marginBottom: 50 }}>
                            {selectedLanguage !== 'ar' ? (<View style={{ marginBottom: 19, width: '100%', marginLeft: 27, flexDirection: 'row', alignItems: 'center' }}>
                                <Entypo name="bar-graph" size={15} color="#2b4757" style={{ marginRight: 6 }} />
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757' }}>{t('dashboard.leaves-summary')}</Text>
                            </View>)
                                :
                                (<View style={{ marginBottom: 19, marginLeft: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 35 }}>
                                    <Text style={{ fontSize: 14.2, fontWeight: '700', color: '#2b4757' }}>{t('dashboard.leaves-summary')}</Text>
                                    <Entypo name="bar-graph" size={13.5} color="#2b4757" style={{ marginLeft: 7 }} />
                                </View>)}

                            {!leavesLoading && (<LeavesSummaryChart leavesSummary={leavesSummary} selectedLanguage={selectedLanguage} />)}

                            {leavesLoading && (<View style={{ marginTop: 5, paddingLeft: 20, paddingRight: 16, paddingTop: 21, paddingBottom: 25, width: '86%', height: 340, backgroundColor: 'white', elevation: 2, shadowColor: 'lightgray', alignSelf: 'center', borderRadius: 5 }}>
                                <View style={{ marginBottom: 7, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14.5, marginBottom: 3, fontWeight: 700, color: 'darkblue' }}>{t('dashboard.leaves-in')}</Text>
                                    <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 13, color: 'gray' }}>{new Date().getFullYear()}</Text>
                                </View>

                                <View style={{ top: 85 }}>
                                    <BarIndicator color="#318CE7" size={24} count={5} />
                                </View>

                                <View style={{ marginTop: 34, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 15, position: 'absolute', bottom: 35, alignSelf: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <View style={{ height: 10, width: 10, backgroundColor: '#177AD5', borderRadius: 2, top: 4 }} />
                                        <View style={{ alignItems: 'center', marginLeft: 6 }}>
                                            <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('dashboard.applied')}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: 700 }}>N/a</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <View style={{ height: 10, width: 10, backgroundColor: '#ED6665', borderRadius: 2, top: 4 }} />
                                        <View style={{ alignItems: 'center', marginLeft: 6 }}>
                                            <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('dashboard.accepted')}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: 700 }}>N/a</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>)}
                        </View>
                        {/* -----Leaves Summary Chart End----- */}


                        {/* -----Footer----- */}
                        <Footer />
                        {/* -----Footer End----- */}

                    </ScrollView >}

                {loading && (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(30, 70, 150, 0.8)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>

                    {selectedLanguage === 'ar' ? (<View style={{ alignItems: 'center', top: -30 }}>
                        <WaveIndicator color="#ffffff" size={50} />
                        <View style={{ top: -337, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{t('loading.getting-things-ready')} !</Text>
                            <Text style={{ color: 'white', fontWeight: '700', fontSize: 13.5, top: 5, left: -1 }}>{t('loading.please-wait')} ....</Text>
                        </View>
                    </View>)
                        :
                        (<View style={{ alignItems: 'center', top: -30 }}>
                            <WaveIndicator color="#ffffff" size={50} />
                            <View style={{ top: -337, alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 14.5 }}>{t('loading.getting-things-ready')}!</Text>
                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 13.5, top: 2, left: 2 }}>{t('loading.please-wait')} ....</Text>
                            </View>
                        </View>)}
                </View>)}

            </View >
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