import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

export default function CustomAlert(props) {
    return (
        <>
            <Modal style={{ flex: 0, top: '32.5%', width: '68%', height: '23%', alignSelf: 'center', elevation: 30, borderRadius: 17, backgroundColor: 'white', shadowColor: 'gray' }} animationType="fade" transparent={true} visible={props.alert}>

                <View style={{ position: 'absolute', top: 0, width: '100%', height: 38, backgroundColor: '#ADD8E6', borderTopLeftRadius: 17, borderTopRightRadius: 17 }} />

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ top: -18 }}>
                        {props.opt !== 'attendanceError' ? (<Image source={require('../assets/checkmark1.png')} style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 50 }} />) :
                            (<Image source={require('../assets/warning.png')} style={{ width: 35, height: 35, top: -2, marginBottom: 3 }} />)}
                    </View>

                    <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center', top: -9 }}>
                        <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#002D62' }}>{props.msg1}</Text>
                        <Text style={{ fontSize: 12.5, fontWeight: '400', color: 'gray', top: 1.5 }}>{props.msg2}</Text>
                    </View>


                    <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'center', top: 13 }}>
                        {props.opt === 'changepassword' && <TouchableOpacity style={{ width: 110, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.setUserToken(null) }}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Continue</Text>
                        </TouchableOpacity>}

                        {props.opt === 'applyleave' && <TouchableOpacity style={{ width: 110, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.toggleAlert2() }}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Continue</Text>
                        </TouchableOpacity>}

                        {props.opt === 'addleavetype' && <TouchableOpacity style={{ width: 110, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.toggleAlert2() }}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Continue</Text>
                        </TouchableOpacity>}

                        {props.opt === 'addleavereason' && <TouchableOpacity style={{ width: 110, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.toggleAlert2() }}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Continue</Text>
                        </TouchableOpacity>}

                        {props.opt === 'futureattendance' && <TouchableOpacity style={{ width: 110, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.toggleAlert2() }}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Continue</Text>
                        </TouchableOpacity>}

                        {props.opt === 'attendance' && <TouchableOpacity style={{ width: 110, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.toggleAlert(); props.toggleCameraModal(); }}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Continue</Text>
                        </TouchableOpacity>}

                        {props.opt === 'attendanceError' && <TouchableOpacity style={{ width: 110, backgroundColor: '#1E90FF', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { props.toggleAlert3(); }}>
                            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Continue</Text>
                        </TouchableOpacity>}
                    </View>

                </View>
            </Modal >
        </>
    )
}