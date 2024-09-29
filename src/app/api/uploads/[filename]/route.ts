// app/api/uploads/[filename]/route.ts
import { createReadStream } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs'

export async function GET(request: Request, {params}) {

// export default async function GET(request: NextRequest,{ params }: { params: { filename: string } }){
  const filename = params.filename;
  console.log(filename)
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }
  const filePath = join(process.cwd(), 'public', 'uploads', filename);

  const imageBuffer = await fs.promises.readFile(filePath);
  
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg', // Ganti sesuai tipe gambar (image/png, image/webp, dll.)
      'Content-Length': imageBuffer.length.toString(),
    },
  });
  // return new Promise((resolve) => {
  //   const stream = createReadStream(filePath);
  //   stream.on('open', () => {
  //     resolve(new NextResponse(stream as any, {
  //       headers: {
  //         'Content-Type': 'image/jpeg', // Sesuaikan dengan tipe file yang diupload
  //       },
  //     }));
  //   });

  //   stream.on('error', () => {
  //     resolve(NextResponse.json({ error: 'File not found' }, { status: 404 }));
  //   });
  // });
}
