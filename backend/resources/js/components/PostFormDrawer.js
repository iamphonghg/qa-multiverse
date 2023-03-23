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
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Text,
  Textarea,
  useToast,
  Icon,
  Image
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { HiOutlineX } from 'react-icons/hi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import UserAPI from '../api/UserAPI';
import AdminAPI from '../api/AdminAPI';
import { getImagePath } from '../helper/helper';

export default function PostFormDrawer({
  isOpen,
  onClose,
  postData,
  isAdmin = false,
  refetch = () => {}
}) {
  const toast = useToast();
  const schema = yup.object().shape({
    title: yup
      .string()
      .max(50, 'Bạn đã nhập quá 50 kí tự')
      .required('Vui lòng điền tiêu đề'),
    body: yup
      .string()
      .max(1500, 'Bạn đã nhập quá 1500 kí tự')
      .required('Vui lòng điền mô tả')
  });

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const oldImages = watch('oldImages');
  const images = watch('images');
  console.log('images', images);

  const handleImagesChange = useCallback(
    (e) => {
      const imagesArray = [];
      for (let i = 0; i < e.target.files.length; i += 1) {
        imagesArray.push(e.target.files[i]);
      }
      setValue('images', [...getValues('images'), ...imagesArray]);
    },
    [getValues, setValue]
  );

  const handleRemoveImage = useCallback(
    (index) => {
      setValue(
        'images',
        getValues('images').filter((_, i) => i !== index)
      );
    },
    [getValues, setValue]
  );

  const handleRemoveOldImage = useCallback(
    (index) => {
      setValue(
        'oldImages',
        oldImages.filter((_, i) => i !== index)
      );
    },
    [oldImages, setValue]
  );

  const { mutate: updatePost, isLoading: isUpdating } = useMutation(
    (formData) => {
      if (!isAdmin) {
        return UserAPI.updatePost(formData);
      }
      return AdminAPI.updatePost(formData);
    },
    {
      onSuccess: (response) => {
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
      formData.append('postId', postData.id);
      formData.append('title', data.title);
      formData.append('body', data.body);
      formData.append('oldImages', JSON.stringify(data.oldImages));
      for (let i = 0; i < getValues('images').length; i += 1) {
        formData.append('images[]', getValues('images')[i]);
      }
      updatePost(formData);
    },
    [getValues, postData.id, updatePost]
  );

  useEffect(() => {
    setValue('title', postData.title);
    setValue('body', postData.body);
    setValue('oldImages', postData.images);
    return () => {
      reset();
    };
  }, [
    postData.body,
    postData.images,
    postData.title,
    reset,
    setValue
  ]);

  useEffect(() => {
    register('oldImages');
  }, [register]);

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Cập nhật bài đăng
          </DrawerHeader>
          <DrawerBody>
            <Flex flexDir="column" gap={5}>
              <FormControl>
                <FormLabel>Tiêu đề và Mô tả</FormLabel>
                <Input placeholder="Tiêu đề" {...register('title')} />
                <Flex justifyContent="space-between">
                  {errors.title ? (
                    <Text mt={1} color="red">
                      {errors.title.message}
                    </Text>
                  ) : null}
                  <Flex justifySelf="flex-end">
                    <FormHelperText>
                      {watch('title') ? watch('title').length : 0} /
                      50 kí tự
                    </FormHelperText>
                  </Flex>
                </Flex>
                <Textarea
                  mt={3}
                  placeholder="Mô tả chi tiết"
                  {...register('body')}
                />
                <Flex justifyContent="space-between">
                  {errors.body ? (
                    <Text mt={1} color="red">
                      {errors.body.message}
                    </Text>
                  ) : null}
                  <FormHelperText textAlign="right">
                    {watch('body') ? watch('body').length : 0} / 1500
                    kí tự
                  </FormHelperText>
                </Flex>
                <Flex
                  paddingInlineStart={6}
                  paddingInlineEnd={6}
                  paddingTop={6}
                  paddingBottom={6}
                  flexDir="column"
                  gap={5}
                >
                  <Text fontWeight="medium">Tải lên ảnh mô tả</Text>
                  <input
                    id="images"
                    multiple
                    hidden
                    type="file"
                    accept="image/*"
                    {...register('images')}
                    onChange={handleImagesChange}
                  />
                  <Grid
                    templateColumns="1fr 1fr 1fr"
                    columnGap={12}
                    rowGap={5}
                  >
                    <IconButton
                      size="lg"
                      icon={<AddIcon />}
                      onClick={() => {
                        document.getElementById('images').click();
                      }}
                    />
                    {oldImages &&
                      oldImages.length > 0 &&
                      oldImages.map((image, i) => (
                        <Box
                          position="relative"
                          key={`old-image-${i + 1}`}
                        >
                          <Image
                            border="1px solid #edf2f7"
                            borderRadius="md"
                            boxSize="12"
                            w={12}
                            src={getImagePath(image.name)}
                          />
                          <IconButton
                            position="absolute"
                            icon={
                              <Icon as={HiOutlineX} w="4" h="4" />
                            }
                            size="xs"
                            top={-2.5}
                            right={-2.5}
                            onClick={() => handleRemoveOldImage(i)}
                          />
                        </Box>
                      ))}
                    {images &&
                      images?.length > 0 &&
                      images.map((image, i) => (
                        <Box
                          position="relative"
                          key={`image-${i + 1}`}
                        >
                          <Image
                            border="1px solid #edf2f7"
                            borderRadius="md"
                            boxSize="12"
                            w={12}
                            src={URL.createObjectURL(image)}
                          />
                          <IconButton
                            position="absolute"
                            icon={
                              <Icon as={HiOutlineX} w="4" h="4" />
                            }
                            size="xs"
                            top={-2.5}
                            right={-2.5}
                            onClick={() => handleRemoveImage(i)}
                          />
                        </Box>
                      ))}
                  </Grid>
                </Flex>
              </FormControl>
            </Flex>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button onClick={onClose} mr={3} disabled={isUpdating}>
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
      </form>
    </Drawer>
  );
}
