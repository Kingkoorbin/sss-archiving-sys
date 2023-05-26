import { Box, Button, Container, Flex, Heading, Icon, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { HttpClient } from '../../utils/HttpClient';
import { GetAccountsApiResponse, Client, Tenant, ISubscriptionPlan } from '../../interface/http.interface';
import { HttpMethod } from '../../enum/http-methods.enum';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { useNavigate } from 'react-router-dom';
import { SubscriptionCard } from '../../components';
import imgStripe from "../../assets/stripe.png";
import dayjs from "dayjs";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai"
import { SessionExpired } from '../../components/confirm-registration.component';

interface IState {
    clients: Client[],
    tenants: Tenant[],
    sessionExpired: boolean
}

function AdminDashboard() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>('token');
    const [state, setState] = useState<IState>({
        sessionExpired: false,
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
            if(error.response?.status === 401) {
                setState((prev) => ({
                    ...prev,
                    sessionExpired: true
                }));
                removeAccessToken();
            }
            console.log("@getClientAccounts error -> ", error.response?.data?.message)
          });  
    }
    const getTenantAccounts = async () => {
        const options = { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };
        await HttpClient<GetAccountsApiResponse>(HttpMethod.GET, "/api/a/accounts/tenants", null, options)
            .then((response) => {
                console.log("@getClientAccounts response -> ", response);
                setState((prev) => ({
                    ...prev,
                    tenants: response.data as any,
                }));
            })
            .catch((error) => {
                if(error.response?.status === 401) {
                    setState((prev) => ({
                        ...prev,
                        sessionExpired: true
                    }));
                    removeAccessToken();
                }
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
    <SessionExpired
        data={{ 
            message: "Oops! Please login again. ",
            email: "",
            mobileNumber:"",
            password:"",
            role:"",
            username:"",
        }}
        isOpen={state.sessionExpired || !accessToken}
        onClose={() => {}}
        onConfirm={() =>  navigate("/", { replace: true })}/>
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
                <Tab fontSize={"sm"} textTransform={"uppercase"}>Clients</Tab>
                <Tab fontSize={"sm"} textTransform={"uppercase"}>Tenants</Tab>
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
                                        <Td>{dayjs(v.birthdate).format("MMM DD YYYY")}</Td>
                                        <Td>{dayjs(v.created_at).format("MMM D dddd h:m A")}</Td>
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
                                        <Th>Verified</Th>
                                        <Th>Created at</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {state?.tenants.map((v: Tenant) => {
                                        const subscriptionPlan: ISubscriptionPlan = JSON.parse(v.subscription_plan as any);
                                        return <Tr key={v.id}>
                                            <Td>
                                                <Box 
                                                    overflow={"hidden"}
                                                    textOverflow={"ellipsis"}
                                                    maxW={"40"}>
                                                    <Heading>{v.company_name}</Heading>
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Box 
                                                    overflow={"hidden"}
                                                    textOverflow={"ellipsis"}
                                                    maxW={"20"}>
                                                        {v.address}
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Box 
                                                    overflow={"hidden"}
                                                    textOverflow={"ellipsis"}
                                                    maxW={"36"}>
                                                        {v.description}
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <SubscriptionCard
                                                        expiry={dayjs(subscriptionPlan.dateStarted).format("MMM D YYYY")}
                                                        image={imgStripe}
                                                        gateway={subscriptionPlan.gateway}/>
                                                    {/* <Text>{subscriptionPlan.gateway}</Text>
                                                    <Text>{subscriptionPlan.currency}</Text>
                                                    <Text>P{subscriptionPlan.amount}</Text>
                                                    <Text>{subscriptionPlan.dateStarted}</Text> */}
                                                </Box>
                                            </Td>
                                            <Td>{v.verified 
                                                ? <Icon as={AiFillCheckCircle} h={"14"} w={"14"}  color={"green.400"}/> 
                                                : <Icon as={AiFillCloseCircle} h={"14"} w={"14"}  color={"red.400"}/> }
                                            </Td>
                                            <Td>{dayjs(v.created_at).format("MMM D dddd h:m A")}</Td>
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