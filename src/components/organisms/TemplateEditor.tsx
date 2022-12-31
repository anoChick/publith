import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import satori from 'satori';
import { html } from 'satori-html';
import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { TemplateFieldsField } from '../molecules/TemplateFieldsField';
import { FormProvider, useForm } from 'react-hook-form';
import { nanoid } from 'nanoid';
import Mustache from 'mustache';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

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
  id: string | null;
  title: string;
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
  const { setValue, watch, getValues, reset } = useFormMethods;
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

    const res = await fetch('/fonts/BIZUDPGothic-Bold.ttf');
    const data = await res.arrayBuffer();
    const a = html(Mustache.render(htmlValue, sampleData));
    const s = await satori(a as any, {
      width: 600,
      height: 400,
      fonts: [
        {
          name: 'Inter',
          data: data,
          weight: 700,
          style: 'normal',
        },
      ],
    });
    setSvg(s);
  };

  useEffect(() => {
    updateSvg();
  }, [htmlValue]);

  const handleClickSaveButton = () => {
    const values = getValues();
    saveMutation.mutate(values);
    console.log(values);
    toast.success('テンプレを保存しました.');
  };
  return (
    <div>
      <FormProvider {...useFormMethods}>
        <div className="text-center flex-1 bg-black">
          {svg && (
            <img
              className="previewimage inline"
              src={`data:image/svg+xml;base64,${window.btoa(svg)}`}
              alt="preview"
            />
          )}
        </div>
        <div className="w-full m px-2 py-16 ">
          <Tab.Group as="div">
            <Tab.List className="flex w-full space-x-1 rounded-xl bg-blue-900/20 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                    )
                  }
                >
                  <div> {tab.title}</div>
                </Tab>
              ))}
            </Tab.List>

            <div>
              <Tab.Panels className="mt-2">
                <Tab.Panel
                  key={'code'}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  )}
                >
                  <div>
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
                <Tab.Panel
                  key={'fields'}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  )}
                >
                  <div>
                    <TemplateFieldsField />
                  </div>
                </Tab.Panel>
                <Tab.Panel
                  key={'settings'}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  )}
                >
                  <div>aaa</div>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </div>
        <div className="w-full m px-2 py-16 ">
          <button
            onClick={handleClickSaveButton}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            保存
          </button>
        </div>
      </FormProvider>
    </div>
  );
};
