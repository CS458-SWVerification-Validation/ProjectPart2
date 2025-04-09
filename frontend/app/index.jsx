import * as AuthSession from 'expo-auth-session'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Button, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'

import splashImg from "@/assets/images/splash_page_bck.jpg"

const App = () => {

  const url = Linking.useLinkingURL()

  const handleLogin = () => {
    const redirectUri = encodeURIComponent('https://192.168.1.103:5000/auth/callback')
    const finalUri = encodeURIComponent('myapp://auth')
    Linking.openURL(`https://validsoftware458.com.tr:8443/auth/login`)
  }

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync('https://validsoftware458.com.tr:8443/auth/login');
  };

  const handleLoginPress = () => {
    console.log({url})
    if (url) {
      createSessionFromUrl(url)
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={splashImg}
        resizeMode='cover'
        style={styles.image}
      >
        <Text style={styles.text}>Welcome</Text>
        <Button style={styles.button} title='Login' onPress={_handlePressButtonAsync}/>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 120
  },
  link: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: 'underline',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4
  },
  button: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 4
  }
})

export default App