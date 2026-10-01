import type { Metadata } from "next";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";
import { projects } from "@/lib/data/projects";
export const metadata:Metadata={title:"Projetos | Admin Pereda Dev",robots:{index:false,follow:false,noarchive:true}};
export const dynamic="force-dynamic";
export default function ProjectsAdminPage(){return <div className="container"><ProjectsAdmin initialProjects={projects}/></div>}
