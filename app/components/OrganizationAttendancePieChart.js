import React from 'react';
import { View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PieChart from 'react-native-pie-chart';
import Swiper from 'react-native-swiper';
import { useTranslation } from 'react-i18next';

export default function OrganizationAttendancePieChart({ stats, selectedLanguage }) {

    const present = (stats[0].TotalPresentUsers / stats[0].TotalActiveUsers) * 100;
    const absent = (stats[0].TotalAbsentUsers / stats[0].TotalActiveUsers) * 100;
    const leave = (stats[0].TotalOnLeaveUsers / stats[0].TotalActiveUsers) * 100;
    const late = (stats[0].TotalLateUsers / stats[0].TotalActiveUsers) * 100;

    const allZero1 = present === 0 && absent === 0 && leave === 0;
    const allZero2 = present === 0 && late === 0;

    const series1 = allZero1 ? [33, 33, 33] : [present, absent, leave];
    const sliceColor1 = ['#47B39C', '#EC6B56', '#FFC154']

    const series2 = allZero2 ? [50, 50] : [100 - late, late]
    const sliceColor2 = ['#87CEFA', '#6082B6']

    const { t } = useTranslation();

    return (
        <>
            <Swiper
                horizontal={true}
                style={{ height: 323 }}
                dotStyle={{ width: 6.8, height: 6.8 }}
                activeDotStyle={{ width: 6.8, height: 6.8 }}
                activeDotColor='#318CE7'
                loop={false}
                showsButtons={true}
                buttonWrapperStyle={{ top: -35, paddingHorizontal: 45 }}
                nextButton={<AntDesign name="arrowright" size={21} color="#318CE7" />}
                prevButton={<AntDesign name="arrowleft" size={21} color="#318CE7" />}
            >
                <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', paddingTop: 21, paddingBottom: 26, alignSelf: 'center' }}>
                    <View style={{ marginBottom: 22, alignItems: 'center' }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 15.2 : 14.5, marginBottom: 3, fontWeight: 700, color: 'darkblue' }}>{t('organizationstats.presence')}</Text>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 13, color: 'gray' }}>{t('organizationstats.today')}</Text>
                    </View>
                    <View style={{ top: -1 }}>
                        <PieChart
                            widthAndHeight={100}
                            series={series1}
                            sliceColor={sliceColor1}
                            coverRadius={0.65}
                            coverFill={'#FFF'}
                        />
                    </View>
                    <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ height: 11, width: 11, backgroundColor: '#47B39C', borderRadius: 20, top: 4 }} />
                            <View style={{ alignItems: 'center', marginLeft: 5 }}>
                                <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('organizationstats.present')}</Text>
                                {allZero1 ? (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>N/a</Text>
                                ) : (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>{present.toString().split(".")[0]}%</Text>
                                )}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ height: 11, width: 11, backgroundColor: '#EC6B56', borderRadius: 20, top: 4 }} />
                            <View style={{ alignItems: 'center', marginLeft: 5 }}>
                                <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('organizationstats.absent')}</Text>
                                {allZero1 ? (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>N/a</Text>
                                ) : (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>{absent.toString().split(".")[0]}%</Text>
                                )}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ height: 11, width: 11, backgroundColor: '#FFC154', borderRadius: 20, top: 4 }} />
                            <View style={{ alignItems: 'center', marginLeft: 5 }}>
                                <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('organizationstats.leave')}</Text>
                                {allZero1 ? (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>N/a</Text>
                                ) : (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>{leave.toString().split(".")[0]}%</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 5, elevation: 1.5, shadowColor: 'gray', paddingTop: 21, paddingBottom: 26, alignSelf: 'center' }}>
                    <View style={{ marginBottom: 22, alignItems: 'center' }}>
                        <Text style={{ fontSize: 14.5, marginBottom: 3, fontWeight: 700, color: 'darkblue' }}>{t('organizationstats.punctuality')}</Text>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 13, color: 'gray' }}>{t('organizationstats.today')}</Text>
                    </View>
                    <View>
                        <PieChart
                            widthAndHeight={100}
                            series={series2}
                            sliceColor={sliceColor2}
                            coverRadius={0.65}
                            coverFill={'#FFF'}
                        />
                    </View>
                    <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ height: 11, width: 11, backgroundColor: '#87CEFA', borderRadius: 20, top: 4 }} />
                            <View style={{ alignItems: 'center', marginLeft: 5 }}>
                                <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('organizationstats.on-time')}</Text>
                                {allZero2 ? (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>N/a</Text>
                                ) : (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>{(100 - late).toString().split(".")[0]}%</Text>
                                )}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ height: 11, width: 11, backgroundColor: '#6082B6', borderRadius: 20, top: 4 }} />
                            <View style={{ alignItems: 'center', marginLeft: 5 }}>
                                <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('organizationstats.late')}</Text>
                                {allZero2 ? (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>N/a</Text>
                                ) : (
                                    <Text style={{ fontSize: 12, fontWeight: 700, top: 1 }}>{late.toString().split(".")[0]}%</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </Swiper>
        </>
    )
}
