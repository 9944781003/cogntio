/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-new */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import React from 'react';
// Using ES6 modules

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserPoolData,
  ISignUpResult,
} from 'amazon-cognito-identity-js';

var authenticationData = {
  Username: 'arul0427@gmail.com',
  Password: 'Asdf@123$',
};
var authenticationDetails = new AuthenticationDetails(authenticationData);
var poolData: ICognitoUserPoolData = {
  UserPoolId: 'eu-central-1_TWtMdQIWj', // Your user pool id here
  ClientId: 'c10fh8ci2svjliso1bca7og01', // Your client id here
};
var userPool = new CognitoUserPool(poolData);

var cognitoUser = new CognitoUser({
  Pool: userPool,
  Username: 'arul0427@gmail.com',
});

export default function App() {
  const [visible, setVisible] = React.useState(false);
  const [timeout, setTimeout] = React.useState<Date>();

  function _signup() {
    let emailAttribute = new CognitoUserAttribute({
      Name: 'email',
      Value: 'arul0427@gmail.com',
    });
    let phoneAttribute = new CognitoUserAttribute({
      Name: 'phone_number',
      Value: '+919944781003',
    });
    userPool.signUp(
      emailAttribute.Value,
      'Asdf@123$',
      [emailAttribute, phoneAttribute],
      [],
      handleSignupCallback,
    );
  }

  function _login() {
    if (!cognitoUser?.getSignInUserSession()) {
      cognitoUser?.authenticateUser(authenticationDetails, {
        onFailure: console.error,
        onSuccess: session => {
          cognitoUser?.setSignInUserSession(session);
          Alert.alert('Logged in successfully ');
        },
      });
    } else {
      Alert.alert('Already Logged in ');
    }
  }

  function _session() {
    let user = new CognitoUserPool(poolData)?.getCurrentUser();
    if (!user) {
      Alert.alert('You dont have active session');
      return;
    }

    user?.getSession((error: Error, session: CognitoUserSession | null) => {
      if (error) {
        console.error(error);
        return;
      }
      let time = session?.getIdToken()?.getExpiration();
      if (time) {
        setTimeout(new Date(time * 1000));
      }
      console.log('time', time);
      if (session) {
        console.log('isValid', session?.isValid());
        console.log(session?.getRefreshToken()?.getToken());
      }
    });
  }
  function _refresh() {
    let token = cognitoUser?.getSignInUserSession()?.getRefreshToken();
    if (token) {
      cognitoUser?.refreshSession(token!, result => {
        console.log('Token refreshed');
      });
    } else {
      Alert.alert('YOu dont have active session');
    }
  }
  function _logout() {
    Alert.alert('Are you want to signout', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          userPool?.getCurrentUser()?.signOut(() => {
            // navigation
          });
        },
      },
    ]);
  }
  function handleSignupCallback(error?: Error, iSignUpResult?: ISignUpResult) {
    if (error) {
      error.name === 'UsernameExistsException'
        ? verifyPhone(cognitoUser)
        : Alert.alert(error.message);
      return;
    }
    if (iSignUpResult) {
      iSignUpResult?.userConfirmed
        ? Alert.alert('User is already confirmed')
        : verifyPhone(iSignUpResult.user);
    }
  }

  function verifyPhone(user: CognitoUser) {
    cognitoUser?.resendConfirmationCode((error, success) => {
      if (error) {
        Alert.alert(error.message);
        return;
      }
      setVisible(true);
    });
  }
  function confirmRegistration(otp: string) {
    console.log('otp', otp);
    cognitoUser.confirmRegistration(otp, true, (error: Error, success) => {
      if (error) {
        console.log('confirmRegistration err===', error);
        setVisible(false);
        return;
      }
      console.log('confirmRegistration success==', success);
      setVisible(false);
    });
  }

  return (
    <React.Fragment>
      <Prompt
        visible={visible}
        setVisible={setVisible}
        onSubmit={confirmRegistration}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={[styles.btn]} onPress={_signup}>
          <Text style={[styles.caption]}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={_login}>
          <Text style={[styles.caption]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={_session}>
          <Text style={[styles.caption]}>Session</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={_refresh}>
          <Text style={[styles.caption]}>refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={_logout}>
          <Text style={[styles.caption]}>logout</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.footer]}>
        <Text
          style={{
            color: '#FFF',
            fontStyle: 'italic',
            fontSize: 22,
            textAlign: 'center',
          }}>{`timeout ${timeout?.toLocaleTimeString()}`}</Text>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 300,
    height: 50,
    margin: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#76a47b',
  },
  caption: {
    fontStyle: 'italic',
    color: '#FFF',
    fontSize: 22,
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 50,
    backgroundColor: '#76a47b',
    bottom: 0,
  },
});

type Props = ViewProps & {
  onSubmit: (otp: string) => void;
  visible: boolean;
  setVisible: (props: boolean) => void;
};

function Prompt(props: Props) {
  const [text, settext] = React.useState('');
  return (
    <Modal
      visible={props.visible}
      children={
        <View
          style={{
            flex: 1,
            backgroundColor: '#88666666',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 8,
          }}>
          <View
            style={{
              height: 200,
              width: '100%',
              backgroundColor: '#FFF',
              elevation: 5,
              justifyContent: 'space-around',
              paddingHorizontal: 16,
            }}>
            <View>
              <Text style={{fontSize: 18, color: 'green'}}>
                You have received your OTP in SMS
              </Text>
            </View>
            <TextInput
              onChangeText={settext}
              style={{
                borderWidth: 1,
                width: '100%',
                borderRadius: 8,
                marginHorizontal: 8,
                alignSelf: 'center',
                fontSize: 22,
              }}
              placeholder="Enter OTP"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity onPress={() => props.setVisible(false)}>
                <Text style={{fontSize: 22, color: 'green', margin: 8}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (text.length !== 6) {
                    Alert.alert('otp must be 6 digit number');
                    return;
                  }
                  props.onSubmit(text);
                }}>
                <Text style={{fontSize: 22, color: 'green', margin: 8}}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}
