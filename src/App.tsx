import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LandingPage from './components/Pages/LandingPage';
import Maker from './components/Pages/Maker';
import GlobalStyle from './components/styles';
import defaultTheme from './components/styles/themes/default';
import ErrorWidget from './components/Widgets/Error';
import SuccessWidget from './components/Widgets/Success';
import './index.css';
import { useBackground } from './components/stores/background';
import { useWidgets } from './components/stores/widgets';
import HowToUse from './components/Pages/HowToUse';

function App() {
   const { error, success } = useWidgets();
   const { show, blur, color } = useBackground();
   return (
      <>
         <ThemeProvider theme={defaultTheme}>
            <GlobalStyle />
            <Router />
            {error.state && <ErrorWidget text={error.message} />}
            {success.state && <SuccessWidget text={success.message} />}
            <Background show={show} blur={blur} color={color} />
         </ThemeProvider>
      </>
   );
}

function Router() {
   return (
      <HashRouter>
         <Routes>
            <Route path='/'>
               <Route path='/' element={<LandingPage />} />
               <Route path='/maker' element={<Maker />} />
               <Route path='/howtouse' element={<HowToUse />} />
            </Route>
         </Routes>
      </HashRouter>
   );
}

function render() {
   const rootElement = document.getElementById('root');
   if (!rootElement) {
      throw new Error('Root element not found');
   }
   const root = createRoot(rootElement);
   root.render(<App />);
}

render();

interface BackgroundProps {
   show: boolean;
   blur?: boolean;
   color?: string;
}

const Background = styled.div<BackgroundProps>`
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: ${(props) =>
      props.color ? props.color : 'rgba(0, 0, 0, 0.7)'};
   z-index: 100;
   opacity: ${(props) => (props.show ? 1 : 0)};
   transition: opacity 0.3s ease-in-out;
   pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
   filter: ${(props) => (props.blur ? 'blur(10px)' : '')};
`;
