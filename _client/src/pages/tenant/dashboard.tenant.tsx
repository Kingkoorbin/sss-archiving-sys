import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks';
import { HttpClient } from '../../utils/HttpClient';
import { Tenant } from '../../interface';
import { HttpMethod } from '../../enum/http-methods.enum';
import { SessionExpired } from '../../components/confirm-registration.component';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface IState {
  profile?: Tenant;
  sessionExpired: boolean;
  spaces: [],
}
interface IInputs {
  description: string;
  diaryTitle: string;
}
function TenantDashboard() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IInputs>();
  const [accessToken, setAccessToken, removeAccessToken] =
    useLocalStorage<string>('token');

    const toast = useToast();
  const [state, setState] = useState<IState>({
    sessionExpired: false,
    spaces: []
  });

  const getProfile = async () => {
    const options = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await HttpClient<{ data: { user: { tenant: Tenant } } }>(
      HttpMethod.GET,
      '/api/t/me',
      null,
      options
    )
      .then((response) => {
        console.log('@getProfile response -> ', response);
        setState((prev) => ({
          ...prev,
          profile: response.data.user.tenant,
        }));
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setState((prev) => ({
            ...prev,
            sessionExpired: true,
          }));
          removeAccessToken();
        }
        console.log('@getProfile error -> ', error.response?.data?.message);
      });
  };

  const onLogout = () => {
    return navigate('/', { replace: true });
  };

  const onCreateSpace = async (data: IInputs) => {
    const options = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const payload = {
      "title": data.diaryTitle,
      "description": data.description
    }
    await HttpClient<any>(
      HttpMethod.POST,
      '/api/space',
      payload,
      options
    )
      .then(async (response) => {
        console.log('@onCreateSpace response -> ', response);
        await getSpaces();
        toast({
          colorScheme: 'green',
          description: "Space created successfully.",
          position: 'bottom',
          duration: 2000,
        });
      })
      .catch((error) => {
        console.log('@onCreateSpace error -> ', error.response?.data?.message);
        if (error.response?.status === 401) {
          setState((prev) => ({
            ...prev,
            sessionExpired: true,
          }));
          removeAccessToken();
        }
      });
  }

  const getSpaces = async () => {
    const options = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await HttpClient<any>(
      HttpMethod.GET,
      '/api/space',
      null,
      options
    )
      .then((response) => {
        console.log('@options response -> ', response);
        setState((prev) => ({
          ...prev,
          spaces: response.data,
        }));
      })
      .catch((error) => {
        console.log('@options error -> ', error.response?.data?.message);
        if (error.response?.status === 401) {
          setState((prev) => ({
            ...prev,
            sessionExpired: true,
          }));
          removeAccessToken();
        }
      });
  }

  useEffect(() => {
    getProfile();
    getSpaces();
  }, []);
  return (
    <>
      <SessionExpired
        data={{
          message: 'Oops! Please login again. ',
          email: '',
          mobileNumber: '',
          password: '',
          role: '',
          username: '',
        }}
        isOpen={state.sessionExpired || !accessToken}
        onClose={() => {}}
        onConfirm={() => navigate('/', { replace: true })}
      />
      <Container mt={'10'} maxW={'7xl'}>
        <Flex justifyContent={'end'}>
          <Button variant={'outline'} onClick={() => onLogout()}>
            Sign out
          </Button>
        </Flex>
      </Container>
      <Container maxW={'3xl'} mt={'10'}>
        {state.profile && !state?.profile?.verified && (
            <Alert status={'warning'} borderRadius={'md'} my={"10"}>
              <AlertIcon />
              The tenant account is pending verification by the administrator, and
              certain features will remain inaccessible until the verification
              process is completed.
            </Alert>
          )}

        <Tabs variant='enclosed'>
          <TabList>
            <Tab>Create</Tab>
            <Tab>My spaces</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form onSubmit={handleSubmit(onCreateSpace)}>
              <Input
              type={'text'}
              placeholder="Write a title"
              autoComplete="off"
              mt={'16'}
              {...register('diaryTitle', {
                required: {
                  value: true,
                  message: 'Title is required',
                },
                minLength: {
                  value: 2,
                  message: 'Min length is 2 characters',
                },
                maxLength: {
                  value: 25,
                  message: 'Max length is 25 characters',
                },
              })}
            />
            <Textarea
              placeholder={'Give a diary description'}
              autoComplete="off"
              mt={'4'}
              {...register('description', {
                required: {
                  value: true,
                  message: 'Description is required',
                },
                minLength: {
                  value: 6,
                  message: 'Min length is 6 characters',
                },
                maxLength: {
                  value: 125,
                  message: 'Max length is 125 characters',
                },
              })}
            />
            <Flex justifyContent={'end'}>
              <Button
              type={"submit"}
                colorScheme="blue"
                size={'lg'}
                textTransform={'uppercase'}
                mt={'3'}
                isDisabled={!state.profile?.verified}
                isLoading={isSubmitting}
                loadingText={"Creating space..."}
              >
                post
              </Button>
            </Flex>
              </form>
            </TabPanel>
            <TabPanel>
              {state?.spaces.map((v: any) => {
                return <Card key={v.id} mt={"2"}>
                <CardBody>
                <Heading size='xs' textTransform='uppercase'>
                  {v.title}
                </Heading>
                  <Text>{v.description}</Text>
                </CardBody>
              </Card>
              })}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

export default TenantDashboard;
