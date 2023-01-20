import { Fragment, useCallback, useRef, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import React from 'react';
import { Icon } from '@iconify-icon/react';

interface Props extends React.HTMLProps<HTMLSelectElement> {
  options: {
    title: string;
    value: string;
  }[];
}

// eslint-disable-next-line react/display-name
export const SelectField = React.forwardRef<HTMLSelectElement, Props>(
  (props, ref) => {
    const { options } = props;
    const [selected, setSelected] = useState<string | null>(null);
    const selectedOption = options.find((opt) => opt.value == selected);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const wrapSetterRef = useCallback((element: HTMLDivElement | null) => {
      wrapRef.current = element;
      const shadowSelector = element?.querySelector<HTMLSelectElement>(
        'select.shadowSelector',
      );
      if (!shadowSelector) return;
      setSelected(shadowSelector.value);
    }, []);

    const wrapElement = wrapRef?.current;
    return (
      <div ref={wrapSetterRef} className={props.className}>
        <select
          className="shadowSelector hidden"
          onChange={props.onChange}
          name={props.name}
          ref={ref}
        >
          {options.map((option, i) => {
            return (
              <option value={option.value} key={i}>
                {option.title}
              </option>
            );
          })}
        </select>
        <Listbox
          value={selected}
          onChange={(newSelected: string) => {
            const shadowSelector =
              wrapElement?.querySelector<HTMLSelectElement>(
                'select.shadowSelector',
              );
            if (!shadowSelector) return;
            shadowSelector.value = newSelected;
            shadowSelector.dispatchEvent(
              new Event('change', { bubbles: true }),
            );
            setSelected(newSelected);
          }}
        >
          <div className="relative ">
            <Listbox.Button className="bg-white text-left border-2 rounded-lg w-full px-2 py-2 text-lg focus:border-orange-300 active:border-orange-300 outline-0">
              <span className="block truncate">{selectedOption?.title}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <Icon icon="material-symbols:unfold-more-rounded" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? 'bg-orange-100 text-orange-500'
                          : 'text-gray-900'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.title}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                            <Icon icon="material-symbols:check-small-rounded" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    );
  },
);
