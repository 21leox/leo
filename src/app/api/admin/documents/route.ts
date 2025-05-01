import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return NextResponse.json(data.documents || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const body = await request.json();
    
    const newDocument = {
      id: Date.now(),
      ...body,
      date: new Date().toISOString()
    };
    
    data.documents = [...(data.documents || []), newDocument];
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newDocument);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
} 