#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для безопасного исправления неиспользуемых импортов
function fixUnusedImportsSafe(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Удаляем только неиспользуемые импорты из lucide-react
    const unusedLucideImports = [
      'Heart',
      'BarChart3', 
      'Calendar',
      'Settings',
      'Lock',
      'Award',
      'MessageCircle'
    ];
    
    unusedLucideImports.forEach(iconName => {
      // Ищем импорт с этим иконкой
      const importPattern = new RegExp(`import\\s*\\{[^}]*\\b${iconName}\\b[^}]*\\}\\s*from\\s*['"]lucide-react['"];?`, 'g');
      
      if (content.match(importPattern)) {
        // Удаляем иконку из импорта, оставляя остальные
        content = content.replace(importPattern, (match) => {
          // Убираем иконку и лишние запятые
          let newImport = match.replace(new RegExp(`\\b${iconName}\\b\\s*,?\\s*`), '');
          newImport = newImport.replace(/,\s*,/g, ','); // Убираем двойные запятые
          newImport = newImport.replace(/,\s*}/g, '}'); // Убираем запятую перед }
          newImport = newImport.replace(/{\s*,/g, '{'); // Убираем запятую после {
          newImport = newImport.replace(/{\s*}/g, '{}'); // Заменяем пустые импорты
          
          // Если импорт стал пустым, удаляем всю строку
          if (newImport.match(/import\s*\{\s*\}\s*from/)) {
            return '';
          }
          
          return newImport;
        });
        console.log(`🗑️ Удалена иконка ${iconName} из импорта в ${filePath}`);
      }
    });
    
    // Удаляем неиспользуемые импорты компонентов
    const unusedComponentImports = [
      'import { useEffect } from \'react\';',
      'import { useMemo } from \'react\';',
      'import { Link } from \'next/link\';',
      'import { useRouter } from \'next/navigation\';',
      'import { toast } from \'sonner\';'
    ];
    
    unusedComponentImports.forEach(importStr => {
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

// Функция для исправления неиспользуемых переменных
function fixUnusedVariablesSafe(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Удаляем только простые неиспользуемые переменные
    const unusedVars = [
      'copied',
      'registrationData',
      'prices',
      'router',
      'Order',
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
      // Удаляем только простые объявления переменных
      const patterns = [
        new RegExp(`const\\s+${varName}\\s*=\\s*[^;]+;?\\s*`, 'g'),
        new RegExp(`let\\s+${varName}\\s*=\\s*[^;]+;?\\s*`, 'g')
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
  console.log('🔧 Начинаю безопасное исправление...\n');
  
  // Список файлов для исправления
  const filesToFix = [
    'src/app/(marketing)/page.tsx',
    'src/app/[linkId]/page.tsx',
    'src/app/app/(protected)/leads/page.tsx',
    'src/app/app/(protected)/page.tsx',
    'src/app/app/(protected)/settings/page.tsx',
    'src/app/app/auth/page.tsx',
    'src/app/offer/page.tsx',
    'src/app/policy/page.tsx',
    'src/app/register/page.tsx',
    'src/components/Analytics.tsx',
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
    'src/lib/apiUtils.ts',
    'src/lib/events.ts',
    'src/lib/logger.ts',
    'src/lib/pricingApi.ts',
    'src/lib/repo.ts',
    'src/tests/unit/pricing.test.ts'
  ];
  
  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`📁 Обрабатываю ${filePath}...`);
      fixUnusedImportsSafe(filePath);
      fixUnusedVariablesSafe(filePath);
    } else {
      console.log(`⚠️ Файл не найден: ${filePath}`);
    }
  });
  
  console.log('\n✅ Безопасное исправление завершено!');
  console.log('💡 Запустите "npm run lint" для проверки результата');
}

main();
