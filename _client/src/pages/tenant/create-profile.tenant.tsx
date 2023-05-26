import { Box, Button, Container, Flex, HStack, Image, Input, Stack, Text, Textarea, useToast } from "@chakra-ui/react"
import modelProfileData from "../../assets/model/undraw_Profile_data_re_v81r.png";
import { useForm } from "react-hook-form";
import { HttpClient } from "../../utils/HttpClient";
import { ICreateClientResponse } from '../../interface/client.interface';
import { HttpMethod } from '../../enum/http-methods.enum';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { useNavigate } from "react-router-dom";
import { IRegistrationTenantLS } from '../../interface/auth.interface';

interface IInputs  {
  address: string;
  companyName: string;
  companyDescription: string;
};

function CreateTenantProfile() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset,  formState: { errors, isSubmitting } } = useForm<IInputs>();
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>('token');
  const [tenant, setTenant, removeTenant] = useLocalStorage<IRegistrationTenantLS>('new-tenant');

  const onCreateProfile = async (data: IInputs) => {
    if(!accessToken) return navigate("/"); 

    setTenant({
      company_name: data.companyName,
      address: data.address,
      description: data.companyDescription
    });

    const payload = {
      "price_id": "price_1NBAMEHnf44tXPC2Mj5nchuC",
      "amount": 20000,
      "currency": "php"
    }
    const options = { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    };

    await HttpClient<any>(HttpMethod.POST, "/api/stripe/payment/checkout-session", payload, options)
      .then((response) => {       
        console.log("@onRegisterUser response -> ", response);
        window.location.href = response.url;
      })
      .catch((error) => {
        console.log("@onRegisterUser error -> ", error.response?.data?.message)
      });  
  }
  return <>
    <Container 
      maxW={"7xl"}
      height={"100vh"}
      display="flex"
      alignItems="center"
      justifyContent="center">
      <Flex gap={"6"}>
          <Box>
              <Image src={modelProfileData} alt="model profile data" height={"full"} w={"full"}/>
          </Box>
          <Box width={"2xl"}>
            <form onSubmit={handleSubmit(onCreateProfile)}>
              <Text 
                color={"facebook.700"}
                fontSize={"7xl"} 
                fontWeight={"black"} 
                letterSpacing={""}
                lineHeight={"100px"}>Profile</Text>
               <Input
                      type={"text"}
                      placeholder='Enter company name'
                      autoComplete='off'
                      mt={"16"}
                      {...register("companyName", {
                        required: {
                          value: true,
                          message: "Company name is required"
                        },
                        minLength: {
                          value: 2,
                          message: "Min length is 2 characters"
                        },
                        maxLength: {
                          value: 25,
                          message: "Max length is 25 characters"
                        }
                      })}/>
                  {errors.companyName && <Text 
                    color={"red.400"} 
                    fontSize={"smaller"} 
                    fontWeight={"normal"}>{errors.companyName.message}</Text>}
              <Box w={"full"}>
                  <Textarea
                      placeholder='Describe your company'
                      autoComplete='off'
                      mt={"4"}
                      {...register("companyDescription", {
                        required: {
                          value: true,
                          message: "Company description is required"
                        },
                        minLength: {
                          value: 6,
                          message: "Min length is 6 characters"
                        },
                        maxLength: {
                          value: 125,
                          message: "Max length is 125 characters"
                        }
                      })}/>
                  {errors.companyDescription && <Text 
                    color={"red.400"} 
                    fontSize={"smaller"} 
                    fontWeight={"normal"}>{errors.companyDescription.message}</Text>}
                </Box>
        
              <Input
                type={"text"}
                placeholder='Enter company address'
                autoComplete='off'
                w={"full"}
                mt={"4"} 
                {...register("address", {
                  required: {
                    value: true,
                    message: "Company address is required"
                  }
                })}/>
              {errors.address && <Text 
                  color={"red.400"} 
                  fontSize={"smaller"} 
                  fontWeight={"normal"}>{errors.address.message}</Text>}
             
              <Button 
                type={"submit"}
                size={"lg"}
                textTransform={"uppercase"} 
                colorScheme={"facebook"} 
                isLoading={isSubmitting}
                loadingText={"Saving..."}
                w={"full"} 
                mt={"16"}>Save</Button>
              <Button 
                type={"button"}
                onClick={() => reset()}
                textTransform={"uppercase"} 
                colorScheme={"facebook"} 
                w={"full"} 
                mt={"4"}
                size={"lg"}
                variant={"outline"}>Clear</Button>
            </form>
          </Box>
      </Flex>
    </Container>
  </>
}

export default CreateTenantProfile