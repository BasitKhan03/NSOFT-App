import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function LeavesInfo({ profile, selectedLanguage }) {
    const { t } = useTranslation();
    return (
        <>
            {selectedLanguage === 'ar' ? (<View style={{ backgroundColor: 'white', width: '93%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray' }}>

                <View style={{ alignItems: 'center', padding: 19 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13.5, fontWeight: 'bold', marginBottom: 10, marginRight: 7.5, color: '#1B2936' }}>{t('profile.leaves-info')}</Text>
                        <AntDesign name="profile" size={14.5} color='#1B2936' style={{ top: -5 }} />
                    </View>
                    <View style={{ borderBottomWidth: 0.4, borderColor: 'lightblue', width: '90%' }} />
                </View>

                <View style={{ padding: 20, paddingTop: 7, paddingBottom: 33 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 13 }}>

                        <View style={{ width: '47%', height: 95, elevation: 5, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.medical-leaves-allocated')}</Text>
                                <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].sick_leaves > 0 ? profile[0].sick_leaves.toString().padStart(2, '0') : '00'}</Text>
                            </View>
                        </View>

                        <View style={{ width: '47%', height: 95, elevation: 5, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.casual-leaves-allocated')}</Text>
                                <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].casual_leaves > 0 ? profile[0].casual_leaves.toString().padStart(2, '0') : '00'}</Text>
                            </View>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 13, marginTop: 20 }}>

                        <View style={{ width: '47%', height: 95, elevation: 4, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.earned-leaves-allocated')}</Text>
                                <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].annual_leaves > 0 ? profile[0].annual_leaves.toString().padStart(2, '0') : '00'}</Text>
                            </View>
                        </View>

                        <View style={{ width: '47%', height: 95, elevation: 4, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.ex-pak-leaves-allocated')}</Text>
                                <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].other_leaves > 0 ? profile[0].other_leaves.toString().padStart(2, '0') : '00'}</Text>
                            </View>
                        </View>

                    </View>

                </View>
            </View>)

                :

                (<View style={{ backgroundColor: 'white', width: '93%', alignSelf: 'center', borderRadius: 5, elevation: 1, shadowColor: 'gray' }}>

                    <View style={{ alignItems: 'center', padding: 19 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="newspaper-variant-outline" size={18} color='#1B2936' style={{ top: -5 }} />
                            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginLeft: 6, color: '#1B2936' }}>{t('profile.leaves-info')}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 0.4, borderColor: 'lightblue', width: '90%' }} />
                    </View>

                    <View style={{ padding: 20, paddingTop: 7, paddingBottom: 33 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 13 }}>

                            <View style={{ width: '47%', height: 95, elevation: 5, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                                <View style={{ paddingVertical: 15, width: 100, alignSelf: 'center' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.medical-leaves-allocated')}</Text>
                                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].sick_leaves > 0 ? profile[0].sick_leaves.toString().padStart(2, '0') : '00'}</Text>
                                </View>
                            </View>

                            <View style={{ width: '47%', height: 95, elevation: 5, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                                <View style={{ paddingVertical: 15, width: 100, alignSelf: 'center' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.casual-leaves-allocated')}</Text>
                                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].casual_leaves > 0 ? profile[0].casual_leaves.toString().padStart(2, '0') : '00'}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 13, marginTop: 20 }}>

                            <View style={{ width: '47%', height: 95, elevation: 4, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                                <View style={{ paddingVertical: 15, width: 100, alignSelf: 'center' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.earned-leaves-allocated')}</Text>
                                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].annual_leaves > 0 ? profile[0].annual_leaves.toString().padStart(2, '0') : '00'}</Text>
                                </View>
                            </View>

                            <View style={{ width: '47%', height: 95, elevation: 4, shadowColor: 'gray', backgroundColor: 'white', borderRadius: 5 }}>
                                <View style={{ paddingVertical: 15, width: 100, alignSelf: 'center' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: 'black', textAlign: 'center' }}>{t('profile.ex-pak-leaves-allocated')}</Text>
                                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13.2, color: 'gray' }}>{profile[0].other_leaves > 0 ? profile[0].other_leaves.toString().padStart(2, '0') : '00'}</Text>
                                </View>
                            </View>

                        </View>

                    </View>
                </View>)}
        </>
    )
}
