import create from 'zustand';
import { channels } from '../../settings/constants';
import { Config } from '../../types/Config';
const { ipcRenderer } = window.require('electron');

interface Store {
   config: Config | null;
   setConfig: (config: Config | null) => void;
   saveConfig: () => Promise<boolean>;
}

export const useConfig = create<Store>((set, get) => {
   return {
      config: null,
      setConfig: (config) => set(() => ({ config })),
      saveConfig: async () => {
         const config = get().config;

         if (!config) {
            return false;
         }

         const configData = await ipcRenderer.invoke(
            channels.SAVE_CONFIG,
            config,
         );
         if (configData.success) {
            set(() => ({ config: configData.config }));
            return true;
         } else {
            return false;
         }
      },
   };
});
