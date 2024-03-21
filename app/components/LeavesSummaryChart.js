import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { useTranslation } from 'react-i18next';

export default function LeavesSummaryChart({ leavesSummary, selectedLanguage }) {
    function getMonthRangeNames() {
        const currentMonth = new Date().getMonth() + 1;
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        if (currentMonth >= 1 && currentMonth <= 6) {
            return monthNames.slice(0, 6);
        } else {
            return monthNames.slice(6, 12);
        }
    }
    const monthRangeNames = getMonthRangeNames();

    function getMonthRange() {
        const currentMonth = new Date().getMonth() + 1;

        if (currentMonth >= 1 && currentMonth <= 6) {
            return 1;
        } else {
            return 7;
        }
    }
    const startMonth = getMonthRange();

    const barData = [
        {
            value: leavesSummary.length > 1 ? leavesSummary[startMonth - 1].LeavesApplied : 5,
            label: monthRangeNames[0],
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray', fontSize: 12.5 },
            frontColor: '#177AD5',
        },
        { value: leavesSummary.length > 1 ? leavesSummary[startMonth - 1].LeavesAccepted : 4, frontColor: '#ED6665' },

        {
            value: leavesSummary.length > 1 ? leavesSummary[startMonth].LeavesApplied : 4,
            label: monthRangeNames[1],
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray', fontSize: 12.5 },
            frontColor: '#177AD5',
        },
        { value: leavesSummary.length > 1 ? leavesSummary[startMonth].LeavesAccepted : 3, frontColor: '#ED6665' },

        {
            value: leavesSummary.length > 1 ? leavesSummary[startMonth + 1].LeavesApplied : 3,
            label: monthRangeNames[2],
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray', fontSize: 12.5 },
            frontColor: '#177AD5',
        },
        { value: leavesSummary.length > 1 ? leavesSummary[startMonth + 1].LeavesAccepted : 2, frontColor: '#ED6665' },

        {
            value: leavesSummary.length > 1 ? leavesSummary[startMonth + 2].LeavesApplied : 2,
            label: monthRangeNames[3],
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray', fontSize: 12.5 },
            frontColor: '#177AD5',
        },
        { value: leavesSummary.length > 1 ? leavesSummary[startMonth + 2].LeavesAccepted : 1, frontColor: '#ED6665' },

        {
            value: leavesSummary.length > 1 ? leavesSummary[startMonth + 3].LeavesApplied : 1,
            label: monthRangeNames[4],
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray', fontSize: 12.5 },
            frontColor: '#177AD5',
        },
        { value: leavesSummary.length > 1 ? leavesSummary[startMonth + 3].LeavesAccepted : 0, frontColor: '#ED6665' },

        {
            value: leavesSummary.length > 1 ? leavesSummary[startMonth + 4].LeavesApplied : 0,
            label: monthRangeNames[5],
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray', fontSize: 12.5 },
            frontColor: '#177AD5',
        },
        { value: leavesSummary.length > 1 ? leavesSummary[startMonth + 4].LeavesAccepted : 0, frontColor: '#ED6665' }
    ]

    const totalLeavesApplied = barData.reduce((total, item, index) => {
        if (index % 2 === 0) {
            return total + item.value;
        }
        return total;
    }, 0);

    const totalLeavesAccepted = barData.reduce((total, item, index) => {
        if (index % 2 === 1) {
            return total + item.value;
        }
        return total;
    }, 0);

    const { t } = useTranslation();

    return (
        <>
            <View style={{ paddingLeft: 20, paddingRight: 16, paddingTop: 21, paddingBottom: 25, width: '86%', backgroundColor: 'white', elevation: 2, shadowColor: 'lightgray', alignSelf: 'center', borderRadius: 5 }}>
                <View style={{ marginBottom: 7, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14.5, marginBottom: 3, fontWeight: 700, color: 'darkblue' }}>{t('dashboard.leaves-in')}</Text>
                    <Text style={{ fontSize: selectedLanguage === 'ar' ? 12.5 : 13, color: 'gray' }}>{new Date().getFullYear()}</Text>
                </View>

                <View
                    style={{
                        width: '95%',
                        marginLeft: -13,
                        alignSelf: 'flex-start'
                    }}
                >
                    <BarChart
                        data={barData}
                        barWidth={10}
                        spacing={25}
                        roundedTop
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisIndicesHeight={10}
                        yAxisTextStyle={{ color: 'gray', fontSize: 12.5, left: 1.5 }}
                        noOfSections={4}
                        maxValue={8}
                        rulesType='dashed'
                        rulesLength={250}
                        stepHeight={37}
                        stepValue={2}
                    />
                </View>

                <View style={{ marginTop: 34, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ height: 10, width: 10, backgroundColor: '#177AD5', borderRadius: 2, top: 4 }} />
                        <View style={{ alignItems: 'center', marginLeft: 6 }}>
                            <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('dashboard.applied')}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 700 }}>{leavesSummary.length > 1 ? totalLeavesApplied : 'N/a'}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ height: 10, width: 10, backgroundColor: '#ED6665', borderRadius: 2, top: 4 }} />
                        <View style={{ alignItems: 'center', marginLeft: 6 }}>
                            <Text style={{ fontSize: 12.5, marginBottom: 2 }}>{t('dashboard.accepted')}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 700 }}>{leavesSummary.length > 1 ? totalLeavesAccepted : 'N/a'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}