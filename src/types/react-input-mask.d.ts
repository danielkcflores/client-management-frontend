declare module 'react-input-mask' {
    import * as React from 'react';
  
    export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
      mask: string;
      maskPlaceholder?: string;
      alwaysShowMask?: boolean;
    }
  
    const MaskInput: React.FC<InputProps>;
  
    export default MaskInput;
  }
  