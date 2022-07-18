import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import ClampLines from 'react-clamp-lines';
import { useAuth } from '../contexts/AuthContext';
import PostAPI from '../api/PostAPI';

export default function PostCard({ post, isDetailPage = false }) {
  const history = useNavigate();
  const { authenticated } = useAuth();

  const {
    title,
    body,
    id,
    score,
    isUpvoted,
    isDownvoted,
    answersCount
  } = post;
  const [currentScore, setCurrentScore] = useState(score);
  const [currentIsUpvoted, setCurrentIsUpvoted] = useState(isUpvoted);
  const [currentIsDownvoted, setCurrentIsDownvoted] = useState(
    isDownvoted
  );
  const handleClickPostCard = useCallback(
    (e) => {
      const clicked = e.target;
      console.log(clicked);
      const target = clicked.tagName.toLowerCase();
      const ignores = ['button', 'svg'];
      if (!ignores.includes(target)) {
        history(`/posts/${id}`);
      }
    },
    [history, id]
  );

  const handleUpvote = useCallback(() => {
    if (authenticated) {
      PostAPI.upvote({ postId: id }).then((response) => {
        if (response.success) {
          if (currentIsUpvoted) {
            setCurrentScore((prev) => prev - 1);
          } else {
            setCurrentScore((prev) => prev + 1);
          }
          setCurrentIsUpvoted((prev) => !prev);
        }
      });
    }
  }, [authenticated, currentIsUpvoted, id]);

  const handleDownvote = useCallback(() => {
    if (authenticated) {
      PostAPI.downvote({ postId: id }).then((response) => {
        if (response.success) {
          if (currentIsDownvoted) {
            setCurrentScore((prev) => prev + 1);
          } else {
            setCurrentScore((prev) => prev - 1);
          }
          setCurrentIsDownvoted((prev) => !prev);
        }
      });
    }
  }, [authenticated, currentIsDownvoted, id]);

  return (
    <Flex
      onClick={!isDetailPage ? handleClickPostCard : null}
      cursor={isDetailPage ? 'unset' : 'pointer'}
      background="white"
      boxShadow="sm"
      borderRadius="2xl"
      _hover={{ boxShadow: isDetailPage ? 'sm' : 'md' }}
    >
      <Flex
        w="25%"
        justifyContent="center"
        alignItems="center"
        borderRightWidth={1}
        borderColor="gray.100"
      >
        <Flex flexDir="column" gap="2" p={4} alignItems="center">
          <IconButton
            icon={<HiChevronUp />}
            size="xs"
            colorScheme={currentIsUpvoted ? 'blue' : 'gray'}
            onClick={handleUpvote}
          />
          <Text fontSize="2xl" fontWeight="600">
            {currentScore}
          </Text>
          <IconButton
            icon={<HiChevronDown />}
            size="xs"
            onClick={handleDownvote}
            colorScheme={currentIsDownvoted ? 'blue' : 'gray'}
          />
        </Flex>
      </Flex>
      <Flex p={4} flexDir="column" gap={2}>
        <Flex flexDir="column">
          <Box fontSize="lg" fontWeight="600">
            {title}
          </Box>
          <Box fontSize="sm" color="gray.500">
            {isDetailPage ? (
              body
            ) : (
              <ClampLines
                text={body}
                lines={2}
                ellipsis="..."
                buttons={false}
                innerElement="p"
              />
            )}
          </Box>
        </Flex>
        <Flex justifyContent="flex-end" gap={3}>
          <Text fontSize="sm" color="gray.400" fontWeight="500">
            1 hours ago
          </Text>
          <Text fontSize="sm" fontWeight="500">
            {answersCount} answers
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
