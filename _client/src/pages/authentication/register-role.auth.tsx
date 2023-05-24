import { Button, Card, CardBody, CardFooter, CardHeader, Container, Flex, Heading, Image, Spacer, Text } from "@chakra-ui/react"
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import modelUser from "../../assets/model/undraw_People_re_8spw.png";
import modelTenant from "../../assets/model/undraw_Credit_card_payment_re_o911.png";
import modelAdmin from "../../assets/model/undraw_Software_engineer_re_tnjc.png";
import { ConfirmRegistration } from "../../components";
import { useState } from 'react';

function RegisterRole() {
  const [user, setUser, removeUser] = useLocalStorage<any>('user');
  const [isModalOpen, setModalOpen] = useState(false);

  const onAddRole = async (role: string) => {
    setUser({ ...user, role: role });
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  };

  const onGenerateRegistrationMessage = (role: string): string => {
    if(role === "USER") return "When users create an account, they gain access to various features and functionalities within the platform. By clicking on the 'Register' button, their provided information will be securely recorded and stored. Other users within the platform will be able to view their profile and interact with them based on the shared information. Users can leverage the platform's services, such as fund transfers, bill payments, and more, while also engaging with other users in a secure and convenient environment."
    if(role === "TENANT") return "As tenants create an account, they gain additional privileges and responsibilities within the platform. By registering, their profile and relevant details will be recorded and made visible to other users. This allows tenants to establish connections and interact with other users, such as managing fund transfers and facilitating bill payments. Additionally, tenants possess administrative capabilities, enabling them to oversee and manage user accounts within the platform. This includes tasks such as creating and updating user profiles, granting permissions, and ensuring smooth financial operations."
    if(role === "ADMIN")  return "As tenants create an account, they gain additional privileges and responsibilities within the platform. By registering, their profile and relevant details will be recorded and made visible to other users. This allows tenants to establish connections and interact with other users, such as managing fund transfers and facilitating bill payments. Additionally, tenants possess administrative capabilities, enabling them to oversee and manage user accounts within the platform. This includes tasks such as creating and updating user profiles, granting permissions, and ensuring smooth financial operations."

    return ""
  }
  
  return <>
    <ConfirmRegistration 
      isOpen={isModalOpen}
      onClose={closeModal}
      data={{...user, message: onGenerateRegistrationMessage(user.role)}}/>
    <Container maxW={"7xl"}>
      <Flex  mt={{ base: "10", md: "56"}}  gap={"6"}flexDir={{ base: "column", md: "row"}} opacity={0.95}>
        <Card flex={"1"}>
          <CardHeader>
            <Flex w={"full"} justifyContent={"center"}>
             <Image src={modelUser} alt={"User"} height={"52"}/>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text fontSize={"large"} fontWeight={"light"}>Users have the ability to perform various actions such as fund transfers, bill payments, and other similar transactions. They can interact with the system to manage their personal finances and make payments conveniently.</Text>
          </CardBody>
          <CardFooter>
            <Button w={"full"}  colorScheme={"facebook"} onClick={() => onAddRole("USER")}>Customer</Button>
          </CardFooter>
        </Card>  

        <Card flex={"1"}>
          <CardHeader>
            <Flex w={"full"} justifyContent={"center"}>
             <Image src={modelTenant} alt={"Tenant"} height={"52"}/>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text fontWeight={"light"}>Tenants possess additional privileges compared to regular users. In addition to fund transfers and bill payments, tenants have the authority to manage other users within the system. This includes tasks such as creating and updating user profiles, granting permissions, and overseeing fund transfers.</Text>
          </CardBody>
          <CardFooter>
          <Button w={"full"}  colorScheme={"facebook"} onClick={() => onAddRole("TENANT")}>Tenant</Button>
          </CardFooter>
        </Card>   

        <Card flex={"1"}>
          <CardHeader>
          <Flex w={"full"} justifyContent={"center"}>
             <Image src={modelAdmin} alt={"Admin"} height={"52"}/>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text  fontWeight={"light"}>Administrators hold higher-level access and responsibilities within the system. They have the capability to verify and authenticate users and tenants. Admins play a crucial role in ensuring the integrity and security of the platform by verifying the identities of users and tenants, performing necessary checks, and maintaining overall system governance.</Text>
          </CardBody>
          <CardFooter>
          <Button w={"full"} colorScheme={"facebook"} onClick={() => onAddRole("ADMIN")}>Admin</Button>
          </CardFooter>
        </Card>
      </Flex>
    </Container>
  </>
}

export default RegisterRole