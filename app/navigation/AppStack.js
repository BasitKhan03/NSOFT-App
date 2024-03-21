import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import AttendancePreAdjustmentScreen from '../screens/AttendancePreAdjustmentScreen';
import AttendanceSummaryScreen from '../screens/AttendanceSummaryScreen';
import MonthlyTimesheetScreen from '../screens/MonthlyTimesheetScreen';
import MonthlyOvertimeScreen from '../screens/MonthlyOvertimeScreen';
import OrganizationAttendanceScreen from '../screens/OrganizationAttendanceScreen';
import LeaveStatisticsScreen from '../screens/LeaveStatisticsScreen';
import LeaveRequestScreen from '../screens/LeaveRequestScreen';
import LeaveApprovalScreen from '../screens/LeaveApprovalScreen';
import LeaveManagementScreen from '../screens/LeaveManagementScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import OrganizationStatisticsScreen from '../screens/OrganizationStatisticsScreen';
import SideDrawer from '../components/SideDrawer';

const Drawer = createDrawerNavigator();

export default function AppStack({ userToken, setUserToken, userData, setUserData }) {
    const { t } = useTranslation();
    const { selectedLanguage } = useLanguage();

    return (
        <Drawer.Navigator
            drawerContent={props => <SideDrawer {...props} userData={userData} setUserData={setUserData} setUserToken={setUserToken} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerStyle: { width: 270 },
                overlayColor: 'rgba(114, 151, 248, 0.4)',
                drawerLabelStyle: {
                    width: '135%',
                    marginLeft: -9,
                    fontSize: 13.5,
                    fontWeight: selectedLanguage === 'ar' ? '600' : '500',
                    alignSelf: selectedLanguage === 'ar' ? 'flex-end' : 'flex-start',
                    marginRight: selectedLanguage === 'ar' ? 15 : 0,
                    textAlign: selectedLanguage === 'ar' ? 'right' : 'left'
                },
                drawerActiveBackgroundColor: '#318CE7',
                drawerActiveTintColor: 'white',
                drawerInactiveTintColor: 'black',
                swipeEdgeWidth: Platform.OS === 'android' && 100
            }}
        >
            <Drawer.Screen name="Dashboard" options={{
                drawerLabel: t('appstack.dashboard'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="home" size={21} color={color} style={{ marginLeft: 6 }} />
                )
            }}
            >
                {props => <DashboardScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            {userData.accessGroup === 2 && <Drawer.Screen name="team" options={{
                drawerLabel: t('appstack.my-team'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="team" size={22} color={color} style={{ marginLeft: 6, marginRight: -1 }} />
                )
            }}
            >
                {props => <MyTeamScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>}

            {userData.accessGroup === 1 && <Drawer.Screen name="organizationstatistics" options={{
                drawerLabel: t('appstack.organization-statistics'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="team" size={22} color={color} style={{ marginLeft: 6, marginRight: -1 }} />
                )
            }}
            >
                {props => <OrganizationStatisticsScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>}

            <Drawer.Screen name="profile" options={{
                drawerLabel: t('appstack.profile'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="user" size={21} color={color} style={{ marginLeft: 6 }} />
                )
            }}
            >
                {props => <ProfileScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            <Drawer.Screen name="attendance" options={{
                drawerLabel: t('appstack.manual-punch'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="scan1" size={21} color={color} style={{ marginLeft: 6 }} />
                )
            }}>
                {props => <AttendanceScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            <Drawer.Screen name="preadjustment" options={{
                drawerLabel: t('appstack.pre-adjustment'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="form" size={19} color={color} style={{ marginLeft: 6, marginRight: 2, left: 0.5 }} />
                )
            }}>
                {props => <AttendancePreAdjustmentScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            {userData.accessGroup === 1 && <Drawer.Screen name="summary" options={{
                drawerLabel: t('appstack.attendance-summary'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="folderopen" size={19} color={color} style={{ marginLeft: 6, marginRight: 2, left: 0.4 }} />
                )
            }}>
                {props => <AttendanceSummaryScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>}

            <Drawer.Screen name="timesheet" options={{
                drawerLabel: t('appstack.monthly-timesheet'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="calendar" size={20} color={color} style={{ marginLeft: 6, marginRight: 1 }} />
                )
            }}>
                {props => <MonthlyTimesheetScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            <Drawer.Screen name="overtime" options={{
                drawerLabel: t('appstack.monthly-overtime'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="clockcircleo" size={19.5} color={color} style={{ marginLeft: 6, marginRight: 1.5 }} />
                )
            }}>
                {props => <MonthlyOvertimeScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            {userData.accessGroup === 1 && <Drawer.Screen name="organizationattendance" options={{
                drawerLabel: t('appstack.organization-attendance'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="layout" size={19} color={color} style={{ marginLeft: 6, marginRight: 2 }} />
                )
            }}>
                {props => <OrganizationAttendanceScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>}

            <Drawer.Screen name="leaverequest" options={{
                drawerLabel: t('appstack.leave-request'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="mail" size={20} color={color} style={{ marginLeft: 6, marginRight: 1 }} />
                )
            }}>
                {props => <LeaveRequestScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            {(userData.accessGroup === 2 || userData.accessGroup === 1) && <Drawer.Screen name="leaveapproval" options={{
                drawerLabel: t('appstack.leave-approval'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="book" size={20.5} color={color} style={{ marginLeft: 6, marginRight: 0.5, left: -0.3 }} />
                )
            }}>
                {props => <LeaveApprovalScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>}

            <Drawer.Screen name="leavestats" options={{
                drawerLabel: t('appstack.leave-statistics'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="barschart" size={21} color={color} style={{ marginLeft: 6 }} />
                )
            }}>
                {props => <LeaveStatisticsScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>

            {userData.accessGroup === 1 && <Drawer.Screen name="leavemanagement" options={{
                drawerLabel: t('appstack.leave-management'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="sharealt" size={19.5} color={color} style={{ marginLeft: 6, marginRight: 1.5 }} />
                )
            }}
            >
                {props => <LeaveManagementScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>}

            <Drawer.Screen name="settings" options={{
                drawerLabel: t('appstack.settings'),
                drawerIcon: ({ color }) => (
                    <AntDesign name="setting" size={21} color={color} style={{ marginLeft: 6 }} />
                )
            }}>
                {props => <SettingsScreen {...props} userToken={userToken} setUserToken={setUserToken} userData={userData} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    )
}