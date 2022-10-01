import { View, Text } from 'react-native'
import React from 'react'
import { store } from '../redux/store'
import { Provider,useSelector } from 'react-redux'
import Hero from './Hero'
import type { RootState } from '../redux/store'
import { useLink } from 'expo-router'

const index = () => {
  return (
    <Provider store={store}>
    <LocalHero/>
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