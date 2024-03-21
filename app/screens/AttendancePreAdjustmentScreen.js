import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { AntDesign, MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { SkypeIndicator, WaveIndicator } from 'react-native-indicators';
import { DataTable } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import CustomAlert from '../components/CustomAlert';

export default function AttendancePreAdjustmentScreen({ navigation, userToken, setUserToken, userData }) {
    const [pageLoading, setPageLoading] = useState(false);
    const [teamNames, setTeamNames] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [reason, setReason] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const [alert, setAlert] = useState(false);
    const [res, setRes] = useState({
        message: 'Attendance has been added',
        status: 'Success !'
    });

    const [datePickerEnabled, setDatePickerEnabled] = useState(false);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateFromCheck, setDateFromCheck] = useState(false);
    const [dateTo, setDateTo] = useState(new Date());
    const [dateToCheck, setDateToCheck] = useState(false);
    const [mode1, setMode1] = useState('date');
    const [mode2, setMode2] = useState('date');
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const [teamModal, setTeamModal] = useState(false);
    const [reasonModal, setReasonModal] = useState(false);

    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

    const [error, setError] = useState({
        employeeErr: false,
        reasonErr: false,
        dateFromErr: false,
        dateToErr: false,
        datePickerErr: false
    });

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, attendance.length);

    const reasons = [
        { label: t('preadjustment.official-visit'), value: 'OV' },
        { label: t('preadjustment.official-meeting'), value: 'OM' },
        { label: t('preadjustment.official-training'), value: 'OT' }
    ];

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
                    const response1 = await axios.post(`${CURRENT_HOST}/api/employee/employeesname/${userData.employeeID}`, null, axiosConfig);
                    setTeamNames(response1.data);
                }
                else {
                    const response1 = await axios.post(`${CURRENT_HOST}/api/employee/teamnames/${userData.employeeID}`, null, axiosConfig);
                    setTeamNames(response1.data);
                }

                if (userData.accessGroup === 2) {
                    const response2 = await axios.post(`${CURRENT_HOST}/api/employee/teamfutureattendance/${userData.employeeID}`, { employeeCode: userData.employeeCode }, axiosConfig);
                    setAttendance(response2.data);
                }
                else if (userData.accessGroup === 1) {
                    const response2 = await axios.post(`${CURRENT_HOST}/api/employee/futureattendance/${userData.employeeID}`, { employeeCode: userData.employeeCode }, axiosConfig);
                    setAttendance(response2.data);
                }
                else {
                    const response2 = await axios.post(`${CURRENT_HOST}/api/employee/employeefutureattendance/${userData.employeeID}`, { employeeCode: userData.employeeCode }, axiosConfig);
                    setAttendance(response2.data);
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

    const onChange1 = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow1(false);
        setDateFrom(currentDate);
        setDatePickerEnabled(true);
        setError(prevState => ({ ...prevState, datePickerErr: false }));
    };

    const onChange2 = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow2(false);
        setDateTo(currentDate);
    };

    const showMode1 = (currentMode) => {
        setShow1(true);
        setMode1(currentMode);
    };

    const showMode2 = (currentMode) => {
        setShow2(true);
        setMode2(currentMode);
    };

    const showDatepicker1 = () => {
        showMode1('date');
    };

    const showDatepicker2 = () => {
        showMode2('date');
    };

    const toggleAlert = () => {
        setAlert(!alert);
    };

    function convertISODateToFormattedDate(isoDate) {
        const dateObject = new Date(isoDate);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    function convertISODateToDateTime(isoDate) {
        return new Date(isoDate);
    };

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async () => {
        if (reason === '' || datePickerEnabled === false || selectedEmployee === '') {
            if (reason === '') {
                setError(prevState => ({ ...prevState, reasonErr: true }));
            }
            if (datePickerEnabled === false) {
                setError(prevState => ({ ...prevState, datePickerErr: true }));
            }
            if (selectedEmployee === '') {
                setError(prevState => ({ ...prevState, employeeErr: true }));
            }
        }

        else {
            try {
                setLoading(true);

                const leaveRequestData = {
                    employeeCode: userData.accessGroup === 2 ? selectedEmployee : userData.employeCode,
                    fromDate: convertISODateToDateTime(convertISODateToFormattedDate(dateFrom)),
                    toDate: convertISODateToDateTime(convertISODateToFormattedDate(dateTo)),
                    remarks: reason
                };

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                await axios.post(`${CURRENT_HOST}/api/employee/insertfutureattendance/${userData.employeeID}`, leaveRequestData, axiosConfig)
                    .then(response => {
                        console.log('Success:', response.data);
                    })
                    .catch(error => {
                        console.error('Error updating future manual attendance:', error);
                        setRes(prevState => ({
                            ...prevState,
                            message: 'Error sending attendance request',
                            status: 'Failed !',
                        }));
                    });

                if (userData.accessGroup === 2) {
                    const response2 = await axios.post(`${CURRENT_HOST}/api/employee/teamfutureattendance/${userData.employeeID}`, { employeeCode: userData.employeeCode }, axiosConfig);
                    setAttendance(response2.data);
                }
                else if (userData.accessGroup === 1) {
                    const response2 = await axios.post(`${CURRENT_HOST}/api/employee/futureattendance/${userData.employeeID}`, { employeeCode: userData.employeeCode }, axiosConfig);
                    setAttendance(response2.data);
                }
                else {
                    const response2 = await axios.post(`${CURRENT_HOST}/api/employee/employeefutureattendance/${userData.employeeID}`, { employeeCode: userData.employeeCode }, axiosConfig);
                    setAttendance(response2.data);
                }
            }
            catch (e) {
                console.log(e);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000);
            }
            finally {
                setTimeout(() => {
                    setLoading(false);
                    toggleAlert();
                }, 1500)

                setDatePickerEnabled(false);
                setDateFromCheck(false);
                setDateToCheck(false);
                setSelectedEmployee('');
                setReason('');
                setError(prevState => ({
                    ...prevState,
                    employeeErr: false,
                    reasonErr: false,
                    dateFromErr: false,
                    dateToErr: false,
                    datePickerErr: false
                }));
            }
        }
    };

    const generateExcel = () => {
        let wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(attendance);

        XLSX.utils.book_append_sheet(wb, ws, "Future Manual Attendances", true)

        const base64 = XLSX.write(wb, { type: "base64" });
        const filename = FileSystem.documentDirectory + "future-manual-attendence-list.xlsx";
        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(async () => {
            Sharing.shareAsync(filename);
        })
    };

    const toggleTeamModal = () => {
        setTeamModal(!teamModal);
    };

    const toggleReasonModal = () => {
        setReasonModal(!reasonModal);
    };

    const showiOSDatePicker1 = () => {
        setDatePickerVisibility1(true);
    };

    const hideiOSDatePicker1 = () => {
        setDatePickerVisibility1(false);
    };

    const handleConfirm1 = (date) => {
        setDateFrom(date);
        setDateFromCheck(true);
        setDatePickerEnabled(true);
        setError(prevState => ({ ...prevState, datePickerErr: false }));
        hideiOSDatePicker1();
    };

    const showiOSDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideiOSDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };

    const handleConfirm2 = (date) => {
        setDateTo(date);
        hideiOSDatePicker2();
    };

    useFocusEffect(
        React.useCallback(() => {
            setDatePickerEnabled(false);
            setDateFromCheck(false);
            setDateToCheck(false);
            setSelectedEmployee('');
            setReason('');
            setLoading(false);
            setAlert(false);
            setError(prevState => ({
                ...prevState,
                employeeErr: false,
                reasonErr: false,
                dateFromErr: false,
                dateToErr: false,
                datePickerErr: false
            }));
        }, [])
    );

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>

                <View style={{
                    backgroundColor: 'rgba(220,224,241,0.95)', elevation: 10, shadowColor: 'gray', shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 1000
                }}>
                    <HeaderNav from='preadjustment' label={t('preadjustment.attendance-preadjustment')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                {(userData.accessGroup === 3 || teamNames.length > 0) && (<ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: selectedLanguage === 'ar' ? 27 : 26, marginHorizontal: 25 }}>

                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4 }}>
                            <AntDesign name="form" size={16.5} color="#2b4757" />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 7 }}>{t('preadjustment.heading')}</Text>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 18, marginRight: 7 }}>
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginRight: 7 }}>{t('preadjustment.heading')}</Text>
                                <AntDesign name="form" size={16.5} color="#2b4757" />
                            </View>)}

                        {(userData.accessGroup === 2 || userData.accessGroup === 1) && (<View style={{ backgroundColor: 'white', paddingTop: 18, paddingBottom: 26, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                            <Modal style={{ flex: 0, top: '32.5%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={teamModal} onBackdropPress={toggleTeamModal} onRequestClose={toggleTeamModal} onBackButtonPress={toggleTeamModal}>
                                <PickerIOS
                                    itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                    selectedValue={selectedEmployee}
                                    numberOfLines={1}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedEmployee(itemValue);
                                        setError(prevState => ({ ...prevState, employeeErr: false }));
                                    }}>
                                    <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2, color: 'gray' }} label={t('preadjustment.select-an-employee')} value="" />
                                    {teamNames.map((team, index) => (
                                        <Picker.Item
                                            key={index.toString()}
                                            label={team.full_name + ' ' + `(${team.AccessGroup})`}
                                            value={team.employee_code}
                                            itemStyle={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13 }}
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

                            {Platform.OS === 'android' ? (<View style={{ width: '87%', height: 38, marginTop: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, alignSelf: 'center', justifyContent: 'center' }}>
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
                                        <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('preadjustment.select-an-employee')} value="" />
                                        {teamNames.map((team, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={team.full_name + ' ' + `(${team.AccessGroup})`}
                                                value={team.employee_code}
                                                style={{ fontSize: 13, color: 'black' }}
                                            />
                                        ))}
                                    </Picker>
                                    {error.employeeErr && <MaterialIcons style={{ right: 30, top: 16 }} name="error-outline" size={14} color="red" />}
                                </View>
                            </View>)
                                :
                                (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleTeamModal}>
                                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.employeeErr ? 'space-between' : 'flex-end' }}>
                                        {error.employeeErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={13} color="red" />}
                                        <Text style={{ fontSize: 13.5, color: 'gray' }}>{selectedEmployee === '' ? t('preadjustment.select-an-employee') : (teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.full_name + ' (' + teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.AccessGroup + ')')}</Text>
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13.2, color: 'gray' }}>{selectedEmployee === '' ? t('preadjustment.select-an-employee') : (teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.full_name + ' (' + teamNames.find(employee => employee.EmployeeId === selectedEmployee)?.AccessGroup + ')')}</Text>
                                            {error.employeeErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={14} color="red" />}
                                        </View>)}
                                </TouchableOpacity>)}


                            <Modal style={{ flex: 0, top: '32.5%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={reasonModal} onBackdropPress={toggleReasonModal} onRequestClose={toggleReasonModal} onBackButtonPress={toggleReasonModal}>
                                <PickerIOS
                                    itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                    selectedValue={reason}
                                    numberOfLines={1}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setReason(itemValue);
                                        setError(prevState => ({ ...prevState, reasonErr: false }));
                                    }}>
                                    <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2, color: 'gray' }} label={t('preadjustment.reason')} value="" />
                                    {reasons.map((reason, index) => (
                                        <Picker.Item
                                            key={index.toString()}
                                            label={reason.label}
                                            value={reason.value}
                                            itemStyle={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13 }}
                                        />
                                    ))}
                                </PickerIOS>

                                <View style={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#318CE7', top: -13 }} onPress={toggleReasonModal}>
                                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12.5, marginRight: 5, top: selectedLanguage === 'ar' ? -2 : 0 }}>{t('report.done')}</Text>
                                        <AntDesign name="arrowright" size={13} color="white" style={{ top: 0.5 }} />
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            {Platform.OS === 'android' ? (<View style={{ width: '87%', height: 38, marginTop: (userData.accessGroup === 2 || userData.accessGroup === 1) ? 13 : 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, alignSelf: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Picker
                                        mode='dropdown'
                                        style={{ width: '100%', color: 'gray' }}
                                        selectedValue={reason}
                                        dropdownIconColor={error.reasonErr ? 'white' : 'gray'}
                                        numberOfLines={1}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setReason(itemValue);
                                            setError(prevState => ({ ...prevState, reasonErr: false }));
                                        }}>
                                        <Picker.Item style={{ fontSize: 13.2, color: 'gray' }} label={t('preadjustment.reason')} value="" />
                                        {reasons.map((reason, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={reason.label}
                                                value={reason.value}
                                                style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13 }}
                                            />
                                        ))}
                                    </Picker>
                                    {error.reasonErr && <MaterialIcons style={{ right: 30, top: 16 }} name="error-outline" size={14} color="red" />}
                                </View>
                            </View>)
                                :
                                (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleReasonModal}>
                                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.reasonErr ? 'space-between' : 'flex-end' }}>
                                        {error.reasonErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={13} color="red" />}
                                        <Text style={{ fontSize: 13.5, color: 'gray' }}>{reason === '' ? t('preadjustment.reason') : (reasons.find(item => item.value === reason)?.label)}</Text>
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 13.2, color: 'gray' }}>{reason === '' ? t('preadjustment.reason') : (reasons.find(item => item.value === reason)?.label)}</Text>
                                            {error.reasonErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={14} color="red" />}
                                        </View>)}
                                </TouchableOpacity>)}

                            {Platform.OS === 'android' ? (<View>
                                {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start' }} onPress={() => {
                                        showDatepicker1();
                                        setDateFromCheck(true);
                                    }}>
                                        <AntDesign name="calendar" size={16} color="#D17842" style={{ marginLeft: 15 }} />
                                        <Text style={{ fontSize: dateFromCheck ? 11.2 : 12, color: '#213440', marginLeft: 7 }}>{dateFromCheck ? dateFrom.toLocaleDateString() : t('preadjustment.date-from')}</Text>
                                        {error.datePickerErr && <MaterialIcons style={{ left: 9, top: 0.5 }} name="error-outline" size={13} color="red" />}
                                    </TouchableOpacity>

                                    {show1 && (
                                        <DateTimePicker
                                            testID="dateTimePicker1"
                                            value={dateFrom}
                                            mode={mode1}
                                            is24Hour={true}
                                            onChange={onChange1}
                                            minimumDate={new Date()}
                                        />
                                    )}

                                    <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => {
                                        showDatepicker2();
                                        datePickerEnabled && setDateToCheck(true);
                                        !datePickerEnabled && setError(prevState => ({ ...prevState, datePickerErr: true }));
                                    }}>
                                        <AntDesign name="calendar" size={16} color="#D17842" style={{ marginLeft: 15 }} />
                                        <Text style={{ fontSize: dateToCheck ? 11.2 : 12, color: '#213440', marginLeft: 7, width: '100%' }}>{dateToCheck ? dateTo.toLocaleDateString() : t('preadjustment.date-to')}</Text>
                                    </TouchableOpacity>

                                    {datePickerEnabled && show2 && (
                                        <DateTimePicker
                                            testID="dateTimePicker2"
                                            value={dateTo}
                                            mode={mode2}
                                            is24Hour={true}
                                            onChange={onChange2}
                                            minimumDate={dateFrom}
                                        />
                                    )}
                                </View>)
                                    :
                                    (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => {
                                            showDatepicker2();
                                            datePickerEnabled && setDateToCheck(true);
                                            !datePickerEnabled && setError(prevState => ({ ...prevState, datePickerErr: true }));
                                        }}>
                                            <Text style={{ fontSize: dateToCheck ? 11.5 : 12, color: '#213440', marginRight: 7 }}>{dateToCheck ? dateTo.toLocaleDateString() : t('preadjustment.date-to')}</Text>
                                            <AntDesign name="calendar" size={16} color="#D17842" style={{ marginRight: 15 }} />
                                        </TouchableOpacity>

                                        {datePickerEnabled && show2 && (
                                            <DateTimePicker
                                                testID="dateTimePicker2"
                                                value={dateTo}
                                                mode={mode2}
                                                is24Hour={true}
                                                onChange={onChange2}
                                                minimumDate={dateFrom}
                                            />
                                        )}

                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end' }} onPress={() => {
                                            showDatepicker1();
                                            setDateFromCheck(true);
                                        }}>
                                            {error.datePickerErr && <MaterialIcons style={{ right: 9, top: 0.5 }} name="error-outline" size={13} color="red" />}
                                            <Text style={{ fontSize: dateFromCheck ? 11.5 : 12, color: '#213440', marginRight: 7 }}>{dateFromCheck ? dateFrom.toLocaleDateString() : t('preadjustment.date-from')}</Text>
                                            <AntDesign name="calendar" size={16} color="#D17842" style={{ marginRight: 15 }} />
                                        </TouchableOpacity>

                                        {show1 && (
                                            <DateTimePicker
                                                testID="dateTimePicker1"
                                                value={dateFrom}
                                                mode={mode1}
                                                is24Hour={true}
                                                onChange={onChange1}
                                                minimumDate={new Date()}
                                            />
                                        )}
                                    </View>)}
                            </View>)
                                :
                                (<View>
                                    {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start' }} onPress={() => {
                                            showiOSDatePicker1();
                                        }}>
                                            <AntDesign name="calendar" size={16} color="#D17842" style={{ marginLeft: 15 }} />
                                            <Text style={{ fontSize: dateFromCheck ? 11.2 : 12, color: '#213440', marginLeft: 7 }}>{dateFromCheck ? dateFrom.toLocaleDateString() : t('preadjustment.date-from')}</Text>
                                            {error.datePickerErr && <MaterialIcons style={{ left: 9, top: 0.5 }} name="error-outline" size={13} color="red" />}
                                        </TouchableOpacity>

                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible1}
                                            mode="date"
                                            onConfirm={handleConfirm1}
                                            onCancel={hideiOSDatePicker1}
                                            display='inline'
                                            minimumDate={new Date()}
                                        />

                                        <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => {
                                            datePickerEnabled && showiOSDatePicker2();
                                            datePickerEnabled && setDateToCheck(true);
                                            !datePickerEnabled && setError(prevState => ({ ...prevState, datePickerErr: true }));
                                        }}>
                                            <AntDesign name="calendar" size={16} color="#D17842" style={{ marginLeft: 15 }} />
                                            <Text style={{ fontSize: dateToCheck ? 11.2 : 12, color: '#213440', marginLeft: 7, width: '100%' }}>{dateToCheck ? dateTo.toLocaleDateString() : t('preadjustment.date-to')}</Text>
                                        </TouchableOpacity>

                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible2}
                                            mode="date"
                                            onConfirm={handleConfirm2}
                                            onCancel={hideiOSDatePicker2}
                                            display='inline'
                                            minimumDate={dateFrom}
                                        />
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => {
                                                datePickerEnabled && showiOSDatePicker2();
                                                datePickerEnabled && setDateToCheck(true);
                                                !datePickerEnabled && setError(prevState => ({ ...prevState, datePickerErr: true }));
                                            }}>
                                                <Text style={{ fontSize: dateToCheck ? 11.5 : 12, color: '#213440', marginRight: 7 }}>{dateToCheck ? dateTo.toLocaleDateString() : t('preadjustment.date-to')}</Text>
                                                <AntDesign name="calendar" size={16} color="#D17842" style={{ marginRight: 15 }} />
                                            </TouchableOpacity>

                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible2}
                                                mode="date"
                                                onConfirm={handleConfirm2}
                                                onCancel={hideiOSDatePicker2}
                                                display='inline'
                                                minimumDate={dateFrom}
                                            />

                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginTop: 15, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end' }} onPress={() => {
                                                showiOSDatePicker1();
                                            }}>
                                                {error.datePickerErr && <MaterialIcons style={{ right: 9, top: 0.5 }} name="error-outline" size={13} color="red" />}
                                                <Text style={{ fontSize: dateFromCheck ? 11.5 : 12, color: '#213440', marginRight: 7 }}>{dateFromCheck ? dateFrom.toLocaleDateString() : t('preadjustment.date-from')}</Text>
                                                <AntDesign name="calendar" size={16} color="#D17842" style={{ marginRight: 15 }} />
                                            </TouchableOpacity>

                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible1}
                                                mode="date"
                                                onConfirm={handleConfirm1}
                                                onCancel={hideiOSDatePicker1}
                                                display='inline'
                                                minimumDate={new Date()}
                                            />
                                        </View>)}
                                </View>
                                )}

                            <View style={{ width: '85%', alignSelf: 'center', borderWidth: 0.5, borderColor: '#00BFFF', borderStyle: 'dashed', marginTop: 20 }} />

                            <View style={{ marginTop: 20 }}>
                                {selectedLanguage !== 'ar' ? (<TouchableOpacity style={{ backgroundColor: '#00308F', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleSubmit()}>
                                    <AntDesign name="login" size={12} color="white" style={{ left: -1 }} />
                                    <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginLeft: 8, left: -2 }}>{t('preadjustment.update-attendance')}</Text>
                                </TouchableOpacity>)
                                    :
                                    (<TouchableOpacity style={{ backgroundColor: '#00308F', padding: 10, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleSubmit()}>
                                        <Text style={{ color: 'white', fontSize: 13, marginRight: 7, left: 1 }}>{t('preadjustment.update-attendance')}</Text>
                                        <AntDesign name="login" size={13} color="white" style={{ left: 1 }} />
                                    </TouchableOpacity>)}
                            </View>

                        </View>)}

                        {alert && <CustomAlert msg1={res.message} msg2={res.status} alert2={alert} toggleAlert2={toggleAlert} opt='futureattendance' />}

                        <View style={{ marginTop: (userData.accessGroup === 2 || userData.accessGroup === 1) ? 20 : 2 }}>
                            <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.2, shadowColor: 'gray', width: '100%' }}>

                                <View style={{ paddingLeft: 7, paddingRight: 8, alignSelf: 'center' }}>
                                    <DataTable>
                                        <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: -3 }}>{t('preadjustment.date-from')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -1 : 9 }}>{t('preadjustment.date-to')}</DataTable.Title>
                                            <DataTable.Title numberOfLines={2} textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 13 : 5, lineHeight: 18 }}>{t('preadjustment.employee-code')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', lineHeight: 16, textAlign: 'center', left: 20 }} numberOfLines={2}>{t('preadjustment.remarks')}</DataTable.Title>
                                        </DataTable.Header>

                                        {attendance.length > 0 && attendance.slice(from, to).map((item, index) => (
                                            <DataTable.Row key={index} style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: -2, color: '#343434' }}>
                                                    {item.from_date === null ? '-----' : formatDate(item.from_date)}
                                                </DataTable.Cell>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, left: 5, color: '#343434' }}>
                                                    {item.to_date === null ? '-----' : formatDate(item.to_date)}
                                                </DataTable.Cell>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, left: 17, color: '#343434' }}>
                                                    {item.employee_code}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 12, right: 13, color: '#343434' }}>
                                                    {item.remarks}
                                                </DataTable.Cell>
                                            </DataTable.Row>
                                        ))}

                                        {attendance.length === 0 && (
                                            <View style={{ marginTop: 30, alignItems: 'center', marginBottom: -72, flexDirection: 'row', justifyContent: 'center' }}>
                                                {!loading && <Feather name="database" size={13} color="#8B0000" />}
                                                {!loading && <Text style={{ fontSize: 12.2, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('preadjustment.data-not-available')}</Text>}
                                                {!loading && <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />}
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
                                            selectPageDropdownLabel={t('preadjustment.rows-per-page')}
                                        />
                                    </DataTable>
                                </View>
                            </View>
                        </View>

                        {attendance.length > 0 && (<View style={{ marginTop: 7, marginBottom: 60 }}>
                            <View style={{ backgroundColor: 'white', paddingTop: 5, paddingBottom: 4, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                                <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: selectedLanguage === 'ar' ? 0 : 10, marginLeft: selectedLanguage === 'ar' ? 10 : 0, flexDirection: 'row' }} onPress={() => { generateExcel(); }}>
                                        <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginRight: 6 }}>{t('preadjustment.export-sheet')}</Text>
                                        <MaterialCommunityIcons name="microsoft-excel" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>)}

                    </View>
                </ScrollView>)}

                {loading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 5000, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <View style={{ alignItems: 'center', top: -20 }}>
                            <SkypeIndicator color="#ffffff" size={42} />
                        </View>
                    </View>
                )}

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