import React from 'react';
import DashboardLayout from '../Dashboard/DashboardLayout';

export default function Layout({ children, title, subtitle, actions, breadcrumbs }) {
  return (
    <DashboardLayout
      title={title}
      subtitle={subtitle}
      actions={actions}
      breadcrumbs={breadcrumbs}
    >
      {children}
    </DashboardLayout>
  );
}
