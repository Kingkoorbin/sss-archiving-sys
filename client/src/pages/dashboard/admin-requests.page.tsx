import { useEffect } from 'react';
import NavigationBarAdmin from '../../components/nav-admin.component';

function AdminRequests() {
  useEffect(() => {
    document.title = 'Requests | SSS Archiving System';
    return () => {};
  }, []);

  return (
    <>
      <NavigationBarAdmin />
    </>
  );
}

export default AdminRequests;
