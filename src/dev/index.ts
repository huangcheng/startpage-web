import React from 'react';

const ComponentPreviews = React.lazy(() => import('./previews'));

export { ComponentPreviews };

export { useInitial } from './useInitial';
