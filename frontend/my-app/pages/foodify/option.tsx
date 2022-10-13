import type {NextPage} from "next";
import React, {useState, useRef, MutableRefObject, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import {
    useAuthenticationStatus,
    useSignOut,
    useUserAvatarUrl,
    useUserDisplayName,
    useUserEmail,
    // useUserId
} from '@nhost/react'
import useUserId from "../../Components/useUserID";
import Link from "next/link";
import {useRouter} from "next/router";
import {useLocation} from "../../Components/useLocation";
import axios from "axios";
import Image from 'next/future/image'
import moment from 'moment';
import raderStyle from '../../styles/rader.module.css';

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
    const [pending,setPending] = useState<boolean|null>()
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
                fontSize:'larger',
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
        if(pending==null){
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
            {
  CUSTOMER_by_pk(USERID:"${userId}"){
  ORDERs(order_by:{
    created_at:desc
  }){
    ID
  }
  }
}
                `
                }
            }).then((data)=>{
                let Last_Order_Index ;
                console.log(data.data.data)
                if((data.data.data.CUSTOMER_by_pk.ORDERs.length>0)&&(data.data.data.CUSTOMER_by_pk.ORDERs[0].ID!=null)){
                Last_Order_Index = data.data.data.CUSTOMER_by_pk.ORDERs[0].ID
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
           {
  ORDER_by_pk(ID:"${Last_Order_Index}"){
    PICKED_BY
  }
}
                `
                        }
                    }).then((data1)=>{

                        if(data1.data.data.ORDER_by_pk.PICKED_BY==null){
                            setPending(prevState => true)
                        }else{
                            setPending(prevState => false)
                        }

                    })
                }else{
                    //assuing that null means the user is new
                    setPending(prevState => false)
                }
            })

            return <>
            <h1>Updating Index Please Wait</h1>
            </>
        }if(pending==true){
            return <>
                <div style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:"center"
                }}>

            <h1 style={{
                display:'inline'

            }}>
               Waiting for Volunteer to Accept Your Request      (Search Parameter <input style={{
                   width:"100px",
                fontSize:"larger",
                border:"none",
                background:"none",

            }} type={"number"} defaultValue={500}></input>m &lt;=)
            </h1>

                <button onClick={signOut} style={{
            display:"inline",
                    marginLeft:"30px",
                    fontSize:"x-large"
            }}>Sign Out</button>
                </div>


                <div className={raderStyle.radar}>

                    <div className={raderStyle.pointer}></div>
                    <div className={raderStyle.shadow}></div>
                </div>
            </>
        }else if (pending==false){
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
                        }} onClick={signOut} > Sign Out </button>
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
                    let orderID:String ;
                    const List_Size = FoodList.length
                    // const Food_List = {data:{FoodList}}

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
                    mutation {
                    insert_ORDER_one(object:{
                    LOCATION: "(${latitude},${longitude})"
                    POSTED_BY: "${userId}"
                    IMAGE_URL:"str_expaple"
                    }){
                    ID
                    }
                    }
                `
                        }
                    }).then((data)=>{
                        if(data.data.data.insert_ORDER_one.ID!=null){
                            orderID=  data.data.data.insert_ORDER_one.ID
                            FoodList.map((Food,index)=>{

                                // console.log(index+1,List_Size)

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
                            mutation {
                            insert_FOOD_UNIT_one(object:{
                            Order_Id: "${orderID}"
                            Food_Name: "${Food.foodType}"
                            Quantity: ${Food.Quantity}
                            DRY_WET: "${Food.DRY_WET}"
                            Feed_Amount: ${Food.Approximation}
                            }){
                              ID
                            }
                            }
                `
                                    }
                                })
                                    .then((Fooddata)=>{
                                        if(Fooddata.data.data.insert_FOOD_UNIT_one.ID!=null){
                                            if((index+1)==List_Size){
                                                setPending(prevState => true)
                                            }
                                        }else{
                                            console.warn("New Error Occured While Updating Food List")
                                        }
                                    }).catch((e)=>{
                                    console.warn("Error Updating Food List")
                                })
                            })
                        }else{
                            console.warn("Order ID Error")
                        }
                    }).catch((e)=>{
                        console.warn("Error Occured While Creating Order",e)
                    })


                }}>
                    Send Data
                </button>

            </>
        }



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