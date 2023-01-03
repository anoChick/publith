import { ReactNode } from 'react';

type Props = { children: ReactNode };

export const FieldLabel: React.FC<Props> = ({ children }) => {
  return (
    <label className="font-bold w-full inline-block mb-1">{children}</label>
  );
};
