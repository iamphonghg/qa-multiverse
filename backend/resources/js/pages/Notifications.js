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
  Tr
} from '@chakra-ui/react';
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePencil,
  HiOutlineTrash
} from 'react-icons/hi';
import { useQuery } from 'react-query';
import { AddIcon } from '@chakra-ui/icons';
import AdminAPI from '../api/AdminAPI';
import NotificationFormDrawer from '../components/NotificationFormDrawer';

const labelVariant = {
  info: 'Thông tin',
  warning: 'Cảnh báo',
  dangerous: 'Nguy hiểm'
};

export default function Notifications() {
  const [page, setPage] = useState(1);

  const [isNotiFormOpen, setIsNotiFormOpen] = useState(false);
  const toggleNotiForm = useCallback(() => {
    setIsNotiFormOpen((prev) => !prev);
  }, []);

  const { isLoading, data: notisData, refetch } = useQuery(
    ['admin-notifications', page],
    () => AdminAPI.getNotifications(page),
    { keepPreviousData: true }
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
      <NotificationFormDrawer
        isOpen={isNotiFormOpen}
        onClose={toggleNotiForm}
        refetch={refetch}
      />
      <Flex background="white" boxShadow="sm" borderRadius="lg">
        <TableContainer whiteSpace="unset" w="full">
          <Flex padding={6} justifyContent="space-between">
            <Text fontWeight="600" fontSize="xl">
              Thông báo
            </Text>
            <IconButton icon={<AddIcon />} onClick={toggleNotiForm} />
          </Flex>
          {/* <Flex
            justifyContent="flex-end"
            gap={3}
            borderBottom="1px solid"
            borderColor="gray.100"
          ></Flex> */}
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tiêu đề</Th>
                <Th>Mô tả</Th>
                <Th>Loại</Th>
                <Th>Dành cho 1 người dùng</Th>
                <Th>Ngày tạo</Th>
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
                {notisData?.data?.length > 0 &&
                  notisData.data.map((noti, i) => (
                    <Tr key={`admin-noti-${i + 1}`}>
                      <Td>{noti?.title}</Td>
                      <Td>{noti?.description}</Td>
                      <Td>{labelVariant[noti?.variant]}</Td>
                      <Td>{noti?.target_user?.email}</Td>
                      <Td>{noti?.created_at}</Td>
                    </Tr>
                  ))}
              </Tbody>
            )}
          </Table>
          {!isLoading && notisData?.data?.length === 0 ? (
            <Box textAlign="center" p="20px	100px" color="gray.800">
              Chưa có dữ liệu
            </Box>
          ) : (
            <Flex justifyContent="space-between" px={6} py={2}>
              <Button
                leftIcon={<HiChevronLeft />}
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                isDisabled={!notisData?.prev_page_url}
              >
                Trước
              </Button>
              <Button
                rightIcon={<HiChevronRight />}
                onClick={() => setPage((old) => old + 1)}
                isDisabled={!notisData?.next_page_url}
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
