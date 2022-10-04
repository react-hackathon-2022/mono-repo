import Link from "next/link";
import { useProviderLink } from '@nhost/react'
const Index:React.FC = () =>{
    const {google } = useProviderLink()

    return (<>
        <Link href={google}
      >
            Start Here
        </Link>
        <button > Volunteer</button>
        </>)
}

export default Index