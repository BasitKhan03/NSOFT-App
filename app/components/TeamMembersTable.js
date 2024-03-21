import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

export default function TeamMembersTable({ details }) {
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, details.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    function toTitleCase(str) {
        return str.toLowerCase().replace(/\b\w/g, function (match) {
            return match.toUpperCase();
        });
    };

    return (
        <>
            <View style={{ backgroundColor: 'white', elevation: 2, shadowColor: 'gray', borderRadius: 5, width: '87%', alignSelf: 'center', paddingLeft: 10, paddingRight: 15, paddingTop: 6, paddingBottom: 20 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 4 }}>{t('myteam.full-name')}</DataTable.Title>
                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: 1 }}>{t('myteam.employee-code')}</DataTable.Title>
                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: -10 }}>{t('myteam.function')}</DataTable.Title>
                            <DataTable.Title textStyle={{ color: '#3457D5', fontSize: 12.5, fontWeight: '700', left: selectedLanguage === 'ar' ? -5 : -8 }}>{t('myteam.location')}</DataTable.Title>
                        </DataTable.Header>

                        {details.slice(from, to).map((detail) => (
                            <DataTable.Row key={detail.employee_code}>
                                <View style={{ width: '25%', marginRight: 7 }}>
                                    <Text style={{ flex: 1, fontSize: 12.5, left: -1, top: 12, color: '#343434' }}>{detail.first_name + ' ' + detail.last_name}</Text>
                                </View>
                                <View style={{ width: '15%', marginRight: 28 }}>
                                    <Text style={{ flex: 1, fontSize: 12.2, top: 12, color: '#343434', textAlign: 'center' }}>{detail.employee_code}</Text>
                                </View>
                                <View style={{ width: '20%', marginRight: 0 }}>
                                    <Text style={{ flex: 1, fontSize: 12.2, top: 12, color: '#343434', textAlign: 'center' }}>{toTitleCase(detail.function_name)}</Text>
                                </View>
                                <View style={{ width: '27%' }}>
                                    <Text style={{ flex: 1, fontSize: 12.2, top: 12, color: '#343434', textAlign: 'center' }}>{toTitleCase(detail.location_name)}</Text>
                                </View>
                            </DataTable.Row>
                        ))}

                        <DataTable.Pagination
                            page={page}
                            style={{ marginTop: 15 }}
                            numberOfPages={Math.ceil(details.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${details.length}`}
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                </ScrollView>
            </View>
        </>
    )
}