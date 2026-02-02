import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  CustomButton,
  CustomScrollView,
  CustomText,
  CustomTextInput,
} from '../../../components';

export default function Security() {
  const [phone, setPhone] = useState('');

  return (
    <CustomScrollView contentStyle={styles.container}>
      <CustomText style={styles.icon}>🛡️</CustomText>

      <CustomText fontSize={25} weight='bold' textAlignCenter color='#1a237e' style={styles.title}>Secure Verification</CustomText>
      <CustomText color='#555' weight='medium' style={styles.subtitle}>
        Your security is our top priority. Enter your mobile number to continue.
      </CustomText>

      <CustomTextInput
        containerStyle={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <CustomButton title="Send Otp" gradient />

      <CustomText style={styles.note}>
        We use advanced security to protect your property data.
      </CustomText>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  icon: {
    fontSize: 60,
    marginBottom: 10,
    flex: 1,
    textAlign: 'center',
  },
  title: {
    flex:1,
    alignSelf:'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
  },
  btn: {
    width: '100%',
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  note: {
    color: '#777',
    marginTop: 15,
    alignSelf:'center',
    flex:1,
    fontSize: 13,
    textAlign: 'center',
  },
});
