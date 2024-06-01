import { redirect } from 'next/navigation';

const DashboardPage = () => {
  redirect('/dashboard/documents');
};

export default DashboardPage;
