import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    // Gerekli alanların kontrolü
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'src/data/db.json');
    const fileContent = await fs.promises.readFile(dbPath, 'utf-8');
    const dbData = JSON.parse(fileContent);

    // Yeni mesajı ekle
    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString(),
      read: false
    };

    dbData.messages.push(newMessage);
    await fs.promises.writeFile(dbPath, JSON.stringify(dbData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save message:', error);
    return NextResponse.json(
      { error: 'Mesaj kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 