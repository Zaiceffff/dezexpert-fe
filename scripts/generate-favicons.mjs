import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

async function generateFavicons() {
  const inputPath = path.join(process.cwd(), 'public', 'logo.jpeg');
  const outputDir = path.join(process.cwd(), 'public', 'favicon');
  
  // Создаем папку favicon если её нет
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Генерируем favicon файлы из logo.jpeg...');
  
  for (const { size, name } of sizes) {
    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(path.join(outputDir, name));
      
      console.log(`✅ Создан ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Ошибка при создании ${name}:`, error.message);
    }
  }
  
  console.log('Генерация favicon завершена!');
}

generateFavicons().catch(console.error);
