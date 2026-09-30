import {NextResponse} from "next/server";
import {requireAdmin} from "@/lib/server/analytics-auth";
import {listProjectRevisions} from "@/lib/server/portfolio-projects";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const denied=await requireAdmin();if(denied)return denied;const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:"ID inválido"},{status:400});try{return NextResponse.json({revisions:await listProjectRevisions(id)},{headers:{"Cache-Control":"private, no-store"}})}catch{return NextResponse.json({error:"Não foi possível carregar o histórico."},{status:503})}}
