/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Text
} from '@chakra-ui/react';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineFlag,
  HiOutlinePresentationChartLine,
  HiOutlineLogout
} from 'react-icons/hi';
import {
  Link as NavLink,
  useLocation,
  useNavigate
} from 'react-router-dom';
import AdminAuthAPI from '../api/AdminAuthAPI';
import {
  getAdminIntendedUrl,
  setAdminIntendedUrl,
  setAdminToken
} from '../utils/adminAuth';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const siderBarItems = [
  {
    title: 'Trang chủ',
    url: '/admin',
    icon: HiOutlineHome
  },
  {
    title: 'Người dùng',
    url: '/admin/users',
    icon: HiOutlineUser
  }
];

export default function SideBar() {
  const location = useLocation();
  const { setCurrentAdmin } = useAdminAuth();
  const history = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogOut = useCallback(() => {
    setIsSubmitting(true);
    AdminAuthAPI.logout().then((response) => {
      setIsSubmitting(false);
      if (response.success) {
        setCurrentAdmin(null);
        setAdminToken(null);
        history(getAdminIntendedUrl());
        setAdminIntendedUrl(null);
      }
    });
  }, [history, setCurrentAdmin]);

  return (
    <Flex
      width="sm"
      pb={8}
      pt={8}
      paddingInlineStart={6}
      paddingInlineEnd={6}
      background="purple.700"
      color="white"
      height="100vh"
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex flexDir="column" width="full">
        <Box display="inline-block" flex="0 0 auto">
          <Text
            fontSize="2xl"
            color="white"
            fontWeight="500"
            fontFamily="logoFont"
          >
            qaMultiverse
          </Text>
        </Box>
        <Box
          mt={6}
          marginInline={0}
          mb={0}
          display="inline-block"
          flex="0 0 auto"
        >
          <Flex flexDir="column">
            {siderBarItems.map((item, i) => (
              <Link
                as={NavLink}
                key={`sidebaritem-${i + 1}`}
                display="inline-flex"
                appearance="none"
                alignItems="center"
                justifyContent="start"
                whiteSpace="nowrap"
                verticalAlign="middle"
                borderRadius="lg"
                minW={10}
                h={10}
                transitionProperty="common"
                transitionDuration="normal"
                fontWeight="medium"
                color="gray.200"
                to={item.url}
                _hover={{
                  textDecoration: 'none',
                  background: 'purple.600'
                }}
                mt={1}
                marginInline={0}
                mb={0}
                paddingInlineStart={4}
                paddingInlineEnd={4}
                {...(location.pathname === item.url
                  ? { bg: 'purple.500', color: 'white' }
                  : {})}
              >
                <Flex alignItems="center" gap={2}>
                  <Icon as={item.icon} w={6} h={6} />
                  <Text fontSize="1.1rem">{item.title}</Text>
                </Flex>
              </Link>
            ))}
          </Flex>
        </Box>
      </Flex>
      <Flex justifyContent="center">
        <Button
          variant="link"
          color="white"
          rightIcon={<HiOutlineLogout />}
          onClick={handleLogOut}
          isLoading={isSubmitting}
        >
          Đăng xuất
        </Button>
      </Flex>
    </Flex>
  );
}
