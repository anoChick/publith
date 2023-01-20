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
  description: string;
  publicationStatus: string;
  html: string;
  fields: Field[];
};

export const TemplateEditor: React.FC<Props> = () => {
  const router = useRouter();
  const saveMutation = trpc.myTemplate.save.useMutation({
    onError: (e) => {
      toast.error('テンプレの保存に失敗しました.');
    },
    onSuccess() {
      toast.success('テンプレを保存しました.');
    },
  });

  const useFormMethods = useForm<FormType>({
    defaultValues: {
      id: '',
      title: '',
      description: '',
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
  trpc.myTemplate.template.useQuery(
    {
      id: `${router.query.id}`,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 0,
      onError: () => {
        toast.error('テンプレが見つかりませんでした.');
        router.push('/');
      },
      onSuccess: (data) => {
        const template = data?.template ?? null;
        if (!template) return;
        reset({
          id: template.id,
          title: template.title,
          description: template.description,
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
  };
  return (
    <div className="w-full h-full flex flex-col">
      <FormProvider {...useFormMethods}>
        <div className="text-center gridbg pt-14">
          <div className="py-4">
            {svg && (
              <img
                className="inline-block max-h-64"
                src={`data:image/svg+xml;base64,${window.btoa(svg)}`}
                alt="preview"
              />
            )}
          </div>

          <div className="pb-2 rounded-t-xl bg-white"></div>
        </div>
        <Tab.Group as="div" className="w-full flex flex-col flex-1 bg-white">
          <Tab.List className="flex mt-[-8px] rounded-t-xl">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'py-3 flex-1 outline-0 text-center transition-all duration-300 font-bold hover:bg-stone-100 border-b-4 ',

                    selected
                      ? 'border-orange-400  text-stone-900'
                      : 'border-stone-300',
                  )
                }
              >
                <div> {tab.title}</div>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="flex-1">
            <Tab.Panel key={'code'} className="w-full h-full">
              <Editor
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
                onChange={(newCode) => {
                  setValue('html', newCode ?? '');
                }}
                width="100%"
                height="100%"
                defaultLanguage="html"
                value={htmlValue}
              />
            </Tab.Panel>
            <Tab.Panel
              key={'fields'}
              className="w-full h-full overflow-y-auto  px-2 py-4"
            >
              <div className="h-0">
                <div className="pb-8">
                  <TemplateFieldsField />
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel
              key={'settings'}
              className="w-full h-full px-2 py-4 overflow-y-auto"
            >
              <div className="h-0">
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
                <div className="mb-2">
                  <FieldLabel>説明</FieldLabel>
                  <TextField rows={5} {...register('description')} />
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className="w-full m px-2 py-2 ">
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
