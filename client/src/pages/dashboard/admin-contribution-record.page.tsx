import { useEffect } from 'react'
import NavigationBarAdmin from "../../components/nav-admin.component";

export default function AdminContributionRecord() {

    useEffect(() => {
        document.title = "Contributions | SSS Archiving System";
        return () => { }
    }, [])

    return <>
        <NavigationBarAdmin />
    </>
}
