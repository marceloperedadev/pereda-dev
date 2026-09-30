import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/analytics-auth";
import { analyzePublicProject } from "@/lib/server/portfolio-projects";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
 const denied=await requireAdmin(); if(denied)return denied;
 let body:unknown; try{body=await request.json()}catch{return NextResponse.json({error:"Corpo JSON inválido."},{status:400})}
 const url=body&&typeof body==="object"?(body as Record<string,unknown>).url:null;
 if(typeof url!=="string")return NextResponse.json({error:"Informe uma URL."},{status:400});
 try{return NextResponse.json({analysis:await analyzePublicProject(url)},{headers:{"Cache-Control":"private, no-store"}})}
 catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível analisar o endereço."},{status:422})}
}
