import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function EventsTable({ selectedLanguage }) {
    const { t } = useTranslation();
    return (
        <>
            {selectedLanguage === 'ar' ? (<View style={{ marginHorizontal: 25, backgroundColor: 'white', elevation: 1, shadowColor: 'gray', borderRadius: 5, padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginTop: 5, marginBottom: 5 }}>
                    <Text style={{ fontSize: 13.8, fontWeight: 700, color: 'darkblue', marginRight: 4 }}>{t('dashboard.date')}</Text>
                    <Text style={{ fontSize: 13.8, fontWeight: 700, color: 'darkblue', marginLeft: 2 }}>{t('dashboard.event-type')}</Text>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 0.5, width: '100%', position: 'absolute', bottom: -7 }} />
                </View>


                <View style={{ marginTop: 18, marginBottom: 5 }}>
                    {renderEvent(t('dashboard.not-specified'), '1', t('dashboard.not-specified'), selectedLanguage)}
                </View>
            </View>)

                :

                (<View style={{ marginHorizontal: 25, backgroundColor: 'white', elevation: 1, shadowColor: 'gray', borderRadius: 5, padding: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginTop: 5, marginBottom: 5 }}>
                        <Text style={{ fontSize: 13.2, fontWeight: 700, color: 'darkblue', marginLeft: 2 }}>{t('dashboard.event-type')}</Text>
                        <Text style={{ fontSize: 13.2, fontWeight: 700, color: 'darkblue', marginRight: 4 }}>{t('dashboard.date')}</Text>
                        <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 0.5, width: '100%', position: 'absolute', bottom: -7 }} />
                    </View>


                    <View style={{ marginTop: 18, marginBottom: 5 }}>
                        {renderEvent(t('dashboard.not-specified'), '1', t('dashboard.not-specified'), selectedLanguage)}
                    </View>
                </View>)}
        </>
    )
}

const renderEvent = (name, number, date, selectedLanguage) => {
    return (
        selectedLanguage === 'ar' ? (<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, paddingHorizontal: 10 }}>

            <View style={{ alignItems: 'flex-end', marginRight: 7 }}>
                <Text style={{ fontSize: 14.2, color: '#4a4a4a' }}>{date}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 2, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 14.2, color: '#4a4a4a' }}>{name}</Text>
                <Text style={{ fontSize: 12, color: '#36454F' }}>  ({number}</Text>
            </View>

        </View>)

            :

            (<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, paddingHorizontal: 10 }}>

                <View style={{ flexDirection: 'row', width: '50%', marginLeft: 2 }}>
                    <Text style={{ fontSize: 12.5, color: '#36454F' }}>{number})  </Text>
                    <Text style={{ fontSize: 12.5, color: '#4a4a4a' }}>{name}</Text>
                </View>

                <View style={{ alignItems: 'flex-end', marginRight: 7 }}>
                    <Text style={{ fontSize: 12.5, color: '#4a4a4a' }}>{date}</Text>
                </View>
            </View>)
    );
};