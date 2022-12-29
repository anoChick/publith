import classNames from 'classnames';
import React from 'react';

type Props = React.HTMLProps<HTMLTextAreaElement>;

// eslint-disable-next-line react/display-name
export const TextField = React.forwardRef<HTMLTextAreaElement, Props>(
  (args, ref) => {
    return (
      <textarea
        ref={ref}
        {...args}
        rows={args.rows ?? 1}
        className={classNames(
          args.className,
          'resize-none border-2 rounded-lg w-full px-2 py-2 text-lg focus:border-orange-300 active:border-orange-300 outline-0',
        )}
      />
    );
  },
);
