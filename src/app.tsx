import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Global, css, ThemeProvider } from '@emotion/react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { hot } from 'react-hot-loader/root';

import type { ReactElement } from 'react';

import { useSelector } from 'hooks/store';

import store from './store';
import routes from './routes';
import themes from './themes';

const i18nInstance = i18next.createInstance();

const Container = (): ReactElement => {
  const content = useRoutes(routes);

  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      {content}
    </>
  );
};

const App = (): JSX.Element => {
  const theme = useSelector((state) => state.global.theme);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <Router>
          <ThemeProvider theme={themes[theme]}>
            <Container />
          </ThemeProvider>
        </Router>
      </I18nextProvider>
    </Provider>
  );
};

export default hot(App);
