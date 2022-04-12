import React, { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { channels } from '../../settings/constants';
import { useConfig } from '../stores/config';
import { usePresence } from '../stores/presence';
import { useWidgets } from '../stores/widgets';
import { PresenceConfig } from '../../types/Config';
import Container from '../Container/Container';
import Editor, {
   EditorItem,
   EditorListItem,
   EditorListItemLabel,
} from '../Editor/Editor';
import Headline from '../Headline/Headline';
import Layout from '../Layout/Layout';
const { ipcRenderer } = window.require('electron');

function Maker() {
   const { setUser, isReady, setReady, setCurrentPresence, currentPresence } =
      usePresence();
   const { error, success } = useWidgets();
   const { config, setConfig, saveConfig } = useConfig();
   const [editor, setEditor] = useState<{
      presence: PresenceConfig | null;
      open: boolean;
   }>({
      presence: null,
      open: false,
   });

   useLayoutEffect(() => {
      ipcRenderer.invoke(channels.GET_CONFIG).then((config) => {
         setConfig(config);
      });
   }, []);

   function closeEditor() {
      setEditor({
         presence: null,
         open: false,
      });
   }

   async function login() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
         if (!config || !config.clientId) return resolve(false);

         const state = await ipcRenderer
            .invoke(channels.START_PRESENCE, config?.clientId)
            .catch(() => {
               return resolve(false);
            });
         if (state.success) {
            setReady(true);

            if (state.user) {
               setUser(state.user);
               success.show(
                  'Connected to discod client as ' +
                     state.user.username +
                     '#' +
                     state.user.discriminator,
               );
            }

            return resolve(true);
         } else {
            error.show(state.error);
            return resolve(false);
         }
      });
   }

   async function saveEditor() {
      if (!config || !editor.presence) return;
      const newConfig = config.presences.map((presenceConfig) => {
         if (!editor.presence) return presenceConfig;
         if (presenceConfig.id === editor.presence.id) {
            return editor.presence;
         }
         return presenceConfig;
      });

      setConfig({
         ...config,
         presences: newConfig,
      });
      const successfully = await saveConfig();
      if (successfully) {
         success.show('Presence saved successfully');
         closeEditor();
      } else {
         error.show('Failed to save presence');
      }

      if (currentPresence && currentPresence.id === editor.presence.id) {
         setPresence(editor.presence);
      }
   }

   async function setPresence(presence: PresenceConfig) {
      if (!isReady()) {
         const stats = await login();
         if (!stats) return;
      }

      if (presence.state && presence.state.length < 2) {
         error.show('State must be at least 2 characters long');
         return;
      } else if (presence.details && presence.details.length < 2) {
         error.show('Details must be at least 2 characters long');
         return;
      } else if (presence.state && presence.state.length > 128) {
         error.show('State must be at most 128 characters long');
         return;
      } else if (presence.details && presence.details.length > 128) {
         error.show('Details must be at most 128 characters long');
         return;
      } else if (
         presence.buttons?.some((button) => {
            return button.label.length > 128 || button.label.length < 2;
         })
      ) {
         error.show(
            'Button label must be at least 2 characters long and at most 128 characters long',
         );
         return;
      } else if (
         presence.buttons?.some((button) => {
            return button.url.length > 512 || button.url.length < 2;
         })
      ) {
         error.show(
            'Button url must be at least 2 characters long and at most 512 characters long',
         );
         return;
      } else if (
         presence.buttons?.some((button) => {
            const urlRegex =
               /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gi;
            return !urlRegex.test(button.url);
         })
      ) {
         error.show('Button url must be a valid url');
         return;
      }

      const state = await ipcRenderer.invoke(channels.SET_PRESENCE, presence);
      if (state.success) {
         setCurrentPresence(presence);
         success.show('Presence set successfully');
      } else {
         error.show(state.error || 'Failed to set presence');
      }
   }

   async function activatePresence(presenceId: number) {
      if (!config) return error.show('No config found');
      if (!config.clientId) return error.show('No client id found');
      const presence = config.presences.find(
         (presence) => presence.id === presenceId,
      );
      if (!presence) return error.show('Presence not found');
      if (!isReady()) {
         const stats = await login();
         if (!stats) return;
      }
      setPresence(presence);
   }

   async function disablePresence() {
      if (!isReady()) return error.show('Please wait until the app is ready');
      if (!currentPresence) return error.show('No presence is active');
      const newPresence = await ipcRenderer.invoke(channels.STOP_PRESENCE);
      if (newPresence.success) {
         setCurrentPresence(null);
      } else {
         error.show(newPresence.error || 'Failed to set presence');
      }
   }

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
               <Headline>Maker</Headline>
               <div style={{ margin: '1rem 0' }}>
                  <input
                     type={'text'}
                     value={config?.clientId || ''}
                     onChange={(e) => {
                        if (!config) return;

                        setConfig({
                           ...config,
                           clientId: e.target.value,
                        });
                        saveConfig();
                     }}
                     placeholder='Please enter your client id'
                     style={{
                        minWidth: '250px',
                     }}
                  />
               </div>
               <MakerContainer>
                  {config?.presences.length ? (
                     config.presences.map((presenceConfig, index) => {
                        return (
                           <MakerItem key={index}>
                              <MakerItemName>
                                 {presenceConfig.name
                                    ? presenceConfig.name
                                    : 'Unknown (Id: ' + presenceConfig.id + ')'}
                              </MakerItemName>
                              <MakerItemButtons>
                                 {currentPresence?.id === presenceConfig.id ? (
                                    <button
                                       className='button button-red'
                                       onClick={() => {
                                          disablePresence();
                                       }}
                                    >
                                       Disable
                                    </button>
                                 ) : (
                                    <button
                                       className='button button-green'
                                       onClick={() => {
                                          activatePresence(presenceConfig.id);
                                       }}
                                    >
                                       Activate
                                    </button>
                                 )}
                                 <button
                                    onClick={() => {
                                       setEditor({
                                          presence: presenceConfig,
                                          open: true,
                                       });
                                    }}
                                    className='button button-blue'
                                 >
                                    Edit
                                 </button>
                                 <button
                                    onClick={() => {
                                       const newConfig =
                                          config.presences.filter(
                                             (p) => p.id !== presenceConfig.id,
                                          );
                                       setConfig({
                                          ...config,
                                          presences: newConfig,
                                       });
                                       saveConfig();
                                    }}
                                    className='button button-red'
                                 >
                                    Delete
                                 </button>
                              </MakerItemButtons>
                           </MakerItem>
                        );
                     })
                  ) : (
                     <>No presence configuration found</>
                  )}
                  <button
                     className='button button-green'
                     onClick={async () => {
                        const newConfig: PresenceConfig = {
                           id:
                              (config?.presences.length
                                 ? config?.presences.length
                                 : 0) + 1,
                        };

                        const currentPresences = config?.presences || [];

                        setConfig({
                           ...config,
                           presences: [...currentPresences, newConfig],
                           clientId: '',
                        });
                        const successfully = await saveConfig();

                        if (successfully) {
                           success.show('Presence added successfully');
                        } else {
                           error.show('Failed to add presence');
                        }
                     }}
                  >
                     Create
                  </button>
               </MakerContainer>
            </Container>
            {editor.open && editor.presence ? (
               <Editor
                  label={editor.presence.id + ' - Presence Editor'}
                  save={saveEditor}
                  close={closeEditor}
               >
                  <EditorItem
                     label='Name'
                     type='input'
                     value={editor.presence.name || ''}
                     placeholder='Enter the name of the presence (not visible in discord)'
                     onChange={(e) =>
                        setEditor((prev) => {
                           if (!prev.presence) return prev;
                           return {
                              ...prev,
                              presence: {
                                 ...prev.presence,
                                 name: e.target.value,
                              },
                           };
                        })
                     }
                  />
                  <EditorItem
                     label='Details'
                     type='input'
                     value={editor.presence.details || ''}
                     placeholder='Details field of the presence'
                     onChange={(e) =>
                        setEditor((prev) => {
                           if (!prev.presence) return prev;
                           return {
                              ...prev,
                              presence: {
                                 ...prev.presence,
                                 details: e.target.value || undefined,
                              },
                           };
                        })
                     }
                  />
                  <EditorItem
                     label='State'
                     type='input'
                     value={editor.presence.state || ''}
                     placeholder='State field of the presence'
                     onChange={(e) =>
                        setEditor((prev) => {
                           if (!prev.presence) return prev;
                           return {
                              ...prev,
                              presence: {
                                 ...prev.presence,
                                 state: e.target.value || undefined,
                              },
                           };
                        })
                     }
                  />
                  <EditorItem
                     label='Large Image (Key)'
                     type='input'
                     value={editor.presence.largeImageKey || ''}
                     placeholder='Enter the key for the large image'
                     onChange={(e) =>
                        setEditor((prev) => {
                           if (!prev.presence) return prev;
                           return {
                              ...prev,
                              presence: {
                                 ...prev.presence,
                                 largeImageKey: e.target.value || undefined,
                              },
                           };
                        })
                     }
                  />
                  <EditorItem
                     label='Large Image Text'
                     type='input'
                     value={editor.presence.largeImageText || ''}
                     placeholder='Enter the text for the large image'
                     onChange={(e) =>
                        setEditor((prev) => {
                           if (!prev.presence) return prev;
                           return {
                              ...prev,
                              presence: {
                                 ...prev.presence,
                                 largeImageText: e.target.value || undefined,
                              },
                           };
                        })
                     }
                  />
                  <EditorItem
                     label='Small Image Key'
                     type='input'
                     value={editor.presence.smallImageKey || ''}
                     placeholder='Enter the key for the large image'
                     onChange={(e) =>
                        setEditor((prev) => {
                           if (!prev.presence) return prev;
                           return {
                              ...prev,
                              presence: {
                                 ...prev.presence,
                                 smallImageKey: e.target.value,
                              },
                           };
                        })
                     }
                  />
                  <EditorItem
                     label='Small image text'
                     type='input'
                     value={editor.presence.smallImageText || ''}
                     placeholder='Enter the text for the large image'
                     onChange={(e) =>
                        setEditor((prev) => {
                           if (!prev.presence) return prev;
                           return {
                              ...prev,
                              presence: {
                                 ...prev.presence,
                                 smallImageText: e.target.value,
                              },
                           };
                        })
                     }
                  />
                  <EditorListItem
                     style={{
                        marginBottom: '5px',
                     }}
                  >
                     <EditorListItemLabel
                        style={{
                           fontSize: '1.1rem',
                           fontWeight: 500,
                        }}
                     >
                        Buttons
                     </EditorListItemLabel>
                     {editor.presence.buttons?.length ? (
                        editor.presence.buttons.map((button, index) => {
                           return (
                              <EditorListItem key={index}>
                                 <EditorListItemLabel>
                                    {index + 1}.
                                 </EditorListItemLabel>
                                 <EditorItem
                                    label={'Label'}
                                    type='input'
                                    value={button.label || ''}
                                    placeholder='Enter the label of the button'
                                    onChange={(e) => {
                                       if (!editor.presence) return;
                                       const newButtons =
                                          editor.presence.buttons || [];
                                       newButtons[index].label = e.target.value;
                                       setEditor((prev) => {
                                          if (!prev.presence) return prev;
                                          return {
                                             ...prev,
                                             presence: {
                                                ...prev.presence,
                                                buttons: newButtons,
                                             },
                                          };
                                       });
                                    }}
                                 />
                                 <EditorItem
                                    label={'Url'}
                                    type='input'
                                    value={button.url || ''}
                                    placeholder='Enter the url of the button'
                                    onChange={(e) => {
                                       if (!editor.presence) return;
                                       const newButtons =
                                          editor.presence.buttons || [];
                                       newButtons[index].url = e.target.value;
                                       setEditor((prev) => {
                                          if (!prev.presence) return prev;
                                          return {
                                             ...prev,
                                             presence: {
                                                ...prev.presence,
                                                buttons: newButtons,
                                             },
                                          };
                                       });
                                    }}
                                 />
                                 <button
                                    className='button button-red'
                                    onClick={() => {
                                       if (!editor.presence) return;
                                       const newButtons =
                                          editor.presence.buttons || [];
                                       newButtons.splice(index, 1);
                                       setEditor((prev) => {
                                          if (!prev.presence) return prev;
                                          return {
                                             ...prev,
                                             presence: {
                                                ...prev.presence,
                                                buttons: newButtons,
                                             },
                                          };
                                       });
                                    }}
                                 >
                                    Delete
                                 </button>
                              </EditorListItem>
                           );
                        })
                     ) : (
                        <>No buttons created yet</>
                     )}
                     <button
                        style={{
                           marginTop: '10px',
                           cursor: editor.presence.buttons
                              ? editor.presence.buttons?.length >= 2
                                 ? 'not-allowed'
                                 : 'pointer'
                              : 'pointer',
                        }}
                        className='button button-green'
                        onClick={() => {
                           if (!editor.presence) return;
                           const newButtons = editor.presence.buttons || [];
                           if (newButtons.length >= 2)
                              return error.show('You can only have 2 buttons');
                           setEditor((prev) => {
                              if (!prev.presence) return prev;
                              return {
                                 ...prev,
                                 presence: {
                                    ...prev.presence,
                                    buttons: [
                                       ...newButtons,
                                       {
                                          label: '',
                                          url: '',
                                       },
                                    ],
                                 },
                              };
                           });
                        }}
                     >
                        Create button
                     </button>
                  </EditorListItem>
               </Editor>
            ) : null}
         </Layout>
      </>
   );
}

const MakerContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 1rem;
   width: 100%;
   height: 100%;
   padding: 1rem 2rem;
`;

const MakerItem = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 1rem 3rem;
   background-color: #26282b;
   width: clamp(50%, 900px, 95%);
   border-radius: 10px;

   @media (max-width: 768px) {
      flex-direction: column;
   }
`;

const MakerItemName = styled.span`
   font-size: 16px;
   font-weight: 500;
   font-family: 'Poppins', sans-serif;
   transition: color 0.2s ease-in-out;
   color: '#fff';

   @media (max-width: 768px) {
      font-size: 14px;
   }
`;

const MakerItemButtons = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 0.5rem;
`;

export default Maker;
