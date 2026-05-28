import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import SettingsForm from '@/components/admin/SettingsForm';
import { redirect } from 'next/navigation';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/admin/auth/login');
  }

  // Fetch the absolute latest data from the database
  const userDb = await prisma.customer.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      title: true,
      image: true
    }
  });

  if (!userDb) {
    redirect('/admin/auth/login');
  }

  return <SettingsForm initialData={userDb} />;
}
