import Hero from "./Hero"
import {Provider} from 'react-redux'
import { store } from "../../../redux/store"

import { persistor } from '../../../redux/store'
import { PersistGate } from "redux-persist/integration/react";
const registration_fill = ({navigation,query}:any) => {
  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
    <Hero/>
       </PersistGate>
    </Provider>
  )
}
  
export default registration_fill