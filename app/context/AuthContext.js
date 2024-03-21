import React, { createContext, useState, useContext } from 'react';
import { Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { CURRENT_HOST } from '../config/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState({
        employeeID: '',
        employeeCode: '',
        firstName: '',
        lastName: '',
        accessGroup: '',
        picture: null
    });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [invalidText, setInvalidText] = useState('');
    const [error, setError] = useState({
        usernameErr: false,
        passwordErr: false,
    });

    const { t } = useTranslation();

    const handleLogin = async () => {
        Keyboard.dismiss();
        setShow(false);

        if (username === '' || password === '') {
            if (username === '') {
                setError(prevState => ({ ...prevState, usernameErr: true }));
            }
            if (password === '') {
                setError(prevState => ({ ...prevState, passwordErr: true }));
            }
        }

        else {
            try {
                setInvalid(false);
                setLoading(true);

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

                        try {
                            await AsyncStorage.setItem('username', username);
                            await AsyncStorage.setItem('password', password);
                        } catch (error) {
                            console.error('Error saving login info to AsyncStorage:', error);
                        }

                        setUsername('');
                        setPassword('');
                        setInvalid(false);
                        setInvalidText('');
                        setLoading(false);
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
                        setLoading(false);

                        e.message === 'API request timed out.' && setInvalidText(t('login.invalid-text-2'));
                        e.message === 'Network Error' && setInvalidText(t('login.invalid-text-2'));
                        e.message === 'Request failed with status code 400' && setInvalidText(t('login.invalid-text-1'));
                        e.message === 'Request failed with status code 401' && setInvalidText(t('login.invalid-text-1'));

                        setInvalid(true);
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
    };

    return (
        <AuthContext.Provider value={{ userToken, setUserToken, userData, setUserData, username, setUsername, password, setPassword, loading, setLoading, invalid, setInvalid, invalidText, setInvalidText, error, setError, show, setShow, handleLogin }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}