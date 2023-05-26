import { Button, Card, CardBody, CardFooter, Flex, Heading, Image, Stack, Text} from '@chakra-ui/react'
import React from 'react'

interface ISubscriptionCard {
    gateway: string;
    image: string;
    expiry: string;
}
export const SubscriptionCard = (data: ISubscriptionCard) => {
  return <>
    <Flex gap={"2"}>
        <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '70px' }}
            maxH={{ base: "100%", sm: "70px"}}
            src={data.image}
            alt='Caffe Latte'
        />
        <Stack>
            <Heading size='md' textTransform={"uppercase"} lineHeight={"5"}>{data.gateway}</Heading>
            <Text fontSize={"sm"}>
                Subscription expiry <br/> <b>{data.expiry}</b>
            </Text>
        </Stack>
    </Flex>
  </>
}
