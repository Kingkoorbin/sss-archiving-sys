import { Box, Container, Flex, Image, Text } from '@chakra-ui/react';
import modelSuccess from '../../assets/model/undraw_Stripe_payments_re_chlm.png';
import { useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { IRegistrationTenantLS } from '../../interface';
import { useNavigate } from 'react-router-dom';
import { HttpClient } from '../../utils/HttpClient';
import { HttpMethod } from '../../enum/http-methods.enum';
import {
  ICreateClientResponse,
  ICreateTenantResponse,
} from '../../interface/client.interface';

function PaymentSuccess() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken, removeAccessToken] =
    useLocalStorage<string>('token');
  const [tenant, setTenant, removeTenant] =
    useLocalStorage<IRegistrationTenantLS>('new-tenant');

  const onCreateProfile = async () => {
    if (!accessToken) return navigate('/');
    const date = new Date();

    const payload = {
      company_name: tenant?.company_name,
      description: tenant?.description,
      address: tenant?.address,
      subscription_plan: {
        dateStarted: date.toISOString(),
        gateway: 'Stripe',
        amount: '5000',
        currency: 'PHP',
      },
    };
    const options = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    await HttpClient<ICreateTenantResponse>(
      HttpMethod.POST,
      '/api/t/me',
      payload,
      options
    )
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    onCreateProfile();
  }, []);

  return (
    <>
      <Container
        px={'32'}
        maxW={'full'}
        height={'100vh'}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Flex alignItems={'center'}>
          <Image src={modelSuccess} alt="Success" />
          <Box>
            <Text
              color={'#6A63F6'}
              fontSize={'8xl'}
              fontWeight={'black'}
              letterSpacing={''}
              lineHeight={'100px'}
            >
              PAYMENT SUCCESSFUL!
            </Text>
            <Text color={'facebook.700'} fontSize={'2xl'} mt={'10'}>
              Thank you for choosing Stripe for your payment. We appreciate your
              business and value your trust in our secure payment processing. If
              you have any questions or need further assistance, please don't
              hesitate to reach out to our support team.
            </Text>
          </Box>
        </Flex>
      </Container>
    </>
  );
}

export default PaymentSuccess;
