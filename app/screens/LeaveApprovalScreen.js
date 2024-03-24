import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import { WaveIndicator, MaterialIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import LeaveApprovalModal from '../components/LeaveApprovalModal';

export default function LeaveApprovalScreen({ navigation, userToken, setUserToken, userData }) {
    const [pageLoading, setPageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [leaves, setLeaves] = useState([]);
    const [alert, setAlert] = useState(false);
    const [itemId, setItemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, leaves.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setPageLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response = await axios.post(`${CURRENT_HOST}/api/employee/leaveapplications/${userData.employeeID}`, null, axiosConfig);
                setLeaves(response.data);
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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        const fetchData = async () => {
            try {
                setPageLoading(true);
                setPage(0);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response = await axios.post(`${CURRENT_HOST}/api/employee/leaveapplications/${userData.employeeID}`, null, axiosConfig);
                setLeaves(response.data);
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

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
    };

    const toggleAlert = () => {
        setAlert(!alert);
    };

    const updateLeaveStatus = async (leaveStatusId) => {
        try {
            setLeaves([]);
            setLoading(true);
            toggleAlert();

            const axiosConfig = {
                headers: {
                    'Authorization': `bearer ${userToken}`,
                },
            };

            const leaveStatusData = {
                leaveId: itemId,
                leaveStatusId: leaveStatusId
            };

            await axios.post(`${CURRENT_HOST}/api/employee/leavestatus/${userData.employeeID}`, leaveStatusData, axiosConfig)
                .then(response => {
                    console.log('Leave status:', response.data);
                })
                .catch(error => {
                    console.error('Error updating leave status:', error);
                });

            const response = await axios.post(`${CURRENT_HOST}/api/employee/leaveapplications/${userData.employeeID}`, null, axiosConfig);
            setLeaves(response.data);
        }
        catch (error) {
            console.log(error);
            setTimeout(() => {
                setUserToken(null);
            }, 2000)
        }
        finally {
            setTimeout(() => {
                setLoading(false);
            }, 1200)
        }
    };

    const generateExcel = () => {
        let wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(leaves);

        XLSX.utils.book_append_sheet(wb, ws, "Team Leave Applications", true)

        const base64 = XLSX.write(wb, { type: "base64" });
        const filename = FileSystem.documentDirectory + "leave-applications.xlsx";
        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(async () => {
            Sharing.shareAsync(filename);
        })
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
                <View style={{ backgroundColor: 'rgba(220,224,241,0.95)', elevation: 10, shadowColor: 'gray', zIndex: 1000 }}>
                    <HeaderNav from='leave' label={t('leaveapproval.leave-approval')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#318CE7"]} />}>
                    <View style={{ marginTop: 28, marginHorizontal: 25 }}>
                        {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
                            <AntDesign name="book" size={18} color="#2b4757" />
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 7 }}>{t('leaveapproval.approve-application')}</Text>
                        </View>)
                            :
                            (<View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', right: 3 }}>
                                <Text style={{ fontSize: 14.2, fontWeight: 700, color: '#2b4757', marginRight: 9 }}>{t('leaveapproval.approve-application')}</Text>
                                <AntDesign name="book" size={18} color="#2b4757" />
                            </View>)}
                    </View>

                    <View style={{ marginTop: 22 }}>
                        <View style={{ backgroundColor: 'white', elevation: 2, shadowColor: 'gray', borderRadius: 5, width: '90%', alignSelf: 'center', paddingLeft: 10, paddingRight: 15, paddingTop: 6, paddingBottom: 20 }}>

                            <View style={{ paddingLeft: 7, paddingRight: 8 }}>
                                <ScrollView contentContainerStyle={{ flexGrow: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <DataTable>
                                        <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -9 : -10 }}>{t('leaveapproval.date-from')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -14 : -5 }}>{t('leaveapproval.date-to')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -19 : -2 }}>{t('leaveapproval.user-code')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', textAlign: 'center', width: 50, lineHeight: 17, left: selectedLanguage === 'ar' ? -25 : -2, top: -2 }} numberOfLines={2}>{t('leaveapproval.leave-status')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', textAlign: 'center', width: 50, lineHeight: 17, left: selectedLanguage === 'ar' ? -23 : 1, top: -2 }} numberOfLines={2}>{t('leaveapproval.leave-type')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', textAlign: 'center', left: selectedLanguage === 'ar' ? 0 : 11 }} numberOfLines={2}>{t('leaveapproval.leave-reason')}</DataTable.Title>
                                        </DataTable.Header>

                                        {leaves.length > 0 && !loading && leaves.slice(from, to).map((item, index) => (
                                            <DataTable.Row key={index} style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, color: '#343434', width: 55, textAlign: 'center', left: -8 }}>
                                                    {item.FromDate === null ? '-----' : formatDate(item.FromDate)}
                                                </DataTable.Cell>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, color: '#343434', width: 55, textAlign: 'center', left: 3 }}>
                                                    {item.ToDate === null ? '-----' : formatDate(item.ToDate)}
                                                </DataTable.Cell>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, color: '#343434', width: 40, textAlign: 'center', left: 15 }}>
                                                    {item.EmployeeId}
                                                </DataTable.Cell>
                                                <DataTable.Cell>
                                                    <TouchableOpacity activeOpacity={item.LeaveStatus === 'Pending' ? 0.1 : 1} style={{ width: 65, height: 27, justifyContent: 'center', left: 31, borderRadius: item.LeaveStatus === 'Pending' ? 5 : 0, backgroundColor: item.LeaveStatus === 'Pending' ? '#6CB4EE' : 'white' }} onPress={() => {
                                                        item.LeaveStatus === 'Pending' && toggleAlert();
                                                        setItemId(item.Id);
                                                    }}>
                                                        <Text style={{ fontSize: item.LeaveStatus === 'Pending' ? 11.5 : 12, color: item.LeaveStatus === 'Pending' ? '#FFFFFF' : '#424242', fontWeight: item.LeaveStatus === 'Pending' ? '500' : '400', textAlign: 'center' }}>
                                                            {item.LeaveStatus}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </DataTable.Cell>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, color: '#343434', width: 70, textAlign: 'center', left: 29 }}>
                                                    {item.LeaveType}
                                                </DataTable.Cell>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, color: '#343434', width: 120, textAlign: 'center', left: 22 }}>
                                                    {item.LeaveReason}
                                                </DataTable.Cell>
                                            </DataTable.Row>
                                        ))}

                                        {leaves.length === 0 && (
                                            <View style={{ marginTop: 30, alignItems: 'center', marginBottom: -50, flexDirection: 'row', justifyContent: 'center', left: -90, }}>
                                                {!loading && <Feather name="database" size={13} color="#8B0000" />}
                                                {!loading && <Text style={{ fontSize: 12.5, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('leaveapproval.data-not-available')}</Text>}
                                                {!loading && <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />}
                                            </View>
                                        )}

                                        {loading && (
                                            <View style={{ alignItems: 'center', top: 15, left: -90, marginBottom: 8 }}>
                                                <MaterialIndicator color="#D17842" size={25} />
                                            </View>
                                        )}

                                        <DataTable.Pagination
                                            style={{ marginTop: leaves.length > 0 ? 20 : 0, opacity: leaves.length > 0 ? 1 : 0 }}
                                            page={page}
                                            numberOfPages={Math.ceil(leaves.length / itemsPerPage)}
                                            onPageChange={(page) => setPage(page)}
                                            label={`${from + 1}-${to} of ${leaves.length}`}
                                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                                            numberOfItemsPerPage={itemsPerPage}
                                            onItemsPerPageChange={onItemsPerPageChange}
                                            showFastPaginationControls
                                            selectPageDropdownLabel={t('leaveapproval.rows-per-page')}
                                        />
                                    </DataTable>
                                </ScrollView>
                            </View>

                        </View>
                    </View>

                    {leaves.length > 0 && (<View style={{ marginTop: 7, marginHorizontal: 17, marginBottom: 40 }}>
                        <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>
                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start', alignItems: 'center', paddingHorizontal: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: selectedLanguage === 'ar' ? 0 : 10, marginLeft: selectedLanguage === 'ar' ? 10 : 0, flexDirection: 'row' }} onPress={() => { generateExcel(); }}>
                                    <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginRight: 6 }}>{t('leaveapproval.export-sheet')}</Text>
                                    <MaterialCommunityIcons name="microsoft-excel" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>)}

                    {alert && <LeaveApprovalModal alert={alert} toggleAlert={toggleAlert} updateLeaveStatus={updateLeaveStatus} />}
                </ScrollView>

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