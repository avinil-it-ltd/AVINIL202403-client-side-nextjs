import CareerApplicationForm from '../../../views/Career/CareerApplicationForm';

export const metadata = {
  title: 'Apply for Career | 3p Communication',
  description: 'Submit your job application to 3P Communication.',
};

export async function generateStaticParams() {
  try {
    const res = await fetch('https://3pcommunicationsserver.vercel.app/api/careers');
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data?.careers || []);
    if (list.length > 0) {
      return list.map((c) => ({ id: String(c._id) }));
    }
  } catch (e) {
    console.warn('Could not fetch careers for static export params:', e.message);
  }
  return [{ id: 'general' }];
}

export default function ApplyCareerPage() {
  return <CareerApplicationForm />;
}
