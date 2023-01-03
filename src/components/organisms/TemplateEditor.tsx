import Editor from '@monaco-editor/react';

import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { TemplateFieldsField } from '../molecules/TemplateFieldsField';
import { FormProvider, useForm } from 'react-hook-form';

import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { FieldLabel } from '../atoms/FieldLabel';
import { TextField } from '../atoms/TextField';
import { SelectField } from '../atoms/SelectField';
import { render } from '~/utils/render';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export type Field = {
  type: 'text' | 'select';
  name: string;
  title: string;
  options?: { title: string; value: string }[];
  description: string;
  default: string;
  sample: string;
};

export type FormType = {
  id: string;
  title: string;
  publicationStatus: string;
  html: string;
  fields: Field[];
};

export const TemplateEditor: React.FC<Props> = () => {
  const router = useRouter();
  const saveMutation = trpc.template.save.useMutation();

  const useFormMethods = useForm<FormType>({
    defaultValues: {
      id: '',
      title: '',
      publicationStatus: 'PRIVATE',
      html: '',
      fields: [
        {
          type: 'text',
          name: 'field1',
          title: '新規フィールド',
          description: '',
          default: '',
          sample: 'サンプルデータ',
        },
      ],
    },
  });
  const { setValue, watch, getValues, reset, register } = useFormMethods;
  trpc.template.template.useQuery(
    {
      id: `${router.query.id}`,
    },
    {
      onSuccess: (data) => {
        const template = data?.template ?? null;
        if (!template) return;
        reset({
          id: template.id,
          title: template.title,
          publicationStatus: template.publicationStatus,
          html: template.html,
          fields: template.fields as any,
        });
      },
    },
  );
  const htmlValue = watch('html');
  const fields = watch('fields');
  const tabs = [
    {
      name: 'code',
      title: 'コード',
    },
    {
      name: 'fields',
      title: 'フィールド',
    },
    {
      name: 'settings',
      title: '基本設定',
    },
  ];

  const [svg, setSvg] = useState<string | null>(null);

  const updateSvg = async () => {
    const sampleData: any = {};
    fields.forEach((field) => {
      sampleData[field.name] = field.sample;
    });
    const svg = await render(htmlValue, sampleData);
    if (svg) setSvg(svg);
  };

  useEffect(() => {
    updateSvg();
  }, [htmlValue]);

  const handleClickSaveButton = () => {
    const values = getValues();
    saveMutation.mutate(values);
    toast.success('テンプレを保存しました.');
  };
  return (
    <div>
      <FormProvider {...useFormMethods}>
        <div className="text-center flex-1 gridbg">
          <div className=" py-4">
            {svg && (
              <img
                className="previewimage inline"
                src={`data:image/svg+xml;base64,${window.btoa(svg)}`}
                alt="preview"
              />
            )}
          </div>

          <div className="py-2 rounded-t-xl bg-white"></div>
        </div>
        <div className="w-full m px-2 ">
          <Tab.Group as="div">
            <Tab.List className="flex w-full space-x-1 rounded-xl bg-orange-50 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 outline-0 ring-none font-bold',

                      selected
                        ? 'bg-white text-orange-500 shadow'
                        : 'text-orange-300 hover:bg-white/[0.12] hover:text-orange-400',
                    )
                  }
                >
                  <div> {tab.title}</div>
                </Tab>
              ))}
            </Tab.List>

            <div>
              <Tab.Panels className="mt-2">
                <Tab.Panel key={'code'}>
                  <div className="my-8">
                    <Editor
                      options={{
                        minimap: {
                          enabled: false,
                        },
                      }}
                      onChange={(newCode) => {
                        setValue('html', newCode ?? '');
                      }}
                      height="200px"
                      defaultLanguage="html"
                      value={htmlValue}
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel key={'fields'}>
                  <div>
                    <TemplateFieldsField />
                  </div>
                </Tab.Panel>
                <Tab.Panel key={'settings'}>
                  <div className="mt-8">
                    <div className="mb-2">
                      <FieldLabel>タイトル</FieldLabel>
                      <TextField {...register('title')} />
                    </div>
                    <div className="mb-2">
                      <FieldLabel>公開設定</FieldLabel>
                      <SelectField
                        options={[
                          { title: '公開', value: 'PUBLIC' },
                          { title: '限定公開', value: 'LIMIT' },
                          { title: '非公開', value: 'PRIVATE' },
                        ]}
                        {...register('publicationStatus')}
                      />
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </div>
        <div className="w-full m px-2 py-8 ">
          <button
            onClick={handleClickSaveButton}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            保存
          </button>
        </div>
      </FormProvider>
    </div>
  );
};
