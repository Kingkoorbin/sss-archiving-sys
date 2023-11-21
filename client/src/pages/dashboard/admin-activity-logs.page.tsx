import { useEffect } from 'react'
import NavigationBarAdmin from "../../components/nav-admin.component";

function AdminActivityLogs() {

    useEffect(() => {
        document.title = "Activity Logs | SSS Archiving System";
        return () => {}
      }, [])
      
      return <>
          <NavigationBarAdmin />
      </>
      
}

export default AdminActivityLogs