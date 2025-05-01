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
        { error: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir e-posta adresi girin' },
        { status: 400 }
      );
    }

    // Mesaj uzunluğu kontrolü
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Mesajınız çok kısa. Lütfen daha detaylı bir mesaj yazın' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'src/data/db.json');

    try {
      // Dosyayı oku
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

      // messages dizisini kontrol et ve gerekirse oluştur
      if (!dbData.messages) {
        dbData.messages = [];
      }

      dbData.messages.push(newMessage);

      // Dosyaya yaz
      await fs.promises.writeFile(dbPath, JSON.stringify(dbData, null, 2));

      return NextResponse.json({ 
        success: true,
        message: 'Mesajınız başarıyla gönderildi'
      });
    } catch (fileError) {
      console.error('Database error:', fileError);
      
      // Dosya okuma/yazma hatası durumunda
      if (fileError instanceof Error) {
        return NextResponse.json(
          { error: 'Veritabanı işlemi sırasında bir hata oluştu: ' + fileError.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Mesaj kaydedilirken bir hata oluştu' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request error:', error);
    
    // JSON parse hatası durumunda
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Bir hata oluştu, lütfen tekrar deneyin' },
      { status: 500 }
    );
  }
} 