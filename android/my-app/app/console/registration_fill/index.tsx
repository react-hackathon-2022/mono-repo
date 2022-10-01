import Hero from "./Hero"
import {Provider} from 'react-redux'
import { store } from "../../../redux/store"


const registration_fill = ({navigation,query}:any) => {
  return (
    <Provider store={store}>
    <Hero/>
    </Provider>

  )
}
  
export default registration_fill