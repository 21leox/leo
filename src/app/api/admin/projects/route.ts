import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return NextResponse.json(data.projects || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const body = await request.json();
    
    const newProject = {
      id: Date.now(),
      ...body,
      date: new Date().toISOString()
    };
    
    data.projects = [...(data.projects || []), newProject];
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
} 