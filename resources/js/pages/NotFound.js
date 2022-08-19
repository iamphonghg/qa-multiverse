/* eslint-disable react/prop-types */
import { Button, Flex, Img, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound({
  message = 'Tin đăng không tồn tại hoặc bị ẩn'
}) {
  const history = useNavigate();

  return (
    <Flex
      justifyContent="center"
      flexDir="column"
      alignItems="center"
      gap={5}
      py={5}
    >
      <Img boxSize="400px" src="/img/post_not_found.svg" />
      <Text fontSize="2xl" fontWeight="bold">
        {message}
      </Text>
      <Button colorScheme="purple" onClick={() => history('/')}>
        Về trang chủ
      </Button>
    </Flex>
  );
}
