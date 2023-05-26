import { Button, Container, Flex, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { HttpClient } from '../../utils/HttpClient';
import { GetAccountsApiResponse, Client, Tenant, ISubscriptionPlan } from '../../interface/http.interface';
import { HttpMethod } from '../../enum/http-methods.enum';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { useNavigate } from 'react-router-dom';


interface IState {
    clients: Client[],
    tenants: Tenant[]
}

function AdminDashboard() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>('token');
    const [state, setState] = useState<IState>({
        clients: [],
        tenants: []
    })

    const getClientAccounts = async () => {
        const options = { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };
        await HttpClient<GetAccountsApiResponse>(HttpMethod.GET, "/api/a/accounts/clients", null, options)
          .then((response) => {
              console.log("@getClientAccounts response -> ", response);
              setState((prev) => ({
                ...prev,
                clients: response.data as any,
            }));
          })
          .catch((error) => {
            console.log("@getClientAccounts error -> ", error.response?.data?.message)
          });  
    }
    const getTenantAccounts = async () => {
        const options = { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };
        await HttpClient<GetAccountsApiResponse>(HttpMethod.GET, "/api/a/accounts/tenants?verified=true", null, options)
            .then((response) => {
                console.log("@getClientAccounts response -> ", response);
                setState((prev) => ({
                    ...prev,
                    tenants: response.data as any,
                }));
            })
            .catch((error) => {
            console.log("@getClientAccounts error -> ", error.response?.data?.message)
            });  
    }
    const onLogout = () => {
        return navigate("/", { replace: true })
    }

    useEffect(() => {
        getClientAccounts();
        getTenantAccounts();
    }, [accessToken])
    
  return <>
    <Container mt={"10"} maxW={"7xl"}>
        <Flex justifyContent={"end"} >
            <Button variant={"outline"} onClick={() => onLogout()}>Sign out</Button>
        </Flex>
    </Container>
    <Container 
        maxW={"full"}
        display="flex"
        alignItems="center"
        justifyContent="center">
        <Tabs size='lg' variant='enclosed' w={"7xl"} mt={"10"}>
            <TabList>
                <Tab>Clients</Tab>
                <Tab>Tenants</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>First name</Th>
                                    <Th>Last name</Th>
                                    <Th>Present address</Th>
                                    <Th>Permanent address</Th>
                                    <Th>Birthdate</Th>
                                    <Th>Created at</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {state?.clients.map((v: Client) => {
                                    return <Tr key={v.id}>
                                        <Td>{v.first_name}</Td>
                                        <Td>{v.last_name}</Td>
                                        <Td>{v.present_address}</Td>
                                        <Td>{v.permanent_address}</Td>
                                        <Td>{v.birthdate}</Td>
                                        <Td>{v.created_at}</Td>
                                    </Tr>
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                    <TabPanel>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Company name</Th>
                                        <Th>Address</Th>
                                        <Th>Description</Th>
                                        <Th>Subscription plan</Th>
                                        <Th>Status</Th>
                                        <Th>Created at</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {state?.tenants.map((v: Tenant) => {
                                        const subscriptionPlan: ISubscriptionPlan = JSON.parse(v.subscription_plan as any);
                                        return <Tr key={v.id}>
                                            <Td>{v.company_name}</Td>
                                            <Td>{v.address}</Td>
                                            <Td>{v.description}</Td>
                                            <Td>
                                                <VStack>
                                                    <Text>METHOD: {subscriptionPlan.gateway}</Text>
                                                    <Text>CURRENCY: {subscriptionPlan.currency}</Text>
                                                    <Text>AMOUNT: {subscriptionPlan.amount}</Text>
                                                    <Text>STARTED AT: {subscriptionPlan.dateStarted}</Text>
                                                </VStack>
                                            </Td>
                                            <Td>{v.verified ? "Veified" : "Unverified"}</Td>
                                            <Td>{v.created_at}</Td>
                                        </Tr>
                                    })}
                                </Tbody>
                            </Table>
                    </TableContainer>                
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Container>
  </>
}

export default AdminDashboard