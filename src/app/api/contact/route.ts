import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    
    // Read current database
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    // Add new message
    db.messages.push({
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString(),
      read: false
    });
    
    // Save to database
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
} 