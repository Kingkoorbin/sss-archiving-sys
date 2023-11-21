import { useEffect } from 'react'
import NavigationBarAdmin from "../../components/nav-admin.component";

function AdminDashboard() {

  useEffect(() => {
    document.title = "Dashboard | SSS Archiving System";
    return () => {}
  }, [])
  
  return <>
      <NavigationBarAdmin />
  </>
}

export default AdminDashboard