#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для исправления импортов компонентов
function fixComponentImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Добавляем недостающие импорты
    if (content.includes('<Input') && !content.includes('import { Input }')) {
      content = content.replace(
        'import { Button } from \'@/components/ui/button\';',
        'import { Button } from \'@/components/ui/button\';\nimport { Input } from \'@/components/ui/input\';'
      );
      console.log(`➕ Добавлен импорт Input в ${filePath}`);
    }
    
    if (content.includes('<Textarea') && !content.includes('import { Textarea }')) {
      content = content.replace(
        'import { Button } from \'@/components/ui/button\';',
        'import { Button } from \'@/components/ui/button\';\nimport { Textarea } from \'@/components/ui/textarea\';'
      );
      console.log(`➕ Добавлен импорт Textarea в ${filePath}`);
    }
    
    if (content.includes('<LoadingSpinner') && !content.includes('import { LoadingSpinner }')) {
      content = content.replace(
        'import { Button } from \'@/components/ui/button\';',
        'import { Button } from \'@/components/ui/button\';\nimport { LoadingSpinner } from \'@/components/ui/loading-spinner\';'
      );
      console.log(`➕ Добавлен импорт LoadingSpinner в ${filePath}`);
    }
    
    if (content.includes('<ButtonLoader') && !content.includes('import { ButtonLoader }')) {
      content = content.replace(
        'import { Button } from \'@/components/ui/button\';',
        'import { Button } from \'@/components/ui/button\';\nimport { ButtonLoader } from \'@/components/ui/loading-spinner\';'
      );
      console.log(`➕ Добавлен импорт ButtonLoader в ${filePath}`);
    }
    
    if (content.includes('<BarChart3') && !content.includes('import { BarChart3 }')) {
      content = content.replace(
        'import { TrendingUp, Users, DollarSign, MapPin, Download } from \'lucide-react\';',
        'import { TrendingUp, Users, DollarSign, MapPin, Download, BarChart3 } from \'lucide-react\';'
      );
      console.log(`➕ Добавлен импорт BarChart3 в ${filePath}`);
    }
    
    if (content.includes('<Settings') && !content.includes('import { Settings }')) {
      content = content.replace(
        'import { TrendingUp, Users, DollarSign, MapPin, Download } from \'lucide-react\';',
        'import { TrendingUp, Users, DollarSign, MapPin, Download, Settings } from \'lucide-react\';'
      );
      console.log(`➕ Добавлен импорт Settings в ${filePath}`);
    }
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Функция для исправления неиспользуемых переменных
function fixUnusedVariablesAdvanced(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Удаляем неиспользуемые переменные
    const unusedVars = [
      'copied',
      'translateService',
      'fetchOrdersWithPagination'
    ];
    
    unusedVars.forEach(varName => {
      // Удаляем объявления неиспользуемых переменных
      const patterns = [
        new RegExp(`const\\s+${varName}\\s*=\\s*[^;]+;?\\s*`, 'g'),
        new RegExp(`let\\s+${varName}\\s*=\\s*[^;]+;?\\s*`, 'g'),
        new RegExp(`var\\s+${varName}\\s*=\\s*[^;]+;?\\s*`, 'g')
      ];
      
      patterns.forEach(pattern => {
        if (content.match(pattern)) {
          content = content.replace(pattern, '');
          console.log(`🗑️ Удалена неиспользуемая переменная ${varName} в ${filePath}`);
        }
      });
    });
    
    // Очищаем пустые строки
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Основная функция
function main() {
  console.log('🔧 Начинаю исправление импортов и оставшихся проблем...\n');
  
  // Список файлов для исправления
  const filesToFix = [
    'src/app/app/(protected)/leads/page.tsx',
    'src/app/app/(protected)/page.tsx',
    'src/app/app/(protected)/settings/page.tsx',
    'src/app/app/auth/page.tsx',
    'src/app/register/page.tsx',
    'src/components/AddRequestModal.tsx',
    'src/components/Analytics.tsx',
    'src/components/DashboardPricingManager.tsx',
    'src/components/LeadsList.tsx',
    'src/components/OrderDetails.tsx',
    'src/components/OrdersManagement.tsx',
    'src/components/PriceEditModal.tsx',
    'src/components/PricingManager.tsx',
    'src/app/app/(protected)/dashboard/page.tsx'
  ];
  
  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`📁 Обрабатываю ${filePath}...`);
      fixComponentImports(filePath);
      fixUnusedVariablesAdvanced(filePath);
    } else {
      console.log(`⚠️ Файл не найден: ${filePath}`);
    }
  });
  
  console.log('\n✅ Исправление завершено!');
  console.log('💡 Запустите "npm run lint" для проверки результата');
}

main();
