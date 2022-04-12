import React from 'react';
import styled from 'styled-components';
import Container from '../Container/Container';
import Headline from '../Headline/Headline';
import Layout from '../Layout/Layout';
const shell = window.require('electron').shell;

function LandingPage() {
   return (
      <>
         <Layout>
            <Container
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
               }}
            >
               <Headline>Welcome to Discord Status Maker!</Headline>
               <h4 style={{ textAlign: 'center' }}>
                  This is a simple tool to help you keep track of your Discord
                  server's presence.
               </h4>
               <h4>
                  <LinkItemContainer>
                     <span>
                        Created by{' '}
                        <a
                           onClick={() =>
                              shell.openExternal('https://mxgnus.de')
                           }
                           data-replace='mxgnus'
                        >
                           mxgnus
                        </a>
                     </span>
                  </LinkItemContainer>
               </h4>
            </Container>
         </Layout>
      </>
   );
}

const LinkItemContainer = styled.div`
   a {
      overflow: hidden;
      position: relative;
      display: inline-block;
   }

   a::before,
   a::after {
      content: '';
      position: absolute;
      width: 100%;
      left: 0;
   }
   a::before {
      background-color: #54b3d6;
      height: 2px;
      bottom: 0;
      transform-origin: 100% 50%;
      transform: scaleX(0);
      transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
   }
   a::after {
      content: attr(data-replace);
      height: 100%;
      top: 0;
      transform-origin: 100% 50%;
      transform: translate3d(200%, 0, 0);
      transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
      color: #54b3d6;
   }

   a:hover::before {
      transform-origin: 0% 50%;
      transform: scaleX(1);
   }
   a:hover::after {
      transform: translate3d(0, 0, 0);
   }

   a span {
      display: inline-block;
      transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
   }

   a:hover span {
      transform: translate3d(-200%, 0, 0);
   }

   a {
      text-decoration: none;
      color: #0d8ed4;
      font-weight: 700;
      vertical-align: top;
   }
`;

export default LandingPage;
