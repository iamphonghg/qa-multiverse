import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import UserAPI from '../api/UserAPI';
import UserInfoFormDrawer from '../components/UserInfoFormDrawer';
import { useUserAuth } from '../contexts/UserAuthContext';

export default function ProfilePage() {
  const { id } = useParams();
  const history = useNavigate();
  const { currentUser } = useUserAuth();
  const { isLoading, data } = useQuery(['profile-page', id], () =>
    UserAPI.getUserInfo(id)
  );
  const [
    isOpenUserInfoFormDrawer,
    setIsOpenUserInfoFormDrawer
  ] = useState(false);

  const toggleUserInfoFormDrawer = useCallback(() => {
    setIsOpenUserInfoFormDrawer((prev) => !prev);
  }, []);

  console.log(data);

  return isLoading ? (
    <Spinner />
  ) : (
    <Flex w="5xl" minW="sm" mx="auto" my={8} gap={8} flexDir="column">
      {data.userInfo.id === currentUser?.id && (
        <UserInfoFormDrawer
          isOpen={isOpenUserInfoFormDrawer}
          onClose={toggleUserInfoFormDrawer}
          userData={data.userInfo}
        />
      )}
      <Flex justifyContent="space-between">
        <Flex alignItems="center" gap={5}>
          <Avatar size="2xl" />
          <Flex flexDir="column">
            <Text fontWeight={500} fontSize="3xl">
              {data.userInfo.display_name}
            </Text>
            <Text>
              Tham gia vào:{' '}
              {moment(data.userInfo.created_at).format('lll')}
            </Text>
          </Flex>
        </Flex>
        {data.userInfo.id === currentUser?.id && (
          <Button onClick={toggleUserInfoFormDrawer}>
            Sửa thông tin
          </Button>
        )}
      </Flex>
      <Flex gap={6}>
        <Flex flexDir="column" gap={2} w="30%">
          <Text fontWeight={500} fontSize="2xl">
            Thống kê
          </Text>
          <Grid
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor="purple.200"
            gap={6}
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
          >
            <GridItem>
              <Flex flexDir="column" alignItems="center">
                <Text fontSize="xl" fontWeight={500}>
                  {data.userInfo.reputation}
                </Text>
                <Text>Điểm uy tín</Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex flexDir="column" alignItems="center">
                <Text fontSize="xl" fontWeight={500}>
                  {data.stats.answerCount}
                </Text>
                <Text>Câu trả lời</Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex flexDir="column" alignItems="center">
                <Text fontSize="xl" fontWeight={500}>
                  {data.stats.postCount}
                </Text>
                <Text>Câu hỏi</Text>
              </Flex>
            </GridItem>
          </Grid>
        </Flex>
        <Flex flexDir="column" w="full" gap={4}>
          <Flex flexDir="column" gap={2} w="full">
            <Text fontWeight={500} fontSize="2xl">
              Về tôi
            </Text>
            <Flex
              w="full"
              justifyContent="center"
              alignItems="center"
              backgroundColor="purple.100"
              borderRadius="md"
              p={4}
            >
              {data.userInfo.about ? (
                <Text alignItems="center">{data.userInfo.about}</Text>
              ) : (
                <Text alignItems="center">
                  Mục 'Về tôi' hiện tại đang trống.
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex flexDir="column" gap={2} w="full">
            <Text fontWeight={500} fontSize="2xl">
              Top bài đăng
            </Text>
            <Flex
              w="full"
              border="1px solid"
              borderColor="purple.200"
              borderRadius="md"
              flexDir="column"
            >
              {data.posts.length > 0 ? (
                data.posts.map((post) => (
                  <Flex
                    justifyContent="space-between"
                    p={2}
                    borderBottomWidth={1}
                    borderBottomColor="purple.200"
                    cursor="pointer"
                    alignItems="center"
                    onClick={() => {
                      if (post.parent_id) {
                        history(
                          `/posts/${post?.university?.slug}/${post.parent_id}`
                        );
                      } else {
                        history(
                          `/posts/${post?.university?.slug}/${post.id}`
                        );
                      }
                    }}
                  >
                    <Flex w="70%" gap={2}>
                      <Flex gap={2} alignItems="center">
                        {post.parent_id ? (
                          <Text
                            p="5px 10px"
                            backgroundColor="white"
                            color="purple.500"
                            borderRadius="md"
                            fontWeight={500}
                            border="1px solid"
                            borderColor="purple.500"
                          >
                            A
                          </Text>
                        ) : (
                          <Text
                            p="5px 10px"
                            backgroundColor="purple.500"
                            color="white"
                            borderRadius="md"
                            fontWeight={500}
                          >
                            Q
                          </Text>
                        )}
                        <Text
                          fontSize="xl"
                          fontWeight={500}
                          p="5px 10px"
                          border="2px solid"
                          borderColor="purple.500"
                          borderRadius="md"
                          w="60px"
                          textAlign="center"
                        >
                          {post.score}
                        </Text>
                      </Flex>
                      <Text>{post.title || post.body}</Text>
                    </Flex>
                    <Text>Aug 18, 2021</Text>
                  </Flex>
                ))
              ) : (
                <Flex
                  w="full"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="purple.100"
                  borderRadius="md"
                  p={4}
                >
                  <Text alignItems="center">Chưa có bài đăng</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
