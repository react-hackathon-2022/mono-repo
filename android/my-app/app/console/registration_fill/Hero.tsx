import { View, Text,StyleSheet,StatusBarStyle, TextInput, Button, ToastAndroid } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'react-native'
import { useState } from 'react'
import axios from 'axios'
import { useLink } from 'expo-router'
import type { RootState } from '../../../redux/store' 
import { useSelector,useDispatch } from 'react-redux'
import { setAuthentication,setProfileUrl,setVolunteerInfo } from '../../../redux/VolunteerSlice'

const Hero = () => {
  const link = useLink();
  const dispatch = useDispatch()
    const volunteerEmail = useSelector((state:RootState)=>state.volunteer.EMAIL_ID)

    const [InputnameHolder, setInputnameHolder] = useState<string>()
    const [PhoneNumberInput, setPhoneNumberInput] = useState<Number>()
    const [AdresssInput, setAdresssInput] = useState<string>()
    return (
      <View style={styled.container}>
        <StatusBar style="auto" />
  <View style={styled.main}>
  <TextInput placeholder='Name' value={InputnameHolder} onChangeText={(e)=>{
      setInputnameHolder(prev=>e)
  }}/>
  <TextInput placeholder='Phone Number' value={PhoneNumberInput?.toString()} onChangeText={(e)=>{
      setPhoneNumberInput(prev=>(+e))
  }} />
  <TextInput placeholder='Address' value={AdresssInput} onChangeText={(e)=>{
      setAdresssInput(prev=>e)
  }}/>
  <Button title='Submit' onPress={()=>{
    if((InputnameHolder!=undefined && InputnameHolder!="" && InputnameHolder!=null) && (PhoneNumberInput!=undefined && PhoneNumberInput!=0 && PhoneNumberInput!=null) && (AdresssInput!=undefined && AdresssInput!="" && AdresssInput!=null)){
      axios({
        url: "https://vanefmkgqsuxooyznwml.nhost.run/v1/graphql",
        method: 'post',
        headers:{
          "content-type": "application/json",
          "x-hasura-admin-secret": "71e169de5168161c212f9c71ec68e208"
        },
        data:{
          query:`mutation{
            update_VOLUNTEER_by_pk(pk_columns:{
              EMAIL_ID:"${volunteerEmail}"
            }
            _set:{
              NAME:"${InputnameHolder}"
              PHONE_NUMBER: ${+(PhoneNumberInput)}
              ADDRESS: "${AdresssInput}"
              REG_DONE:true
              PROFILE_URL: "https://ui-avatars.com/api/?background=random&name=${(InputnameHolder.replace((/ /g),'+')).toString()}"
              ORDER_DONE: 0
            }
            ){
              REG_DONE
            }
          }`
  
        }
      }).then((data=>{
        console.log(data.data.data.update_VOLUNTEER_by_pk.REG_DONE==true)
        dispatch(setAuthentication(true))
        dispatch(setProfileUrl(InputnameHolder))
        dispatch(setVolunteerInfo({
          ADDRESS: AdresssInput,
          NAME: InputnameHolder,
          PHONE_NUMBER: PhoneNumberInput
        }))
        ToastAndroid.showWithGravity("Registration Successful",ToastAndroid.LONG,ToastAndroid.CENTER)
        setTimeout(()=>{
          link.push("/menu")

        },3000)
       
      })).catch((e)=>{
        console.log("An Error Occured",e)
      })
    }else{
      ToastAndroid.show("Please Fill All The Fields",ToastAndroid.LONG)
    }
  
  }} />
       </View>
       
      </View>
    )
  }
  
  
  const styled = StyleSheet.create({
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
    }})
  
export default Hero