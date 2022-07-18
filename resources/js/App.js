import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppFrame from './layouts/AppFrame';
import AuthProvider from './contexts/AuthContext';
import AppProvider from './contexts/AppContext';

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AuthProvider>
            <AppFrame />
          </AuthProvider>
        </AppProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
