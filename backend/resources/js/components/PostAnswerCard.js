/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useState } from 'react';
import {
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
import { HiCheck, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PostAPI from '../api/PostAPI';
import { useUserAuth } from '../contexts/UserAuthContext';
import Comment from './Comment';
import CommentAPI from '../api/CommentAPI';

export default function PostAnswerCard({
  verse,
  postId,
  parentAuthorId
}) {
  const [isOpenCommentInput, setIsOpenCommentInput] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const { authenticated, currentUser } = useUserAuth();
  const toast = useToast();
  const history = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const { isLoading, data, refetch } = useQuery(
    ['postAnswer', verse, postId],
    () => PostAPI.getPostAnswer(verse, postId)
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

  const handleMarkAsAcceptdAnswer = useCallback(() => {
    PostAPI.markAsAcceptedAnswer({
      postId: data?.post?.parent_id,
      acceptedAnswerId: data?.post?.id
    }).then((response) => {
      if (response.success) {
        toast({
          title: response.message,
          duration: 3000,
          status: 'success'
        });
        refetch();
      } else {
        toast({
          title: 'Có lỗi xảy ra',
          duration: 3000,
          status: 'error'
        });
      }
    });
  }, [data?.post?.id, data?.post?.parent_id, refetch, toast]);

  if (isLoading)
    return (
      <Flex
        background="white"
        boxShadow="xl"
        borderRadius="md"
        flexDir="column"
        p={5}
      >
        <SkeletonText noOfLines={4} spacing={4} />
      </Flex>
    );

  if (!isLoading && !data?.success) {
    return null;
  }

  return (
    <Flex p={4} gap={4} borderBottomWidth={1} borderColor="gray.200">
      <Flex flexDir="column" alignItems="center" w="75px">
        <IconButton
          onClick={() => handleUpvote(data.post.id)}
          icon={
            <Icon
              as={HiChevronUp}
              w={10}
              h={10}
              color={data.post.isUpvoted ? 'purple.500' : 'gray.300'}
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
        {currentUser?.id === parentAuthorId ? (
          <IconButton
            onClick={handleMarkAsAcceptdAnswer}
            icon={
              <Icon
                as={HiCheck}
                w={10}
                h={10}
                color={
                  data.post.isAcceptedAnswer
                    ? 'green.600'
                    : 'gray.300'
                }
              />
            }
            size="lg"
            background="none"
            w="75px"
            mt={2}
            _hover={{ background: 'none' }}
            _focus={{ border: 'none' }}
          />
        ) : null}
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
          <Flex justifyContent="flex-end">
            <Flex
              flexDir="column"
              backgroundColor="purple.200"
              p={2}
              borderRadius="md"
              alignItems="flex-start"
            >
              <Text color="gray.700">
                Đã trả lời vào{' '}
                {moment(new Date(data.post.created_at)).format('lll')}
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
                  {...register('comment', {
                    required: true
                  })}
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
  );
}
