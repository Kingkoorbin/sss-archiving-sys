import { Button, Container, Flex, Input, InputGroup, InputRightElement, Text, VStack } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HttpClient } from '../../utils/HttpClient';
import { HttpMethod } from '../../enum/http-methods.enum';
import { ButtonRedirect, LoginButton } from '../../components/button.component';
import { ILoginResponse } from '../../interface';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../interface/roles.interface';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';

interface IInputs  {
    email: string,
    password: string,
};


function Login() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>('token');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IInputs>();

    const [state, setState] = useState({
        togglePassword: false,
        loginErrorMessage: null
    });

    const onLogin = async (data: IInputs) => {
       await HttpClient<ILoginResponse>(HttpMethod.POST, "/api/login", {
            "email": data.email,
            "password": data.password
        })
        .then(async (response) => {
            console.log("@onLogin response -> ", response.data);
            // ASSIGN TOKEN
            setAccessToken(response.data.access_token);
            // REDIRECT BY ROLES
            if(response.data.role === Role.ADMIN) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const token = response.data.access_token;
                navigate(`/a/${token.substring(0, token.indexOf("."))}/dashboard`);
            }
            setState((prev) => ({
                ...prev,
                loginErrorMessage: null
            }))
        })
        .catch((error) => {
            setState((prev) => ({
                ...prev,
                loginErrorMessage: error.response?.data?.message
            }))
        });
    }

    const handleClick = () => {
        setState((prev) => ({
            ...prev,
            togglePassword: !state.togglePassword 
        }))
    }

    useEffect(() => {
      if(accessToken) {
        removeAccessToken();
      }
    }, []);
    
  return <>
    <Container 
        maxW={"350px"} 
        height={"100vh"}
        display="flex"
        alignItems="center"
        justifyContent="center">
        <form onSubmit={handleSubmit(onLogin)}>
            <VStack textAlign={"center"}>
                <Text 
                    color={"facebook.700"}
                    fontSize={"7xl"} 
                    fontWeight={"black"} 
                    letterSpacing={""}
                    lineHeight={"100px"}>E-DIARY</Text>
                <Text 
                    color={"facebook.700"}
                    fontSize={"sm"} 
                    fontWeight={"thin"} 
                    textTransform={"uppercase"} 
                    letterSpacing={"10px"}>A Laravel Powered Application</Text>
            </VStack>
            <VStack gap={"1"} align={"start"} mt={"10"}>
                <Input
                    pr='4.5rem'
                    type={"email"}
                    placeholder='Enter email'
                    focusBorderColor={errors.email || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                    borderColor={errors.email || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                    autoComplete='off'
                    {...register("email", { required: { value: true, message: "Email is required"} })}/>
                {errors.email && <Text 
                    color={"red.400"} 
                    fontSize={"smaller"} 
                    fontWeight={"normal"}>{errors.email.message}</Text>}
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={state.togglePassword ? 'text' : 'password'}
                        placeholder='Enter password' 
                        focusBorderColor={errors.password || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        borderColor={errors.password || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        {...register("password", { required: { value: true, message: "Password is required"} })}/>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {state.togglePassword ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {errors.password && <Text 
                    color={"red.400"} 
                    fontSize={"smaller"} 
                    fontWeight={"normal"}>{errors.password.message}</Text>}
                {state.loginErrorMessage && <Text 
                    color={"red.400"} 
                    fontSize={"smaller"} 
                    fontWeight={"normal"} 
                    p={"2"}>{state.loginErrorMessage}</Text>}

                <Flex justifyContent={"end"} width={"full"}>
                    <Text 
                        color={"facebook.600"} 
                        fontSize={"smaller"} 
                        fontWeight={"bold"} 
                        p={"2"}
                        cursor={"pointer"}>Forgot password?</Text>
                </Flex>
            </VStack>
            <VStack gap={"1"} mt={"10"}>
                <LoginButton
                    isLoading={isSubmitting}
                    isSubmitting={isSubmitting}/>
                <ButtonRedirect 
                    path={"/register"}
                    title={"Don't have an account? Register now"}/>
            </VStack>
        </form>
    </Container>
  </>
}

export default Login