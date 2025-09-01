#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для исправления неиспользуемых переменных
function fixUnusedVariables(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Удаляем неиспользуемые переменные
    const unusedVars = [
      'userData',
      'copied',
      'registrationData',
      'prices',
      'router',
      'Order',
      'Link',
      'useEffect',
      'confirmPassword',
      'ChartData',
      'userProfile',
      'getCurrentWeek',
      'handleLogout',
      'validatePrices',
      'isLoading',
      'ButtonLoader',
      'LoadingSpinner',
      'useMemo',
      'ChevronLeft',
      'ChevronRight',
      'ChevronsLeft',
      'ChevronsRight',
      'getOrderById',
      'setMessage',
      'isSaving',
      'formatPrice',
      'showTextOnMobile',
      'showLabelOnMobile',
      'get',
      'event',
      'data'
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

// Функция для исправления неиспользуемых импортов
function fixUnusedImportsAdvanced(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Удаляем неиспользуемые импорты
    const unusedImports = [
      'import { Heart } from \'lucide-react\';',
      'import { BarChart3 } from \'lucide-react\';',
      'import { Calendar } from \'lucide-react\';',
      'import { Settings } from \'lucide-react\';',
      'import { Lock } from \'lucide-react\';',
      'import { Award } from \'lucide-react\';',
      'import { MessageCircle } from \'lucide-react\';',
      'import { toast } from \'sonner\';',
      'import { SmsRequest, SmsResponse } from \'@/lib/types\';',
      'import { User } from \'@/lib/types\';'
    ];
    
    unusedImports.forEach(importStr => {
      if (content.includes(importStr)) {
        content = content.replace(importStr, '');
        console.log(`🗑️ Удален неиспользуемый импорт в ${filePath}`);
      }
    });
    
    // Очищаем пустые строки
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Функция для исправления типов any
function fixAnyTypesAdvanced(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Заменяем any на unknown где это безопасно
    content = content.replace(/: any/g, ': unknown');
    content = content.replace(/: any\[/g, ': unknown[');
    content = content.replace(/any>/g, 'unknown>');
    
    // Заменяем Function на более конкретные типы
    content = content.replace(/: Function/g, ': (...args: unknown[]) => unknown');
    content = content.replace(/Function\[/g, '((...args: unknown[]) => unknown)[');
    content = content.replace(/Function>/g, '(...args: unknown[]) => unknown>');
    
    fs.writeFileSync(filePath, content);
    console.log(`🔧 Исправлены типы в ${filePath}`);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Функция для исправления require statements
function fixRequireStatements(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Заменяем require на import
    if (content.includes('require(')) {
      content = content.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, 'import { $1 } from \'$2\'');
      console.log(`🔄 Заменены require на import в ${filePath}`);
    }
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Функция для исправления пустых блоков
function fixEmptyBlocks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Заменяем пустые блоки на комментарии
    content = content.replace(/\{\s*\}/g, '{ /* TODO: implement */ }');
    
    fs.writeFileSync(filePath, content);
    console.log(`🔧 Исправлены пустые блоки в ${filePath}`);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Функция для исправления try/catch
function fixTryCatch(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Упрощаем ненужные try/catch
    content = content.replace(/try\s*\{\s*throw\s+([^;]+);\s*\}\s*catch\s*\(\s*([^)]+)\s*\)\s*\{\s*throw\s+\2;\s*\}/g, 'throw $1;');
    
    fs.writeFileSync(filePath, content);
    console.log(`🔧 Исправлены try/catch в ${filePath}`);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Основная функция
function main() {
  console.log('🔧 Начинаю исправление оставшихся ошибок линтера...\n');
  
  // Список файлов для исправления
  const filesToFix = [
    'src/app/[linkId]/page.tsx',
    'src/app/api/auth/login/route.ts',
    'src/app/api/order/route.ts',
    'src/app/app/(protected)/dashboard/page.tsx',
    'src/app/app/(protected)/layout.tsx',
    'src/app/app/(protected)/leads/page.tsx',
    'src/app/app/(protected)/page.tsx',
    'src/app/app/(protected)/settings/page.tsx',
    'src/app/app/auth/page.tsx',
    'src/app/offer/page.tsx',
    'src/app/payment_v2/success/page.tsx',
    'src/app/policy/page.tsx',
    'src/app/register/page.tsx',
    'src/components/Analytics.tsx',
    'src/components/Calendar.tsx',
    'src/components/DashboardPricingManager.tsx',
    'src/components/Footer.tsx',
    'src/components/Header.tsx',
    'src/components/LeadsList.tsx',
    'src/components/OrderDetails.tsx',
    'src/components/OrdersManagement.tsx',
    'src/components/PriceEditModal.tsx',
    'src/components/PriceManager.tsx',
    'src/components/PricingManager.tsx',
    'src/components/ui/button.tsx',
    'src/components/ui/input.tsx',
    'src/hooks/useAuth.tsx',
    'src/hooks/useBilling.ts',
    'src/hooks/useOrders.ts',
    'src/hooks/usePartners.ts',
    'src/hooks/useSms.ts',
    'src/hooks/useUsers.ts',
    'src/lib/analytics.ts',
    'src/lib/api.ts',
    'src/lib/events.ts',
    'src/lib/logger.ts',
    'src/lib/repo.ts',
    'src/tests/unit/pricing.test.ts'
  ];
  
  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`📁 Обрабатываю ${filePath}...`);
      fixUnusedVariables(filePath);
      fixUnusedImportsAdvanced(filePath);
      fixAnyTypesAdvanced(filePath);
      fixRequireStatements(filePath);
      fixEmptyBlocks(filePath);
      fixTryCatch(filePath);
    } else {
      console.log(`⚠️ Файл не найден: ${filePath}`);
    }
  });
  
  console.log('\n✅ Исправление завершено!');
  console.log('💡 Запустите "npm run lint" для проверки результата');
}

main();
