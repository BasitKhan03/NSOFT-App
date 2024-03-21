import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AntDesign, MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import { MaterialIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import OrganizationAttendancePieChart2 from '../components/OrganizationAttendancePieChart2';

export default function OrganizationAttendanceScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [datePickerEnabled, setDatePickerEnabled] = useState(false);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateFromCheck, setDateFromCheck] = useState(false);
    const [dateTo, setDateTo] = useState(new Date());
    const [dateToCheck, setDateToCheck] = useState(false);
    const [mode1, setMode1] = useState('date');
    const [mode2, setMode2] = useState('date');
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [error, setError] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, attendance.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    useFocusEffect(
        React.useCallback(() => {
            setDatePickerEnabled(false);
            setDateFromCheck(false);
            setDateToCheck(false);
            setAttendance([]);
            setLoading(false);
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

    const onChange1 = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow1(false);
        setDateFrom(currentDate);
        setDatePickerEnabled(true);
        setError(false);
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

    const handleSearch = async () => {
        if (datePickerEnabled === false) {
            setError(true);
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

                await axios.post(`${CURRENT_HOST}/api/employee/organizationattendance/${userData.employeeID}`, { fromDate: dateFrom, toDate: dateTo }, axiosConfig)
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
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000)
            }
        }
    };

    const generateExcel = () => {
        let wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(attendance);

        XLSX.utils.book_append_sheet(wb, ws, "Organization Attendance", true)

        const base64 = XLSX.write(wb, { type: "base64" });

        const filename = FileSystem.documentDirectory + "organization-attendance-report.xlsx";
        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(async () => {
            Sharing.shareAsync(filename);
        })
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

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>
                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='report' label={t('report.report')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: 25, marginHorizontal: 25 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4 }}>
                            <AntDesign name="layout" size={17} color="#2b4757" />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 7.5 }}>{t('report.organization-attendance')}</Text>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, alignSelf: 'flex-end', right: 3 }}>
                                <Text style={{ fontSize: 14.2, fontWeight: 700, color: '#2b4757', marginRight: 9.5 }}>{t('report.organization-attendance')}</Text>
                                <AntDesign name="layout" size={16} color="#2b4757" style={{ transform: [{ scaleX: (-1) }] }} />
                            </View>)}

                        <View style={{ backgroundColor: 'white', paddingTop: 18, paddingBottom: 22, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                            {Platform.OS === 'android' ? (<View>
                                {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start' }} onPress={() => {
                                        showDatepicker1();
                                        setDateFromCheck(true);
                                    }}>
                                        <AntDesign name="calendar" size={16} color="#D17842" style={{ marginLeft: 15 }} />
                                        <Text style={{ fontSize: dateFromCheck ? 11.2 : 12, color: '#213440', marginLeft: 7 }}>{dateFromCheck ? dateFrom.toLocaleDateString() : t('report.date-from')}</Text>
                                        {error && <MaterialIcons style={{ left: 9 }} name="error-outline" size={13} color="red" />}
                                    </TouchableOpacity>

                                    {show1 && (
                                        <DateTimePicker
                                            testID="dateTimePicker1"
                                            value={dateFrom}
                                            mode={mode1}
                                            is24Hour={true}
                                            onChange={onChange1}
                                            maximumDate={new Date()}
                                        />
                                    )}

                                    <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => {
                                        showDatepicker2();
                                        datePickerEnabled && setDateToCheck(true);
                                        !datePickerEnabled && setError(true);
                                    }}>
                                        <AntDesign name="calendar" size={16} color="#D17842" style={{ marginLeft: 15 }} />
                                        <Text style={{ fontSize: dateToCheck ? 11.2 : 12, color: '#213440', marginLeft: 7, width: '100%' }}>{dateToCheck ? dateTo.toLocaleDateString() : t('report.date-to')}</Text>
                                    </TouchableOpacity>

                                    {datePickerEnabled && show2 && (
                                        <DateTimePicker
                                            testID="dateTimePicker2"
                                            value={dateTo}
                                            mode={mode2}
                                            is24Hour={true}
                                            onChange={onChange2}
                                            minimumDate={dateFrom}
                                            maximumDate={new Date()}
                                        />
                                    )}
                                </View>)
                                    :
                                    (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => {
                                            showDatepicker2();
                                            datePickerEnabled && setDateToCheck(true);
                                            !datePickerEnabled && setError(true);
                                        }}>
                                            <Text style={{ fontSize: dateToCheck ? 11.5 : 12, color: '#213440', marginRight: 7 }}>{dateToCheck ? dateTo.toLocaleDateString() : t('report.date-to')}</Text>
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
                                                maximumDate={new Date()}
                                            />
                                        )}

                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end' }} onPress={() => {
                                            showDatepicker1();
                                            setDateFromCheck(true);
                                        }}>
                                            {error && <MaterialIcons style={{ right: 9 }} name="error-outline" size={13} color="red" />}
                                            <Text style={{ fontSize: dateFromCheck ? 11.5 : 12, color: '#213440', marginRight: 7 }}>{dateFromCheck ? dateFrom.toLocaleDateString() : t('report.date-from')}</Text>
                                            <AntDesign name="calendar" size={16} color="#D17842" style={{ marginRight: 15 }} />
                                        </TouchableOpacity>

                                        {show1 && (
                                            <DateTimePicker
                                                testID="dateTimePicker1"
                                                value={dateFrom}
                                                mode={mode1}
                                                is24Hour={true}
                                                onChange={onChange1}
                                                maximumDate={new Date()}
                                            />
                                        )}
                                    </View>)}
                            </View>)
                                :
                                (<View>
                                    {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start' }} onPress={() => {
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
                                            maximumDate={new Date()}
                                        />

                                        <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => {
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
                                            maximumDate={new Date()}
                                        />
                                    </View>)
                                        :
                                        (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 5 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => {
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
                                                maximumDate={new Date()}
                                            />

                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '42%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.35, borderRadius: 4, justifyContent: 'flex-end' }} onPress={() => {
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
                                                maximumDate={new Date()}
                                            />
                                        </View>)}
                                </View>
                                )}

                            <View style={{ marginTop: 15 }}>
                                <TouchableOpacity style={{ backgroundColor: '#00308F', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                    handleSearch();
                                }}>
                                    <AntDesign name="search1" size={selectedLanguage === 'ar' ? 12.5 : 13} color="white" style={{ left: selectedLanguage === 'ar' ? 0 : -1 }} />
                                    <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 13.5 : 12.2, fontWeight: '500', marginLeft: 7, left: selectedLanguage === 'ar' ? 0 : -2 }}>{t('report.search')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <OrganizationAttendancePieChart2 present={!attendance.length > 0 ? 0 : attendance[0].OverallPresentPercentage} absent={!attendance.length > 0 ? 0 : attendance[0].OverallAbsentPercentage} leave={!attendance.length > 0 ? 0 : attendance[0].OverallLeavePercentage} earlyout={!attendance.length > 0 ? 0 : attendance[0].OverallEarlyOutPercentage} late={!attendance.length > 0 ? 0 : attendance[0].OverallLatePercentage} ontime={!attendance.length > 0 ? 0 : attendance[0].OverallOnTimePercentage} exit={!attendance.length > 0 ? 0 : attendance[0].OverallExitPercentage} selectedLanguage={selectedLanguage} />
                    </View>

                    <View style={{ marginTop: 5, marginHorizontal: 17, marginBottom: attendance.length > 0 ? 0 : 65 }}>
                        <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.2, shadowColor: 'gray', width: '100%' }}>
                            <View style={{ paddingLeft: 7, paddingRight: 8 }}>

                                <ScrollView contentContainerStyle={{ flexGrow: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <DataTable>
                                        <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -2 : 4 }}>{t('report.employee-code')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 2 : 26 }}>{t('report.full-name')}</DataTable.Title>
                                            <DataTable.Title numeric textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -3 : 18 }}>{t('report.present')}</DataTable.Title>
                                            <DataTable.Title numeric textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 0 : 17 }}>{t('report.leave')}</DataTable.Title>
                                            <DataTable.Title numeric textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 6 : 14 }}>{t('report.absent')}</DataTable.Title>
                                            <DataTable.Title numeric numberOfLines={3} textStyle={{ color: '#3457D5', fontSize: 12.5, width: selectedLanguage === 'ar' ? 35 : 30, textAlign: 'center', fontWeight: '700', lineHeight: 16, left: selectedLanguage === 'ar' ? 8 : 12 }}>{t('report.on-time')}</DataTable.Title>
                                            <DataTable.Title numeric textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 10 : 12 }}>{t('report.late')}</DataTable.Title>
                                            <DataTable.Title numeric numberOfLines={2} textStyle={{ color: '#3457D5', fontSize: 12.5, width: 35, textAlign: 'center', fontWeight: '700', lineHeight: 16, left: 8 }}>{t('report.early-out')}</DataTable.Title>
                                        </DataTable.Header>

                                        {attendance.length > 0 && !loading && attendance.slice(from, to).map((item, index) => (
                                            <DataTable.Row key={index} style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 52, left: -5 }}>
                                                    {item.EmployeeCode}
                                                </DataTable.Cell>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 110, left: -17 }}>
                                                    {item.FullName}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 25, left: -40 }}>
                                                    {item.PresentPercentage === null ? '----' : `${item.PresentPercentage.toString().split(".")[0]}%`}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 25, left: selectedLanguage === 'ar' ? -32 : -28 }}>
                                                    {item.LeavePercentage === null ? '----' : `${item.LeavePercentage.toString().split(".")[0]}%`}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 25, left: selectedLanguage === 'ar' ? -25 : -15 }}>
                                                    {item.AbsentPercentage === null ? '----' : `${item.AbsentPercentage.toString().split(".")[0]}%`}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 25, left: selectedLanguage === 'ar' ? -14 : -5 }}>
                                                    {item.OnTimePercentage === null ? '----' : `${item.OnTimePercentage.toString().split(".")[0]}%`}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 25, left: selectedLanguage === 'ar' ? -4 : -1 }}>
                                                    {item.LatePercentage === null ? '----' : `${item.LatePercentage.toString().split(".")[0]}%`}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, color: '#343434', textAlign: 'center', width: 25, left: 3 }}>
                                                    {item.EarlyOutPercentage === null ? '----' : `${item.EarlyOutPercentage.toString().split(".")[0]}%`}
                                                </DataTable.Cell>
                                            </DataTable.Row>
                                        ))}

                                        {attendance.length === 0 && (
                                            <View style={{ marginTop: 25, alignItems: 'center', marginBottom: -25, flexDirection: 'row', justifyContent: 'center', left: -73, }}>
                                                {!loading && <Feather name="database" size={13} color="#8B0000" />}
                                                {!loading && <Text style={{ fontSize: 12.5, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('report.data-not-available')}</Text>}
                                                {!loading && <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />}
                                            </View>
                                        )}

                                        {loading && (
                                            <View style={{ alignItems: 'center', top: 29, left: -78, marginBottom: 8 }}>
                                                <MaterialIndicator color="#D17842" size={25} />
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
                                </ScrollView>

                            </View>
                        </View>
                    </View>

                    {attendance.length > 0 && (<View style={{ marginTop: 7, marginHorizontal: 17, marginBottom: 65 }}>
                        <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start', alignItems: 'center', paddingHorizontal: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: selectedLanguage === 'ar' ? 0 : 10, marginLeft: selectedLanguage === 'ar' ? 10 : 0, flexDirection: 'row' }} onPress={() => generateExcel()}>
                                    <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginRight: 6 }}>{t('report.export-sheet')}</Text>
                                    <MaterialCommunityIcons name="microsoft-excel" size={16} color="white" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>)}

                </ScrollView>
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