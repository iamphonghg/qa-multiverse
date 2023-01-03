import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function WebLayout() {
  return (
    <Box h="full">
      <NavBar />
      <Box position="relative">
        <Outlet />
      </Box>
    </Box>
  );
}
