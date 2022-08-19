import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar';

export default function DashboardLayout() {
  return (
    <Flex flexWrap="nowrap" maxH="100vh" bg="gray.50">
      <SideBar />
      <Flex w="full" flexDir="column" overflowY="scroll">
        <Outlet />
      </Flex>
    </Flex>
  );
}
