import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({ setUserToken, setUserData }) {
    return (
        <Stack.Navigator initialRouteName='login' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login">
                {props => <LoginScreen {...props} setUserToken={setUserToken} setUserData={setUserData} />}
            </Stack.Screen>
        </Stack.Navigator>
    )
}