import axios from "axios";
import { StyleSheet, Text, View ,Button} from "react-native";
import {Link} from 'expo-router'



export default function Hero() {  
  return (
    <View style={styles.container}>
      <View style={styles.main}>
      <Link style={{
                margin: 20,
                textAlign: 'center',
                borderWidth: 2,
                padding: 6,
                borderColor: 'red',
      }} href={"/console"} >Move to Console</Link>
          <Link style={{
        margin: 20,
        textAlign: 'center',
        borderWidth: 2,
        padding: 6,
        borderColor: 'blue',
      }} href={"/console"} >Start</Link>
      {/* <Button title="Click me" onPress={() => 
      axios({
        url:'https://vanefmkgqsuxooyznwml.nhost.run/v1/graphql',
        method: 'post',
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret": "71e169de5168161c212f9c71ec68e208"
        },
        data:{
          "query": `query{
            CUSTOMER{
              NAME
            }
          }`,
          "variables": {}
        }
      }).then((data)=>{
        console.log(data.data.data)
      }).catch(e=>{
        console.log(e)
      })
      

      } /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
