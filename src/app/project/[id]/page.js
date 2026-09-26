import ProjectsDetails from '../../../views/ProjectsDetails/ProjectsDetails';

export const metadata = {
  title: 'Project Details | 3p Communication',
  description: 'View project details, gallery, and client specifications.',
};

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

export default function ProjectDetailsPage() {
  return <ProjectsDetails />;
}
