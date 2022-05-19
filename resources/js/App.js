import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import AppFrame from './layouts/AppFrame';

export default function App() {
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: 'gray.50'
        }
      }
    },
    fonts: {
      body: "'SF Pro Display', sans-serif",
      logoFont: "'Sofia', cursive;"
    }
  });

  return (
    <ChakraProvider theme={theme}>
      <AppFrame />
    </ChakraProvider>
  );
}
