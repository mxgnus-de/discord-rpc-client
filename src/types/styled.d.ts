import 'styled-components';

declare module 'styled-components' {
   export interface DefaultTheme {
      fonts: {
         poppins: {
            normal: string;
            bold: string;
            italic: string;
            medium: string;
            extraBold: string;
            black: string;
            blackItalic: string;
         };
      };
   }
}
