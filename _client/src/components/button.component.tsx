import { Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

interface IButtonProperties {
  isLoading: boolean;
  isSubmitting: boolean;
}

interface IButtonRedirectProperties {
  path: string, 
  title: string
}

export const LoginButton = ({ isLoading, isSubmitting }: IButtonProperties) => {
  return (
    <Button
      colorScheme="facebook"
      variant="solid"
      size="md"
      w="full"
      type="submit"
      isLoading={isLoading}
      loadingText="Logging in..."
      disabled={isSubmitting}
    >
      Login
    </Button>
  );
};

export const RegisterButton = ({ isLoading, isSubmitting }: IButtonProperties) => {
  return (
    <Button
      colorScheme="facebook"
      variant="solid"
      size="md"
      w="full"
      type="submit"
      isLoading={isLoading}
      loadingText="Redirecting..."
      disabled={isSubmitting}
    >
      Register
    </Button>
  );
};

export const ButtonRedirect = (data: IButtonRedirectProperties) => {
  const navigate = useNavigate();

  const handleLogin = () => navigate(data.path);

  return (
    <Button
      colorScheme="facebook"
      variant="outline"
      size="md"
      w="full"
      type="button"
      onClick={handleLogin}
    >
      {data.title}
    </Button>
  );
};
