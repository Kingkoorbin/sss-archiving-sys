import { Button, Container, Flex, Input, InputGroup, InputRightElement, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpClient } from '../../utils/HttpClient';
import { HttpMethod } from '../../enum/http-methods.enum';
import { ButtonRedirect, LoginButton } from '../../components/button.component';

interface IInputs  {
    email: string,
    password: string,
};

interface ILoginResponse {
    status: string;
    message: string;
    data: {
        role: string;
        access_token: string;
    }
}
  
function Login() {
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
        .then((response) => { 
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
  return <>
    <Container maxW={"350px"}>
        <form onSubmit={handleSubmit(onLogin)}>
            <VStack mt={"52"}>
                <Text 
                    color={"facebook.700"}
                    fontSize={"8xl"} 
                    fontWeight={"black"} 
                    letterSpacing={"10px"}
                    lineHeight={"100px"}>LARA</Text>
                <Text 
                    color={"facebook.700"}
                    fontSize={"md"} 
                    fontWeight={"thin"} 
                    textTransform={"uppercase"} 
                    letterSpacing={"10px"}>Online Banking</Text>
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