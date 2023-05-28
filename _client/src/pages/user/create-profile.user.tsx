import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import modelProfileData from '../../assets/model/undraw_Profile_data_re_v81r.png';
import { useForm } from 'react-hook-form';
import { HttpClient } from '../../utils/HttpClient';
import { ICreateClientResponse } from '../../interface/client.interface';
import { HttpMethod } from '../../enum/http-methods.enum';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { useNavigate } from 'react-router-dom';

interface IInputs {
  firstName: string;
  lastName: string;
  presentAddress: string;
  permanentAddress: string;
  birthDate: string;
}

function CreateUserProfile() {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IInputs>();
  const [accessToken, setAccessToken, removeAccessToken] =
    useLocalStorage<string>('token');
  const [user, setUser, removeUser] = useLocalStorage<null>('user');

  const onCreateProfile = async (data: IInputs) => {
    if (!accessToken) return navigate('/');

    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      present_address: data.presentAddress,
      permanent_address: data.permanentAddress,
      birthdate: data.birthDate,
    };
    const options = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    console.log(options.Authorization);
    await HttpClient<ICreateClientResponse>(
      HttpMethod.POST,
      '/api/c/me',
      payload,
      options
    )
      .then((response) => {
        toast({
          colorScheme: 'facebook',
          description: response.message,
          position: 'bottom',
          duration: 2000,
          onCloseComplete: async () => {
            removeUser();
          },
        });
        console.log(response);
      })
      .catch((error) => {
        toast({
          colorScheme: 'red',
          description: error.response?.data?.message,
          position: 'bottom',
          duration: 2000,
          onCloseComplete: async () => navigate('/register'),
        });
      });
  };
  return (
    <>
      <Container
        maxW={'7xl'}
        height={'100vh'}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Flex gap={'6'}>
          <Box>
            <Image
              src={modelProfileData}
              alt="model profile data"
              height={'full'}
              w={'full'}
            />
          </Box>
          <Box width={'2xl'}>
            <form onSubmit={handleSubmit(onCreateProfile)}>
              <Text
                color={'facebook.700'}
                fontSize={'7xl'}
                fontWeight={'black'}
                letterSpacing={''}
                lineHeight={'100px'}
              >
                Profile
              </Text>
              <HStack gap={'2'} mt={'16'}>
                <Box w={'full'}>
                  <Input
                    type={'text'}
                    placeholder="Enter First name"
                    autoComplete="off"
                    {...register('firstName', {
                      required: {
                        value: true,
                        message: 'First name is required',
                      },
                    })}
                  />
                  {errors.firstName && (
                    <Text
                      color={'red.400'}
                      fontSize={'smaller'}
                      fontWeight={'normal'}
                    >
                      {errors.firstName.message}
                    </Text>
                  )}
                </Box>
                <Box w={'full'}>
                  <Input
                    type={'text'}
                    placeholder="Enter Last name"
                    autoComplete="off"
                    {...register('lastName', {
                      required: {
                        value: true,
                        message: 'Last name is required',
                      },
                    })}
                  />
                  {errors.lastName && (
                    <Text
                      color={'red.400'}
                      fontSize={'smaller'}
                      fontWeight={'normal'}
                    >
                      {errors.lastName.message}
                    </Text>
                  )}
                </Box>
              </HStack>
              <Input
                type={'date'}
                placeholder=""
                autoComplete="off"
                w={'full'}
                mt={'4'}
                {...register('birthDate', {
                  required: {
                    value: true,
                    message: 'Birthdate is required',
                  },
                })}
              />
              {errors.birthDate && (
                <Text
                  color={'red.400'}
                  fontSize={'smaller'}
                  fontWeight={'normal'}
                >
                  {errors.birthDate.message}
                </Text>
              )}
              <Input
                type={'text'}
                placeholder="Enter Present Address"
                autoComplete="off"
                w={'full'}
                mt={'4'}
                {...register('presentAddress', {
                  required: {
                    value: true,
                    message: 'Present address is required',
                  },
                })}
              />
              {errors.presentAddress && (
                <Text
                  color={'red.400'}
                  fontSize={'smaller'}
                  fontWeight={'normal'}
                >
                  {errors.presentAddress.message}
                </Text>
              )}
              <Input
                type={'text'}
                placeholder="Enter Permanent Address"
                autoComplete="off"
                w={'full'}
                mt={'4'}
                {...register('permanentAddress', {
                  required: {
                    value: true,
                    message: 'Permanent address is required',
                  },
                })}
              />
              {errors.permanentAddress && (
                <Text
                  color={'red.400'}
                  fontSize={'smaller'}
                  fontWeight={'normal'}
                >
                  {errors.permanentAddress.message}
                </Text>
              )}

              <Button
                type={'submit'}
                size={'lg'}
                textTransform={'uppercase'}
                colorScheme={'facebook'}
                isLoading={isSubmitting}
                loadingText={'Saving...'}
                w={'full'}
                mt={'16'}
              >
                Save
              </Button>
              <Button
                type={'button'}
                onClick={() => reset()}
                textTransform={'uppercase'}
                colorScheme={'facebook'}
                w={'full'}
                mt={'4'}
                size={'lg'}
                variant={'outline'}
              >
                Clear
              </Button>
            </form>
          </Box>
        </Flex>
      </Container>
    </>
  );
}

export default CreateUserProfile;
