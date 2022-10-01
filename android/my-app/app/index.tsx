import { View, Text } from 'react-native'
import React from 'react'
import { store } from '../redux/store'
import { Provider,useSelector } from 'react-redux'
import Hero from './Hero'
import type { RootState } from '../redux/store'
import { useLink } from 'expo-router'
import { persistor } from '../redux/store'
import { PersistGate } from "redux-persist/integration/react";

const index = () => {
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
    <LocalHero/>
        </PersistGate>
    </Provider>
  )
}

const LocalHero:React.FC = () =>{
    const link = useLink()
    const isAutheticated = useSelector((state:RootState) => state.volunteer.LOGGED_IN)
    return <>
    {isAutheticated==true?link.push("/menu"):<Hero/>}
    </>
}

export default index