/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
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
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import UserAPI from '../api/UserAPI';
import AdminAPI from '../api/AdminAPI';

export default function UserInfoFormDrawer({
  isOpen,
  onClose,
  userData,
  isAdmin = false,
  refetch = () => {}
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const schema = yup.object().shape({
    displayName: yup.string().required()
  });

  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(
    (data) => {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('id', userData.id);
      Object.keys(data).forEach((key) => {
        if (key !== 'avatar') {
          formData.append(key, data[key]);
        }
      });

      if (!isAdmin) {
        UserAPI.updateUserInfo(formData)
          .then((response) => {
            setIsUpdating(false);
            if (response.success) {
              toast({
                title: response.message,
                status: 'success',
                position: 'top',
                duration: 3000
              });
              onClose();
            } else {
              toast({
                title: response.message,
                status: 'error',
                position: 'top',
                duration: 3000
              });
            }
          })
          .catch(() => {
            setIsUpdating(false);
            toast({
              title: 'Xảy ra lỗi không xác định',
              status: 'error',
              position: 'top',
              duration: 3000
            });
          });
      } else {
        AdminAPI.updateUserInfo(formData)
          .then((response) => {
            setIsUpdating(false);
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
          })
          .catch(() => {
            setIsUpdating(false);
            toast({
              title: 'Xảy ra lỗi không xác định',
              status: 'error',
              position: 'top',
              duration: 3000
            });
          });
      }
    },
    [isAdmin, onClose, refetch, toast, userData.id]
  );

  useEffect(() => {
    setValue('displayName', userData.display_name);
    setValue('about', userData.about);
    return () => {
      reset();
    };
  }, [reset, setValue, userData]);

  return (
    <Drawer onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Cập nhật thông tin
          </DrawerHeader>
          <DrawerBody>
            <Flex flexDir="column" gap={5}>
              <FormControl>
                <FormLabel>Avatar</FormLabel>
                <Flex>
                  <Box position="relative">
                    <Avatar size="lg" />
                  </Box>
                  <Button size="xs" ml={4}>
                    Select avatar
                  </Button>
                </Flex>
              </FormControl>
              <FormControl>
                <FormLabel>Họ và tên</FormLabel>
                <Input
                  placeholder="Họ và tên"
                  {...register('displayName')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Về tôi</FormLabel>
                <Textarea
                  rows={5}
                  placeholder="Về tôi"
                  {...register('about')}
                />
              </FormControl>
            </Flex>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button onClick={onClose} mr={3}>
              Hủy
            </Button>
            <Button
              colorScheme="purple"
              type="submit"
              isLoading={isUpdating}
            >
              Cập nhật
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
