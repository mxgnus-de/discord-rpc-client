import create from 'zustand';

interface Store {
   open: boolean;
   setOpen: (open: boolean) => void;
   toggle: () => void;
}

export const useSidebar = create<Store>((set, get) => {
   return {
      open: false,
      setOpen: (open) => set({ open }),
      toggle: () => set({ open: !get().open }),
   };
});
