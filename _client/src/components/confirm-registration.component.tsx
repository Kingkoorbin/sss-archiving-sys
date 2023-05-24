import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, TableContainer, Table, Tbody, Tr, Td, Text, Heading } from '@chakra-ui/react';

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
    data: IRegistrationPayload;
}
export function ConfirmRegistration({ isOpen, onClose, data }: IConfirmRegistrationProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account</ModalHeader>
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
                    <Td>{data.mobileNumber}</Td>
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
            <Button colorScheme={"facebook"}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
