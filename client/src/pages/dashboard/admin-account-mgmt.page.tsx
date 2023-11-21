import { useEffect } from 'react'
import { Button, Divider, Tabs } from 'antd';
import NavigationBarAdmin from "../../components/nav-admin.component";


const items = [
    {
        key: 1,
        label: `Staffs`,
        children: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore excepturi nesciunt ipsa fuga totam quia sint vero rerum dolores officia?",
    },
    {
        key: 2,
        label: `Employee`,
        children: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore excepturi nesciunt ipsa fuga totam quia sint vero rerum dolores officia?",
    }
];
function AdminAccountManagement() {
    useEffect(() => {
        document.title = "Account Management | SSS Archiving System";
        return () => { }
    }, [])
    return <>
        <NavigationBarAdmin />

        <div
            style={{
                padding: "50px"
            }}>
            <Tabs tabBarExtraContent={<Button>Registration</Button>} items={items as any} />
            <br />
            <br />
            <br />
            <div>You can also specify its direction or both side</div>
            <Divider />
            <div>AdminAccountManagement</div>
        </div>

    </>
}

export default AdminAccountManagement