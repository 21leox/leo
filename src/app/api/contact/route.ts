import { NextResponse } from 'next/server';

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

    try {
      // Veritabanını oku
      const dbResponse = await fetch('http://localhost:3000/api/db');
      if (!dbResponse.ok) {
        throw new Error('Veritabanı okunamadı');
      }
      const dbData = await dbResponse.json();

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

      // Veritabanına yaz
      const writeResponse = await fetch('http://localhost:3000/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbData),
      });

      if (!writeResponse.ok) {
        throw new Error('Veritabanına yazılamadı');
      }

      return NextResponse.json({ 
        success: true,
        message: 'Mesajınız başarıyla gönderildi'
      });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
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