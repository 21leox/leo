import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return NextResponse.json({
      projects: data.projects || [],
      documents: data.documents || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 