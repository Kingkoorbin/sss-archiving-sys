import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, TableContainer, Table, Tbody, Tr, Td, Text, Heading } from '@chakra-ui/react';
import { useState } from 'react';

interface IRegistrationPayload {
    email: string;
    password: string;
    username: string;
    role: string;
    mobileNumber: string;
    message: string;
}

interface IConfirmRegistrationProps {
    isOpen:  boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    data: IRegistrationPayload;
}
export function ConfirmRegistration({ isOpen, onClose, data, onConfirm }: IConfirmRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table size='sm'>
                <Tbody>
                  <Tr>
                    <Td fontWeight={"bold"}>ROLE</Td>
                    <Td>{data.role}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight={"bold"}>EMAIL</Td>
                    <Td>{data.email}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight={"bold"}>PHONE NO.</Td>
                    <Td>{data.mobileNumber.substring(0, 5) + "*"
                       .repeat(data.mobileNumber.length - 4) + data.mobileNumber
                       .substring(data.mobileNumber.length - 2)}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight={"bold"}>PASSWORD</Td>
                    <Td>{data.password.substring(0, 2) + "*"
                      .repeat(data.password.length - 4) + data.password
                      .substring(data.password.length - 2)}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
           
           <Text mt={"10"} p={"2"}>
            {data.message}
           </Text>
          </ModalBody>

          <ModalFooter>
            <Button 
              onClick={() => onSubmit()}
              textTransform={"uppercase"} 
              colorScheme={"facebook"} 
              isLoading={isLoading}
              loadingText={"Creating Account..."}
              w={"full"} >Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
