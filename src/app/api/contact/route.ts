import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Request body'sini parse et
    const data = await request.json();
    console.log('Received data:', data);

    const { name, email, message } = data;

    // Gerekli alanların kontrolü
    if (!name || !email || !message) {
      console.log('Missing required fields:', { name, email, message });
      return NextResponse.json(
        { error: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Lütfen geçerli bir e-posta adresi girin' },
        { status: 400 }
      );
    }

    // Mesaj uzunluğu kontrolü
    if (message.length < 10) {
      console.log('Message too short:', message.length);
      return NextResponse.json(
        { error: 'Mesajınız çok kısa. Lütfen daha detaylı bir mesaj yazın' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'src/data/db.json');
    console.log('Database path:', dbPath);

    try {
      // Dosyanın varlığını kontrol et
      if (!fs.existsSync(dbPath)) {
        console.log('Database file does not exist, creating new file');
        // Dosya yoksa yeni bir dosya oluştur
        const initialData = {
          messages: [],
          projects: [],
          documents: []
        };
        await fs.promises.writeFile(dbPath, JSON.stringify(initialData, null, 2));
      }

      // Dosyayı oku
      const fileContent = await fs.promises.readFile(dbPath, 'utf-8');
      console.log('File content:', fileContent);

      let dbData;
      try {
        dbData = JSON.parse(fileContent);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // JSON geçersizse, yeni bir veri yapısı oluştur
        dbData = {
          messages: [],
          projects: [],
          documents: []
        };
      }

      // messages dizisinin varlığını kontrol et
      if (!Array.isArray(dbData.messages)) {
        console.log('Messages array does not exist, creating new array');
        dbData.messages = [];
      }

      // Yeni mesajı ekle
      const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString(),
        read: false
      };

      console.log('Adding new message:', newMessage);
      dbData.messages.push(newMessage);

      // Dosyaya yaz
      await fs.promises.writeFile(dbPath, JSON.stringify(dbData, null, 2));
      console.log('Message saved successfully');

      return NextResponse.json({ success: true });
    } catch (fileError) {
      console.error('Database file error:', fileError);
      return NextResponse.json(
        { error: 'Veritabanı dosyasına erişilemiyor. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to save message:', error);
    return NextResponse.json(
      { error: 'Mesaj kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
} 