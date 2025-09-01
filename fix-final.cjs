#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для исправления оставшихся проблем
function fixFinalIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Исправляем переменную copied
    if (content.includes('const copied =')) {
      content = content.replace(/const\s+copied\s*=\s*[^;]+;?/g, '');
      console.log(`🗑️ Удалена переменная copied в ${filePath}`);
    }
    
    // Исправляем переменную let token на const
    if (content.includes('let token =')) {
      content = content.replace(/let\s+token\s*=/g, 'const token =');
      console.log(`🔧 Исправлена переменная token в ${filePath}`);
    }
    
    // Исправляем пустые блоки
    content = content.replace(/\{\s*\/\* TODO: implement \*\/\s*\}/g, '{}');
    
    // Очищаем пустые строки
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Основная функция
function main() {
  console.log('🔧 Начинаю финальное исправление...\n');
  
  // Список файлов для исправления
  const filesToFix = [
    'src/app/[linkId]/page.tsx',
    'src/components/OrderDetails.tsx'
  ];
  
  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`📁 Обрабатываю ${filePath}...`);
      fixFinalIssues(filePath);
    } else {
      console.log(`⚠️ Файл не найден: ${filePath}`);
    }
  });
  
  console.log('\n✅ Финальное исправление завершено!');
  console.log('💡 Запустите "npm run lint" для проверки результата');
}

main();
