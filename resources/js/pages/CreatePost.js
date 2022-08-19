/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  Image,
  Input,
  Kbd,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { HiOutlineX } from 'react-icons/hi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PostAPI from '../api/PostAPI';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useAppContext } from '../contexts/AppContext';

const colorSchemes = [
  'blackAlpha',
  'blue',
  'cyan',
  'facebook',
  'gray',
  'green',
  'linkedin',
  'messenger',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'telegram',
  'twitter',
  'whatsapp',
  'yellow'
];

export default function CreatePost() {
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
  const [isPosting, setIsPosting] = useState(false);
  const { currentUser } = useUserAuth();
  const { verse } = useAppContext();
  const toast = useToast();
  const history = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    unregister,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: { tags: [] },
    resolver: yupResolver(schema)
  });
  register('tags');
  const tags = watch('tags');

  const handleAddTag = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === 'Space') {
        e.preventDefault();
        if (e.target.value) {
          console.log(e.target.value);
          setValue('tags', [...tags, e.target.value]);
          e.target.value = '';
        }
      }
    },
    [setValue, tags]
  );

  const handleRemoveTag = useCallback(
    (index) => {
      setValue(
        'tags',
        tags.filter((_, i) => i !== index)
      );
    },
    [setValue, tags]
  );

  // const handleImagesChange = useCallback(
  //   (e) => {
  //     const imagesArray = [];
  //     for (let i = 0; i < e.target.files.length; i += 1) {
  //       imagesArray.push(e.target.files[i]);
  //     }
  //     setValue('images', [...getValues('images'), ...imagesArray]);
  //     trigger('images'); // trigger validate after images change
  //   },
  //   [getValues, setValue, trigger]
  // );

  // const handleRemoveImage = useCallback(
  //   (index) => {
  //     setValue(
  //       'images',
  //       getValues('images').filter((_, i) => i !== index)
  //     );
  //     trigger('images'); // trigger validate after images change
  //   },
  //   [getValues, setValue, trigger]
  // );

  const onSubmit = useCallback(
    (data) => {
      console.log(data);
      setIsPosting(true);
      data.verse = verse;

      PostAPI.create(data).then((response) => {
        // console.log(response);
        setIsPosting(false);
        if (!response.success) {
          toast({
            title: 'Đã có lỗi xảy ra!',
            description: response.message,
            duration: 3000,
            status: 'error'
          });
        } else {
          toast({
            title: 'Đăng bài thành công',
            duration: 3000,
            status: 'success'
          });
          history(`/posts/${verse}/${response.newPostId}`);
          reset();
        }
      });
    },
    [history, reset, toast, verse]
  );

  return (
    <Box
      paddingTop={8}
      paddingBottom={8}
      paddingInlineStart={8}
      paddingInlineEnd={8}
      marginInline="auto"
      maxW="4xl"
      w="100%"
    >
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          {/* <Box flexShrink={0} maxW="2xs" width="100%">
            <Flex
              bg="white"
              boxShadow="sm"
              borderRadius="lg"
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
                columnGap={8}
                rowGap={5}
              >
                <IconButton
                  size="lg"
                  icon={<AddIcon />}
                  onClick={() => {
                    document.getElementById('images').click();
                  }}
                />
                {!!watch('images') &&
                  getValues('images').map((image, i) => (
                    <Box position="relative" key={`image${i + 1}`}>
                      <Image
                        border="1px solid #edf2f7"
                        borderRadius="md"
                        boxSize="12"
                        w={12}
                        src={URL.createObjectURL(image)}
                      />
                      <IconButton
                        position="absolute"
                        icon={<Icon as={HiOutlineX} w="4" h="4" />}
                        size="xs"
                        top={-2.5}
                        right={-2.5}
                        onClick={() => handleRemoveImage(i)}
                      />
                    </Box>
                  ))}
              </Grid>
              {errors.images ? (
                <Text color="red">{errors.images.message}</Text>
              ) : null}
            </Flex>
          </Box> */}
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.keyCode === 'Enter') e.preventDefault();
            }}
            w="full"
          >
            <Box
              bg="white"
              mt={0}
              mb={0}
              w="100%"
              boxShadow="sm"
              borderRadius="lg"
            >
              <Flex
                paddingInlineStart={6}
                paddingInlineEnd={6}
                paddingTop={6}
                paddingBottom={6}
                flexDir="column"
                gap={5}
                w="100%"
              >
                <FormControl>
                  <FormLabel>Tiêu đề và Mô tả</FormLabel>
                  <Input
                    placeholder="Tiêu đề"
                    {...register('title')}
                  />
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
                      {watch('body') ? watch('body').length : 0} /
                      1500 kí tự
                    </FormHelperText>
                  </Flex>
                </FormControl>
                <FormControl>
                  <FormLabel>Gắn thẻ</FormLabel>
                  <Input onKeyDown={(e) => handleAddTag(e)} />
                  <FormHelperText>
                    <Kbd>Enter</Kbd> để thêm thẻ
                  </FormHelperText>
                  {tags ? (
                    <Flex mt={3} gap={2} flexWrap="wrap">
                      {tags.map((tag, i) => (
                        <Box position="relative" key={`tag-${i + 1}`}>
                          <Badge
                            fontSize="1rem"
                            colorScheme={
                              colorSchemes[
                                Math.floor(
                                  Math.random() * colorSchemes.length
                                )
                              ]
                            }
                          >
                            {tag}
                          </Badge>
                          <IconButton
                            position="absolute"
                            background="none"
                            icon={
                              <Icon as={HiOutlineX} w={3} h={3} />
                            }
                            size="xs"
                            top={-3}
                            right={-3}
                            onClick={() => handleRemoveTag(i)}
                          />
                        </Box>
                      ))}
                    </Flex>
                  ) : null}
                </FormControl>
              </Flex>
              <Divider />
              <Flex
                justifyContent="end"
                paddingTop={4}
                paddingBottom={4}
                paddingInlineStart={6}
                paddingInlineEnd={6}
              >
                <Button
                  isLoading={isPosting}
                  type="submit"
                  colorScheme="purple"
                >
                  Đăng câu hỏi
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
