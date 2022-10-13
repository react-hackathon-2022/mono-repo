import { useUserEmail } from "@nhost/react"
import {useState,useRef} from 'react'
import uuid from 'react-native-uuid';

function useUserId(){
    const userID = useRef<null|string | number[]>(null);
    const ROOT_CONFIG = 'root_admin';
    const userEmail = useUserEmail()
    if(userEmail)
    userID.current=(uuid.v5(userEmail,ROOT_CONFIG))
    return userID.current
}

export default useUserId