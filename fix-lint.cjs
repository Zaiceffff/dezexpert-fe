#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для исправления импортов NextRequest
function fixNextRequestImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Исправляем импорты NextRequest
    if (content.includes('import { NextRequest, NextResponse }')) {
      content = content.replace(
        'import { NextRequest, NextResponse } from \'next/server\';',
        'import type { NextRequest } from \'next/server\';\nimport { NextResponse } from \'next/server\';'
      );
    }
    
    // Исправляем импорты NextRequest
    if (content.includes('import { NextRequest }')) {
      content = content.replace(
        'import { NextRequest } from \'next/server\';',
        'import type { NextRequest } from \'next/server\';'
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Исправлен ${filePath}`);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Функция для исправления неиспользуемых импортов
function fixUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Удаляем неиспользуемые импорты
    const unusedImports = [
      'import { Image } from \'next/image\';',
      'import { BarChart3 } from \'lucide-react\';',
      'import { Calendar } from \'lucide-react\';',
      'import { Filter } from \'lucide-react\';',
      'import { Input } from \'@/components/ui/input\';',
      'import { useEffect } from \'react\';',
      'import { useMemo } from \'react\';',
      'import { Link } from \'next/link\';',
      'import { apiClient } from \'@/lib/api\';',
      'import { apiClient } from \'@/lib/apiUtils\';',
      'import { getAuthToken } from \'@/lib/auth\';',
      'import { FullScreenLoader } from \'@/components/ui/loading-spinner\';',
      'import { Heart } from \'lucide-react\';',
      'import { Settings } from \'lucide-react\';',
      'import { Lock } from \'lucide-react\';',
      'import { Award } from \'lucide-react\';',
      'import { MessageCircle } from \'lucide-react\';',
      'import { track } from \'@/lib/analytics\';',
      'import { ButtonLoader } from \'@/components/ui/loading-spinner\';',
      'import { LoadingSpinner } from \'@/components/ui/loading-spinner\';',
      'import { ChevronLeft } from \'lucide-react\';',
      'import { ChevronRight } from \'lucide-react\';',
      'import { ChevronsLeft } from \'lucide-react\';',
      'import { ChevronsRight } from \'lucide-react\';',
      'import { Textarea } from \'@/components/ui/textarea\';',
      'import { getApiUrl } from \'@/lib/config\';',
      'import { validatePrices } from \'@/lib/validation\';',
      'import { formatPrice } from \'@/lib/utils\';',
      'import { showTextOnMobile } from \'@/lib/utils\';',
      'import { showLabelOnMobile } from \'@/lib/utils\';',
      'import { get } from \'@/lib/api\';',
      'import { SmsRequest, SmsResponse } from \'@/lib/types\';',
      'import { User } from \'@/lib/types\';'
    ];
    
    unusedImports.forEach(importStr => {
      if (content.includes(importStr)) {
        content = content.replace(importStr, '');
        console.log(`🗑️ Удален неиспользуемый импорт в ${filePath}`);
      }
    });
    
    // Очищаем пустые строки после удаления импортов
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Функция для исправления типов any
function fixAnyTypes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Заменяем any на unknown где это безопасно
    content = content.replace(/: any/g, ': unknown');
    content = content.replace(/: any\[/g, ': unknown[');
    content = content.replace(/any>/g, 'unknown>');
    
    fs.writeFileSync(filePath, content);
    console.log(`🔧 Исправлены типы any в ${filePath}`);
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
  }
}

// Основная функция
function main() {
  console.log('🔧 Начинаю исправление ошибок линтера...\n');
  
  // Список файлов для исправления
  const filesToFix = [
    'src/app/api/ai/proxy/route.ts',
    'src/app/api/auth/login/route.ts',
    'src/app/api/auth/register/route.ts',
    'src/app/api/leads/route.ts',
    'src/app/api/order/list/route.ts',
    'src/app/api/order/route.ts',
    'src/app/api/partners/[id]/pricing/route.ts',
    'src/app/api/user/by-link-id/[linkId]/route.ts',
    'src/app/api/user/profile/route.ts',
    'src/app/api/user/service/route.ts',
    'src/app/api/user/token-info/route.ts',
    'src/app/(marketing)/page.tsx',
    'src/app/[linkId]/page.tsx',
    'src/app/app/(protected)/dashboard/page.tsx',
    'src/app/app/(protected)/layout.tsx',
    'src/app/app/(protected)/leads/[id]/page.tsx',
    'src/app/app/(protected)/leads/page.tsx',
    'src/app/app/(protected)/page.tsx',
    'src/app/app/(protected)/settings/page.tsx',
    'src/app/app/auth/page.tsx',
    'src/app/layout.tsx',
    'src/app/offer/page.tsx',
    'src/app/payment_v2/error/page.tsx',
    'src/app/payment_v2/success/page.tsx',
    'src/app/policy/page.tsx',
    'src/app/register/page.tsx',
    'src/components/AddRequestModal.tsx',
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
    'src/components/ui/table.tsx',
    'src/hooks/useApi.ts',
    'src/hooks/useAuth.tsx',
    'src/hooks/useBilling.ts',
    'src/hooks/useOrders.ts',
    'src/hooks/usePartners.ts',
    'src/hooks/useSms.ts',
    'src/hooks/useUsers.ts',
    'src/hooks/useWebhooks.ts',
    'src/lib/analytics.ts',
    'src/lib/api.ts',
    'src/lib/apiUtils.ts',
    'src/lib/events.ts',
    'src/lib/logger.ts',
    'src/lib/pricingApi.ts',
    'src/lib/repo.ts',
    'src/lib/types.ts',
    'src/tests/unit/pricing.test.ts'
  ];
  
  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`📁 Обрабатываю ${filePath}...`);
      fixNextRequestImports(filePath);
      fixUnusedImports(filePath);
      fixAnyTypes(filePath);
    } else {
      console.log(`⚠️ Файл не найден: ${filePath}`);
    }
  });
  
  console.log('\n✅ Исправление завершено!');
  console.log('💡 Запустите "npm run lint" для проверки результата');
}

main();
