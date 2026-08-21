import React from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sharvan Base CMS — Administration & Content Architecture",
  description: "Administrative portal for C S Sharvan Sai portfolio management.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <AdminDashboard />
    </div>
  );
}
