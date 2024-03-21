import React from 'react';
import { View, Text } from 'react-native';

export default function TeamChart({ count, label, subLabel, color, selectedLanguage }) {
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
                <View style={{ marginTop: 25, marginBottom: 20 }}>
                    <Text style={{ color: color, fontSize: 17, fontWeight: '700' }}>{formatNumberWithZero(count)}</Text>
                </View>

                <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13, marginBottom: 4, fontWeight: selectedLanguage === 'ar' ? '600' : '500' }}>{label}</Text>
                <Text style={{ fontSize: selectedLanguage === 'ar' ? 12 : 12.2, color: 'gray' }}>{subLabel}</Text>
            </View>
        </>
    )
}
