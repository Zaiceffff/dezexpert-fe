import React, { useState } from 'react';
import { useUsersState } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Users, Trash2, Edit, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/lib/api';

export const UsersManagement: React.FC = () => {
  const { users, isLoading, error, fetchUsers, fetchAllUsers, updateUserStatus, deleteUser, clearError } = useUsersState();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState('');

  // Фильтрация пользователей по поиску
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const handleStatusUpdate = async (userId: string, status: string) => {
    const success = await updateUserStatus(userId, status);
    if (success) {
      setEditingUser(null);
      setNewStatus('');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      const success = await deleteUser(userId);
      if (success) {
        toast.success('Пользователь успешно удален');
      }
    }
  };

  const toggleUserList = () => {
    setShowAllUsers(!showAllUsers);
    if (!showAllUsers) {
      fetchAllUsers();
    } else {
      fetchUsers();
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-600">Ошибка загрузки пользователей</CardTitle>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <CardTitle>Управление пользователями</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={toggleUserList}
                variant="outline"
              >
                {showAllUsers ? 'Показать активных' : 'Показать всех'}
              </Button>
              <Button
                onClick={showAllUsers ? fetchAllUsers : fetchUsers}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {showAllUsers ? 'Все пользователи в системе' : 'Активные пользователи'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени, email или телефону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Загрузка пользователей...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Пользователи не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name} {user.surname}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          {editingUser?.id === user.id ? (
                            <div className="flex items-center space-x-2">
                              <select 
                                value={newStatus} 
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              >
                                <option value="active">Активен</option>
                                <option value="inactive">Неактивен</option>
                                <option value="suspended">Заблокирован</option>
                              </select>
                              <Button
                                onClick={() => handleStatusUpdate(user.id, newStatus)}
                                disabled={!newStatus}
                              >
                                Сохранить
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                              >
                                Отмена
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {user.status || 'active'}
                              </Badge>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setEditingUser(user);
                                  setNewStatus(user.status || 'active');
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
