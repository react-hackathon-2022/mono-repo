import { View, Text ,Image, Button} from 'react-native'
import React from 'react'
import { store } from '../../../redux/store'
import { Provider,useSelector,useDispatch } from 'react-redux'
import type { RootState } from "../../../redux/store";
import { setAuthentication } from '../../../redux/VolunteerSlice';
import { persistor } from '../../../redux/store';
import { PersistGate } from "redux-persist/integration/react";



const Profile = () => {
  return (
    <Provider store={store}>
           <PersistGate loading={null} persistor={persistor}>
  <Hero/>
           </PersistGate>
  </Provider>
  )
}

const Hero = () =>{
    const dispatch = useDispatch()
    const [userEmail,useProfileUrl,userName,userAddress,userPhone] = useSelector((state:RootState) => [state.volunteer.EMAIL_ID,state.volunteer.PROFILE_URL,state.volunteer.NAME,state.volunteer.ADDRESS,state.volunteer.PHONE_NUMBER])
    console.log(useProfileUrl)
    console.log("Hello")
return (
<View>
    <Text style={{
        fontSize: 25,
        textAlign: 'center',
        margin: 30
    }}>You are Logged In As</Text>
    <View style={{
        alignItems: 'center'
    }}> 
    <Image source={{
        uri:useProfileUrl as any
    }} style={{
        width: 70,
        height: 70,
        borderRadius: 15,
        borderColor: 'brown',
        borderWidth:1
    }}/>
    <View >
        <Text style={{
            margin: 10,
            fontSize:30,
            fontWeight: '700',
        }}>
            Volunteer
        </Text>
    </View>
    <View style={{
        padding: 30,
        width: '80%',
        height: '70%',
        alignItems:'center',
        justifyContent: 'space-between'
    }}>
        <Text style={{
            fontSize: 20,
            margin: 10
        }}>
             {`Name :- ${userName}`}
        </Text>
        <Text style={{
            fontSize: 20,
            margin: 10
        }}>
             {`Email Address :- ${userEmail}`}
        </Text>
        <Text style={{
            fontSize: 20,
            margin: 10
        }}>
             {`Home Address :- ${userAddress}`}
        </Text>
        <Text style={{
            fontSize: 20,
            margin: 10
        }}>
             {`Phone Number :- ${userPhone}`}
        </Text>
        <Button title="Logout" onPress={()=>{
            dispatch(setAuthentication(false))
        }}/>

    </View>
    </View>
  </View>
)}

export default Profile