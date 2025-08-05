import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userApi } from '@/utils/api';
import { isAuthenticated, getAuthToken, removeAuthToken } from '@/utils/auth';
import { User } from '@/types';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery<User>(
    'currentUser',
    () => userApi.getCurrentUser().then(res => res.data),
    {
      enabled: isLoggedIn,
      retry: false,
      onError: () => {
        removeAuthToken();
        setIsLoggedIn(false);
      },
    }
  );

  const updateUserMutation = useMutation(
    (userData: Partial<User>) => userApi.updateCurrentUser(userData),
    {
      onSuccess: (response) => {
        queryClient.setQueryData('currentUser', response.data);
      },
    }
  );

  const deleteUserMutation = useMutation(
    () => userApi.deleteCurrentUser(),
    {
      onSuccess: () => {
        removeAuthToken();
        setIsLoggedIn(false);
        queryClient.clear();
      },
    }
  );

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    setIsLoggedIn(true);
    refetchUser();
  };

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    queryClient.clear();
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    logout,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isUpdatingUser: updateUserMutation.isLoading,
    isDeletingUser: deleteUserMutation.isLoading,
  };
};
