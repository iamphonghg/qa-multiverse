/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Container,
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
import AuthAPI from '../api/UserAuthAPI';
import { useUserAuth } from '../contexts/UserAuthContext';
import { getIntendedUrl, setUserToken } from '../utils/userAuth';

export default function LogIn() {
  const { setCurrentUser } = useUserAuth();
  const history = useNavigate();
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

  const onSubmit = useCallback(
    (data) => {
      AuthAPI.login(data)
        .then((response) => {
          if (response.success) {
            setUserToken(response.token.access_token);
            setCurrentUser(response.user);
            toast({
              title: 'Đăng nhập thành công!',
              position: 'top',
              duration: 3000,
              status: 'success'
            });
            history('/');
          } else {
            reset();
            toast({
              title: 'Đăng nhập thất bại!',
              position: 'top',
              description: response.message,
              duration: 5000,
              status: 'error'
            });
          }
        })
        .catch(() => {
          toast({
            title: 'Lỗi không xác định!',
            position: 'top',
            description: 'Vui lòng thử lại',
            duration: 5000,
            status: 'error'
          });
        });
    },
    [history, reset, setCurrentUser, toast]
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
              Đăng nhập vào Hỏi đáp đa vũ trụ
            </Text>
            <HStack justify="center">
              <Text color="muted">Chưa có tài khoản?</Text>
              <Button
                variant="link"
                colorScheme="purple"
                onClick={() => history('/register')}
              >
                Đăng ký
              </Button>
            </HStack>
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
                    type="email"
                    {...register('email')}
                    focusBorderColor="purple.500"
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
              {/* <HStack justify="space-between">
                <Checkbox defaultIsChecked colorScheme="purple">
                  Nhớ mật khẩu
                </Checkbox>
                <Button variant="link" colorScheme="purple" size="sm">
                  Quên mật khẩu?
                </Button>
              </HStack> */}
              <Stack spacing="6">
                <Button type="submit" colorScheme="purple">
                  Đăng nhập
                </Button>
                {/* <HStack>
                  <Divider />
                  <Text
                    fontSize="sm"
                    whiteSpace="nowrap"
                    color="muted"
                  >
                    hoặc đăng nhập bằng
                  </Text>
                  <Divider />
                </HStack>
                <OAuthButtonGroup /> */}
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
