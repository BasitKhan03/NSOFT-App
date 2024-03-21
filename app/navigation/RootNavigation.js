import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LanguageProvider } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { CURRENT_HOST } from '../config/config';
import SplashScreen from '../screens/SplashScreen';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigation() {
    const { userToken, setUserToken, userData, setUserData } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStoredCredentials = async () => {
            try {
                const username = await AsyncStorage.getItem('username');
                const password = await AsyncStorage.getItem('password');

                if (username && password) {
                    try {
                        const timeout = 10000;
                        const response = await Promise.race([
                            axios.post(`${CURRENT_HOST}/auth/login`, {
                                username,
                                password
                            }),
                            new Promise((_, reject) =>
                                setTimeout(() => {
                                    reject(new Error('API request timed out.'));
                                }, timeout)
                            ),
                        ])
                            .then(async res => {
                                console.log('Login Successfully');

                                setUserToken(res.data.token);
                                setUserData(prevState => ({
                                    ...prevState,
                                    employeeID: res.data.EmployeeId,
                                    employeeCode: res.data.employee_code,
                                    firstName: res.data.first_name,
                                    lastName: res.data.last_name,
                                    accessGroup: res.data.access_group,
                                    picture: res.data.photograph
                                }));
                            })
                            .catch(e => {
                                setUserToken(null);
                                setUserData(prevState => ({
                                    ...prevState,
                                    employeeID: '',
                                    employeeCode: '',
                                    firstName: '',
                                    lastName: '',
                                    accessGroup: '',
                                    picture: null
                                }));
                                console.log(e);
                            })
                    }
                    catch (e) {
                        console.log(e);
                        setUserToken(null);
                        setUserData(prevState => ({
                            ...prevState,
                            employeeID: '',
                            employeeCode: '',
                            firstName: '',
                            lastName: '',
                            accessGroup: '',
                            picture: null
                        }));
                    }
                }

            } catch (error) {
                console.error('Error loading language from AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        };

        checkStoredCredentials();
    }, []);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <>
            <LanguageProvider>
                <NavigationContainer>
                    {userToken ?
                        <AppStack userToken={userToken} setUserToken={setUserToken} userData={userData} setUserData={setUserData} />
                        :
                        <AuthStack userToken={userToken} setUserToken={setUserToken} userData={userData} setUserData={setUserData} />
                    }
                </NavigationContainer>
            </LanguageProvider>
        </>
    )
}