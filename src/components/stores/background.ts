import create from 'zustand';

interface Store {
   show: boolean;
   blur?: boolean;
   color?: string;
   setShow: ({
      show,
      blur,
      color,
   }: {
      show: boolean;
      blur?: boolean;
      color?: string;
   }) => void;
}

export const useBackground = create<Store>((set) => {
   return {
      show: false,
      setShow: (state) => set({ ...state }),
   };
});
