import '../styles/globals.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import AppProvider from '../contexts/AppContext';

function MyApp({ Component, pageProps }) {
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
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
