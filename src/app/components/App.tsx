import * as React from 'react';
import { RecoilRoot } from 'recoil';
import { Main } from './Main';

export const App = () => {
  return (
    <RecoilRoot>
      <Main />
    </RecoilRoot>
  );
};
