/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  SkeletonText,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PostAPI from '../api/PostAPI';
import Comment from './Comment';
import { useUserAuth } from '../contexts/UserAuthContext';
import CommentAPI from '../api/CommentAPI';

export default function DetailPostCard({ verse, postId }) {
  const [isOpenCommentInput, setIsOpenCommentInput] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const { authenticated } = useUserAuth();
  const toast = useToast();
  const history = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const { isLoading, data, refetch } = useQuery(
    ['detail-post', verse, postId],
    () => PostAPI.show(verse, postId)
  );

  const handleUpvote = useCallback(
    (id) => {
      if (authenticated) {
        PostAPI.upvote({ postId: id }).then(() => {
          refetch();
        });
      } else {
        toast({
          title: 'Vui lòng đăng nhập để sử dụng',
          duration: 3000,
          status: 'warning',
          position: 'top'
        });
      }
    },
    [authenticated, refetch, toast]
  );

  const handleDownvote = useCallback(
    (id) => {
      if (authenticated) {
        PostAPI.downvote({ postId: id }).then(() => {
          refetch();
        });
      } else {
        toast({
          title: 'Vui lòng đăng nhập để sử dụng',
          duration: 3000,
          status: 'warning',
          position: 'top'
        });
      }
    },
    [authenticated, refetch, toast]
  );

  const handleComment = useCallback(
    ({ comment }) => {
      if (authenticated) {
        setIsCommenting(true);
        CommentAPI.comment({
          postId: data?.post?.id,
          body: comment
        })
          .then((response) => {
            setIsCommenting(false);
            toast({
              title: response.message,
              duration: 3000,
              status: response.success ? 'success' : 'error'
            });
            reset();
            refetch();
            setIsOpenCommentInput(false);
          })
          .catch(() => {
            setIsCommenting(false);
            toast({
              title: 'Lỗi không xác định',
              duration: 3000,
              status: 'error'
            });
          });
      } else {
        toast({
          title: 'Vui lòng đăng nhập để sử dụng',
          duration: 3000,
          status: 'warning',
          position: 'top'
        });
      }
    },
    [authenticated, data?.post?.id, refetch, reset, toast]
  );

  if (isLoading)
    return (
      <Flex
        background="white"
        boxShadow="xl"
        borderRadius="md"
        flexDir="column"
        p={5}
      >
        <SkeletonText noOfLines={6} spacing={8} />
      </Flex>
    );

  if (!isLoading && !data?.success) {
    return null;
  }

  return (
    <Flex
      background="white"
      boxShadow="xl"
      borderRadius="md"
      flexDir="column"
    >
      <Flex
        p={4}
        borderBottomWidth={1}
        borderColor="gray.200"
        flexDir="column"
      >
        <Text fontSize="3xl" fontWeight={500}>
          {data.post.title}
        </Text>
        <Text color="gray.500">
          Đã hỏi {moment(new Date(data.post.created_at)).fromNow()}
        </Text>
      </Flex>
      <Flex p={4} gap={4}>
        <Flex flexDir="column" alignItems="center" w="90px">
          <IconButton
            onClick={() => handleUpvote(data.post.id)}
            icon={
              <Icon
                as={HiChevronUp}
                w={10}
                h={10}
                color={
                  data.post.isUpvoted ? 'purple.500' : 'gray.300'
                }
              />
            }
            size="lg"
            background="none"
            w="75px"
            _hover={{ background: 'none' }}
            _focus={{ border: 'none' }}
          />
          <Text
            fontSize="2xl"
            fontWeight="600"
            color={
              data.post.isUpvoted || data.post.isDownvoted
                ? 'gray.600'
                : 'gray.500'
            }
          >
            {data.post.score}
          </Text>
          <IconButton
            onClick={() => handleDownvote(data.post.id)}
            icon={
              <Icon
                as={HiChevronDown}
                w={10}
                h={10}
                color={
                  data.post.isDownvoted ? 'purple.500' : 'gray.300'
                }
              />
            }
            size="lg"
            background="none"
            w="75px"
            _hover={{ background: 'none' }}
            _focus={{ border: 'none' }}
          />
        </Flex>
        <Flex flexDir="column" w="full">
          <Flex
            flexDir="column"
            gap={4}
            pb={4}
            borderBottomWidth={1}
            borderColor="gray.200"
          >
            <Text whiteSpace="pre-wrap">{data.post.body}</Text>
            <Flex gap={2}>
              {data.post.tags.map((tag) => (
                <Badge key={`tag-${tag.name}`}>{tag.name}</Badge>
              ))}
            </Flex>
            <Flex justifyContent="flex-end">
              <Flex
                flexDir="column"
                backgroundColor="purple.200"
                p={2}
                borderRadius="md"
                alignItems="flex-start"
              >
                <Text color="gray.700">
                  Đã hỏi vào{' '}
                  {moment(new Date(data.post.created_at)).format(
                    'lll'
                  )}
                </Text>
                <Button
                  variant="link"
                  fontWeight={500}
                  onClick={() =>
                    history(`/profile/${data.post.user.id}`)
                  }
                >
                  {data.post.user.display_name}
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir="column" alignItems="flex-start">
            {data.post.comments.map((comment, i) => (
              <Comment
                key={`comment-${i + 1}-${comment.body}`}
                body={comment.body}
                author={comment.user}
                createdAt={comment.created_at}
              />
            ))}
            <Box w="full">
              <Collapse
                in={isOpenCommentInput}
                animateOpacity
                w="full"
                style={{ overflow: 'inherit' }}
              >
                <Flex
                  w="full"
                  gap={2}
                  mt={4}
                  as="form"
                  onSubmit={handleSubmit(handleComment)}
                >
                  <Textarea
                    {...register('comment', { required: true })}
                    focusBorderColor="purple.500"
                  />
                  <Button
                    type="submit"
                    colorScheme="purple"
                    isLoading={isCommenting}
                  >
                    Thêm bình luận
                  </Button>
                </Flex>
              </Collapse>
            </Box>
            {!isOpenCommentInput ? (
              <Button
                variant="link"
                mt={4}
                onClick={() => setIsOpenCommentInput((prev) => !prev)}
              >
                Thêm bình luận
              </Button>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
