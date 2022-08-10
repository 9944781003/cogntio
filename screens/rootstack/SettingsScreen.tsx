/* eslint-disable no-new */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import * as AWS from 'aws-sdk/global';
import AmazonCognitoIdentity, {
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

var authenticationData = {
  Username: 'arul12345@gmail.com',
  Password: 'Asdf@12345',
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
  authenticationData,
);
var poolData = {
  UserPoolId: 'eu-central-1_TWtMdQIWj', // Your user pool id here
  ClientId: 'c10fh8ci2svjliso1bca7og01', // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
  Username: 'arul12345@gmail.com',
  Pool: userPool,
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

export default function SettingsScreen() {
  const [session, setSession] = React.useState<CognitoUserSession>();

  React.useEffect(() => {
    if (!session) {
      cognitoUser.authenticateUser(authenticationDetails, {
        onFailure: console.error,
        onSuccess: setSession,
      });
    }
    return () => {
      if (cognitoUser) {
        cognitoUser?.signOut();
      }
    };
  }, [session]);
  return (
    <View>
      <Text>Session</Text>
      <Text>{cognitoUser?.getUsername()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
