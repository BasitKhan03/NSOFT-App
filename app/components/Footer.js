import React from 'react';
import { View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    return (
        <>
            <View style={{ height: 65, width: '100%', backgroundColor: 'rgba(220,224,241,0.95)', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: -2 }}>
                    <AntDesign name="copyright" size={13} color="darkblue" />
                    <Text style={{ fontSize: 12.2, color: 'darkblue', fontWeight: '700', marginLeft: 6 }}>{t('drawer.copyright-2023')}</Text>
                </View>
            </View>
        </>
    )
}