import React, { ReactNode } from 'react';
import Content from '../Content/Content';
import Sidebar from '../Sidebar/Sidebar';
import Wrapper from '../Wrapper/Wrapper';

function Layout({ children }: { children: ReactNode }) {
   return (
      <>
         <Wrapper>
            <Sidebar />

            <Content>{children}</Content>
         </Wrapper>
      </>
   );
}

export default Layout;
