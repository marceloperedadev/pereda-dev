import { AdminWorkspace } from "@/components/admin/AdminWorkspace";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminWorkspace>{children}</AdminWorkspace>;
}