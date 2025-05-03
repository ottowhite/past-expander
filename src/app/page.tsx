'use client';

import { TimelineProvider } from '@/context/TimelineContext';
import Timeline from '@/components/Timeline';
import AddEventForm from '@/components/AddEventForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <TimelineProvider>
        <Timeline />
        <AddEventForm />
      </TimelineProvider>
    </main>
  );
}
