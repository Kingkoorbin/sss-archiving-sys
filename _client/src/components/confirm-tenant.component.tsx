import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useState } from 'react';

interface IConfirmPayload {
  companyName: string;
  description: string;
}
interface IConfirmTenant {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (() => Promise<void>) | (() => void);
  data: IConfirmPayload;
  loading: boolean;
}

export function VerifyTenantModal({
  isOpen,
  onClose,
  data,
  loading,
  onConfirm,
}: IConfirmTenant) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'sm'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verify Tenant {data.companyName}</ModalHeader>
        <ModalBody>{data.description}</ModalBody>

        <ModalFooter gap={'2'}>
          <Button
            onClick={() => onConfirm()}
            textTransform={'uppercase'}
            colorScheme={'facebook'}
            size="lg"
            isLoading={loading}
            w={'full'}
          >
            APPROVE
          </Button>
          <Button
            onClick={() => onClose()}
            textTransform={'uppercase'}
            colorScheme={'facebook'}
            variant={'outline'}
            size="lg"
            w={'full'}
          >
            CANCEL
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
