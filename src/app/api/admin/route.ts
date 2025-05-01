import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

// Login endpoint
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    if (username === db.admin.username && password === db.admin.password) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// Get messages endpoint
export async function GET() {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return NextResponse.json(db.messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Mark message as read
export async function PUT(request: Request) {
  try {
    const { id } = await request.json();
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    const message = db.messages.find((m: any) => m.id === id);
    if (message) {
      message.read = true;
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
} 