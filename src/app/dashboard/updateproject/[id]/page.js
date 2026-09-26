import UpdateProject from '../../../../Dashboard/UpdateProject';

export async function generateStaticParams() {
  try {
    const res = await fetch('https://3pcommunicationsserver.vercel.app/api/projects');
    const data = await res.json();
    const list = data?.projects || (Array.isArray(data) ? data : []);
    if (list.length > 0) {
      return list.map((p) => ({ id: String(p._id) }));
    }
  } catch (e) {
    console.warn('Could not fetch projects for static export params:', e.message);
  }
  return [{ id: '6725964c8c4655a9ee37871c' }];
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <UpdateProject projectId={resolvedParams?.id} />;
}


