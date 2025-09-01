import React from 'react';
import { useSeed } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const SeedManagement: React.FC = () => {
  const { isLoading, error, makeSeeds, makeTariffSeeds, clearError } = useSeed();

  const handleMakeSeeds = async () => {
    if (window.confirm('Вы уверены, что хотите создать тестовые данные? Это может перезаписать существующие данные.')) {
      const success = await makeSeeds();
      if (success) {
        toast.success('Тестовые данные успешно созданы!');
      }
    }
  };

  const handleMakeTariffSeeds = async () => {
    if (window.confirm('Вы уверены, что хотите создать тестовые тарифы? Это может перезаписать существующие тарифы.')) {
      const success = await makeTariffSeeds();
      if (success) {
        toast.success('Тестовые тарифы успешно созданы!');
      }
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Ошибка</span>
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={clearError} variant="outline">
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span>Управление тестовыми данными</span>
          </CardTitle>
          <CardDescription>
            Создание тестовых данных для разработки и тестирования
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Тестовые данные</span>
                </CardTitle>
                <CardDescription>
                  Создание тестовых пользователей, заявок и других данных
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleMakeSeeds}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    'Создать тестовые данные'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Тестовые тарифы</span>
                </CardTitle>
                <CardDescription>
                  Создание тестовых тарифов и планов подписки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleMakeTariffSeeds}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    'Создать тестовые тарифы'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Внимание!</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Эти действия предназначены только для разработки и тестирования. 
                  В продакшене используйте с осторожностью, так как они могут перезаписать существующие данные.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
