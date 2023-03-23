/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import {
  HiCheck,
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePencil,
  HiOutlineTrash
} from 'react-icons/hi';
import { useMutation, useQuery } from 'react-query';
import AdminAPI from '../api/AdminAPI';
import ChangePermissionMenu from '../components/ChangePermissionMenu';

export default function Reports() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [type, setType] = useState('post');
  const [status, setStatus] = useState('pending');

  const { isLoading, data: reportsData, refetch } = useQuery(
    ['reports', page, type, status],
    () => AdminAPI.getReports(page, type, status),
    { keepPreviousData: true }
  );

  const { mutate: reviewReport, isLoading: isSending } = useMutation(
    (data) => AdminAPI.reviewReport(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast({
            title: response.message,
            status: 'success',
            position: 'top',
            duration: 3000
          });
          refetch();
        } else {
          toast({
            title: response.message,
            status: 'error',
            position: 'top',
            duration: 3000
          });
        }
      },
      onError: () => {
        toast({
          title: 'Xảy ra lỗi không xác định',
          status: 'error',
          position: 'top',
          duration: 3000
        });
      }
    }
  );

  const handleReviewReport = useCallback(
    (reportId) => {
      reviewReport({ reportId });
    },
    [reviewReport]
  );

  const { mutate: deletePost, isLoading: isDeleting } = useMutation(
    (data) => AdminAPI.deletePost(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast({
            title: response.message,
            status: 'success',
            position: 'top',
            duration: 3000
          });
          refetch();
        } else {
          toast({
            title: response.message,
            status: 'error',
            position: 'top',
            duration: 3000
          });
        }
      },
      onError: () => {
        toast({
          title: 'Xảy ra lỗi không xác định',
          status: 'error',
          position: 'top',
          duration: 3000
        });
      }
    }
  );

  return (
    <Box
      paddingTop={8}
      paddingBottom={8}
      paddingInlineStart={8}
      paddingInlineEnd={8}
      marginInline="auto"
      marginTop="2rem"
      maxW="10xl"
      w="100%"
    >
      <Flex background="white" boxShadow="sm" borderRadius="lg">
        <TableContainer whiteSpace="unset" w="full">
          <Flex padding={6} justifyContent="space-between">
            <Text fontWeight="600" fontSize="xl">
              Danh sách báo cáo vi phạm
            </Text>
          </Flex>
          <Flex
            justifyContent="flex-end"
            gap={3}
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <Select
              size="sm"
              w="17%"
              mr={6}
              mb={3}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              {[
                { name: 'Bài đăng', id: 'post' },
                { name: 'Người dùng', id: 'user' }
              ].map(({ name, id }) => (
                <option key={`type-filter-${id}`} value={id}>
                  {name}
                </option>
              ))}
            </Select>
            <Select
              size="sm"
              w="17%"
              mr={6}
              mb={3}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              {[
                { name: 'Đang chờ', id: 'pending' },
                { name: 'Đã duyệt', id: 'reviewed' }
              ].map(({ name, id }) => (
                <option key={`status-filter-${id}`} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Lí do</Th>
                {type === 'post' ? (
                  <Th>Tiêu đề bài đăng</Th>
                ) : (
                  <Th>Tên người dùng</Th>
                )}
                <Th>Người báo cáo</Th>
                <Th>Ngày tạo</Th>
                {status === 'pending' && <Th>Thao tác</Th>}
              </Tr>
            </Thead>
            {isLoading ? (
              <Tbody>
                <Tr>
                  <Td>
                    <Spinner mt={2} ml={2} />
                  </Td>
                </Tr>
              </Tbody>
            ) : (
              <Tbody>
                {reportsData?.data?.length > 0 &&
                  reportsData.data.map((report, i) => (
                    <Tr key={`report-${i + 1}`}>
                      <Td>{report.reason}</Td>
                      {type === 'post' ? (
                        <Td>
                          <Button
                            variant="link"
                            onClick={() => {
                              if (report?.objectData?.title)
                                window.open(
                                  `/posts/${report?.objectData?.university?.slug}/${report?.objectData?.id}`
                                );
                            }}
                          >
                            {report?.objectData?.title || (
                              <Text color="red">
                                Bài đăng đã bị xóa
                              </Text>
                            )}
                          </Button>
                        </Td>
                      ) : (
                        <Td>
                          <Button
                            variant="link"
                            onClick={() => {
                              window.open(
                                `/profile/${report?.objectData?.id}`
                              );
                            }}
                          >
                            {report?.objectData?.display_name}
                          </Button>
                        </Td>
                      )}
                      <Td>
                        <Button
                          variant="link"
                          onClick={() =>
                            window.open(
                              `/profile/${report?.owner?.id}`
                            )
                          }
                        >
                          {report?.owner?.display_name}
                        </Button>
                      </Td>
                      <Td>{report?.created_at}</Td>
                      {status === 'pending' && (
                        <Td>
                          <Flex gap={1}>
                            <IconButton
                              icon={<HiCheck />}
                              fontSize="20px"
                              isLoading={isSending}
                              onClick={() =>
                                handleReviewReport(report?.id)
                              }
                            />
                            {type === 'post' ? (
                              <IconButton
                                colorScheme="red"
                                icon={<HiOutlineTrash />}
                                fontSize="20px"
                                isLoading={isDeleting}
                                onClick={() => {
                                  deletePost({
                                    id: report?.objectData?.id
                                  });
                                }}
                              />
                            ) : (
                              <ChangePermissionMenu
                                canComment={
                                  report?.objectData?.canComment
                                }
                                canCreatePost={
                                  report?.objectData?.canCreatePost
                                }
                                canEditPost={
                                  report?.objectData?.canEditPost
                                }
                                canVote={report?.objectData?.canVote}
                                userId={report?.objectData?.id}
                                refetch={refetch}
                              />
                            )}
                          </Flex>
                        </Td>
                      )}
                    </Tr>
                  ))}
              </Tbody>
            )}
          </Table>
          {!isLoading && reportsData?.data?.length === 0 ? (
            <Box textAlign="center" p="20px	100px" color="gray.800">
              Chưa có dữ liệu
            </Box>
          ) : (
            <Flex justifyContent="space-between" px={6} py={2}>
              <Button
                leftIcon={<HiChevronLeft />}
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                isDisabled={!reportsData?.prev_page_url}
              >
                Trước
              </Button>
              <Button
                rightIcon={<HiChevronRight />}
                onClick={() => setPage((old) => old + 1)}
                isDisabled={!reportsData?.next_page_url}
              >
                Sau
              </Button>
            </Flex>
          )}
        </TableContainer>
      </Flex>
    </Box>
  );
}
