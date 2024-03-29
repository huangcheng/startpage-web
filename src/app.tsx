import { useEffect } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Global, css, ThemeProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import { ConfigProvider, App as AntdApp } from 'antd';
import { useCookie, useLocalStorage } from 'react-use';

import { hot } from 'react-hot-loader/root';

import type { ReactElement } from 'react';

import { default as i18n } from 'locales';
import { useDispatch, useSelector } from 'hooks/store';
import { useUserInfoMutation } from 'hooks/request';
import { useUser } from 'hooks/store/user';
import { setUser } from 'reducers/user';
import { setLanguage } from 'reducers/global';

import type { Language } from 'locales';

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
  const [token] = useCookie('token');
  const user = useUser();
  const { mutate, data } = useUserInfoMutation();

  const [_locale] = useLocalStorage('locale', locale as string);

  useEffect(() => {
    if (i18n.isInitialized) {
      void i18n.changeLanguage(locale);
    }
  }, [locale]);

  useEffect(() => {
    dispatch(setLanguage(_locale as Language));
  }, [_locale, dispatch]);

  useEffect(() => {
    if (token !== undefined && (token ?? '').length > 0 && user === undefined) {
      mutate();
    }
  }, [mutate, token, user]);

  useEffect(() => {
    if (user === undefined && data !== undefined) {
      dispatch(setUser(data));
    }
  }, [user, data, dispatch]);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ConfigProvider>
          <AntdApp>
            <Router>
              <ThemeProvider theme={themes[theme]}>
                <Container />
              </ThemeProvider>
            </Router>
          </AntdApp>
        </ConfigProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default hot(App);
