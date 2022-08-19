import React, { useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useAppContext } from '../contexts/AppContext';

export default function PostCard({ post }) {
  const history = useNavigate();

  const {
    title,
    id,
    score,
    answersCount,
    user,
    created_at: createdAt
  } = post;

  const { verse } = useAppContext();

  const handleClickPostCard = useCallback(
    (e) => {
      const clicked = e.target;
      console.log(clicked);
      const target = clicked.tagName.toLowerCase();
      const ignores = ['button', 'svg'];
      if (!ignores.includes(target)) {
        history(`/posts/${verse}/${id}`);
      }
    },
    [history, id, verse]
  );

  return (
    <Flex
      onClick={handleClickPostCard}
      cursor="pointer"
      background="white"
      boxShadow="xl"
      borderRadius="md"
      _hover={{ boxShadow: '2xl' }}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        borderRightWidth={1}
        borderColor="gray.100"
      >
        <Flex
          flexDir="column"
          gap={1}
          p={4}
          alignItems="flex-end"
          w="120px"
        >
          <Text>{score} điểm</Text>
          <Text color="gray.500">{answersCount} câu trả lời</Text>
        </Flex>
      </Flex>
      <Flex p={4} flexDir="column" gap={2} w="full">
        <Flex flexDir="column">
          <Box fontSize="lg" fontWeight="600">
            {title}
          </Box>
        </Flex>
        <Flex justifyContent="flex-end" gap={3} alignItems="center">
          <Text>{user.display_name}</Text>
          <Text fontSize="sm" color="gray.400" fontWeight="500">
            đã hỏi{' '}
            {moment(new Date(createdAt))
              .locale('vi')
              .fromNow()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
