import { TemplateEditor } from '~/components/organisms/TemplateEditor';
import { NextPageWithLayout } from '~/pages/_app';

const Page: NextPageWithLayout = (props) => {
  return (
    <div className="h-full w-full">
      <TemplateEditor />
    </div>
  );
};

export default Page;
