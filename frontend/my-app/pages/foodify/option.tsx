import type {NextPage} from "next";
import React, {useState, useRef, MutableRefObject} from "react";
import { v4 as uuidv4 } from 'uuid';
import {useAuthenticationStatus, useSignOut, useUserAvatarUrl, useUserDisplayName, useUserId} from '@nhost/react'
import Link from "next/link";
import {useRouter} from "next/router";
import {useLocation} from "../../Components/useLocation";
import axios from "axios";
import Image from 'next/future/image'



const Option:React.FC = ()=>{
    const userAvatarUrl = useUserAvatarUrl()
    const [latitude,longitude] = useLocation()
    const { signOut } = useSignOut()
    const userId = useUserId()
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthenticationStatus()
    const userDisplayName = useUserDisplayName()
    const FoodInputRef = useRef<HTMLInputElement>();
    const [FoodList , setFoodList] = useState<Array<ListType>>([])
    const [FoodTypeInput , setFoodTypeInput] = useState<string|null>()
    const [QuantityInput , setQuantityInput] = useState<number|null>()
    const [DRY_WETInput , setDRY_WETInput] = useState<'DRY'|'WET'|string|null>()
    const [ApproximationInput , setApproximationInput] = useState<number|null>()
    const [DateTimeInput,setDateTimeInput] = useState()
    const [EmailAddressInput,setEmailAddressInput] = useState()
    const [AddressInput,setAddressInput] = useState()
    const [PhoneInput,setPhoneInput]= useState()
    interface ListType {
        foodType:string,
        Quantity:number,
        DRY_WET: 'DRY'|'WET'|string,
        Approximation:number
    }
    if (isLoading) {
        return <div>Checking Authenticating Status</div>
    }
    if (!isAuthenticated) {
        router.push('/foodify')
       return <>Authentication failed Redirecting to Home Page</>
    }else {

        axios({
            url:`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=86b702a7ea524bd488c7c20313a50bfd`,
            method: 'GET'
        }).then((e)=>{
            setAddressInput(e.data.results[0].formatted.replace(/unnamed road,/g,''))
        }).catch((e)=>{
            console.warn(e)
        })

        return (<>
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
                    Date and Times:- <input type={"datetime-local"}/>
                </div>
                <div style={{
                    alignSelf: 'center'
                }}>
                    Address:- <input value={AddressInput||''} placeholder={"Fetching Location ..."} readOnly={true}/>
                </div>
                <div style={{
                    alignSelf: 'center'
                }}>
                    Phone Number:- <input/>
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
            {/*    ---------------------------------------------*/}
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
            {/*    ---------------------------------------------*/}

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

        </>)

    }


    
}

export default Option