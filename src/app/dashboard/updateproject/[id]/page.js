import UpdateProject from '../../../../Dashboard/UpdateProject';

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <UpdateProject projectId={resolvedParams?.id} />;
}

