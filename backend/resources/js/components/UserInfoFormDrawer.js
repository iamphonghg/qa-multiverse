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
  IconButton,
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiOutlineX } from 'react-icons/hi';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import UserAPI from '../api/UserAPI';
import AdminAPI from '../api/AdminAPI';
import { getAvatarPath } from '../helper/helper';

export default function UserInfoFormDrawer({
  isOpen,
  onClose,
  userData,
  isAdmin = false,
  refetch = () => {}
}) {
  const toast = useToast();
  const schema = yup.object().shape({
    displayName: yup.string().required()
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const oldAvatar = watch('oldAvatar');
  const avatar = watch('avatar');

  const handleRemoveOldAvatar = useCallback(() => {
    setValue('oldAvatar', null);
  }, [setValue]);
  const handleRemoveAvatar = useCallback(() => {
    setValue('avatar', null);
  }, [setValue]);

  const {
    mutate: updateUserInfo,
    isLoading: isUpdating
  } = useMutation(
    (formData) => {
      if (!isAdmin) {
        return UserAPI.updateUserInfo(formData);
      }
      return AdminAPI.updateUserInfo(formData);
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
      const formData = new FormData();
      formData.append('id', userData.id);
      Object.keys(data).forEach((key) => {
        if (key !== 'avatar') {
          formData.append(key, data[key]);
        }
      });
      if (avatar && avatar.length > 0) {
        formData.append('avatar', avatar[0]);
      }
      updateUserInfo(formData);
    },
    [avatar, updateUserInfo, userData.id]
  );

  const handleOpenAvatarSelect = useCallback(() => {
    document.getElementById('avatar').click();
  }, []);

  useEffect(() => {
    if (userData.avatar?.name) {
      setValue('oldAvatar', getAvatarPath(userData.avatar?.name));
    }
    setValue('displayName', userData.display_name);
    setValue('about', userData.about);
    return () => {
      reset();
    };
  }, [reset, setValue, userData]);

  return (
    <Drawer onClose={onClose} isOpen={isOpen}>
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
                  <input
                    id="avatar"
                    hidden
                    type="file"
                    accept="image/*"
                    {...register('avatar')}
                  />
                  {oldAvatar ? (
                    <>
                      <Avatar size="lg" src={oldAvatar} />

                      <IconButton
                        position="absolute"
                        top="-12px"
                        right="-12px"
                        borderRadius="50%"
                        border="4px solid #fff"
                        icon={<HiOutlineX />}
                        onClick={handleRemoveOldAvatar}
                      />
                    </>
                  ) : (
                    <Box>
                      <Avatar
                        bg="purple.200"
                        size="lg"
                        src={
                          avatar && avatar.length > 0
                            ? URL.createObjectURL(avatar[0])
                            : null
                        }
                      />
                      {avatar && avatar.length > 0 && (
                        <IconButton
                          position="absolute"
                          top="-12px"
                          right="-12px"
                          borderRadius="50%"
                          border="4px solid #fff"
                          icon={<HiOutlineX />}
                          onClick={handleRemoveAvatar}
                        />
                      )}
                    </Box>
                  )}
                </Box>
                <Button
                  size="xs"
                  ml={4}
                  onClick={handleOpenAvatarSelect}
                >
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
            onClick={handleSubmit(onSubmit)}
            isLoading={isUpdating}
          >
            Cập nhật
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
