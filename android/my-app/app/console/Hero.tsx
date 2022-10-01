import axios from "axios";
import {
  StyleSheet,
  Modal,
  Text,
  View,
  Button,
  Pressable,
  Alert,
  TextInput,
  ToastAndroid
} from "react-native";
import { Link,useLink } from "expo-router";
import { useState } from "react";
import type { RootState } from "../../redux/store";
import {useDispatch } from 'react-redux'
import { setEmailPass } from "../../redux/VolunteerSlice";



export default function Hero() {
    const dispatch = useDispatch()
    const link = useLink();
    const [clickType, setclickType] = useState<type>()
    enum type{
      'signup',
      'singin'
    }
  
    const [emailInput, setemailInput] = useState<string>()
    const [passwordInput, setpasswordInput] = useState<string>()
    const [modalVisible, setModalVisible] = useState(false);
  
  
  
    return (
      <View style={styles.container}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          
          onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          {clickType === type.signup ? 
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Welcome New Volunteer</Text>
              <TextInput placeholder="Enter Email Address"  value={emailInput}  onChangeText={(e)=>{
                
                setemailInput(prev=>e)
            
              }}/>
              <TextInput placeholder="Enter Password" value={passwordInput} onChangeText={(e)=>{
         
                setpasswordInput(prev=>e)
          
              }}/>
              <View style={{
                margin: 20
              }}>
              <Button  onPress={()=>{
                if(emailInput!=undefined && passwordInput!=undefined){
                  axios({
                    url:'https://vanefmkgqsuxooyznwml.nhost.run/v1/graphql',
                    method: 'post',
                    headers: {
                      "content-type": "application/json",
                      "x-hasura-admin-secret": "71e169de5168161c212f9c71ec68e208"
                    },
                    data:{
                      "query": `mutation{
                        insert_VOLUNTEER_one(object:{
                          EMAIL_ID:"${emailInput}",
                          PASSWORD:"${passwordInput}"
                          REG_DONE: false
                        }){
                          REG_DONE
                        }
                      }`,
                    }
                  }).then((data)=>{
                    console.log(data)
                    const ErrorMatchingString = new RegExp('Uniqueness violation. duplicate key value violates unique constraint','g');
                    if(data.data.data!=undefined){
                      if(data.data.data.insert_VOLUNTEER_one.REG_DONE==false){
  
                        dispatch(setEmailPass({
                          EMAIL: emailInput,
                          PASSWORD: passwordInput
                        }))
  
                        // let c = alert("Signup Successful ,You Will be Navigated to Next Step Soon")
                        ToastAndroid.showWithGravity("Signup Successful ,You Will be Navigated to Next Step Soon",ToastAndroid.LONG, ToastAndroid.TOP);
                        setTimeout(()=>{
                          // link.push("/console/registration_fill")
                          link.push({
                            pathname: "/console/registration_fill",
                          })
                          
                        },3000)
                      }
                    }
                    else 
                    if(ErrorMatchingString.test(data.data.errors[0].message))
                    {
                      alert("Email Already Registered in Our System")
                    }
                  }).catch(e=>{
                    console.log(e)
                  })
                }else{
                  ToastAndroid.show("One or More Input Boxes can't be empty",ToastAndroid.LONG)
                }
              }}  title="Submit" />
              </View>
            </View>
          </View>
          
          :<View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>CREATE NEW ACCOUNT</Text>
            <TextInput placeholder="Enter Email Address"  value={emailInput}  onChangeText={(e)=>{
              if(e!=""){
              setemailInput(prev=>e)
              }
            }}/>
            <TextInput placeholder="Enter Password" value={passwordInput} onChangeText={(e)=>{
              if(e!= ""){
              setpasswordInput(prev=>e)
              }
            }}/>
            <View style={{
              margin: 20
            }}>
            <Button  onPress={()=>{
              if(emailInput!=undefined && passwordInput!=undefined){
                axios({
                  url:'https://vanefmkgqsuxooyznwml.nhost.run/v1/graphql',
                  method: 'post',
                  headers: {
                    "content-type": "application/json",
                    "x-hasura-admin-secret": "71e169de5168161c212f9c71ec68e208"
                  },
                  data:{
                    "query": `query{
                      VOLUNTEER_by_pk(EMAIL_ID:)
                    }`,
                  }
                }).then((data)=>{
                  console.log(data.data)
                }).catch(e=>{
                  if(e.data.insert_CUSTOMER_one.REG_DONE==false){
                    alert("SignIn Successful ,Please Continue Further")
                  }
                })
              }else{
                ToastAndroid.show("One or More Input Boxes can't be empty",ToastAndroid.LONG)
              }
            }}  title="Submit" />
            </View>
          </View>
        </View> }
         
        </Modal>
        <View style={styles.main}>
          <Pressable
            style={{
              margin: 20,
              borderWidth: 2,
              padding: 6,
              borderColor: "red",
            }}
            onPress={() => {
              setModalVisible(true);
              setclickType(type.signup)
            }}
          >
            <Text>Sign Up as New Volunteer</Text>
          </Pressable>
          <Pressable
            style={{
              margin: 20,
              borderWidth: 2,
              padding: 6,
              borderColor: "blue",
            }}
            onPress={()=>{
              setModalVisible(true);
              setclickType(type.singin)
            }}
          >
            <Text>SignIn as Existing Volunteer</Text>
          </Pressable>
  
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
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
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
  