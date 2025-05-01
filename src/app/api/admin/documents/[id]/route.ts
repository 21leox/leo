import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dbPath = path.join(process.cwd(), 'src/data/db.json');
    const fileContent = await fs.promises.readFile(dbPath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Belgeyi bul ve sil
    const documentIndex = data.documents.findIndex((d: any) => d.id === parseInt(params.id));
    if (documentIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    data.documents.splice(documentIndex, 1);
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
} 