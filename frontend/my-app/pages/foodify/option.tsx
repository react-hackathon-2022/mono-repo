import type {NextPage} from "next";
import React, {useState, useRef, MutableRefObject, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import {
    useAuthenticationStatus,
    useSignOut,
    useUserAvatarUrl,
    useUserDisplayName,
    useUserEmail,
    useUserId
} from '@nhost/react'
import Link from "next/link";
import {useRouter} from "next/router";
import {useLocation} from "../../Components/useLocation";
import axios from "axios";
import Image from 'next/future/image'
import moment from 'moment';

const Option:React.FC = ()=>{
    const userAvatarUrl = useUserAvatarUrl()
    const userEmail = useUserEmail()
    const userId = useUserId()
    const userDisplayName = useUserDisplayName()
    const [latitude,longitude] = useLocation()
    const { signOut } = useSignOut()
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthenticationStatus()
    const FoodInputRef = useRef<HTMLInputElement>();
    const [FoodList , setFoodList] = useState<Array<ListType>>([])
    const [FoodTypeInput , setFoodTypeInput] = useState<string|null>()
    const [QuantityInput , setQuantityInput] = useState<number|null>()
    const [DRY_WETInput , setDRY_WETInput] = useState<'DRY'|'WET'|string|null>()
    const [ApproximationInput , setApproximationInput] = useState<number|null>()
    const [DateTimeInput,setDateTimeInput] = useState<string>(moment().format('MM Do, h:mm:ss a'))
    const [EmailAddressInput,setEmailAddressInput] = useState<string>()
    const [AddressInput,setAddressInput] = useState()
    const [userType , setUserType] = useState<"OLD"|"NEW"|null>(null)
    const [PhoneInput,setPhoneInput]= useState<string>()
    interface ListType {
        foodType:string,
        Quantity:number,
        DRY_WET: 'DRY'|'WET'|string,
        Approximation:number
    }
    useEffect(()=>{
        // const Timer_Input = setInterval(()=>{
            setDateTimeInput( moment().format('MM Do, h:mm:ss a'))
        // },1000)
        const emailTImePOut = setTimeout(()=>{
            setEmailAddressInput(userEmail)
        },300)
        // TODO:Remove Timer casuing Rerender of component


        return ()=>{
            // clearInterval(Timer_Input)
            clearTimeout(emailTImePOut)
        }
    },[])
    if (isLoading) {
        return <div>Checking Authenticating Status</div>
    }
    if (!isAuthenticated) {
        router.push('/foodify')
       return <>Authentication failed Redirecting to Home Page</>
    }else if(userType==null){
        axios({
            url:"https://vanefmkgqsuxooyznwml.nhost.run/v1/graphql",
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-hasura-admin-secret": "71e169de5168161c212f9c71ec68e208"
            },
            data:{
                "query":`
               query { 
CUSTOMER_by_pk(USERID:"${userId}"){
  USERID
}
}
                `
            }
        }).then((data)=>{
            // if()
          if(data.data.data.CUSTOMER_by_pk==null){
              setUserType(prev=>"NEW")
          }else if(data.data.data.CUSTOMER_by_pk.USERID!=null){
              setUserType(prev=>"OLD")
          }

        })
        return <>
        Verifying Credentials ..... Connecting to Server Backend
        </>
    }
    else if (userType=="NEW"){

        return <>
            <h1 style={{
                textAlign: 'center'
            }}>

        Welcome {userDisplayName}
            </h1>
                <h3 style={{
                    textAlign: 'center'
                }}>Looks Like you are new to our Service . Please Register Your Mobile Number to Continue</h3>

        <div style={{
        marginLeft: "auto", marginRight: "auto",
            width: "fit-content"
        }} >
            <input style={{
            width: "400px"
            }} type={"number"} value={PhoneInput||''} onChange={(e)=>{
            setPhoneInput(prev=>e.target.value)}
            } placeholder={"Enter Your Number Here"}/>
            <button style={{
                marginLeft:"10px"
            }} onClick={()=>{
                if(PhoneInput) {
                    axios({
                        url:"https://vanefmkgqsuxooyznwml.nhost.run/v1/graphql",
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            "x-hasura-admin-secret": "71e169de5168161c212f9c71ec68e208"
                        },
                        data:{
                            "query":
                                `
              mutation{
                insert_CUSTOMER_one(object:
                        {
                            USERID:"${userId}"
                            NAME:"${userDisplayName}"
                            ADDRESS:"(${latitude},${longitude})"
                            PHONE_NUMBER: ${+(PhoneInput)}
                            EMAIL: "${userEmail}"
                        })
                        {
                        USERID
                        }
                    }
                `
                        }
                    }).then((data)=>{
                        if(data.data.data.insert_CUSTOMER_one.USERID!=null){
                            window.alert("Thankyou for Contributing Towards a Better Future")
                            setUserType("OLD")

                        }
                    }).catch((e)=>{
                        console.warn(e)
                    })

                }else{
                    window.alert("Field Empty")
                }
            }
            }>
               Register
            </button>

            </div>
        </>

    }else if(userType=="OLD"){
        return <>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                marginBottom: '100px',
            }}>

                <h1 style={{
                    placeSelf: 'center'
                }}>Your Food Request</h1>

                <div style={{
                    width: 'fit-content',
                    display: 'flex',
                }}>
                    <Image src={userAvatarUrl as any} alt={"click me"} style={{
                        marginLeft: '40px',
                        marginRight: '40px',
                        borderRadius: '50px',
                        display: 'inline',
                        placeSelf:'center',
                        // margin: '30px',
                        height: 'fit-content',
                        width:'fit-content'
                    }} width={50} height={50} />


                    <button style={{
                        placeSelf: 'center',
                        width: '100px',
                        height: '40px'
                    }} onClick={signOut} > Sing Out </button>
                </div>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto',
            }}>
                <div style={{
                    alignSelf: 'center'
                }}>
                    Your Name:- <input value={userDisplayName}  readOnly={true}/>
                </div>
                <div style={{
                    alignSelf: 'center'
                }}>
                    Date and Times:- <input  value={DateTimeInput||''} readOnly={true}/>
                </div>
                <div style={{
                    alignSelf: 'center'
                }}>
                    Address:- <input value={AddressInput||''} placeholder={"Fetching Location ..."} readOnly={true}/>
                </div>
                <div style={{
                    alignSelf: 'center'
                }}>
                    Email Address:- <input value={EmailAddressInput||''} placeholder={'Fetching ...'} readOnly={true}/>
                </div>

            </div>
            <div>
                <input style={{
                    margin: '40px'
                }} type={"file"}/>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto auto auto'
            }} >
                <div>
                    Food Type
                </div>
                <div>
                    Quantity Left (KG)
                </div>
                <div>
                    DRY / WET
                </div>
                <div>
                    Please Enter The Approximate Amount
                    the People That can be feed on Quantity
                </div>
            </div>
            { /*   --------------------------------------------- */}
            {FoodList?.map((e,index)=>{
                //TODO: FIX The Even occurring Key Prop before deploying
                return<>
                    <div key={uuidv4()} style={{
                        display: 'grid',
                        gridTemplateColumns: '230px 300px 200px auto'
                    }}>
                        <div key={uuidv4()} > {e.foodType} </div>
                        <div key={uuidv4()} > {e.Quantity} </div>
                        <div  key={uuidv4()}> {e.DRY_WET} </div>
                        <div key={uuidv4()} > {e.Approximation}</div>
                    </div>
                </>
            })}
            { /*   --------------------------------------------- */}

            <div style={{
                display: 'grid',
                gridTemplateColumns: '230px 300px 200px auto',
                margin: '10px'
            }}>
                <input ref={FoodInputRef as MutableRefObject<HTMLInputElement>} placeholder={'Enter Food Name Here'} value={FoodTypeInput||''} onChange={(e)=>{
                    setFoodTypeInput(e.target.value)
                }} />
                <input value={QuantityInput||''} placeholder={"Enter Quantity here"} onChange={(e)=>{
                    setQuantityInput(+(e.target.value|| ''))
                }} type={'number'}/>
                <input value={DRY_WETInput || ''} placeholder={"Enter DRY or WET"} onChange={(e)=>{
                    setDRY_WETInput(e.target.value)
                }}/>
                <input onKeyDown={(e)=>{
                    if(e.code==='Enter'){
                        if((FoodTypeInput!=undefined)&&(ApproximationInput!=undefined)&&(DRY_WETInput!=undefined)&&(QuantityInput!=undefined)){
                            const FoodItem :ListType={
                                foodType: FoodTypeInput,
                                Approximation: ApproximationInput,
                                DRY_WET: DRY_WETInput,
                                Quantity: QuantityInput
                            }
                            setFoodList(prev=>[...prev,FoodItem])
                            FoodInputRef.current?.focus();
                            setFoodTypeInput(null)
                            setQuantityInput( null)
                            setDRY_WETInput(null)
                            setApproximationInput(null)
                        }
                    }

                }} value={ApproximationInput||''}  placeholder={'Enter Amount that could be eaten by old'}  onChange={(e)=>{

                    setApproximationInput(+e.target.value)
                }}/>
            </div>
            <button onClick={()=>{
                if((FoodTypeInput!=undefined)&&(ApproximationInput!=undefined)&&(DRY_WETInput!=undefined)&&(QuantityInput!=undefined)){
                    const FoodItem :ListType={
                        foodType: FoodTypeInput,
                        Approximation: ApproximationInput,
                        DRY_WET: DRY_WETInput,
                        Quantity: QuantityInput
                    }
                    setFoodList(prev=>[...prev,FoodItem])
                    FoodInputRef.current?.focus();
                    setFoodTypeInput(null)
                    setQuantityInput( null)
                    setDRY_WETInput(null)
                    setApproximationInput(null)
                }else{
                    window.alert("Empty Field Detected")
                }
            }}>
                Add More Data
            </button>
            <button style={{
                marginTop: '50px',
                display: 'block'
            }} onClick={()=>{
                const AddressInput= 'Bagunhatu'
                const order_ID = uuidv4()
                const user_Name = userDisplayName
                const user_Email = userEmail
                const user_ID = userId
                const Date_Time = DateTimeInput
                const Food_List = {data:{FoodList}}

                    console.log(user_ID,Food_List,Date_Time,AddressInput)

//                 axios({
//                     url:"https://vanefmkgqsuxooyznwml.nhost.run/v1/graphql",
//                     method: "POST",
//                     headers: {
//                         "content-type": "application/json",
//                         "x-hasura-admin-secret": "71e169de5168161c212f9c71ec68e208"
//                     },
//                     data:{
//                         "query":`
//                         mutation{
//   insert_ORDER_one(object:{
//                         FOOD_LIST:"Dhanajay"
//                           }){
//     ID
//   }
// }
//                         `
//                     }
//                 }).then((data)=>{
//                     console.log(data)
//                 })

            }}>
                Send Data
            </button>

        </>
    }

    /*
        //TODO:UpdateLocationHere
        // axios({
        //     url:`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=86b702a7ea524bd488c7c20313a50bfd`,
        //     method: 'GET'
        // }).then((e)=>{
        //
        //     setAddressInput(e.data.results[0].formatted.replace(/unnamed road,/g,''))
        // }).catch((e)=>{
        //     console.warn(e)
        // })
        // console.log(uuidv4())



*/
    return <>
        <h1>
            Service Failed
        </h1>
    </>

    
}

export default Option