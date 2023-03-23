/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import UserAPI from '../api/UserAPI';

export default function ReportUserModal({ isOpen, onClose, userId }) {
  const toast = useToast();
  const { register, handleSubmit } = useForm();

  const { mutate: reportUser, isLoading: isReporting } = useMutation(
    (data) => UserAPI.reportUser(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast({
            title: 'Báo cáo người dùng thành công',
            duration: 3000,
            status: 'success',
            isClosable: true
          });
          onClose();
        } else {
          toast({
            title: 'Đã có lỗi xảy ra!',
            duration: 3000,
            status: 'error',
            isClosable: true
          });
        }
      },
      onError: () => {
        toast({
          title: 'Đã có lỗi xảy ra!',
          duration: 3000,
          status: 'error',
          isClosable: true
        });
      }
    }
  );

  const onSubmit = useCallback(
    (data) => {
      data.userId = userId;
      reportUser(data);
    },
    [reportUser, userId]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Báo cáo vi phạm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Lí do báo cáo</FormLabel>
            <Textarea
              {...register('reason')}
              placeholder="Lí do báo cáo vi phạm"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="purple"
            onClick={handleSubmit(onSubmit)}
            isLoading={isReporting}
          >
            Gửi báo cáo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
