import Link from "next/link";
import { useProviderLink } from '@nhost/react'
const Index:React.FC = () =>{
    const {google } = useProviderLink()

    return (<>
        <div style={{
            display: 'grid',
            height:'100vh'
        }}>
            <div style={{
                placeSelf:'center'
            }}>

        <Link href={google} style={{

        }}
      >
            <div style={{
                margin:'30px',
                fontSize:'xxx-large',
                cursor: 'pointer'
            }}>

            Start Here
            </div>
        </Link>
        <button  style={{
            margin:'30px',
            fontSize:'xxx-large'
        }}> Volunteer</button>
        </div>
            </div>
        </>)
}

export default Index