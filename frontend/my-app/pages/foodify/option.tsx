import type {NextPage} from "next";
import React, {useState, useRef, MutableRefObject} from "react";
import { v4 as uuidv4 } from 'uuid';

const Option:React.FC = ()=>{
    const FoodInputRef = useRef<HTMLInputElement>();
    const [FoodList , setFoodList] = useState<Array<ListType>>([])
    const [FoodTypeInput , setFoodTypeInput] = useState<string|null>()
    const [QuantityInput , setQuantityInput] = useState<number|null>()
    const [DRY_WETInput , setDRY_WETInput] = useState<'DRY'|'WET'|string|null>()
    const [ApproximationInput , setApproximationInput] = useState<number|null>()
    interface ListType {
        foodType:string,
        Quantity:number,
        DRY_WET: 'DRY'|'WET'|string,
        Approximation:number
    }
    return (<>
        <h1>Your Food Request</h1>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
        }}>
            <div style={{
                alignSelf: 'center'
            }}>
               Your Name:- <input/>
            </div>
            <div style={{
                alignSelf: 'center'
            }}>
                Date and Times:- <input type={"datetime-local"}/>
            </div>
            <div style={{
                alignSelf: 'center'
            }}>
                Address:- <input/>
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
            //TODO: FIX The Even occuring Key Prop before deploying
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

export default Option