import OrgChartCanvas from '../components/OrgChartCanvas';

export const metadata = {
  title: 'OrgBuilder - Visual Org Chart',
  description: 'A tool to build and layout your organization chart easily.',
};

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <OrgChartCanvas />
    </main>
  );
}
