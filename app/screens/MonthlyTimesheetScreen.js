import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { DataTable } from 'react-native-paper';
import { MaterialIndicator, WaveIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { shareAsync } from 'expo-sharing';
import Modal from "react-native-modal";
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';

export default function MonthlyTimesheetScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [teamNames, setTeamNames] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const [teamModal, setTeamModal] = useState(false);
    const [yearModal, setYearModal] = useState(false);
    const [monthModal, setMonthModal] = useState(false);

    const [error, setError] = useState({
        employeeErr: false,
        yearErr: false,
        monthErr: false,
    });

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const years = [
        { label: t('report.2020'), value: '2020' },
        { label: t('report.2021'), value: '2021' },
        { label: t('report.2022'), value: '2022' },
        { label: t('report.2023'), value: '2023' }
    ];

    const months = [
        { label: t('report.jan'), value: 1 },
        { label: t('report.feb'), value: 2 },
        { label: t('report.mar'), value: 3 },
        { label: t('report.apr'), value: 4 },
        { label: t('report.may'), value: 5 },
        { label: t('report.jun'), value: 6 },
        { label: t('report.jul'), value: 7 },
        { label: t('report.aug'), value: 8 },
        { label: t('report.sep'), value: 9 },
        { label: t('report.oct'), value: 10 },
        { label: t('report.nov'), value: 11 },
        { label: t('report.dec'), value: 12 }
    ];

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, attendance.length);

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
                    },
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
            setSelectedYear('');
            setSelectedMonth('');
            setAttendance([]);
            setLoading(false);
            setError(prevState => ({
                ...prevState,
                employeeErr: false,
                yearErr: false,
                monthErr: false
            }));
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
        if (selectedYear === '' || selectedMonth === '') {
            if (selectedYear === '') {
                setError(prevState => ({ ...prevState, yearErr: true }));
            }
            if (selectedMonth === '') {
                setError(prevState => ({ ...prevState, monthErr: true }));
            }
        }
        else {
            try {
                setAttendance([]);
                setLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                await axios.post(`${CURRENT_HOST}/api/employee/attendance/${userData.employeeID}`, { selectedYear, selectedMonth }, axiosConfig)
                    .then(res => {
                        setAttendance(res.data);
                        setLoading(false);
                    })
                    .catch(e => {
                        console.log(e);
                        setUserToken(null);
                        setLoading(false);
                    })
            }
            catch (error) {
                setTimeout(() => {
                    setUserToken(null);
                }, 2000)
            }
        }
    };

    const handleSearch2 = async () => {
        if (selectedYear === '' || selectedMonth === '' || selectedEmployee === '') {
            if (selectedYear === '') {
                setError(prevState => ({ ...prevState, yearErr: true }));
            }
            if (selectedMonth === '') {
                setError(prevState => ({ ...prevState, monthErr: true }));
            }
            if (selectedEmployee === '') {
                setError(prevState => ({ ...prevState, employeeErr: true }));
            }
        }
        else {
            try {
                setAttendance([]);
                setLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                await axios.post(`${CURRENT_HOST}/api/employee/attendance/${selectedEmployee}`, { selectedYear, selectedMonth }, axiosConfig)
                    .then(res => {
                        setAttendance(res.data);
                        setLoading(false);
                    })
                    .catch(e => {
                        console.log(e);
                        setUserToken(null);
                        setLoading(false);
                    })
            }
            catch (error) {
                setTimeout(() => {
                    setUserToken(null);
                }, 2000)
            }
        }
    };

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
    };

    function formatTimeWithAMPM(isoTimestamp) {
        const date = new Date(isoTimestamp);
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }

        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    };

    const generateExcel = () => {
        let wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(attendance);

        if (userData.accessGroup === 1 || userData.accessGroup === 2) {
            XLSX.utils.book_append_sheet(wb, ws, `Monthly Timesheet - ${selectedEmployee}`, true)
        }
        else {
            XLSX.utils.book_append_sheet(wb, ws, "Monthly Timesheet", true)
        }

        const base64 = XLSX.write(wb, { type: "base64" });

        if (userData.accessGroup === 1 || userData.accessGroup === 2) {
            const filename = FileSystem.documentDirectory + `monthly-timesheet-report-${selectedEmployee}.xlsx`;
            FileSystem.writeAsStringAsync(filename, base64, {
                encoding: FileSystem.EncodingType.Base64
            }).then(async () => {
                Sharing.shareAsync(filename);
            })
        }
        else {
            const filename = FileSystem.documentDirectory + "monthly-timesheet-report.xlsx";
            FileSystem.writeAsStringAsync(filename, base64, {
                encoding: FileSystem.EncodingType.Base64
            }).then(async () => {
                Sharing.shareAsync(filename);
            })
        }
    };

    // const downloadFromUrl = async () => {
    //     let wb = XLSX.utils.book_new();
    //     const ws = XLSX.utils.json_to_sheet(attendance);

    //     XLSX.utils.book_append_sheet(wb, ws, "Attendance Data", true)

    //     const base64 = XLSX.write(wb, { type: "base64" });
    //     const filename = FileSystem.documentDirectory + "attendence_data.xlsx";

    //     const result = await FileSystem.downloadAsync(
    //         `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`,
    //         FileSystem.documentDirectory + 'attendance_data.xlsx'
    //     );

    //     save(result.uri, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // }

    // const save = async (uri, fileName, mimetype) => {
    //     if (Platform.OS === 'android') {
    //         const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    //         if (permissions.granted) {
    //             const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    //             await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, mimetype)
    //                 .then(async (uri) => {
    //                     await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
    //                 })
    //                 .catch(e => console.log(e));
    //         }
    //         else {
    //             shareAsync(uri);
    //         }
    //     } else {
    //         shareAsync(uri);
    //     }
    // }

    const toggleTeamModal = () => {
        setTeamModal(!teamModal);
    };

    const toggleYearModal = () => {
        setYearModal(!yearModal);
    };

    const toggleMonthModal = () => {
        setMonthModal(!monthModal);
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>
                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='report' label={t('report.report')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                {(userData.accessGroup === 3 || teamNames.length > 0) && <ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: 25, marginHorizontal: 25 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4 }}>
                            <AntDesign name="calendar" size={17} color="#2b4757" />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 7 }}>{t('report.monthly-timesheet')}</Text>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, alignSelf: 'flex-end', right: 3 }}>
                                <Text style={{ fontSize: 14.2, fontWeight: 700, color: '#2b4757', marginRight: 9 }}>{t('report.monthly-timesheet')}</Text>
                                <AntDesign name="calendar" size={16} color="#2b4757" />
                            </View>)}

                        <View style={{ backgroundColor: 'white', paddingTop: 18, paddingBottom: 22, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                            <Modal style={{ flex: 0, top: '32.5%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={teamModal} onBackdropPress={toggleTeamModal} onRequestClose={toggleTeamModal} onBackButtonPress={toggleTeamModal}>
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

                            {Platform.OS === 'android' ? (userData.accessGroup === 2 || userData.accessGroup === 1) && (<View style={{ width: '87%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center' }}>
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
                                        <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('report.select-an-employee')} value="" />
                                        {teamNames.map((team, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={team.full_name + ' ' + `(${team.AccessGroup})`}
                                                value={team.EmployeeId}
                                                style={{ fontSize: 13, color: 'black' }}
                                            />
                                        ))}
                                    </Picker>
                                    {error.employeeErr && <MaterialIcons style={{ right: 30, top: selectedLanguage === 'ar' ? 18 : 16 }} name="error-outline" size={15} color="red" />}
                                </View>
                            </View>)
                                :
                                (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleTeamModal}>
                                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.employeeErr ? 'space-between' : 'flex-end' }}>
                                        {error.employeeErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={14} color="red" />}
                                        <Text style={{ fontSize: 13.5, color: 'gray' }}>{selectedEmployee === '' ? t('report.select-an-employee') : (teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.full_name + ' (' + teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.AccessGroup + ')')}</Text>
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13.2, color: 'gray' }}>{selectedEmployee === '' ? t('report.select-an-employee') : (teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.full_name + ' (' + teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.AccessGroup + ')')}</Text>
                                            {error.employeeErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={15} color="red" />}
                                        </View>)}
                                </TouchableOpacity>)}


                            <Modal style={{ flex: 0, top: '32.5%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={yearModal} onBackdropPress={toggleYearModal} onRequestClose={toggleYearModal} onBackButtonPress={toggleYearModal}>
                                <PickerIOS
                                    itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                    selectedValue={selectedYear}
                                    numberOfLines={1}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedYear(itemValue);
                                        setError(prevState => ({ ...prevState, yearErr: false }));
                                    }}>
                                    <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('report.select-a-year')} value="" />
                                    {years.map((year, index) => (
                                        <Picker.Item
                                            key={index.toString()}
                                            label={year.label}
                                            value={year.value}
                                            itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14.2 : 13.2 }}
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
                                        selectedValue={selectedYear}
                                        dropdownIconColor={error.yearErr ? 'white' : 'gray'}
                                        numberOfLines={1}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setSelectedYear(itemValue);
                                            setError(prevState => ({ ...prevState, yearErr: false }));
                                        }}>
                                        <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('report.select-a-year')} value="" />
                                        {years.map((year, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={year.label}
                                                value={year.value}
                                                style={{ fontSize: selectedLanguage === 'ar' ? 15 : 13.2 }}
                                            />
                                        ))}
                                    </Picker>
                                    {error.yearErr && <MaterialIcons style={{ right: 30, top: selectedLanguage === 'ar' ? 18 : 16 }} name="error-outline" size={15} color="red" />}
                                </View>
                            </View>)
                                :
                                (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleYearModal}>
                                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.yearErr ? 'space-between' : 'flex-end' }}>
                                        {error.yearErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={14} color="red" />}
                                        <Text style={{ fontSize: 13.5, color: 'gray' }}>{selectedYear === '' ? t('report.select-a-year') : selectedYear}</Text>
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13.2, color: 'gray' }}>{selectedYear === '' ? t('report.select-a-year') : selectedYear}</Text>
                                            {error.yearErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={15} color="red" />}
                                        </View>)}
                                </TouchableOpacity>)}


                            <Modal style={{ flex: 0, top: '32.5%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={monthModal} onBackdropPress={toggleMonthModal} onRequestClose={toggleMonthModal} onBackButtonPress={toggleMonthModal}>
                                <PickerIOS
                                    itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                    selectedValue={selectedMonth}
                                    numberOfLines={1}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedMonth(itemValue);
                                        setError(prevState => ({ ...prevState, monthErr: false }));
                                    }}>
                                    <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('report.select-a-month')} value="" />
                                    {months.map((month, index) => (
                                        <Picker.Item
                                            key={index.toString()}
                                            label={month.label}
                                            value={month.value}
                                            itemStyle={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2 }}
                                        />
                                    ))}
                                </PickerIOS>

                                <View style={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#318CE7', top: -13 }} onPress={toggleMonthModal}>
                                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12.5, marginRight: 5, top: selectedLanguage === 'ar' ? -2 : 0 }}>{t('report.done')}</Text>
                                        <AntDesign name="arrowright" size={13} color="white" style={{ top: 0.5 }} />
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            {Platform.OS === 'android' ? (<View style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Picker
                                        mode='dropdown'
                                        style={{ width: '100%', color: 'gray' }}
                                        selectedValue={selectedMonth}
                                        dropdownIconColor={error.monthErr ? 'white' : 'gray'}
                                        numberOfLines={1}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setSelectedMonth(itemValue);
                                            setError(prevState => ({ ...prevState, monthErr: false }));
                                        }}>
                                        <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('report.select-a-month')} value="" />
                                        {months.map((month, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={month.label}
                                                value={month.value}
                                                style={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2 }}
                                            />
                                        ))}
                                    </Picker>
                                    {error.monthErr && <MaterialIcons style={{ right: 30, top: selectedLanguage === 'ar' ? 18 : 16 }} name="error-outline" size={15} color="red" />}
                                </View>
                            </View>)
                                :
                                (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleMonthModal}>
                                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.monthErr ? 'space-between' : 'flex-end' }}>
                                        {error.monthErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={14} color="red" />}
                                        <Text style={{ fontSize: 13.5, color: 'gray' }}>{selectedMonth === '' ? t('report.select-a-month') : (months.find(month => month.value === selectedMonth)?.label)}</Text>
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13.2, color: 'gray' }}>{selectedMonth === '' ? t('report.select-a-month') : (months.find(month => month.value === selectedMonth)?.label)}</Text>
                                            {error.monthErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={15} color="red" />}
                                        </View>)}
                                </TouchableOpacity>)}

                            <View style={{ marginTop: 15 }}>
                                <TouchableOpacity style={{ backgroundColor: '#00308F', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                    (userData.accessGroup === 2 || userData.accessGroup === 1) ? handleSearch2() : handleSearch1();
                                }}>
                                    <AntDesign name="search1" size={selectedLanguage === 'ar' ? 12.5 : 13} color="white" style={{ left: selectedLanguage === 'ar' ? 0 : -1 }} />
                                    <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 13.5 : 12.2, fontWeight: '500', marginLeft: 7, left: selectedLanguage === 'ar' ? 0 : -2 }}>{t('report.search')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 20, marginHorizontal: 17 }}>
                        <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.2, shadowColor: 'gray', width: '100%' }}>

                            <View style={{ paddingLeft: 7, paddingRight: 8, alignSelf: 'center' }}>
                                <DataTable>
                                    <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                        <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: -1 }}>{t('report.date')}</DataTable.Title>
                                        <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: -1 }}>{t('report.time-in')}</DataTable.Title>
                                        <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: attendance.length === 0 ? 10 : 16 }}>{t('report.time-out')}</DataTable.Title>
                                        <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', lineHeight: 16, textAlign: 'center', left: 26 }} numberOfLines={2}>{t('report.remarks')}</DataTable.Title>
                                    </DataTable.Header>

                                    {attendance.length > 0 && attendance.slice(from, to).map((item, index) => (
                                        <DataTable.Row key={index} style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                            <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: -4, color: '#343434' }}>
                                                {item.date === null ? '-----' : formatDate(item.date)}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric={item.time_in === null ? false : true} textStyle={{ fontSize: 11.5, left: item.time_in === null ? 18 : -5, color: '#343434' }}>
                                                {item.time_in === null ? '-----' : formatTimeWithAMPM(item.time_in)}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric={item.time_out === null ? false : true} textStyle={{ fontSize: 11.5, left: item.time_out === null ? 40 : 14, color: '#343434' }}>
                                                {item.time_out === null ? '-----' : formatTimeWithAMPM(item.time_out)}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric textStyle={{ fontSize: 12, color: '#343434' }}>
                                                {item.final_remarks}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    ))}

                                    {attendance.length === 0 && (
                                        <View style={{ marginTop: 30, alignItems: 'center', marginBottom: -72, flexDirection: 'row', justifyContent: 'center' }}>
                                            {!loading && <Feather name="database" size={13} color="#8B0000" />}
                                            {!loading && <Text style={{ fontSize: 12.2, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('report.data-not-available')}</Text>}
                                            {!loading && <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />}
                                        </View>
                                    )}

                                    {loading && (
                                        <View style={{ alignItems: 'center', top: 15, marginBottom: -3 }}>
                                            <MaterialIndicator color="#D17842" size={23} />
                                        </View>
                                    )}

                                    <DataTable.Pagination
                                        style={{ marginTop: attendance.length > 0 ? 20 : 0, opacity: attendance.length > 0 ? 1 : 0 }}
                                        page={page}
                                        numberOfPages={Math.ceil(attendance.length / itemsPerPage)}
                                        onPageChange={(page) => setPage(page)}
                                        label={`${from + 1}-${to} of ${attendance.length}`}
                                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                                        numberOfItemsPerPage={itemsPerPage}
                                        onItemsPerPageChange={onItemsPerPageChange}
                                        showFastPaginationControls
                                        selectPageDropdownLabel={t('report.rows-per-page')}
                                    />
                                </DataTable>
                            </View>
                        </View>
                    </View>

                    {attendance.length > 0 && (<View style={{ marginTop: 7, marginHorizontal: 17, marginBottom: 60 }}>
                        <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start', alignItems: 'center', paddingHorizontal: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: selectedLanguage === 'ar' ? 0 : 10, marginLeft: selectedLanguage === 'ar' ? 10 : 0, flexDirection: 'row' }} onPress={() => generateExcel()}>
                                    <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginRight: 6 }}>{t('report.export-sheet')}</Text>
                                    <MaterialCommunityIcons name="microsoft-excel" size={16} color="white" />
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexDirection: 'row' }} onPress={() => generateExcel()}>
                                    <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginRight: 6 }}>{t('report.export-pdf')}</Text>
                                    <AntDesign name="pdffile1" size={14} color="white" />
                                </TouchableOpacity> */}
                            </View>

                        </View>
                    </View>)}

                </ScrollView>}

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