import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Spinner,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HiChevronLeft,
  HiChevronRight,
  HiFlag
} from 'react-icons/hi';
import moment from 'moment';
import UserAPI from '../api/UserAPI';
import UserInfoFormDrawer from '../components/UserInfoFormDrawer';
import { useUserAuth } from '../contexts/UserAuthContext';
import { getAvatarPath } from '../helper/helper';
import ReportUserModal from '../components/ReportUserModal';

export default function ProfilePage() {
  const { id } = useParams();
  const history = useNavigate();
  const { authenticated, currentUser } = useUserAuth();
  const [page, setPage] = useState(1);
  const { isLoading, data, refetch } = useQuery(
    ['profile-page', id, page],
    () => UserAPI.getUserInfo(id, page)
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [
    isOpenUserInfoFormDrawer,
    setIsOpenUserInfoFormDrawer
  ] = useState(false);

  const toggleReportModal = useCallback(() => {
    setIsReportModalOpen((prev) => !prev);
  }, []);
  const toggleUserInfoFormDrawer = useCallback(() => {
    setIsOpenUserInfoFormDrawer((prev) => !prev);
  }, []);

  return isLoading ? (
    <Spinner />
  ) : (
    <Flex w="5xl" minW="sm" mx="auto" my={8} gap={8} flexDir="column">
      {data.userInfo.id === currentUser?.id && (
        <UserInfoFormDrawer
          isOpen={isOpenUserInfoFormDrawer}
          onClose={toggleUserInfoFormDrawer}
          userData={data.userInfo}
          refetch={refetch}
        />
      )}
      <Flex justifyContent="space-between">
        <Flex alignItems="center" gap={5}>
          <Avatar
            bg="purple.200"
            size="2xl"
            src={getAvatarPath(data?.userInfo?.avatar?.name)}
          />
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
        {authenticated && data?.userInfo?.id !== currentUser?.id && (
          <>
            <ReportUserModal
              isOpen={isReportModalOpen}
              onClose={toggleReportModal}
              userId={data?.userInfo?.id}
            />
            <Tooltip label="Báo cáo người dùng này">
              <IconButton
                icon={<HiFlag fontSize="1.5rem" />}
                onClick={toggleReportModal}
              />
            </Tooltip>
          </>
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
              {data.posts.data.length > 0 ? (
                data.posts.data.map((post, i) => (
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
                    key={`profile-page-post-${i + 1}`}
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
                    <Flex alignItems="center" gap={2}>
                      <Badge bg="purple.400" color="white">
                        {post?.university?.slug}
                      </Badge>
                      <Text>Aug 18, 2021</Text>
                    </Flex>
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
            {data.posts.data.length > 0 && (
              <Flex justifyContent="space-between" px={6} py={2}>
                <Button
                  leftIcon={<HiChevronLeft />}
                  onClick={() =>
                    setPage((old) => Math.max(old - 1, 0))
                  }
                  isDisabled={!data.posts?.prev_page_url}
                >
                  Trước
                </Button>
                <Button
                  rightIcon={<HiChevronRight />}
                  onClick={() => setPage((old) => old + 1)}
                  isDisabled={!data.posts?.next_page_url}
                >
                  Sau
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
