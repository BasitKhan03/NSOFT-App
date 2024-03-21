import React from 'react';
import { View, Text } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';

export default function CircularChart({ percent, label, color, option, selectedLanguage }) {
  function getCurrentMonthYear() {
    const currentDate = new Date();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    return `${currentMonth} ${currentYear}`;
  }

  if (option === 'Leave') {
    return (
      <>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'space-between', backgroundColor: 'white', width: '83%', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, elevation: 2, shadowColor: 'gray' }}>
          <CircularProgress
            size={73}
            width={7}
            fill={percent}
            tintColor={color}
            backgroundColor="rgba(0, 0, 0, 0.1)"
            rotation={0}
            lineCap="square"
            onAnimationComplete={() => console.log('onAnimationComplete')}
            style={{ marginVertical: 5, marginLeft: 15 }}
          >
            {(fill) => (
              <Text style={{ fontSize: 14.5, color: color }}>{`${Math.round(fill)}%`}</Text>
            )}
          </CircularProgress>

          <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 23 }}>
            <Text style={{ fontSize: 14, marginBottom: 8, fontWeight: selectedLanguage === 'ar' ? '600' : '500' }}>{label}</Text>
            <Text style={{ fontSize: 12.2, color: 'gray' }}>{getCurrentMonthYear()}</Text>
          </View>
        </View>
      </>
    )
  }

  else {
    return (
      <>
        <View style={{ alignItems: 'center' }}>
          <CircularProgress
            size={73}
            width={7}
            fill={percent}
            tintColor={color}
            backgroundColor="rgba(0, 0, 0, 0.1)"
            rotation={0}
            lineCap="square"
            onAnimationComplete={() => console.log('onAnimationComplete')}
            style={{ marginBottom: 10 }}
          >
            {(fill) => (
              <Text style={{ fontSize: 14.5, color: color }}>{`${Math.round(fill)}%`}</Text>
            )}
          </CircularProgress>
          <Text style={{ fontSize: selectedLanguage === 'ar' ? 13.2 : 13, marginBottom: 8, fontWeight: selectedLanguage === 'ar' ? '600' : '500' }}>{label}</Text>
          <Text style={{ fontSize: selectedLanguage === 'ar' ? 12 : 12.2, color: 'gray' }}>{getCurrentMonthYear()}</Text>
        </View>
      </>
    )
  }
}