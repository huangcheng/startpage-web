import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Global, css, ThemeProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import Cookie from 'js-cookie';

import { hot } from 'react-hot-loader/root';

import type { ReactElement } from 'react';

import { default as i18n } from 'locales';
import { useDispatch, useSelector } from 'hooks/store';
import { useUserInfoMutation } from 'hooks/request';
import { useUser } from 'hooks/store/user';
import { setUser } from 'reducers/user';

import store from './store';
import routes from './routes';
import themes from './themes';

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
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.global.theme);
  const locale = useSelector((state) => state.global.locale);
  const token = useMemo(() => Cookie.get('token'), []);
  const user = useUser();
  const { mutate, data } = useUserInfoMutation();

  useEffect(() => {
    if (i18n.isInitialized) {
      void i18n.changeLanguage(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (token !== undefined && token.length > 0 && user === undefined) {
      mutate();
    }
  }, [token, mutate, user]);

  useEffect(() => {
    if (user === undefined && data !== undefined) {
      dispatch(setUser(data));
    }
  }, [user, data, dispatch]);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
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
