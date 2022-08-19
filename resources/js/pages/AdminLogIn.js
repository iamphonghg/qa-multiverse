/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import { OAuthButtonGroup } from '../components/OAuthButtonGroup';
import AdminAuthAPI from '../api/AdminAuthAPI';
import { setAdminToken } from '../utils/adminAuth';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminLogIn() {
  const { setCurrentAdmin } = useAdminAuth();
  const history = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm();

  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };
  // const wait = (ms) =>
  // new Promise((resolve) => setTimeout(resolve, ms));
  const onSubmit = useCallback(
    (data) => {
      setIsSubmitting(true);
      AdminAuthAPI.login(data)
        .then((response) => {
          setIsSubmitting(false);
          if (!response.error) {
            setAdminToken(response.token.admin_access_token);
            setCurrentAdmin(response.admin);
            toast({
              title: 'Đăng nhập thành công!',
              duration: 3000,
              status: 'success'
            });
            history('/admin');
          } else {
            reset();
            toast({
              title: 'Email hoặc mật khẩu không chính xác!',
              description: 'Vui lòng thử lại',
              duration: 3000,
              status: 'error'
            });
          }
        })
        .catch(() => {
          setIsSubmitting(false);
          toast({
            title: 'Lỗi không xác định',
            description: 'Vui lòng thử lại',
            duration: 3000,
            status: 'error'
          });
        });
    },
    [history, reset, setCurrentAdmin, toast]
  );

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
      h="full"
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing="2" textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" lineHeight="1.2">
              Đăng nhập vào Trang quản lý
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useBreakpointValue({
            base: 'white'
          })}
          boxShadow={{
            base: 'none',
            sm: useColorModeValue('md', 'md-dark')
          }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    focusBorderColor="purple.500"
                    type="email"
                    {...register('email')}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                  <InputGroup>
                    <Input
                      focusBorderColor="purple.500"
                      ref={inputRef}
                      type={isOpen ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password')}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="link"
                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                        onClick={onClickReveal}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Stack>
              <Stack spacing="6">
                <Button
                  type="submit"
                  colorScheme="purple"
                  isLoading={isSubmitting}
                >
                  Đăng nhập
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
