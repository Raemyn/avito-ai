import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(

  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={{
      fontFamily: 'var(--font-family)',

      headings: {
        fontFamily: 'var(--second-family)',
      },
    }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </QueryClientProvider>

);