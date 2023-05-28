import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import modelUser from '../../assets/model/undraw_People_re_8spw.png';
import modelTenant from '../../assets/model/undraw_Credit_card_payment_re_o911.png';
import modelAdmin from '../../assets/model/undraw_Software_engineer_re_tnjc.png';
import { ConfirmRegistration } from '../../components';
import { useState } from 'react';
import { HttpClient } from '../../utils/HttpClient';
import { HttpMethod } from '../../enum/http-methods.enum';
import { IRegistrationLocalStorage } from '../../interface';
import { useNavigate } from 'react-router-dom';
import { TRegistrationResponse } from '../../interface/auth.interface';
import { Role } from '../../interface/roles.interface';

function RegisterRole() {
  const [user, setUser, removeUser] = useLocalStorage<
    IRegistrationLocalStorage | any
  >('user');
  const [accessToken, setAccessToken, removeAccessToken] =
    useLocalStorage<string>('token');

  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const onAddRole = async (role: string) => {
    setUser({ ...user, role: role });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onGenerateRegistrationMessage = (role: string): string => {
    if (role === Role.USER)
      return "As a user, you have the privilege to create an account and access our platform's basic functionalities. Enjoy the convenience of browsing and interacting with the available features tailored to enhance your experience. While you may have limited administrative control, you can utilize our services, explore content, and engage with other users within the defined scope of your privileges.";
    if (role === Role.TENANT)
      return 'By selecting the "TENANT" role, you gain exclusive privileges related to rental or leasing systems. Take advantage of specialized features designed to streamline your tenancy experience. Explore rental listings, submit maintenance requests, make rental payments, and communicate seamlessly with landlords or property managers. Your role as a tenant empowers you to actively participate in property management processes, ensuring a smooth and hassle-free tenancy.';
    if (role === Role.ADMIN)
      return 'As an administrator, you hold significant authority and responsibility within our application or platform. With elevated privileges, you gain access to powerful tools and administrative interfaces. Manage user accounts, moderate content, configure system settings, and enforce policies to maintain the integrity and security of the platform. Your role as an admin is pivotal in ensuring the smooth operation of the system and providing a seamless experience for all users.';

    return '';
  };

  const onRegisterUser = async (
    payload: IRegistrationLocalStorage
  ): Promise<void> => {
    if (!['USER', 'TENANT', 'ADMIN'].includes(payload.role))
      return navigate('/register');

    await HttpClient<TRegistrationResponse>(HttpMethod.POST, '/api/register', {
      ...payload,
      phone_number: payload.mobileNumber,
    })
      .then((response) => {
        console.log('@onRegisterUser response -> ', response);
        setAccessToken(response.data.access_token);
        toast({
          colorScheme: 'facebook',
          description: response.message,
          position: 'bottom',
          duration: 2000,
          onCloseComplete: async () => {
            if (payload.role === Role.ADMIN) {
              const token = response.data.access_token;
              navigate(
                `/a/${token.substring(0, token.indexOf('.'))}/dashboard`
              );
              removeUser();
              return;
            }
            navigate(`/profile/${payload.role.toLocaleLowerCase()}/create`);
            removeUser();
          },
        });
      })
      .catch((error) => {
        console.log('@onRegisterUser error -> ', error.response?.data?.message);
        toast({
          colorScheme: 'red',
          description: error.response?.data?.message,
          position: 'bottom',
          duration: 2000,
        });
      });
  };

  return (
    <>
      <ConfirmRegistration
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => onRegisterUser(user as IRegistrationLocalStorage)}
        data={{ ...user, message: onGenerateRegistrationMessage(user.role) }}
      />

      <Container
        maxW={'7xl'}
        height={'100vh'}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Flex gap={'6'} flexDir={{ base: 'column', md: 'row' }} opacity={0.95}>
          <Card flex={'1'}>
            <CardHeader>
              <Flex w={'full'} justifyContent={'center'}>
                <Image src={modelUser} alt={'User'} height={'52'} />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize={'md'} fontWeight={'light'}>
                The "USER" role refers to an individual who registers and
                interacts with the system as a regular user. As a user,
                individuals have access to the basic functionalities of the
                application or platform. They can perform actions such as
                creating an account, logging in, browsing content, and
                interacting with available features within the defined scope of
                their privileges. Users typically have limited administrative
                control and are primarily focused on utilizing the services or
                resources provided by the system.
              </Text>
            </CardBody>
            <CardFooter>
              <Button
                variant={'ghost'}
                textTransform={'uppercase'}
                w={'full'}
                colorScheme={'facebook'}
                onClick={() => onAddRole(Role.USER)}
              >
                Customer
              </Button>
            </CardFooter>
          </Card>

          <Card flex={'1'}>
            <CardHeader>
              <Flex w={'full'} justifyContent={'center'}>
                <Image src={modelTenant} alt={'Tenant'} height={'52'} />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontWeight={'light'}>
                The "TENANT" role represents a user who is affiliated with a
                rental or leasing system. Tenants have specific rights and
                responsibilities related to their rental agreement. Within the
                application or platform, tenants can access features and
                functionalities tailored towards managing their tenancy. This
                may include tasks such as viewing rental listings, submitting
                maintenance requests, making rental payments, communicating with
                landlords or property managers, and accessing relevant
                tenancy-related information. The tenant role typically involves
                a higher level of involvement in property management processes
                compared to regular users.
              </Text>
            </CardBody>
            <CardFooter>
              <Button
                variant={'ghost'}
                textTransform={'uppercase'}
                w={'full'}
                colorScheme={'facebook'}
                onClick={() => onAddRole(Role.TENANT)}
              >
                Tenant
              </Button>
            </CardFooter>
          </Card>

          <Card flex={'1'} opacity={0.4}>
            <CardHeader>
              <Flex w={'full'} justifyContent={'center'}>
                <Image src={modelAdmin} alt={Role.ADMIN} height={'52'} />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontWeight={'light'}>
                The "ADMIN" role pertains to users with administrative
                privileges and control over the application or platform.
                Administrators possess a higher level of authority and
                responsibility compared to regular users and tenants. They have
                access to backend systems, administrative interfaces, and
                additional tools for managing and overseeing the platform's
                operation. Administrators can perform various administrative
                tasks such as user management, content moderation, system
                configuration, and enforcing policies or rules. They play a
                crucial role in maintaining the system's integrity, security,
                and overall functionality.
              </Text>
            </CardBody>
            <CardFooter>
              <Button
                variant={'ghost'}
                textTransform={'uppercase'}
                w={'full'}
                colorScheme={'facebook'}
                onClick={() => onAddRole(Role.ADMIN)}
              >
                Admin
              </Button>
            </CardFooter>
          </Card>
        </Flex>
      </Container>
    </>
  );
}

export default RegisterRole;
