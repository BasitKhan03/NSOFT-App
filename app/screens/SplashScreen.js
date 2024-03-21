import React from 'react';
import { View, Image } from 'react-native';

export default function SplashScreen() {
    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <Image source={require('../assets/splash.png')} style={{ resizeMode: 'contain', width: 700, height: 700, top: 15 }} />
            </View>
        </>
    )
}