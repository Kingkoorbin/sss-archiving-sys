import { Button, Container, Flex, Input, InputGroup, InputLeftElement, InputRightElement, Text, VStack } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { RegisterButton } from '../../components';
import { ButtonRedirect } from '../../components/button.component';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { AiOutlinePhone } from "react-icons/ai";

interface IInputs  {
    email: string,
    password: string,
    mobileNumber: string;
    passwordConfirm: string;
};

function Register() {
    const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<IInputs>();
    const [user, setUser, removeUser] = useLocalStorage<any>('user');

    const navigate = useNavigate();

    const [state, setState] = useState({
        togglePassword: false,
        loginErrorMessage: null
    });

    const onProceed = async (data: IInputs) => {
        setUser({...data});
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate(`/register/${data.email.substring(0, data.email.indexOf("@"))}/role`);
      }
      

    const handleClick = () => {
        setState((prev) => ({
            ...prev,
            togglePassword: !state.togglePassword 
        }))
    }

   useEffect(() => {
        if(user) {
            removeUser();
        }
    }, []);
  return <>
    <Container maxW={"350px"}>
        <form onSubmit={handleSubmit(onProceed)}>
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
                  <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                    <AiOutlinePhone color='gray.300' />
                    </InputLeftElement>
                    <Input
                        pr='4.5rem'
                        type={"text"}
                        placeholder='+639******123'
                        focusBorderColor={errors.mobileNumber || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        borderColor={errors.mobileNumber || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        autoComplete='off'
                        {...register("mobileNumber", { 
                            required: { value: true, message: "Mobile No. is required"},
                            pattern: { value:/^\+639\d{9}$/i, message: "Mobile No. should be in this format: +639123456789"}
                        })}/>
                </InputGroup>
                {errors.mobileNumber && <Text 
                    color={"red.400"} 
                    fontSize={"smaller"} 
                    fontWeight={"normal"}>{errors.mobileNumber.message}</Text>}
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={state.togglePassword ? 'text' : 'password'}
                        placeholder='Enter password' 
                        focusBorderColor={errors.password || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        borderColor={errors.password || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        {...register("password", { 
                            required: { value: true, message: "Password is required"},
                            minLength: { value: 8, message: "Password should be at least 8 characters long"},
                            maxLength: { value: 20, message: "Password should be at most 20 characters long"},
                            pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, message: "Password should have 1 uppercase letter, 1 lowercase letter and 1 number and 1 special character"}
                        })}/>
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
                <Input
                        pr='4.5rem'
                        type={"password"}
                        placeholder='Enter password again' 
                        focusBorderColor={errors.passwordConfirm || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        borderColor={errors.passwordConfirm || state.loginErrorMessage  ? 'red.300' : 'blackAlpha.100'}
                        {...register("passwordConfirm", { 
                            required: { value: true, message: "Password is required"},
                            validate: (value) => value === getValues("password") || "The passwords do not match",
                        })}/>
                {errors.passwordConfirm && <Text 
                    color={"red.400"} 
                    fontSize={"smaller"} 
                    fontWeight={"normal"}>{errors.passwordConfirm.message}</Text>}
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
                <RegisterButton
                    isLoading={isSubmitting}
                    isSubmitting={isSubmitting} />
                <ButtonRedirect 
                    path={"/"}
                    title={"Already have an account? Login here"}/>
            </VStack>
        </form>
    </Container>
  </>
}

export default Register