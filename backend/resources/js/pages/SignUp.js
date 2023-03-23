/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
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
import UserAuthAPI from '../api/UserAuthAPI';

export default function SignUp() {
  const history = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const onSubmit = useCallback(
    (data) => {
      UserAuthAPI.register(data).then((response) => {
        if (!response.error) {
          toast({
            title: 'Đăng ký thành công',
            description: 'Vui lòng đăng nhập vào hệ thống',
            duration: 3000,
            status: 'success'
          });
          history('/login');
        } else {
          reset();
          toast({
            title: 'Email đã tồn tại',
            description: 'Vui lòng thử lại',
            duration: 3000,
            status: 'error'
          });
        }
      });
    },
    [history, reset, toast]
  );

  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
      h="full"
    >
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" lineHeight="1.2">
            Đăng ký tài khoản
          </Text>
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
                <FormControl isRequired>
                  <FormLabel htmlFor="fullName">Họ tên</FormLabel>
                  <Input {...register('fullName')} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input type="email" {...register('email')} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                  <InputGroup>
                    <Input
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
                <Button type="submit" colorScheme="purple">
                  Đăng ký
                </Button>
                <HStack justify="center">
                  <Text color="muted">Đã có tài khoản?</Text>
                  <Button
                    variant="link"
                    colorScheme="purple"
                    onClick={() => history('/login')}
                  >
                    Đăng nhập
                  </Button>
                </HStack>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
