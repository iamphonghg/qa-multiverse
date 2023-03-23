/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiOutlineX } from 'react-icons/hi';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import AdminAPI from '../api/AdminAPI';

export default function NotificationFormDrawer({
  isOpen,
  onClose,
  refetch = () => {}
}) {
  const toast = useToast();
  const schema = yup.object().shape({});

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      specific: false,
      variant: 'info'
    }
  });

  const {
    mutate: createNotification,
    isLoading: isUploading
  } = useMutation(
    (formData) => {
      return AdminAPI.createNotification(formData);
    },
    {
      onSuccess: (response) => {
        console.log(response);
        if (response.success) {
          toast({
            title: response.message,
            status: 'success',
            position: 'top',
            duration: 3000
          });
          onClose();
          refetch();
        } else {
          toast({
            title: response.message,
            status: 'error',
            position: 'top',
            duration: 3000
          });
        }
      },
      onError: () => {
        toast({
          title: 'Xảy ra lỗi không xác định',
          status: 'error',
          position: 'top',
          duration: 3000
        });
      }
    }
  );
  const onSubmit = useCallback(
    (data) => {
      createNotification(data);
    },
    [createNotification]
  );

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Tạo thông báo
        </DrawerHeader>
        <DrawerBody>
          <Flex flexDir="column" gap={5}>
            <FormControl>
              <FormLabel>Tiêu đề</FormLabel>
              <Input
                placeholder="Tiêu đề"
                {...register('title', { required: true })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                rows={5}
                placeholder="Mô tả"
                {...register('description')}
              />
            </FormControl>
            <Checkbox {...register('specific')}>
              Tạo thông báo cho 1 người dùng
            </Checkbox>
            {watch('specific') && (
              <Input
                placeholder="Email của người dùng nhận thông báo"
                {...register('email')}
              />
            )}
            <FormControl>
              <FormLabel>Dạng thông báo</FormLabel>
              <Select {...register('variant')}>
                <option value="info">Thông tin</option>
                <option value="warning">Cảnh báo</option>
                <option value="dangerous">Nguy hiểm</option>
              </Select>
            </FormControl>
          </Flex>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button onClick={onClose} mr={3}>
            Hủy
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit(onSubmit)}
            isLoading={isUploading}
          >
            Tạo
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
