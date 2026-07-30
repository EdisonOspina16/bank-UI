import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface ProfileData {
  id: string;
  email: string;
  phoneCountry: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  docType: string;
  docNumber: string;
  birthDate: string | null;
  ciudad: string;
  ocupacion: string;
  ingresosMensuales: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/perfil');
      setProfile(res.profile);
    } catch (e: any) {
      setError(e.message || 'Error al obtener el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: {
    nombre: string;
    telefono: string;
    ocupacion?: string;
  }) => {
    setError(null);
    setValidationErrors({});
    try {
      const res = await api.put('/api/perfil', data);
      setProfile(res.profile);
      // Update local storage user details to keep sync
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.firstName = res.profile.firstName;
        userObj.lastName = res.profile.lastName;
        userObj.phoneNumber = res.profile.phoneNumber;
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      return res;
    } catch (e: any) {
      if (e.validationErrors) {
        const errorMap: Record<string, string> = {};
        e.validationErrors.forEach((err: { field: string; message: string }) => {
          errorMap[err.field] = err.message;
        });
        setValidationErrors(errorMap);
      }
      setError(e.message || 'Error al actualizar el perfil.');
      throw e;
    }
  };

  const changePassword = async (payload: { password?: string; pin?: string }) => {
    setError(null);
    setValidationErrors({});
    try {
      const res = await api.put('/api/perfil/password', payload);
      return res;
    } catch (e: any) {
      if (e.validationErrors) {
        const errorMap: Record<string, string> = {};
        e.validationErrors.forEach((err: { field: string; message: string }) => {
          errorMap[err.field] = err.message;
        });
        setValidationErrors(errorMap);
      }
      setError(e.message || 'Error al actualizar seguridad.');
      throw e;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    validationErrors,
    updateProfile,
    changePassword,
    refetch: fetchProfile,
  };
}

export default useProfile;
