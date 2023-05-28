import { Box, Button, Container, Flex, Image, Text } from '@chakra-ui/react';
import modelCancelled from '../../assets/model/undraw_Cancel_re_pkdm.png';
import { useNavigate } from 'react-router-dom';

function PaymentCancelled() {
  const navigate = useNavigate();
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
          <Image src={modelCancelled} alt="Success" />
          <Box>
            <Text
              color={'red.400'}
              fontSize={'8xl'}
              fontWeight={'black'}
              letterSpacing={''}
              lineHeight={'100px'}
            >
              PAYMENT UNSUCCESSFUL!
            </Text>
            <Text color={'facebook.700'} fontSize={'2xl'} mt={'10'}>
              We apologize for the inconvenience caused by the payment failure.
              It seems there was an issue processing your payment through
              Stripe. Please double-check your payment details and try again. If
              the problem persists, feel free to contact our support team for
              further assistance. We appreciate your patience and understanding.
            </Text>

            <Button
              colorScheme={'facebook'}
              mt={'5'}
              onClick={() => navigate(-1)}
              variant={'outline'}
            >
              Go Back
            </Button>
          </Box>
        </Flex>
      </Container>
    </>
  );
}

export default PaymentCancelled;
