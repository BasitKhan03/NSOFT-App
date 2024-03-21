import React from 'react';
import { View, Text } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function LatestAttendanceTable({ attendance, selectedLanguage }) {
    const { t } = useTranslation();

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

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}  ${ampm}`;
    };

    function isOff() {
        if (
            (attendance[0].time_in === null || attendance[0].time_in === '' || attendance[0].time_in === ' ') &&
            (attendance[0].time_out === null || attendance[0].time_out === '' || attendance[0].time_out === ' ') &&
            (attendance[0].terminal_in === null || attendance[0].terminal_in === '' || attendance[0].terminal_in === ' ') &&
            (attendance[0].terminal_out === null || attendance[0].terminal_out === '' || attendance[0].terminal_out === ' ')
        ) {
            return true;
        }
        return false;
    }

    return (
        <>
            <View style={{ marginHorizontal: 25, backgroundColor: 'white', elevation: 1.5, shadowColor: 'gray', borderRadius: 5, padding: 10, paddingHorizontal: 10 }}>

                <View style={{ marginTop: 7, marginBottom: 8, width: '100%' }}>
                    {selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: 700, color: '#213440', textAlign: 'center', marginRight: 7 }}>{t('dashboard.todays-attendance')}</Text>
                        <Octicons name="checklist" size={16} color="#213440" />
                    </View>) : (<View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', left: -2 }}>
                        <Octicons name="checklist" size={17} color="#213440" />
                        <Text style={{ fontSize: 13.8, fontWeight: 700, color: '#213440', textAlign: 'center', marginLeft: 8 }}>{t('dashboard.todays-attendance')}</Text>
                    </View>)}
                </View>
            </View>

            <View style={{ marginHorizontal: 25, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <View style={{ width: '48.5%', backgroundColor: 'white', elevation: 1.5, shadowColor: 'gray', borderRadius: 5, padding: 10, paddingHorizontal: 10, paddingBottom: 15 }}>

                    <View style={{ alignItems: 'center', marginBottom: 14.5 }}>
                        <Text style={{ fontSize: 13.2, fontWeight: 700, color: '#3457D5' }}>{t('dashboard.time-in')}</Text>
                    </View>

                    <View style={{ borderBottomColor: '#242D40', borderBottomWidth: 0.45, width: '88%', position: 'absolute', top: 33, borderStyle: 'dashed', alignSelf: 'center' }} />

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Text style={{ fontSize: 12.2, textAlign: 'center', color: '#4a4a4a', lineHeight: 18 }}>{isOff() ? 'Off' : (attendance[0].time_in === null || attendance[0].time_in === ' ' || attendance[0].time_in === 'NULL' ? 'Not specified' : formatTimeWithAMPM(attendance[0].time_in))}</Text>
                    </View>

                </View>

                <View style={{ width: '48.5%', backgroundColor: 'white', elevation: 1.5, shadowColor: 'gray', borderRadius: 5, padding: 10, paddingHorizontal: 10, paddingBottom: 15 }}>

                    <View style={{ alignItems: 'center', marginBottom: 14.5 }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13, fontWeight: 700, color: '#3457D5' }}>{t('dashboard.time-out')}</Text>
                    </View>

                    <View style={{ borderBottomColor: '#242D40', borderBottomWidth: 0.45, width: '88%', position: 'absolute', top: 33, borderStyle: 'dashed', alignSelf: 'center' }} />

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Text style={{ fontSize: 12.2, textAlign: 'center', color: '#4a4a4a', lineHeight: 18 }}>{isOff() ? 'Off' : (attendance[0].time_out === null || attendance[0].time_out === ' ' || attendance[0].time_out === 'NULL' ? 'Not specified' : formatTimeWithAMPM(attendance[0].time_out))}</Text>
                    </View>

                </View>

            </View>

            <View style={{ marginHorizontal: 25, marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <View style={{ width: '48.5%', backgroundColor: 'white', elevation: 1.5, shadowColor: 'gray', borderRadius: 5, padding: 10, paddingHorizontal: 10, paddingBottom: 15 }}>

                    <View style={{ alignItems: 'center', marginBottom: 14.5 }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13, fontWeight: 700, color: '#3457D5' }}>{t('dashboard.terminal-in')}</Text>
                    </View>

                    <View style={{ borderBottomColor: '#242D40', borderBottomWidth: 0.45, width: '88%', position: 'absolute', top: 33, borderStyle: 'dashed', alignSelf: 'center' }} />

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.2 : 12.5, textAlign: 'center', color: '#4a4a4a', lineHeight: 17, paddingTop: 1 }}>{isOff() ? 'Off' : (attendance[0].terminal_in === null || attendance[0].terminal_in === ' ' || attendance[0].terminal_in === 'NULL' ? 'Not specified' : attendance[0].terminal_in)}</Text>
                    </View>
                </View>

                <View style={{ width: '48.5%', backgroundColor: 'white', elevation: 1.5, shadowColor: 'gray', borderRadius: 5, padding: 10, paddingHorizontal: 10, paddingBottom: 15 }}>

                    <View style={{ alignItems: 'center', marginBottom: 14.5 }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13, fontWeight: 700, color: '#3457D5' }}>{t('dashboard.terminal-out')}</Text>
                    </View>

                    <View style={{ borderBottomColor: '#242D40', borderBottomWidth: 0.45, width: '88%', position: 'absolute', top: 33, borderStyle: 'dashed', alignSelf: 'center' }} />

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.2 : 12.5, textAlign: 'center', color: '#4a4a4a', lineHeight: 17, paddingTop: 1 }}>{isOff() ? 'Off' : (attendance[0].terminal_out === null || attendance[0].terminal_out === ' ' || attendance[0].terminal_out === 'NULL' ? 'Not specified' : attendance[0].terminal_out)}</Text>
                    </View>
                </View>

            </View>
        </>
    )
}