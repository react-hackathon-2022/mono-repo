import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NhostClient } from '@nhost/nhost-js'

export default function App() {

  const nhost = new NhostClient({
    region:'ap-south-1',
    subdomain:'ap-south-1'
  })


    
  

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <View>
        <Button title='Click me To Login Into Google' onPress={()=>{
          nhost.auth.signIn({
            provider: 'google'
          }).then((d)=>{
            console.log(d)
          }).catch((e)=>{
            console.log(e)
          })
        }}/>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
