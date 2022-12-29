import { Icon } from '@iconify-icon/react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { FieldLabel } from '../atoms/FieldLabel';
import { SelectField } from '../atoms/SelectField';
import { TextField } from '../atoms/TextField';
import { FormType } from '../organisms/TemplateEditor';
import { SelectOptionsField } from './templateFieldsField/SelectOptionsField';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export const TemplateFieldsField: React.FC<Props> = () => {
  const { control, register } = useFormContext<FormType>();
  const piyo = useFieldArray({
    control,
    name: 'fields',
  });
  const { fields, append, remove, update } = piyo;

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
          <div
            key={i}
            className="p-4 mb-4 border-2 rounded-xl  relative border-stone-200 mt-4 pt-12"
          >
            <div className="absolute right-4 top-4">
              <button
                onClick={() => {
                  remove(i);
                }}
                className="bg-red-400 hover:bg-red-500 text-white p-[12px] my-[2px] rounded-lg"
              >
                <Icon
                  className="inline-block align-top pt-0.5 text-xl"
                  icon="material-symbols:delete-outline-rounded"
                />{' '}
                <span className="inline">フィールド消去</span>
              </button>
            </div>
            <div className="mb-2">
              <FieldLabel>フィールド名</FieldLabel>
              <TextField {...register(`fields.${i}.title`)} />
            </div>
            <div className="mb-2">
              <FieldLabel>識別子</FieldLabel>
              <TextField {...register(`fields.${i}.name`)} />
            </div>
            <div className="mb-2">
              <FieldLabel>説明</FieldLabel>
              <TextField rows={3} {...register(`fields.${i}.description`)} />
            </div>
            <div className="mb-2">
              <FieldLabel>フィールド種別</FieldLabel>
              <SelectField
                options={[
                  { title: 'テキスト', value: 'text' },
                  { title: '選択', value: 'select' },
                ]}
                {...register(`fields.${i}.type`)}
                onChange={(e: any) => {
                  const f = { ...field };
                  f.type = e.target.value;
                  if (f.type == 'text') {
                    f.options = undefined;
                  }
                  if (f.type == 'select') {
                    f.options = [{ title: '選択肢1', value: 'value1' }];
                  }
                  const { onChange } = register(`fields.${i}.type`);
                  update(i, f);
                  onChange(e);
                }}
              />
            </div>
            <div className="ml-4 p-4 rounded-xl bg-stone-100">
              {field.type == 'select' && (
                <div className="mb-2">
                  <FieldLabel>選択肢</FieldLabel>
                  <SelectOptionsField fieldNumber={i} />
                </div>
              )}

              <div className="mb-2">
                <FieldLabel>初期値</FieldLabel>
                <TextField {...register(`fields.${i}.default`)} />
              </div>
              <div className="mb-2">
                <FieldLabel>サンプル値</FieldLabel>
                <TextField {...register(`fields.${i}.sample`)} />
              </div>
            </div>
          </div>
        );
      })}
      <div className="my-4">
        <button
          className="w-full bg-stone-200 py-3 text-stone-700 font-bold hover:bg-stone-300 rounded-lg"
          onClick={addNewField}
        >
          フィールドを追加
        </button>
      </div>
    </div>
  );
};
