import { useEffect, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useCopyToClipboard } from 'usehooks-ts';
import { Icon } from '@iconify-icon/react';
import { TextField } from '../atoms/TextField';
import { FieldLabel } from '../atoms/FieldLabel';
import { SelectField } from '../atoms/SelectField';
import { render } from '~/utils/render';
import { Template } from '@prisma/client';
import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  template: Template & {
    user: {
      id: string;
      image: string | null;
      name: string | null;
    };
  };
};

export type Field = {
  type: 'text';
  name: string;
  title: string;
  description: string;
  default: string;
  sample: string;
};

export type FormType = {
  templateId: string;
  html: string;
  fieldInputs: { [key: string]: any };
};

export const ImageGenerator: React.FC<Props> = ({ template }) => {
  const [_value, copy] = useCopyToClipboard();

  const router = useRouter();
  const [fields, setFields] = useState([]);
  const useFormMethods = useForm<FormType>({
    defaultValues: {
      templateId: '',
      html: '<div></div>',
      fieldInputs: {},
    },
  });
  const { watch, reset, register } = useFormMethods;
  const htmlValue = watch('html');
  const fieldInputsValue = watch('fieldInputs');

  useEffect(() => {
    if (!template) return;

    const fieldInputs: { [key: string]: any } = {};
    const fields = template.fields as any;
    fields.forEach((field: any) => {
      fieldInputs[field.name] = field.sample;
    });
    setFields(fields);
    reset({
      templateId: template.id,
      html: template.html,
      fieldInputs,
    });
  }, [template]);

  const [svg, setSvg] = useState<string | null>(null);
  const url = new URL(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/i/${router.query.id}`,
  );
  for (const key in fieldInputsValue) {
    const value = fieldInputsValue[key];
    url.searchParams.append(key, value);
  }
  const imageUrl = url.toString();
  const updateSvg = async () => {
    const svg = await render(htmlValue, fieldInputsValue);
    if (svg) setSvg(svg);
  };

  useEffect(() => {
    updateSvg();
  }, [htmlValue, JSON.stringify(fieldInputsValue)]);
  return (
    <div>
      <FormProvider {...useFormMethods}>
        <div className="text-center flex-1 gridbg pt-[72px] ">
          <div className="">
            {svg && (
              <img
                className="inline shadow-lg shadow-stone-300 z-10"
                src={`data:image/svg+xml;base64,${window.btoa(svg)}`}
                alt="preview"
              />
            )}
          </div>

          <div className="bg-white z-20 mt-4 rounded-2xl rounded-b h-4"></div>
        </div>
        <div className="p-4">
          <div>
            <div className="font-bold text-2xl mb-4">{template?.title}</div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <img
                src={template.user.image ?? ''}
                className="rounded-full w-8 h-8 inline-block"
              />
              <span className="inline-block align-top mt-1 ml-1 font-bold text-lg text-stone-700">
                {template.user.name}
              </span>
              <span className="inline-block align-top mt-2 ml-0.5 text-sm text-stone-500">
                {dayjs(template.lastEditedAt).fromNow()}
              </span>
            </div>
            <div>
              <button
                className="transition-all bg-stone-100 hover:bg-stone-200 px-2 py-1.5 rounded-lg text-sm font-bold text-stone-500 mr-2"
                onClick={() => {
                  copy(imageUrl);
                  toast.success('画像URLをクリップボードにコピーしました.');
                }}
              >
                <Icon
                  icon="material-symbols:content-paste"
                  className="w-4 h-4 inline-block align-top mr-1 mt-0.5 text-lg"
                />
                コピー
              </button>
              <button
                className="transition-all bg-stone-100 hover:bg-stone-200 px-2 py-1.5 rounded-lg text-sm font-bold text-stone-500"
                onClick={() => {
                  const link = document.createElement('a');
                  document.body.appendChild(link);
                  link.href = imageUrl;
                  link.download = `${template?.title}.png`;
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Icon
                  icon="material-symbols:content-paste"
                  className="w-4 h-4 inline-block align-top mr-1 mt-0.5 text-lg"
                />
                ダウンロード
              </button>
            </div>
          </div>
          <div className="bg-stone-100 p-4 mt-4 rounded-xl">
            {template.description}
          </div>
          <div className="w-full m px-2 py-8">
            {fields.map((field: any, i) => {
              return (
                <div key={i}>
                  <FieldLabel>{field.title}</FieldLabel>
                  {field.type === 'text' && (
                    <TextField {...register(`fieldInputs.${field.name}`)} />
                  )}{' '}
                  {field.type === 'select' && (
                    <SelectField
                      options={field.options ?? []}
                      {...register(`fieldInputs.${field.name}`)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </FormProvider>
      <div className="text-center text-sm text-stone-400">
        anoChick 2023 all right reserved.
      </div>
    </div>
  );
};
