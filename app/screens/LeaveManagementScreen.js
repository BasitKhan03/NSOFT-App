import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Keyboard, Platform } from 'react-native';
import { AntDesign, MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { DataTable } from 'react-native-paper';
import { WaveIndicator, MaterialIndicator, SkypeIndicator } from 'react-native-indicators';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Modal from "react-native-modal";
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { CURRENT_HOST } from '../config/config';
import HeaderNav from '../components/HeaderNav';
import CustomAlert from '../components/CustomAlert';
import LeaveManagementModal from '../components/LeaveManagementModal';
import Footer from '../components/Footer';

export default function LeaveManagementScreen({ navigation, userToken, setUserToken, userData }) {
    const [scroll, setScroll] = useState(false);
    const [option, setOption] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);

    const [loading1, setLoading1] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [type, setType] = useState('');
    const [defaultCount, setDefaultCount] = useState('');
    const [maxCount, setMaxCount] = useState('');
    const [selectedType, setSelectedType] = useState([]);
    const [page1, setPage1] = useState(0);
    const [numberOfItemsPerPageList1] = useState([5, 10, 15]);
    const [itemsPerPage1, onItemsPerPageChange1] = useState(numberOfItemsPerPageList1[0]);
    const [alert, setAlert] = useState(false);
    const [delAlert, setDelAlert] = useState(false);
    const [res1, setRes1] = useState({
        message: 'Leave type has been added',
        status: 'Success !'
    });

    const [defaultCountModal, setDefaultCountModal] = useState(false);
    const [maxCountModal, setMaxCountModal] = useState(false);

    const [error, setError] = useState({
        typeErr: false,
        defaultCountErr: false,
        maxCountErr: false,
    });

    const [loading2, setLoading2] = useState(false);
    const [leaveReasons, setLeaveReasons] = useState([]);
    const [reason, setReason] = useState('');
    const [active, setActive] = useState(false);
    const [reasonErr, setReasonErr] = useState(false);
    const [selectedReason, setSelectedReason] = useState([]);
    const [page2, setPage2] = useState(0);
    const [numberOfItemsPerPageList2] = useState([5, 10, 15]);
    const [itemsPerPage2, onItemsPerPageChange2] = useState(numberOfItemsPerPageList2[0]);
    const [res2, setRes2] = useState({
        message: 'Leave reason has been added',
        status: 'Success !'
    });

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const numberRange = Array.from({ length: 100 }, (_, index) => ({ label: index.toString(), value: index }));

    const from1 = page1 * itemsPerPage1;
    const to1 = Math.min((page1 + 1) * itemsPerPage1, leaveTypes.length);

    const from2 = page2 * itemsPerPage2;
    const to2 = Math.min((page2 + 1) * itemsPerPage2, leaveReasons.length);

    useEffect(() => {
        setPage1(0);
    }, [itemsPerPage1]);

    useEffect(() => {
        setPage2(0);
    }, [itemsPerPage2]);

    useEffect(() => {
        async function fetchData() {
            try {
                setPageLoading(true);

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                const response1 = await axios.post(`${CURRENT_HOST}/api/employee/leavetypes/${userData.employeeID}`, null, axiosConfig);
                setLeaveTypes(response1.data);

                const response2 = await axios.post(`${CURRENT_HOST}/api/employee/leavereasons/${userData.employeeID}`, null, axiosConfig);
                setLeaveReasons(response2.data);
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
            setOption(1);
            setType('');
            setDefaultCount('');
            setMaxCount('');
            setError(false);
            setReason('');
            setActive(false);
            setReasonErr(false);
        }, [])
    );

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const pageYOffset = contentOffset.y;
        pageYOffset > 30 ? setScroll(true) : setScroll(false);
    };

    const toggleAlert = () => {
        setAlert(!alert);
    };

    const toggleDelAlert = () => {
        setDelAlert(!delAlert);
    };

    const handleTypeSave = async () => {
        if (type === '' || defaultCount === '' || maxCount === '') {
            if (type === '') {
                setError(prevState => ({ ...prevState, typeErr: true }));
            }
            if (defaultCount === '') {
                setError(prevState => ({ ...prevState, defaultCountErr: true }));
            }
            if (maxCount === '') {
                setError(prevState => ({ ...prevState, maxCountErr: true }));
            }
        }
        else {
            try {
                Keyboard.dismiss();
                setSaveLoading(true);
                setLeaveTypes([]);

                const leaveTypeData = {
                    leaveType: type,
                    defaultCount: defaultCount,
                    maxCount: maxCount
                };

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                await axios.post(`${CURRENT_HOST}/api/employee/insertleavetype/${userData.employeeID}`, leaveTypeData, axiosConfig)
                    .then(response => {
                        console.log('Leave type:', response.data);
                    })
                    .catch(error => {
                        console.error('Error adding leave type:', error);
                        setRes1(prevState => ({
                            ...prevState,
                            message: 'Error adding Leave type',
                            status: 'Failed !',
                        }));
                    });

                setLoading1(true);

                const response = await axios.post(`${CURRENT_HOST}/api/employee/leavetypes/${userData.employeeID}`, null, axiosConfig);
                setLeaveTypes(response.data);

                setTimeout(() => {
                    setSaveLoading(false);
                    toggleAlert();
                    setLoading1(false);
                }, 1500)

                setType('');
                setDefaultCount('');
                setMaxCount('');
                setError(prevState => ({
                    ...prevState,
                    typeErr: false,
                    defaultCountErr: false,
                    maxCountErr: false,
                }));
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000);
            }
        }
    };

    const handleReasonSave = async () => {
        if (reason === '') {
            setReasonErr(true);
        }
        else {
            try {
                Keyboard.dismiss();
                setSaveLoading(true);
                setLeaveReasons([]);

                const leaveReasonData = {
                    leaveReason: reason,
                    isActive: active ? 1 : 0,
                };

                const axiosConfig = {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                    },
                };

                await axios.post(`${CURRENT_HOST}/api/employee/insertleavereason/${userData.employeeID}`, leaveReasonData, axiosConfig)
                    .then(response => {
                        console.log('Leave reason:', response.data);
                    })
                    .catch(error => {
                        console.error('Error adding leave reason:', error);
                        setRes2(prevState => ({
                            ...prevState,
                            message: 'Error adding Leave reason',
                            status: 'Failed !',
                        }));
                    });

                setLoading2(true);

                const response = await axios.post(`${CURRENT_HOST}/api/employee/leavereasons/${userData.employeeID}`, null, axiosConfig);
                setLeaveReasons(response.data);

                setReason('');
                setActive(false);
                setReasonErr(false);
            }
            catch (error) {
                console.log(error);
                setTimeout(() => {
                    setUserToken(null);
                }, 2000);
            }
            finally {
                setTimeout(() => {
                    setSaveLoading(false);
                    toggleAlert();
                }, 1100)
                setTimeout(() => {
                    setLoading2(false);
                }, 1500)
            }
        }
    };

    const handleTypeDelete = async () => {
        try {
            setLoading1(true);
            setLeaveTypes([]);

            const axiosConfig = {
                headers: {
                    'Authorization': `bearer ${userToken}`,
                },
            };

            await axios.post(`${CURRENT_HOST}/api/employee/deleteleavetype/${userData.employeeID}`, { leaveTypeId: selectedType.Id }, axiosConfig)
                .then(response => {
                    console.log('Leave type:', response.data);
                })
                .catch(error => {
                    console.error('Error deleting leave type:', error);
                });

            const response = await axios.post(`${CURRENT_HOST}/api/employee/leavetypes/${userData.employeeID}`, null, axiosConfig);
            setLeaveTypes(response.data);
        }
        catch (error) {
            console.log(error);
            setTimeout(() => {
                setUserToken(null);
            }, 2000);
        }
        finally {
            setLoading1(false);
        }
    };

    const handleReasonDelete = async () => {
        try {
            setLoading2(true);
            setLeaveReasons([]);

            const axiosConfig = {
                headers: {
                    'Authorization': `bearer ${userToken}`,
                },
            };

            await axios.post(`${CURRENT_HOST}/api/employee/deleteleavereason/${userData.employeeID}`, { leaveReasonId: selectedReason.Id }, axiosConfig)
                .then(response => {
                    console.log('Leave reason:', response.data);
                })
                .catch(error => {
                    console.error('Error deleting leave reason:', error);
                });

            const response = await axios.post(`${CURRENT_HOST}/api/employee/leavereasons/${userData.employeeID}`, null, axiosConfig);
            setLeaveReasons(response.data);
        }
        catch (error) {
            console.log(error);
            setTimeout(() => {
                setUserToken(null);
            }, 2000);
        }
        finally {
            setLoading2(false);
        }
    };

    const generateExcelForTypes = () => {
        let wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(leaveTypes);

        XLSX.utils.book_append_sheet(wb, ws, "Leave Types", true)

        const base64 = XLSX.write(wb, { type: "base64" });
        const filename = FileSystem.documentDirectory + "leave-types.xlsx";

        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(async () => {
            Sharing.shareAsync(filename);
        })
    };

    const generateExcelForReasons = () => {
        let wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(leaveReasons);

        XLSX.utils.book_append_sheet(wb, ws, "Leave Reasons", true)

        const base64 = XLSX.write(wb, { type: "base64" });
        const filename = FileSystem.documentDirectory + "leave-reasons.xlsx";

        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(async () => {
            Sharing.shareAsync(filename);
        })
    };

    const toggleDefaultCountModal = () => {
        setDefaultCountModal(!defaultCountModal);
    };

    const toggleMaxCountModal = () => {
        setMaxCountModal(!maxCountModal);
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#eef0f8' }}>
                <View style={[scroll ? styles.scroll : null]}>
                    <HeaderNav from='leave' label={t('leavemanagement.leave-management')} picture={userData.picture} accessGroup={userData.accessGroup} navigation={navigation} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} onScroll={handleScroll} showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', width: '90%', alignSelf: 'center', borderRadius: 50, elevation: 3, shadowColor: 'gray' }}>
                        <TouchableOpacity style={{ width: '50%', justifyContent: 'center', borderRadius: 50, paddingVertical: 11, paddingHorizontal: 15, backgroundColor: option === 1 ? '#318CE7' : '#FFFFFF', elevation: option === 1 ? 2 : undefined, shadowColor: option === 1 ? 'gray' : undefined }} onPress={() => {
                            setOption(1);
                            setReason('');
                            setActive(false);
                            setReasonErr(false);
                        }}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 13 : 12.5, fontWeight: option === 1 ? '700' : '600', textAlign: 'center', color: option === 1 ? 'white' : 'gray' }}>{t('leavemanagement.leave-types')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ width: '50%', justifyContent: 'center', borderRadius: 50, paddingVertical: 11, paddingHorizontal: 15, backgroundColor: option === 2 ? '#318CE7' : '#FFFFFF', elevation: option === 2 ? 2 : undefined, shadowColor: option === 2 ? 'gray' : undefined }} onPress={() => {
                            setOption(2);
                            setType('');
                            setDefaultCount('');
                            setMaxCount('');
                            setError(false);
                        }}>
                            <Text style={{ fontSize: selectedLanguage === 'ar' ? 13 : 12.5, fontWeight: option === 2 ? '700' : '600', textAlign: 'center', color: option === 2 ? 'white' : 'gray' }}>{t('leavemanagement.leave-reasons')}</Text>
                        </TouchableOpacity>
                    </View>

                    {option === 1 && (<View>
                        <View style={{ marginTop: 35, marginHorizontal: 25 }}>
                            {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4 }}>
                                <AntDesign name="tagso" size={20} color="#2b4757" />
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 6 }}>{t('leavemanagement.leave-types-management')}</Text>
                            </View>)
                                :
                                (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4, alignSelf: 'flex-end' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginRight: 6 }}>{t('leavemanagement.leave-types-management')}</Text>
                                    <AntDesign name="tagso" size={20} color="#2b4757" style={{ transform: [{ scaleX: (-1) }] }} />
                                </View>)}

                            <View style={{ backgroundColor: 'white', paddingTop: 18, paddingBottom: 22, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <TextInput style={{ width: '87%', height: 38, marginVertical: 8, marginBottom: Platform.OS === 'android' ? 8 : 5, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', fontSize: 13, paddingHorizontal: 15, color: 'gray' }}
                                        placeholder={t('leavemanagement.enter-type-name')}
                                        placeholderTextColor='gray'
                                        value={type}
                                        onChangeText={(text) => {
                                            setType(text.toString());
                                            setError(prevState => ({ ...prevState, typeErr: false }));
                                        }}
                                    />
                                    {error.typeErr && <MaterialIcons style={{ position: 'absolute', right: selectedLanguage === 'ar' ? 260 : 35, top: 19 }} name="error-outline" size={15} color="red" />}
                                </View>


                                <Modal style={{ flex: 0, top: '32.5%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={defaultCountModal} onBackdropPress={toggleDefaultCountModal} onRequestClose={toggleDefaultCountModal} onBackButtonPress={toggleDefaultCountModal}>
                                    <PickerIOS
                                        itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                        selectedValue={defaultCount}
                                        numberOfLines={1}
                                        onFocus={() => Keyboard.dismiss()}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setDefaultCount(itemValue);
                                            setError(prevState => ({ ...prevState, defaultCountErr: false }));
                                        }}>
                                        <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('leavemanagement.select-default-count')} value="" />
                                        {numberRange.map((item, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={item.label}
                                                value={item.value}
                                                itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14.2 : 13.2 }}
                                            />
                                        ))}
                                    </PickerIOS>

                                    <View style={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#318CE7', top: -13 }} onPress={toggleDefaultCountModal}>
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
                                            selectedValue={defaultCount}
                                            dropdownIconColor={(error.defaultCountErr && selectedLanguage !== 'ar') ? 'white' : 'gray'}
                                            numberOfLines={1}
                                            onFocus={() => Keyboard.dismiss()}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setDefaultCount(itemValue);
                                                setError(prevState => ({ ...prevState, defaultCountErr: false }));
                                            }}
                                        >
                                            <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2, color: 'gray' }} label={t('leavemanagement.select-default-count')} value="" />
                                            {numberRange.map((item, index) => (
                                                <Picker.Item
                                                    key={index.toString()}
                                                    label={item.label}
                                                    value={item.value}
                                                    style={{ fontSize: 13, color: 'black' }}
                                                />
                                            ))}
                                        </Picker>
                                        {error.defaultCountErr && <MaterialIcons style={{ right: selectedLanguage === 'ar' ? 255 : 30, top: 16 }} name="error-outline" size={15} color="red" />}
                                    </View>
                                </View>)
                                    :
                                    (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleDefaultCountModal}>
                                        {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.defaultCountErr ? 'space-between' : 'flex-end' }}>
                                            {error.defaultCountErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={14} color="red" />}
                                            <Text style={{ fontSize: 13.5, color: 'gray' }}>{defaultCount === '' ? t('leavemanagement.select-default-count') : defaultCount}</Text>
                                        </View>)
                                            :
                                            (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 13.2, color: 'gray' }}>{defaultCount === '' ? t('leavemanagement.select-default-count') : defaultCount}</Text>
                                                {error.defaultCountErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={14} color="red" />}
                                            </View>)}
                                    </TouchableOpacity>)}


                                <Modal style={{ flex: 0, top: '32.5%', width: '80%', height: '30%', alignSelf: 'center', elevation: 30, borderRadius: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }} animationType="fade" transparent={true} visible={maxCountModal} onBackdropPress={toggleMaxCountModal} onRequestClose={toggleMaxCountModal} onBackButtonPress={toggleMaxCountModal}>
                                    <PickerIOS
                                        itemStyle={{ width: '100%', color: 'rgb(20,20,20)', fontSize: 14.2 }}
                                        selectedValue={maxCount}
                                        numberOfLines={1}
                                        onFocus={() => Keyboard.dismiss()}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setMaxCount(itemValue);
                                            setError(prevState => ({ ...prevState, maxCountErr: false }));
                                        }}>
                                        <Picker.Item itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14 : 13.2, color: 'gray' }} label={t('leavemanagement.select-max-count')} value="" />
                                        {numberRange.map((item, index) => (
                                            <Picker.Item
                                                key={index.toString()}
                                                label={item.label}
                                                value={item.value}
                                                itemStyle={{ fontSize: selectedLanguage === 'ar' ? 14.2 : 13.2 }}
                                            />
                                        ))}
                                    </PickerIOS>

                                    <View style={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#318CE7', top: -13 }} onPress={toggleMaxCountModal}>
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
                                            selectedValue={maxCount}
                                            dropdownIconColor={(error.maxCountErr && selectedLanguage !== 'ar') ? 'white' : 'gray'}
                                            numberOfLines={1}
                                            onFocus={() => Keyboard.dismiss()}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setMaxCount(itemValue);
                                                setError(prevState => ({ ...prevState, maxCountErr: false }));
                                            }}
                                        >
                                            <Picker.Item style={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13.2, color: 'gray' }} label={t('leavemanagement.select-max-count')} value="" />
                                            {numberRange.map((item, index) => (
                                                <Picker.Item
                                                    key={index.toString()}
                                                    label={item.label}
                                                    value={item.value}
                                                    style={{ fontSize: 13, color: 'black' }}
                                                />
                                            ))}
                                        </Picker>
                                        {error.maxCountErr && <MaterialIcons style={{ right: selectedLanguage === 'ar' ? 255 : 30, top: 16 }} name="error-outline" size={15} color="red" />}
                                    </View>
                                </View>)
                                    :
                                    (<TouchableOpacity style={{ width: '87%', height: 38, marginVertical: 4, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', paddingLeft: selectedLanguage === 'ar' ? 0 : 20, paddingRight: selectedLanguage === 'ar' ? 20 : 0, marginTop: 10 }} onPress={toggleMaxCountModal}>
                                        {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: error.maxCountErr ? 'space-between' : 'flex-end' }}>
                                            {error.maxCountErr && <MaterialIcons style={{ left: 17, top: 2 }} name="error-outline" size={14} color="red" />}
                                            <Text style={{ fontSize: 13.5, color: 'gray' }}>{maxCount === '' ? t('leavemanagement.select-max-count') : maxCount}</Text>
                                        </View>)
                                            :
                                            (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 13.2, color: 'gray' }}>{maxCount === '' ? t('leavemanagement.select-max-count') : maxCount}</Text>
                                                {error.maxCountErr && <MaterialIcons style={{ right: 15, top: 2 }} name="error-outline" size={14} color="red" />}
                                            </View>)}
                                    </TouchableOpacity>)}


                                <View style={{ marginTop: 11 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#00308F', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { handleTypeSave(); }}>
                                        <AntDesign name="save" size={14} color="white" style={{ left: selectedLanguage === 'ar' ? -2 : -1 }} />
                                        <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 12.5 : 12.5, fontWeight: '500', marginLeft: 7, left: -2 }}>{t('leavemanagement.save')}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                        {alert && <CustomAlert msg1={res1.message} msg2={res1.status} alert2={alert} toggleAlert2={toggleAlert} opt='addleavetype' />}

                        {delAlert && <LeaveManagementModal alert={delAlert} toggleAlert={toggleDelAlert} handleDelete={handleTypeDelete} item={selectedType} from='deleteType' />}

                        <View style={{ marginTop: 20, marginHorizontal: 17, marginBottom: leaveTypes.length > 0 ? 0 : 50 }}>
                            <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.2, shadowColor: 'gray', width: '100%' }}>
                                <View style={{ paddingLeft: 7, paddingRight: 8, alignSelf: 'center' }}>

                                    <DataTable>
                                        <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 7 : -1 }}>{t('leavemanagement.type-name')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ flex: 5, color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -5 : -1, lineHeight: 16.5 }} numberOfLines={2}>{t('leavemanagement.default-count')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 6 : 8 }}>{t('leavemanagement.max-count')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', lineHeight: 16, textAlign: 'center', left: selectedLanguage === 'ar' ? 19 : 24 }} numberOfLines={2}>{t('leavemanagement.action')}</DataTable.Title>
                                        </DataTable.Header>

                                        {leaveTypes.length > 0 && leaveTypes.slice(from1, to1).map((item, index) => (
                                            <DataTable.Row key={index} style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ flex: 5, fontSize: 11.5, left: -2, color: '#343434', textAlign: 'center', width: '25%' }}>
                                                    {item.LeaveTypeText}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, left: -26, color: '#343434', textAlign: 'center', width: '20%' }}>
                                                    {item.LeaveDefaultCount}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 11.5, left: -22, color: '#343434', textAlign: 'center', width: '20%' }}>
                                                    {item.LeaveMaxCount}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 12, color: '#343434' }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <TouchableOpacity style={{ width: 47, height: 23, backgroundColor: '#D22B2B', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} onPress={() => { setSelectedType(item); toggleDelAlert(); }}><AntDesign name="delete" size={13} color="white" /></TouchableOpacity>
                                                    </View>
                                                </DataTable.Cell>
                                            </DataTable.Row>
                                        ))}

                                        {leaveTypes.length === 0 && (
                                            <View style={{ marginTop: 30, alignItems: 'center', marginBottom: -72, flexDirection: 'row', justifyContent: 'center' }}>
                                                {!loading1 && <Feather name="database" size={13} color="#8B0000" />}
                                                {!loading1 && <Text style={{ fontSize: 12.2, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('leavemanagement.data-not-available')}</Text>}
                                                {!loading1 && <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />}
                                            </View>
                                        )}

                                        {loading1 && (
                                            <View style={{ alignItems: 'center', top: 15, marginBottom: -3 }}>
                                                <MaterialIndicator color="#D17842" size={23} />
                                            </View>
                                        )}

                                        <DataTable.Pagination
                                            style={{ marginTop: leaveTypes.length > 0 ? 20 : 0, opacity: leaveTypes.length > 0 ? 1 : 0 }}
                                            page={page1}
                                            numberOfPages={Math.ceil(leaveTypes.length / itemsPerPage1)}
                                            onPageChange={(page) => setPage1(page)}
                                            label={`${from1 + 1}-${to1} of ${leaveTypes.length}`}
                                            numberOfItemsPerPageList={numberOfItemsPerPageList1}
                                            numberOfItemsPerPage={itemsPerPage1}
                                            onItemsPerPageChange={onItemsPerPageChange1}
                                            showFastPaginationControls
                                            selectPageDropdownLabel={t('leavemanagement.rows-per-page')}
                                        />
                                    </DataTable>

                                </View>
                            </View>
                        </View>

                        {leaveTypes.length > 0 && (<View style={{ marginTop: 7, marginHorizontal: 17, marginBottom: 115 }}>
                            <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>
                                <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: selectedLanguage === 'ar' ? 0 : 10, marginLeft: selectedLanguage === 'ar' ? 10 : 0, flexDirection: 'row' }} onPress={() => { generateExcelForTypes(); }}>
                                        <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginRight: 6 }}>{t('leavemanagement.export-sheet')}</Text>
                                        <MaterialCommunityIcons name="microsoft-excel" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>)}
                    </View>)}


                    {option === 2 && (<View>
                        <View style={{ marginTop: 35, marginHorizontal: 25 }}>
                            {selectedLanguage !== 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4 }}>
                                <AntDesign name="filetext1" size={17} color="#2b4757" />
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginLeft: 7 }}>{t('leavemanagement.leave-reasons-management')}</Text>
                            </View>)
                                :
                                (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 4, alignSelf: 'flex-end' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 700, color: '#2b4757', marginRight: 9 }}>{t('leavemanagement.leave-reasons-management')}</Text>
                                    <AntDesign name="filetext1" size={15} color="#2b4757" style={{ transform: [{ scaleX: (-1) }] }} />
                                </View>)}

                            <View style={{ backgroundColor: 'white', paddingTop: 18, paddingBottom: 22, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <TextInput style={{ width: '87%', height: 38, marginVertical: 8, borderColor: 'gray', borderWidth: 0.3, borderRadius: 4, alignSelf: 'center', justifyContent: 'center', fontSize: 13, paddingHorizontal: 15, color: 'gray' }}
                                        placeholder={t('leavemanagement.enter-reason')}
                                        placeholderTextColor='gray'
                                        value={reason}
                                        onChangeText={(text) => {
                                            setReason(text.toString());
                                            setReasonErr(false);
                                        }}
                                    />
                                    {reasonErr && <MaterialIcons style={{ position: 'absolute', right: selectedLanguage === 'ar' ? 260 : 35, top: 19 }} name="error-outline" size={15} color="red" />}
                                </View>

                                <View style={{ marginVertical: 8, marginTop: 7, width: '87%', alignSelf: 'center', alignItems: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start' }}>
                                    <View style={{ marginLeft: 4 }}>
                                        <BouncyCheckbox
                                            size={13}
                                            fillColor="#32CD32"
                                            unfillColor="#FFFFFF"
                                            text={t('leavemanagement.active')}
                                            iconStyle={{ borderColor: "#32CD32" }}
                                            innerIconStyle={{ borderWidth: 1.5 }}
                                            isChecked={active}
                                            textStyle={{ fontSize: selectedLanguage === 'ar' ? 13.5 : 13, left: -8, textDecorationLine: 'none' }}
                                            onPress={() => { setActive(!active) }}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginTop: 11 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#00308F', padding: 9, borderRadius: 5, alignItems: 'center', width: '87%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { handleReasonSave(); }}>
                                        <AntDesign name="save" size={14} color="white" style={{ left: selectedLanguage === 'ar' ? -2 : -1 }} />
                                        <Text style={{ color: 'white', fontSize: selectedLanguage === 'ar' ? 12.5 : 12.5, fontWeight: '500', marginLeft: 7, left: -2 }}>{t('leavemanagement.save')}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                        {alert && <CustomAlert msg1={res2.message} msg2={res2.status} alert2={alert} toggleAlert2={toggleAlert} opt='addleavereason' />}

                        {delAlert && <LeaveManagementModal alert={delAlert} toggleAlert={toggleDelAlert} handleDelete={handleReasonDelete} item={selectedReason} from='deleteReason' />}

                        <View style={{ marginTop: 20, marginHorizontal: 17, marginBottom: leaveReasons.length > 0 ? 0 : 50 }}>
                            <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.2, shadowColor: 'gray', width: '100%' }}>
                                <View style={{ paddingLeft: 7, paddingRight: 8, alignSelf: 'center' }}>

                                    <DataTable>
                                        <DataTable.Header style={{ justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 30 : -1 }}>{t('leavemanagement.reason')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ flex: 5, color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? 50 : 48, lineHeight: 16.5 }}>{t('leavemanagement.status')}</DataTable.Title>
                                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', lineHeight: 16, textAlign: 'center', left: selectedLanguage === 'ar' ? 55 : 47 }}>{t('leavemanagement.action')}</DataTable.Title>
                                        </DataTable.Header>

                                        {leaveReasons.length > 0 && leaveReasons.slice(from2, to2).map((item, index) => (
                                            <DataTable.Row key={index} style={{ borderColor: 'gray', borderBottomWidth: 0.25 }}>
                                                <DataTable.Cell textStyle={{ fontSize: 11.5, left: 0, color: '#343434', textAlign: 'left', width: '140%' }}>
                                                    {item.LeaveReasonText}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ flex: 5, fontSize: 11.5, left: 20, color: '#343434', textAlign: 'center', width: '20%' }}>
                                                    {item.IsActive ? 'Active' : 'Inactive'}
                                                </DataTable.Cell>
                                                <DataTable.Cell numeric textStyle={{ fontSize: 12, color: '#343434' }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <TouchableOpacity style={{ width: 47, height: 23, backgroundColor: '#D22B2B', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} onPress={() => { setSelectedReason(item); toggleDelAlert(); }}><AntDesign name="delete" size={13} color="white" /></TouchableOpacity>
                                                    </View>
                                                </DataTable.Cell>
                                            </DataTable.Row>
                                        ))}

                                        {leaveReasons.length === 0 && (
                                            <View style={{ marginTop: 30, alignItems: 'center', marginBottom: -72, flexDirection: 'row', justifyContent: 'center' }}>
                                                {!loading2 && <Feather name="database" size={13} color="#8B0000" />}
                                                {!loading2 && <Text style={{ fontSize: 12.2, fontWeight: '600', color: '#8B0000', textDecorationLine: 'underline', marginLeft: 3 }}>{t('leavemanagement.data-not-available')}</Text>}
                                                {!loading2 && <Ionicons name="ios-alert" size={13} color="#8B0000" style={{ left: -1.8 }} />}
                                            </View>
                                        )}

                                        {loading2 && (
                                            <View style={{ alignItems: 'center', top: 15, marginBottom: -3 }}>
                                                <MaterialIndicator color="#D17842" size={23} />
                                            </View>
                                        )}

                                        <DataTable.Pagination
                                            style={{ marginTop: leaveReasons.length > 0 ? 20 : 0, opacity: leaveReasons.length > 0 ? 1 : 0 }}
                                            page={page2}
                                            numberOfPages={Math.ceil(leaveReasons.length / itemsPerPage2)}
                                            onPageChange={(page) => setPage2(page)}
                                            label={`${from2 + 1}-${to2} of ${leaveReasons.length}`}
                                            numberOfItemsPerPageList={numberOfItemsPerPageList2}
                                            numberOfItemsPerPage={itemsPerPage2}
                                            onItemsPerPageChange={onItemsPerPageChange2}
                                            showFastPaginationControls
                                            selectPageDropdownLabel={t('leavemanagement.rows-per-page')}
                                        />
                                    </DataTable>

                                </View>
                            </View>
                        </View>

                        {leaveReasons.length > 0 && (<View style={{ marginTop: 7, marginHorizontal: 17, marginBottom: 115 }}>
                            <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 5, alignSelf: 'center', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', width: '100%' }}>
                                <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: selectedLanguage === 'ar' ? 0 : 10, marginLeft: selectedLanguage === 'ar' ? 10 : 0, flexDirection: 'row' }} onPress={() => { generateExcelForReasons(); }}>
                                        <Text style={{ color: 'white', fontSize: 12.2, fontWeight: '500', marginRight: 6 }}>{t('leavemanagement.export-sheet')}</Text>
                                        <MaterialCommunityIcons name="microsoft-excel" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>)}
                    </View>)}


                    <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                        <Footer />
                    </View>
                </ScrollView>

                {saveLoading && (
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