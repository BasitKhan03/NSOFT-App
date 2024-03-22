import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AntDesign, MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { DataTable } from 'react-native-paper';
import { MaterialIndicator, WaveIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import Modal from "react-native-modal";
import axios from 'axios';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';

export default function LeaveStatisticsScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [teamNames, setTeamNames] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [year, setYear] = useState('');
    const [leaves, setLeaves] = useState([]);
    const [initial, setInitial] = useState(false);
    const [balance, setBalance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const [teamModal, setTeamModal] = useState(false);
    const [yearModal, setYearModal] = useState(false);

    const [error, setError] = useState({
        employeeErr: false,
        yearErr: false,
    });

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const years = [
        { label: t('leavestatistics.session-2022'), value: '2022' },
        { label: t('leavestatistics.session-2023'), value: '2023' },
        { label: t('leavestatistics.session-2024'), value: '2024' },
        { label: t('leavestatistics.session-2025'), value: '2025' }
    ];

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, balance.length);

    function formatCustomDate(inputDate) {
        const options = { month: 'short', day: '2-digit' };
        return inputDate.toLocaleString('en-US', options);
    };

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    useEffect(() => {
        async function fetchData() {
            try {
                setPageLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    }
                };

                if (userData.accessGroup === 1) {
                    const response = await axios.post(`${CURRENT_HOST}/api/employee/employeesname/${userData.employeeID}`, null, axiosConfig);
                    setTeamNames(response.data);
                }
                else {
                    const response = await axios.post(`${CURRENT_HOST}/api/employee/teamnames/${userData.employeeID}`, null, axiosConfig);
                    setTeamNames(response.data);
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
        }

        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setSelectedEmployee('');
            setYear('');
            setInitial(false);
            setBalance([])
            setLoading(false);
            setLeaves([]);
            setError(false);
            setPage(0);
            onItemsPerPageChange(numberOfItemsPerPageList[0]);
        }, [])
    );

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const pageYOffset = contentOffset.y;
        pageYOffset > 30 ? setScroll(true) : setScroll(false);
    };

    const handleSearch1 = async () => {
        if (year === '') {
            setError(prevState => ({ ...prevState, yearErr: true }));
        }
        else {
            try {
                setInitial(true);
                setLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                await axios.post(`${CURRENT_HOST}/api/employee/leaveslist/${userData.employeeID}`, { year: year }, axiosConfig)
                    .then(response => {
                        setLeaves(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });

                await axios.post(`${CURRENT_HOST}/api/employee/leavesbalance/${userData.employeeID}`, { year: year }, axiosConfig)
                    .then(response => {
                        setBalance(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });

                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000);
            }
        }
    };

    const handleSearch2 = async () => {
        if (year === '' || selectedEmployee === '') {
            if (year === '') {
                setError(prevState => ({ ...prevState, yearErr: true }));
            }
            if (selectedEmployee === '') {
                setError(prevState => ({ ...prevState, employeeErr: true }));
            }
        }
        else {
            try {
                setInitial(true);
                setLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                await axios.post(`${CURRENT_HOST}/api/employee/leaveslist/${selectedEmployee}`, { year: year }, axiosConfig)
                    .then(response => {
                        setLeaves(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });

                await axios.post(`${CURRENT_HOST}/api/employee/leavesbalance/${selectedEmployee}`, { year: year }, axiosConfig)
                    .then(response => {
                        setBalance(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });

                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000);
            }
        }
    };

    const toggleTeamModal = () => {
        setTeamModal(!teamModal);
    };

    const toggleYearModal = () => {
        setYearModal(!yearModal);
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='leave' label={t('leavestatistics.leave-statistics')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                {(userData.accessGroup === 3 || teamNames.length > 0) && (<ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: 25, marginHorizontal: 25 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4 }}>
                            <AntDesign name="barschart" size={17.5} color="#2b4757" />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 7 }}>{t('leavestatistics.leaves-stats')}</Text>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4, alignSelf: 'flex-end' }}>
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginRight: 7 }}>{t('leavestatistics.leaves-stats')}</Text>
                                <AntDesign name="barschart" size={17.5} color="#2b4757" style={{ transform: [{ scaleX: (-1) }] }} />
                            </View>)}

                        <View style={{ backgroundColor: 'white', paddingTop: 18, paddingBottom: 22, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                            <Modal style={{ flex: 0, top: '31%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={teamModal} onBackdropPress={toggleTeamModal} onRequestClose={toggleTeamModal} onBackButtonPress={toggleTeamModal}>
                                <PickerIOS
                                    itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                    selectedValue={selectedEmployee}
                                    numberOfLines={1}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedEmployee(itemValue);
                                        setError(prevState => ({ ...prevState, employeeErr: false }));
                                    }}>
                                    <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('report.select-an-employee')} value="" />
                                    {teamNames.map((team, index) => (
                                        <Picker.Item
                                            key={index.toString()}
                                            label={team.full_name + ' ' + `(${team.AccessGroup})`}
                                            value={team.EmployeeId}
                                            itemStyle={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2 }}
                                        />
                                    ))}
                                </PickerIOS>

                                <View style={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#318CE7', top: -13 }} onPress={toggleTeamModal}>
                                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12.5, marginRight: 5, top: selectedLanguage === 'ar' ? -2 : 0 }}>{t('report.done')}</Text>
                                        <AntDesign name="arrowright" size={13} color="white" style={{ top: 0.5 }} />
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            {(userData.accessGroup === 2 || userData.accessGroup === 1) && (Platform.OS === 'android' ? (<View style={{ width: '87%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Picker
                                        mode='dropdown'
                                        style={{ width: '100%', color: 'gray' }}
                                        selectedValue={selectedEmployee}
                                        dropdownIconColor={error.employeeErr ? 'white' : 'gray'}
                                        numberOfLines={1}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setSelectedEmployee(itemValue);
                                            setError(prevState => ({ ...prevState, employeeErr: false }));
                                        }}>
                                        <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2, color: 'gray' }} label={t('report.select-an-employee')} value="" />
                                        {teamNames.map((team, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={team.full_name + ' ' + `(${team.AccessGroup})`}
                                                value={team.EmployeeId}
                                                style={{ fontSize: 13, color: 'black' }}
                                            />
                                        ))}
                                    </Picker>
                                    {error.employeeErr && <MaterialIcons style={{ right: 30, top: 16 }} name="error-outline" size={15} color="red" />}
                                </View>
                            </View>)
                                :
                                ((userData.accessGroup === 2 || userData.accessGroup === 1) && <TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleTeamModal}>
                                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.employeeErr ? 'space-between' : 'flex-end' }}>
                                        {error.employeeErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={14} color="red" />}
                                        <Text style={{ fontSize: 13.5, color: 'gray' }}>{selectedEmployee === '' ? t('report.select-an-employee') : (teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.full_name + ' (' + teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.AccessGroup + ')')}</Text>
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13.2, color: 'gray' }}>{selectedEmployee === '' ? t('report.select-an-employee') : (teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.full_name + ' (' + teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.AccessGroup + ')')}</Text>
                                            {error.employeeErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={14} color="red" />}
                                        </View>)}
                                </TouchableOpacity>))}


                            <Modal style={{ flex: 0, top: '31%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={yearModal} onBackdropPress={toggleYearModal} onRequestClose={toggleYearModal} onBackButtonPress={toggleYearModal}>
                                <PickerIOS
                                    itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                    selectedValue={year}
                                    numberOfLines={1}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setYear(itemValue);
                                        setError(prevState => ({ ...prevState, yearErr: false }));
                                    }}>
                                    <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('leavestatistics.select-session-year')} value="" />
                                    {years.map((year, index) => (
                                        <Picker.Item
                                            key={index.toString()}
                                            label={year.label}
                                            value={year.value}
                                            itemStyle={{ fontSize: selectedLanguage === 'ar' ? 15 : 13.2 }}
                                        />
                                    ))}
                                </PickerIOS>

                                <View style={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#318CE7', top: -13 }} onPress={toggleYearModal}>
                                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12.5, marginRight: 5, top: selectedLanguage === 'ar' ? -2 : 0 }}>{t('report.done')}</Text>
                                        <AntDesign name="arrowright" size={13} color="white" style={{ top: 0.5 }} />
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            {Platform.OS === 'android' ? (<View style={{ width: '87%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Picker
                                        mode='dropdown'
                                        style={{ width: '100%', color: 'gray' }}
                                        selectedValue={year}
                                        dropdownIconColor={error.yearErr ? 'white' : 'gray'}
                                        numberOfLines={1}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setYear(itemValue);
                                            setError(prevState => ({ ...prevState, yearErr: false }));
                                        }}>
                                        <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2, color: 'gray' }} label={t('leavestatistics.select-session-year')} value="" />
                                        {years.map((year, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={year.label}
                                                value={year.value}
                                                style={{ fontSize: selectedLanguage === 'ar' ? 14 : 13 }}
                                            />
                                        ))}
                                    </Picker>
                                    {error.yearErr && <MaterialIcons style={{ right: 30, top: 16 }} name="error-outline" size={15} color="red" />}
                                </View>
                            </View>)
                                :
                                (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleYearModal}>
                                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.yearErr ? 'space-between' : 'flex-end' }}>
                                        {error.yearErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={14} color="red" />}
                                        <Text style={{ fontSize: 13.5, color: 'gray' }}>{year === '' ? t('leavestatistics.select-session-year') : (years.find(item => item.value === year)?.label)}</Text>
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13.2, color: 'gray' }}>{year === '' ? t('leavestatistics.select-session-year') : (years.find(item => item.value === year)?.label)}</Text>
                                            {error.yearErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={14} color="red" />}
                                        </View>)}
                                </TouchableOpacity>)}

                            <View style={{ marginTop: 11 }}>
                                <TouchableOpacity style={{ backgroundColor: '#00308F', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                    (userData.accessGroup === 2 || userData.accessGroup === 1) ? handleSearch2() : handleSearch1();
                                }}>
                                    <AntDesign name="search1" size={13} color="white" style={{ left: selectedLanguage === 'ar' ? -2 : -1 }} />
                                    <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 12.5 : 12.2, fontWeight: selectedLanguage !== 'ar' ? '500' : '400', marginLeft: 7, left: -2 }}>{t('leavestatistics.search')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {initial && (<View style={{ marginTop: 18, marginHorizontal: 25 }}>
                        <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 22, paddingHorizontal: 8, alignSelf: 'center', borderRadius: 5, elevation: 1.2, shadowColor: 'gray', width: '100%' }}>

                            <View style={{ marginTop: 8, marginBottom: 12 }}>
                                <Text style={{ fontSize: 13, fontWeight: '500', color: 'darkblue', alignSelf: 'center' }}>{t('leavestatistics.leaves-list-by-date')}</Text>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#007FFF', borderStyle: 'dashed', width: '95%', alignSelf: 'center', marginTop: 10 }} />
                            </View>

                            {leaves.length > 0 && !loading && (<View>

                                {leaves.map((leave, index) => (<View key={index} style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '27%', alignItems: 'center' }}>
                                        {leave.LeaveStatus === 'Pending' && <View style={{ width: 7, height: 7, backgroundColor: '#FDDA0D', borderRadius: 20, marginRight: 9 }} />}
                                        {leave.LeaveStatus === 'Approved' && <View style={{ width: 7, height: 7, backgroundColor: '#8A9A5B', borderRadius: 20, marginRight: 9 }} />}
                                        {leave.LeaveStatus === 'Rejected' && <View style={{ width: 7, height: 7, backgroundColor: 'red', borderRadius: 20, marginRight: 9 }} />}
                                        <Text style={{ fontSize: 12, color: '#002D62' }}>{formatCustomDate(new Date(leave.CreateDateTime))}</Text>
                                    </View>

                                    <View style={{ width: '30%', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: '#002D62' }}>{leave.LeaveType} Leave</Text>
                                    </View>

                                    <View style={{ width: '20%', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: '#002D62', left: -5 }}>{leave.DaysCount} day</Text>
                                    </View>

                                    <View style={{ width: '23%', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: '#002D62', left: -4 }}>{leave.LeaveStatus}</Text>
                                    </View>
                                </View>))}

                            </View>)}

                            {leaves.length === 0 && !loading && (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                                <Feather name="database" size={12} color="#8B0000" />
                                <Text style={{ fontSize: 12.2, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('leavestatistics.data-not-available')}</Text>
                                <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />
                            </View>)}

                            {loading && (
                                <View style={{ alignItems: 'center', top: 3 }}>
                                    <MaterialIndicator color="#D17842" size={22} />
                                </View>
                            )}
                        </View>
                    </View>)}

                    <View style={{ marginTop: 28, marginHorizontal: 17, marginBottom: 60 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 7 }}>
                            <AntDesign name="folderopen" size={14} color="#2b4757" />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 7.5 }}>{t('leavestatistics.balance')}</Text>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginRight: 8, alignSelf: 'flex-end' }}>
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginRight: 7.5 }}>{t('leavestatistics.balance')}</Text>
                                <AntDesign name="folderopen" size={14} color="#2b4757" />
                            </View>)}

                        <View style={{ backgroundColor: 'white', paddingTop: 5, paddingBottom: 20, alignSelf: 'center', borderRadius: 5, elevation: 1.2, shadowColor: 'gray', width: '100%' }}>

                            <View style={{ paddingHorizontal: 8, alignSelf: 'center' }}>
                                {selectedLanguage !== 'ar' ? (<DataTable>
                                    <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.5, borderStyle: 'dashed' }}>
                                        <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 7 }}>{t('leavestatistics.leave-type')}</DataTable.Title>
                                        <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 27 }}>{t('leavestatistics.availed')}</DataTable.Title>
                                        <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 35 }}>{t('leavestatistics.allowed')}</DataTable.Title>
                                    </DataTable.Header>

                                    {balance.length > 0 && !loading &&
                                        <React.Fragment>
                                            <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: -1, color: '#343434' }}>
                                                    {t('leavestatistics.casual-leaves')}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 12, color: '#343434', left: -35 }}>
                                                    {balance[0].UsedCasualLeaves}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 12, color: '#343434', left: -25 }}>
                                                    {balance[0].TotalCasualLeaves}
                                                </DataTable.Cell>
                                            </DataTable.Row>

                                            <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: -1, color: '#343434' }}>
                                                    {t('leavestatistics.medical-leaves')}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -35 }}>
                                                    {balance[0].UsedMedicalLeaves}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -25 }}>
                                                    {balance[0].TotalMedicalLeaves}
                                                </DataTable.Cell>
                                            </DataTable.Row>

                                            <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: -1, color: '#343434' }}>
                                                    {t('leavestatistics.earned-leaves')}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -35 }}>
                                                    {balance[0].UsedEarnedLeaves}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -25 }}>
                                                    {balance[0].TotalEarnedLeaves}
                                                </DataTable.Cell>
                                            </DataTable.Row>

                                            <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: -1, color: '#343434' }}>
                                                    {t('leavestatistics.ex-pak-leaves')}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -35 }}>
                                                    {balance[0].UsedExPakLeaves}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -25 }}>
                                                    {balance[0].TotalExPakLeaves}
                                                </DataTable.Cell>
                                            </DataTable.Row>
                                        </React.Fragment>
                                    }

                                    {balance.length === 0 && !loading && (
                                        <View style={{ marginTop: 28, alignItems: 'center', marginBottom: -87, flexDirection: 'row', justifyContent: 'center' }}>
                                            <Feather name="database" size={13} color="#8B0000" />
                                            <Text style={{ fontSize: 12.2, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('report.data-not-available')}</Text>
                                            <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />
                                        </View>
                                    )}

                                    {loading && (
                                        <View style={{ alignItems: 'center', marginTop: -35 }}>
                                            <MaterialIndicator color="#D17842" size={23} />
                                        </View>
                                    )}

                                    <DataTable.Pagination
                                        style={{ marginTop: balance.length > 0 ? 20 : 0, opacity: balance.length > 0 && !loading ? 1 : 0 }}
                                        page={page}
                                        numberOfPages={Math.ceil(balance.length / itemsPerPage)}
                                        onPageChange={(page) => setPage(page)}
                                        label={`${from + 1}-${to} of ${balance.length}`}
                                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                                        numberOfItemsPerPage={itemsPerPage}
                                        onItemsPerPageChange={onItemsPerPageChange}
                                        showFastPaginationControls
                                        selectPageDropdownLabel={t('report.rows-per-page')}
                                    />
                                </DataTable>)
                                    :
                                    (<DataTable>
                                        <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.5, borderStyle: 'dashed' }}>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 7 }}>{t('leavestatistics.allowed')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 20 }}>{t('leavestatistics.availed')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 35 }}>{t('leavestatistics.leave-type')}</DataTable.Title>
                                        </DataTable.Header>

                                        {balance.length > 0 && !loading &&
                                            <React.Fragment>
                                                <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 12, color: '#343434', left: -50 }}>
                                                        {balance[0].TotalCasualLeaves}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 12, color: '#343434', left: -51 }}>
                                                        {balance[0].UsedCasualLeaves}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: 30, color: '#343434' }}>
                                                        {t('leavestatistics.casual-leaves')}
                                                    </DataTable.Cell>
                                                </DataTable.Row>

                                                <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -50 }}>
                                                        {balance[0].TotalMedicalLeaves}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -51 }}>
                                                        {balance[0].UsedMedicalLeaves}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: 35, color: '#343434' }}>
                                                        {t('leavestatistics.medical-leaves')}
                                                    </DataTable.Cell>
                                                </DataTable.Row>

                                                <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -50 }}>
                                                        {balance[0].TotalEarnedLeaves}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -51 }}>
                                                        {balance[0].UsedEarnedLeaves}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: 25, color: '#343434' }}>
                                                        {t('leavestatistics.earned-leaves')}
                                                    </DataTable.Cell>
                                                </DataTable.Row>

                                                <DataTable.Row style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -45 }}>
                                                        {balance[0].TotalExPakLeaves}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', left: -40 }}>
                                                        {balance[0].UsedExPakLeaves}
                                                    </DataTable.Cell>
                                                    <View style={{ top: 15 }}>
                                                        <Text style={{ flex: 5, fontSize: 11.5, left: -1, color: '#343434' }}>
                                                            {t('leavestatistics.ex-pak-leaves')}
                                                        </Text>
                                                    </View>
                                                </DataTable.Row>
                                            </React.Fragment>
                                        }

                                        {balance.length === 0 && !loading && (
                                            <View style={{ marginTop: 28, alignItems: 'center', marginBottom: -87, flexDirection: 'row', justifyContent: 'center' }}>
                                                <Feather name="database" size={13} color="#8B0000" />
                                                <Text style={{ fontSize: 12.2, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('report.data-not-available')}</Text>
                                                <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />
                                            </View>
                                        )}

                                        {loading && (
                                            <View style={{ alignItems: 'center', marginTop: -35 }}>
                                                <MaterialIndicator color="#D17842" size={23} />
                                            </View>
                                        )}

                                        <DataTable.Pagination
                                            style={{ marginTop: balance.length > 0 ? 20 : 0, opacity: balance.length > 0 && !loading ? 1 : 0 }}
                                            page={page}
                                            numberOfPages={Math.ceil(balance.length / itemsPerPage)}
                                            onPageChange={(page) => setPage(page)}
                                            label={`${from + 1}-${to} of ${balance.length}`}
                                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                                            numberOfItemsPerPage={itemsPerPage}
                                            onItemsPerPageChange={onItemsPerPageChange}
                                            showFastPaginationControls
                                            selectPageDropdownLabel={t('report.rows-per-page')}
                                        />
                                    </DataTable>)}

                            </View>
                        </View>
                    </View>

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