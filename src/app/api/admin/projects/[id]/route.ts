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

    // Projeyi bul ve sil
    const projectIndex = data.projects.findIndex((p: any) => p.id === parseInt(params.id));
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    data.projects.splice(projectIndex, 1);
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 