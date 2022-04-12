import { User } from 'discord-rpc';
import create from 'zustand';
import { PresenceConfig } from '../../types/Config';

interface Store {
   currentPresence: PresenceConfig | null;
   ready: boolean;
   user: User | null;
   setCurrentPresence: (presence: PresenceConfig | null) => void;
   setReady: (state: boolean) => void;
   setUser: (user: User | null) => void;
   isReady: () => boolean;
}

export const usePresence = create<Store>((set, get) => {
   return {
      currentPresence: null,
      ready: false,
      user: null,
      setCurrentPresence: (state) => {
         return set({
            currentPresence: state,
         });
      },
      setReady: (state) => {
         return set({
            ready: state,
         });
      },
      isReady: () => {
         return get().ready;
      },
      setUser: (state) => {
         return set({
            user: state,
         });
      },
   };
});
