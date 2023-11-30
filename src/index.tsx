import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { DevSupport } from '@react-buddy/ide-toolbox';

import App from './app';
import store from './store';
import './locales';
import { ComponentPreviews, useInitial } from './dev';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

const container = document.querySelector('#app');

if (container) {
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
          <StrictMode>
            <App />
          </StrictMode>
        </DevSupport>
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </Provider>,
  );
}
