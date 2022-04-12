import React from 'react';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { SidebarIconClose, SidebarIconOpen } from '../Icons/Sidebar';
import Hyphen from '../Hyphen/Hyphen';
import { useNavigate, useLocation } from 'react-router';
import { useSidebar } from '../stores/sidebar';

function Sidebar() {
   const sidebar = useSidebar();
   const navigate = useNavigate();
   const location = useLocation();

   const sidebarItems: {
      id: number;
      name: string;
      icon: JSX.Element;
      site: string;
   }[] = [
      {
         id: 1,
         name: 'Home',
         icon: <HomeIcon />,
         site: '/',
      },
      {
         id: 2,
         name: 'Maker',
         icon: <BuildIcon />,
         site: '/maker',
      },
      {
         id: 3,
         name: 'How to use',
         icon: <QuestionMarkIcon />,
         site: '/howtouse',
      },
   ];

   return (
      <SidebarWrapper open={sidebar.open}>
         <SidebarIconWrapper>
            <button onClick={() => sidebar.toggle()}>
               {sidebar.open ? <SidebarIconClose /> : <SidebarIconOpen />}
            </button>
         </SidebarIconWrapper>
         <Hyphen />
         {sidebar.open === true ? (
            <SidebarOpenWrapper>
               {sidebarItems
                  .sort((sidebarItemA, sideBarItemB) => {
                     return sidebarItemA.id - sideBarItemB.id;
                  })
                  .map((item) => {
                     return (
                        <div key={item.id} onClick={() => navigate(item.site)}>
                           <SidebarItem
                              path={item.site}
                              currentPage={location.pathname}
                           >
                              <SidebarItemWrapper
                                 path={item.site}
                                 currentPage={location.pathname}
                              >
                                 {item.icon}
                                 <SideBarItemLink closed={false}>
                                    {item.name}
                                 </SideBarItemLink>
                              </SidebarItemWrapper>
                           </SidebarItem>
                        </div>
                     );
                  })}
            </SidebarOpenWrapper>
         ) : (
            <SidebarCloseWrapper>
               {sidebarItems
                  .sort((sidebarItemA, sideBarItemB) => {
                     return sidebarItemA.id - sideBarItemB.id;
                  })
                  .map((sidebarItem) => {
                     return (
                        <div key={sidebarItem.id}>
                           <SideBarItemLink
                              closed={true}
                              onClick={() => navigate(sidebarItem.site)}
                           >
                              <SidebarItemClose
                                 path={sidebarItem.site}
                                 currentPage={location.pathname}
                              >
                                 {sidebarItem.icon}
                              </SidebarItemClose>
                           </SideBarItemLink>
                        </div>
                     );
                  })}
            </SidebarCloseWrapper>
         )}
      </SidebarWrapper>
   );
}

interface WrapperProps {
   open: boolean;
}

const SidebarWrapper = styled.div<WrapperProps>`
   position: relative;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: ${({ open }) => (open ? '300' : '100')}px;
   padding: 20px 10px;
   z-index: 10;
   bottom: 0;
   top: 0;
   background-color: #191a1b;
   transition: all 0.3s ease-in-out;

   @media (max-width: 896px) {
      width: ${({ open }) => (open ? '100vw' : '70px')};
   }

   @media (max-width: 600px) {
      ${({ open }) =>
         open
            ? 'width: 100vw; position: absolute; top: 0; left: 0; bottom: 0; right: 0;'
            : 'width: 50px'};
   }
`;

const SidebarIconWrapper = styled.div`
   display: flex;
   justify-content: center;
`;

const SidebarOpenWrapper = styled.div`
   width: 100%;
   height: 100%;
`;

const SidebarCloseWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`;

const SidebarItem = styled.div`
   display: flex;
   align-items: center;
   padding: 5px 20px;
   cursor: pointer;

   svg {
      min-width: 24px;
      min-height: 24px;
      path {
         color: ${(props: { path: string; currentPage: string }) =>
            props.path === props.currentPage ? '#fff000' : '#828282'};
      }
   }
`;

const SidebarItemClose = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 5px 0;

   svg path {
      color: ${(props: { path: string; currentPage: string }) =>
         props.path === props.currentPage ? '#fff000' : '#828282'};
   }
`;

const SidebarItemWrapper = styled.div`
   height: 100%;
   width: 100%;
   display: flex;
   align-items: center;
   padding: 8px 15px;
   border-radius: 5px;
   background-color: ${(props: { path: string; currentPage: string }) =>
      props.path === props.currentPage ? '#222227' : 'transparent'};
`;

const SideBarItemLink = styled.div`
   ${(props: { closed: boolean }) => (props.closed ? '' : 'margin-left: 20px;')}
   font-size: 16px;
   cursor: pointer;
   user-select: none;
`;

export default Sidebar;
