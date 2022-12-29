import { Icon } from '@iconify-icon/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { TextField } from '~/components/atoms/TextField';
import { FormType } from '~/server/routers/template';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  fieldNumber: number;
};

export const SelectOptionsField: React.FC<Props> = ({ fieldNumber }) => {
  const { control, register, watch } = useFormContext<FormType>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: `fields.${fieldNumber}.options`,
    },
  );
  const addNewField = () => {
    append({
      title: `選択肢${fields.length + 1}`,
      value: `value${fields.length + 1}`,
    });
  };

  return (
    <div className="mb-4">
      <div>
        {fields.map((field, i) => {
          return (
            <div key={field.id} className="flex">
              <div className="flex-1">
                <TextField
                  {...register(`fields.${fieldNumber}.options.${i}.title`)}
                />
              </div>
              <div className="">
                <div className="p-[12px] my-[2px] ">
                  <Icon
                    className="inline text-xl"
                    icon="material-symbols:remove-rounded"
                  />
                </div>
              </div>
              <div className="flex-1">
                <TextField
                  {...register(`fields.${fieldNumber}.options.${i}.value`)}
                />
              </div>
              <div className="ml-4">
                <button
                  onClick={() => {
                    remove(i);
                  }}
                  className="bg-red-400 text-white p-[12px] my-[2px] rounded-lg"
                >
                  <Icon
                    className="inline text-xl"
                    icon="material-symbols:delete-outline-rounded"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        <button
          onClick={addNewField}
          className="w-full bg-stone-200 py-3 text-stone-700 font-bold hover:bg-stone-300 rounded-lg"
        >
          選択肢を追加
        </button>
      </div>
    </div>
  );
};
