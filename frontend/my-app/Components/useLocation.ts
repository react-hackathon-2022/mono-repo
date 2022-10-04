import {useEffect, useState} from "react";

export function useLocation(){
    const [location,setLocation] = useState<Array<Number>>([])
        useEffect(()=>{
            if(typeof window !== "undefined") {
                if ("geolocation" in navigator) {

                    navigator.geolocation.getCurrentPosition((position) => {
                        setLocation(prevState => [position.coords.latitude, position.coords.longitude])
                    })

                } else {
                    throw new Error("No Access to Location Given")
                }

            }

        },[])


return location



}
