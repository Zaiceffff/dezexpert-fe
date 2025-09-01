import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createIco() {
  const inputPath = path.join(process.cwd(), 'public', 'logo.jpeg');
  const outputPath = path.join(process.cwd(), 'public', 'favicon.ico');
  
  try {
    // Создаем ICO файл с несколькими размерами
    const sizes = [16, 32, 48];
    const buffers = [];
    
    for (const size of sizes) {
      const buffer = await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      buffers.push({ size, buffer });
    }
    
    // Создаем простой ICO файл (базовая структура)
    // Примечание: это упрощенная версия, для полноценного ICO нужна более сложная структура
    
    // Создаем PNG версию 32x32 как основной favicon
    await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(process.cwd(), 'public', 'favicon.png'));
    
    console.log('✅ Создан favicon.png (32x32)');
    console.log('⚠️  Для создания полноценного .ico файла рекомендуется использовать онлайн конвертеры');
    
  } catch (error) {
    console.error('❌ Ошибка при создании favicon:', error.message);
  }
}

createIco().catch(console.error);
