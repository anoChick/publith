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

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

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

export const ImageGenerator: React.FC<Props> = () => {
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
  const { setValue, watch, getValues, reset, register } = useFormMethods;
  const htmlValue = watch('html');
  const fieldInputsValue = watch('fieldInputs');
  const { data } = trpc.template.template.useQuery(
    {
      id: `${router.query.id}`,
    },
    {
      onSuccess: (data) => {
        const template = data?.template ?? null;
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
      },
    },
  );

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
        <div className="text-center flex-1 gridbg pt-4 ">
          <div className="">
            {svg && (
              <img
                className="previewimage inline shadow-lg shadow-stone-300 z-10"
                src={`data:image/svg+xml;base64,${window.btoa(svg)}`}
                alt="preview"
              />
            )}
          </div>

          <div className="bg-white z-20 mt-4 rounded-2xl rounded-b h-4"></div>
        </div>
        <div className="p-4">
          <div className="bg-stone-100 p-8 rounded-xl">
            <button
              className="bg-orange-400 px-4 py-2 rounded-lg text-white mr-4"
              onClick={() => {
                copy(imageUrl);
                toast.success('画像URLをクリップボードにコピーしました.');
              }}
            >
              <Icon
                icon="material-symbols:content-paste"
                className="w-4 h-4 inline-block align-top mr-2 mt-0.5 text-xl"
              />
              クリップボードにコピー
            </button>

            <button
              className="bg-orange-400 px-4 py-2 rounded-lg text-white"
              onClick={() => {
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.href = imageUrl;
                link.download = `${data?.template?.title}.png`;
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Icon
                icon="material-symbols:content-paste"
                className="w-4 h-4 inline-block align-top mr-2 mt-0.5 text-xl"
              />
              ダウンロード
            </button>
          </div>
          <div className="w-full m px-2 py-16">
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
