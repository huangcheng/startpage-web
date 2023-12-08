import { motion } from 'framer-motion';
import { css, useTheme } from '@emotion/react';

import type { FC, ReactElement } from 'react';

import type { Theme } from 'types/theme';

export interface SiteProps {
  description: string;
  icon: string;
  link: string;
  title: string;
}

const Site: FC<SiteProps> = (props: SiteProps): ReactElement<SiteProps> => {
  const { description, icon, link, title } = props;

  const theme = useTheme() as Theme;

  const { textColor, siteBackgroundColor } = theme;

  return (
    <motion.a
      css={css`
        display: inline-flex;
        border-radius: 8px;
        box-sizing: border-box;
        align-items: center;
        justify-content: stretch;
        text-decoration: none;
        padding: 20px 24px 26px 20px;
        background-color: ${siteBackgroundColor};
      `}
      href={link}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <img
        src={icon}
        alt={title}
        css={css`
          width: 36px;
          height: 36px;
          margin-right: 16px;
        `}
      />
      <div
        css={css`
          flex: auto;
          overflow: hidden;
        `}
      >
        <h3
          css={css`
            width: 85px;
            font-size: 16px;
            font-weight: bold;
            line-height: 28px;
            color: ${textColor};
            margin: 6px 0 0 0;
            width: 100%;
          `}
        >
          {title}
        </h3>
        <p
          css={css`
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            font-weight: 400;
            line-height: 28px;
            color: ${textColor};
          `}
        >
          {description}
        </p>
      </div>
    </motion.a>
  );
};

Site.displayName = 'Site';

export default Site;
