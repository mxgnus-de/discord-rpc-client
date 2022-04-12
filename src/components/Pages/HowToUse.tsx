import React from 'react';
import styled from 'styled-components';
import {
   exampleDiscordRPC,
   pastClientIdInInputField,
   selectClientId,
} from '../../settings/images';
import Container from '../Container/Container';
import Headline from '../Headline/Headline';
import Layout from '../Layout/Layout';
const shell = window.require('electron').shell;

function HowToUse() {
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
               <Headline>How to use it?</Headline>
               <Content>
                  <p>
                     1. Go to{' '}
                     <LinkElement
                        href='https://discord.com/developers/applications'
                        displayname='Discord Developers/Applications'
                     />{' '}
                     and create a new application (or use an existing one).
                  </p>
                  <p>
                     2. Now you can copy the client/application Id from the
                     developer dashboard
                  </p>
                  <img alt='select-client-id' src={selectClientId} />
                  <p>
                     3. Go now to the "Maker" tab in the sidebar and paste the
                     clientId/ApplicationId at the input field at the top
                  </p>
                  <img
                     alt='paste-client-id-in-input-field'
                     src={pastClientIdInInputField}
                  />
                  <p>
                     4. Click on the create button below and then click on the
                     "Edit" button
                  </p>
                  <p>
                     5. A window should now have opened where you can fill in
                     all data
                  </p>
                  <p>6. If you're done, click on the "Save" button</p>
                  <p>
                     7. Click now on the "Activate" button and you're done! Now
                     you have a custom Discord RPC!
                  </p>
                  <img alt='example-discord-rpc' src={exampleDiscordRPC} />
               </Content>
            </Container>
         </Layout>
      </>
   );
}

function LinkElement({
   href,
   displayname,
}: {
   href: string;
   displayname?: string;
}) {
   return (
      <Link
         onClick={() => {
            shell.openExternal(href);
         }}
      >
         {displayname || href}
      </Link>
   );
}
const Content = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 1rem;
   margin-top: 1rem;
`;

const Link = styled.span`
   color: #0d8ed4;
   cursor: pointer;
   transition: color 0.2s ease-in-out;

   &:hover {
      color: #54b3d6;
   }
`;

export default HowToUse;
