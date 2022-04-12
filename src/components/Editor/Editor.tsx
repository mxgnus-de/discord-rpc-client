import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useBackground } from '../stores/background';

function Editor({
   label,
   close,
   save,
   children,
}: {
   label: string;
   close: () => void;
   save: () => void;
   children: ReactNode;
}) {
   const { setShow } = useBackground();

   useEffect(() => {
      setShow({
         show: true,
         blur: true,
      });
      return () => setShow({ show: false, blur: false });
   }, []);

   return (
      <EditorWrapper
         onKeyDown={(e) => {
            const char = e.key.toLowerCase();
            const isCtrl = e.ctrlKey;
            if (char === 'escape') {
               e.preventDefault();
               close();
            }
            if (char === 's' && isCtrl) {
               e.preventDefault();
               save();
               close();
            }
         }}
      >
         <EditorContainer>
            <EditorTitle>
               {label}
               <EditorCloseIconWrapper>
                  <CloseIcon onClick={() => close()} />
               </EditorCloseIconWrapper>
            </EditorTitle>
            <EditorListWrapper>{children}</EditorListWrapper>
            <EditorSubmitButtonWrapper>
               <span className='button button-green' onClick={() => save()}>
                  Save presence
               </span>
            </EditorSubmitButtonWrapper>
         </EditorContainer>
      </EditorWrapper>
   );
}

export function EditorItem<T>({
   onChange,
   value,
   type,
   label,
   placeholder,
}: {
   onChange: (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
   ) => void;
   value: T;
   type: 'textarea' | 'input';
   label: string;
   placeholder?: string;
}) {
   if (type === 'textarea' && typeof value === 'string') {
      return (
         <EditorListItem>
            <EditorListItemLabel>{label}</EditorListItemLabel>
            <EditorListItemTextarea
               onChange={onChange}
               value={value}
               placeholder='Enter text here'
            />
         </EditorListItem>
      );
   } else if (type === 'input' && typeof value === 'string') {
      return (
         <EditorListItem>
            <EditorListItemLabel>{label}</EditorListItemLabel>
            <EditorListItemInput
               onChange={onChange}
               value={value}
               placeholder={placeholder || 'Enter text here'}
               type='text'
            />
         </EditorListItem>
      );
   } else if (type === 'input' && typeof value === 'number') {
      return (
         <EditorListItem>
            <EditorListItemLabel>{label}</EditorListItemLabel>
            <EditorListItemInput
               onChange={onChange}
               value={value}
               placeholder={placeholder || 'Enter number here'}
               type='number'
            />
         </EditorListItem>
      );
   } else {
      return <span>Invalid configuration</span>;
   }
}

const EditorWrapper = styled.div`
   position: absolute;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   top: 0;
   left: 0;
   width: 100%;
   min-height: 100%;
   z-index: 101;
   transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out;
   margin: 3rem 10px;
`;

const EditorContainer = styled.div`
   width: clamp(300px, 600px, 100%);
   padding: 20px;
   background-color: '#131313';
   display: flex;
   flex-direction: column;
   border-radius: 5px;
   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
   transition: background-color 0.3s ease-in-out;
   gap: 2em;
`;

const EditorCloseIconWrapper = styled.div`
   position: absolute;
   top: 0;
   right: 0;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
`;

const CloseIcon = styled(CloseTwoToneIcon)`
   width: 25px;
   height: 25px;
   fill: #c0c0c0;
`;

const EditorTitle = styled.span`
   position: relative;
   font-size: 1.2em;
   font-weight: bold;
   margin-bottom: 20px;
   text-align: center;
   font-family: 'Poppins', sans-serif;
`;

const EditorListWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1em;
   width: 100%;
   height: 100%;
   word-break: break-all;
`;

export const EditorListItemLabel = styled.h4`
   font-family: 'Poppins', sans-serif;
   margin-bottom: 10px;
`;

export const EditorListItem = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   height: 100%;
   padding: 10px;
`;

export const EditorListItemTextarea = styled.textarea`
   width: clamp(70%, 300px, 90%);
   min-height: 150px;
   background-color: #3f2260;
   border-radius: 5px;
   padding: 10px 20px;
   font-family: 'Poppins', sans-serif;
   font-size: 14px;
`;

export const EditorListItemInput = styled.input`
   width: clamp(70%, 300px, 90%);
   min-height: 50px;
   background-color: #3f2260;
   border-radius: 5px;
   padding: 5px 10px;
   font-family: 'Poppins', sans-serif;
   font-size: 14px;
`;

const EditorSubmitButtonWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`;

export default Editor;
