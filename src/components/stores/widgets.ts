import create from 'zustand';

interface Store {
   error: {
      state: boolean;
      message: string;
      show: (message: string) => void;
   };
   success: {
      state: boolean;
      message: string;
      show: (message: string) => void;
   };
}

export const useWidgets = create<Store>((set) => {
   function showError(message: string) {
      set((state) => {
         state.error.state = true;
         state.error.message = message;
      });

      setTimeout(() => {
         set((state) => {
            state.error.state = false;
            state.error.message = '';
         });
      }, 1500);
   }

   function showSuccess(message: string) {
      set((state) => {
         state.success.state = true;
         state.success.message = message;
      });

      setTimeout(() => {
         set((state) => {
            state.success.state = false;
            state.success.message = '';
         });
      }, 1500);
   }

   return {
      error: {
         state: false,
         message: '',
         show: showError,
      },
      success: {
         state: false,
         message: '',
         show: showSuccess,
      },
   };
});
