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
import { Provider } from 'react-redux'
import { store } from "../../redux/store";
import Hero from "./Hero";

export default function consoleScreen() {
return(
<Provider store={store}>
<Hero/>
</Provider>

)
}