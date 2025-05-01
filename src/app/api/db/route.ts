import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Veritabanı dosyasının yolu
const dbPath = path.join(process.cwd(), 'src/data/db.json');

// Veritabanını oku
export async function GET() {
  try {
    const fileContent = await fs.promises.readFile(dbPath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Database read error:', error);
    return NextResponse.json(
      { error: 'Veritabanı okunamadı' },
      { status: 500 }
    );
  }
}

// Veritabanına yaz
export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database write error:', error);
    return NextResponse.json(
      { error: 'Veritabanına yazılamadı' },
      { status: 500 }
    );
  }
} 