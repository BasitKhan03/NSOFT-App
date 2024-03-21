import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ProfileInfo({ profile, selectedLanguage }) {
    const { t } = useTranslation();

    const datetimeString = profile[0].date_of_joining;
    const datePart = datetimeString.split(" ")[0];
    const dateObject = new Date(datePart);

    const options = { year: "numeric", month: "short", day: "2-digit" };
    const formattedDate = dateObject.toLocaleDateString("en-US", options);

    return (
        <>
            {selectedLanguage === 'ar' ? (<View style={{ backgroundColor: 'white', width: '93%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray' }}>
                <View style={{ alignItems: 'center', padding: 18 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14.2, fontWeight: 'bold', marginBottom: 10, marginRight: 7, color: '#1B2936' }}>{t('profile.user-info')}</Text>
                        <AntDesign name="profile" size={14.5} color='#1B2936' style={{ top: -5 }} />
                    </View>
                    <View style={{ borderBottomWidth: 0.45, borderColor: 'lightblue', width: '90%' }} />
                </View>

                <View style={{ padding: 20, paddingTop: 6, paddingBottom: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 5, marginRight: 8 }}>{profile[0].employee_code === null ? 'N/A' : profile[0].employee_code}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 1 }}>
                            <Text style={{ fontSize: 13.2, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.employee-code')}</Text>
                            <AntDesign name="qrcode" size={17} color="#242D40" />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 16.5 }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 5, textAlign: 'left', width: '46%' }}>{profile[0].email === null ? 'N/A' : profile[0].email}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 1 }}>
                            <Text style={{ fontSize: 13.2, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.email-address')}</Text>
                            <AntDesign name="mail" size={16} color="#242D40" />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 5, marginRight: 8 }}>{profile[0].mobile_no === null ? 'N/A' : profile[0].mobile_no}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 1 }}>
                            <Text style={{ fontSize: 13.2, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.mobile-number')}</Text>
                            <Feather name="phone" size={15} color="#242D40" />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 5, marginRight: 8 }}>{formattedDate === null ? 'N/A' : formattedDate}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13.2, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.joining-date')}</Text>
                            <AntDesign name="calendar" size={15} color="#242D40" />
                        </View>
                    </View>

                    <View style={{ borderBottomWidth: 0.7, borderColor: 'lightblue', width: '100%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 17 }} />
                    <View style={{ borderBottomWidth: 0.7, borderColor: 'lightblue', width: '100%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 2 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 17 }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginRight: 5, marginLeft: 8 }}>{profile[0].emergency_contact_01 === null || profile[0].emergency_contact_01 === 'n/a' || profile[0].emergency_contact_01 === 'NOT ASSIGNED' ? 'N/A' : profile[0].emergency_contact_01}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.emergency-contact-1')}</Text>
                            <Feather name="alert-triangle" size={15} color="#242D40" />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginRight: 5, marginLeft: 8 }}>{profile[0].emergency_contact_02 === null || profile[0].emergency_contact_02 === 'n/a' || profile[0].emergency_contact_02 === 'NOT ASSIGNED' ? 'N/A' : profile[0].emergency_contact_02}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.emergency-contact-2')}</Text>
                            <Feather name="alert-triangle" size={15} color="#242D40" />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginRight: 5, marginLeft: 8 }}>{profile[0].active ? 'Yes' : 'No'}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.finger-registered')}</Text>
                            <Entypo name="fingerprint" size={15} color="#242D40" />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                        <Text style={{ fontSize: 13.2, color: 'gray', marginRight: 5, marginLeft: 8 }}>0</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, marginRight: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.cards-assigned')}</Text>
                            <Feather name="credit-card" size={15} color="#242D40" />
                        </View>
                    </View>
                </View>
            </View>)

                :

                (<View style={{ backgroundColor: 'white', width: '93%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray' }}>
                    <View style={{ alignItems: 'center', padding: 18 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account-details-outline" size={20} color='#1B2936' style={{ top: -5 }} />
                            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginLeft: 6, color: '#1B2936' }}>{t('profile.user-info')}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 0.45, borderColor: 'lightblue', width: '90%' }} />
                    </View>

                    <View style={{ padding: 20, paddingTop: 6, paddingBottom: 24 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <AntDesign name="qrcode" size={17} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 7, fontWeight: '600', color: 'darkblue' }}>{t('profile.employee-code')}</Text>
                            </View>
                            <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8 }}>{profile[0].employee_code === null ? 'N/A' : profile[0].employee_code}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <AntDesign name="mail" size={16} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.email-address')}</Text>
                            </View>
                            <View style={{ width: '55%' }}>
                                <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8, textAlign: 'right' }}>{profile[0].email === null ? 'N/A' : profile[0].email}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Feather name="phone" size={15} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.mobile-number')}</Text>
                            </View>
                            <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8 }}>{profile[0].mobile_no === null ? 'N/A' : profile[0].mobile_no}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <AntDesign name="calendar" size={15} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.joining-date')}</Text>
                            </View>
                            <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8 }}>{formattedDate === null ? 'N/A' : formattedDate}</Text>
                        </View>

                        <View style={{ borderBottomWidth: 0.7, borderColor: 'lightblue', width: '100%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 17 }} />
                        <View style={{ borderBottomWidth: 0.7, borderColor: 'lightblue', width: '100%', borderStyle: 'dashed', alignSelf: 'center', marginTop: 2 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 17 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Feather name="alert-triangle" size={15} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.emergency-contact-1')}</Text>
                            </View>
                            <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8 }}>{profile[0].emergency_contact_01 === null || profile[0].emergency_contact_01 === 'n/a' || profile[0].emergency_contact_01 === 'NOT ASSIGNED' ? 'N/A' : profile[0].emergency_contact_01}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Feather name="alert-triangle" size={15} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.emergency-contact-2')}</Text>
                            </View>
                            <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8 }}>{profile[0].emergency_contact_02 === null || profile[0].emergency_contact_02 === 'n/a' || profile[0].emergency_contact_02 === 'NOT ASSIGNED' ? 'N/A' : profile[0].emergency_contact_02}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Entypo name="fingerprint" size={15} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.finger-registered')}</Text>
                            </View>
                            <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8 }}>{profile[0].active ? 'Yes' : 'No'}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16.5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Feather name="credit-card" size={15} color="#242D40" />
                                <Text style={{ fontSize: 13.2, marginLeft: 8, fontWeight: '600', color: 'darkblue' }}>{t('profile.cards-assigned')}</Text>
                            </View>
                            <Text style={{ fontSize: 13.2, color: 'gray', marginLeft: 8 }}>0</Text>
                        </View>
                    </View>
                </View>)}
        </>
    )
}
