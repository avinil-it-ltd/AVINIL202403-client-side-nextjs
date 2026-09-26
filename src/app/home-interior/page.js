import { redirect } from 'next/navigation';

export default function HomeInteriorPage() {
  redirect('/interior?sub=Home');
}
