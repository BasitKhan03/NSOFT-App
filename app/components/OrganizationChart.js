import React from 'react';
import { View, Text } from 'react-native';

export default function OrganizationChart({ count, label, subLabel, color, selectedLanguage }) {
    function formatNumberWithZero(number) {
        let numberString = number.toString();

        if (numberString.length === 1) {
            numberString = '0' + numberString;
        }

        return numberString;
    };

    return (
        <>
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginTop: 20, marginBottom: 17 }}>
                    <Text style={{ color: color, fontSize: 17, fontWeight: '700' }}>{formatNumberWithZero(count)}</Text>
                </View>

                <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 12.5, marginBottom: 5, color: '#0E3386', fontWeight: '700', width: '90%', textAlign: 'center' }}>{label}</Text>
                <Text style={{ fontSize: selectedLanguage === 'ar' ? 12 : 12.2, color: 'gray' }}>{subLabel}</Text>
            </View>
        </>
    )
}
