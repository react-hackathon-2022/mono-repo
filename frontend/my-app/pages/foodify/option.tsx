import type {NextPage} from "next";
import React, {useState} from "react";

const Option:React.FC = ()=>{
    const [FoodList , setFoodList] = useState<Array<ListType>|null>()
    const [foodTypeInput , setfoodTypeInput] = useState<string>()
    const [QuantityInput , setQuantityInput] = useState<number>()
    const [DRY_WETInput , setDRY_WETInput] = useState<'DRY'|'WET'|string>()
    const [ApproximationInput , setApproximationInput] = useState<number>()
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
        {FoodList?.map((e)=>{
            return<>
                <div key={e.foodType.toString()} style={{
                    display: 'grid',
                    gridTemplateColumns: '230px 300px 200px auto'
                }}>
                    <div > {e.foodType} </div>
                    <div > {e.Quantity} </div>
                    <div > {e.DRY_WET} </div>
                    <div > {e.Approximation}</div>
                </div>
            </>
        })}
        <div style={{
            display: 'grid',
            gridTemplateColumns: '230px 300px 200px auto'
        }}>
            <input value={foodTypeInput} onChange={(e)=>{
                setfoodTypeInput(prev=>e.target.value)
            }} />
            <input value={QuantityInput} onChange={(e)=>{
                setQuantityInput(prev=>+(e.target.value))
            }} type={'number'}/>
            <input value={DRY_WETInput} onChange={(e)=>{
                setDRY_WETInput(prev=>e.target.value)
            }}/>
            <input value={ApproximationInput} onChange={(e)=>{
                    setApproximationInput(prev=>+e.target.value)
            }}/>
        </div>
        <button onClick={()=>{
            if((foodTypeInput!=undefined)&&(ApproximationInput!=undefined)&&(DRY_WETInput!=undefined)&&(QuantityInput!=undefined)){
            const FoodItem :ListType={
                foodType: foodTypeInput,
                Approximation: ApproximationInput,
                DRY_WET: DRY_WETInput,
                Quantity: QuantityInput
            }
            setFoodList(prev=>  prev!=undefined?[...prev,FoodItem]:null )
            }
        }}>
            Add More Data
        </button>

        </>)
    
}

export default Option