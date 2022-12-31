import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { FormType } from '../organisms/TemplateEditor';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export const TemplateFieldsField: React.FC<Props> = () => {
  const { control, register } = useFormContext<FormType>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'fields',
    },
  );

  const addNewField = () => {
    append({
      type: 'text',
      name: nanoid(),
      title: '新規フィールド',
      description: '',
      default: '',
      sample: 'サンプルデータ',
    });
  };
  return (
    <div>
      {fields.map((field, i) => {
        return (
          <div key={i}>
            <div>
              <label>フィールド名: </label>
              <input {...register(`fields.${i}.title`)} />
            </div>
            <div>
              <label>識別子: </label>
              <input {...register(`fields.${i}.name`)} />
            </div>
            <div>
              <label>説明: </label>
              <input {...register(`fields.${i}.description`)} />
            </div>
            <div>
              <label>初期値: </label>
              <input {...register(`fields.${i}.default`)} />
            </div>
            <div>
              <label>サンプルデータ: </label>
              <input {...register(`fields.${i}.sample`)} />
            </div>
          </div>
        );
      })}
      <div>
        <button onClick={addNewField}>+</button>
      </div>
    </div>
  );
};
export const TemplateFieldField: React.FC<Props> = () => {
  return <div>s</div>;
};
