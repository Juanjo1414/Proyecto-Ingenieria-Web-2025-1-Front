import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser, type User, type UpdateUserDto } from '../api/users';
import toast from 'react-hot-toast';
import { FaUserCircle, FaSave } from 'react-icons/fa'; 

const UserProfile: React.FC = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [allergicReactions, setAllergicReactions] = useState('');
  const [testSubjectStatus, setTestSubjectStatus] = useState(false);
  const [initialUserData, setInitialUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setError('Usuario no autenticado. Por favor, inicia sesión para ver tu perfil.');
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserById(user.id);
        setInitialUserData(userData);
        setCurrentName(userData.name);
        setCurrentEmail(userData.email);
        setAllergicReactions(userData.allergic_reactions || '');
        setTestSubjectStatus(userData.test_subject_status || false);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('Error al cargar el perfil del usuario. Por favor, inténtalo de nuevo.');
        toast.error('Error al cargar tu perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('No se pudo actualizar: usuario no autenticado.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    const updatedData: UpdateUserDto = {};
    let changesMade = false;

    if (initialUserData) {
      if (currentName !== initialUserData.name) {
        updatedData.name = currentName;
        changesMade = true;
      }

      if (currentEmail !== initialUserData.email) {
        updatedData.email = currentEmail;
        changesMade = true;
      }

      if ((user?.role === 'tester' || user?.role === 'admin' || user?.role === 'employee') &&
          allergicReactions !== (initialUserData.allergic_reactions || '')) {
        updatedData.allergic_reactions = allergicReactions;
        changesMade = true;
      }

      if ((user?.role === 'tester' || user?.role === 'admin' || user?.role === 'employee') &&
          testSubjectStatus !== (initialUserData.test_subject_status || false)) {
        updatedData.test_subject_status = testSubjectStatus;
        changesMade = true;
      }
    }

    if (newPassword) {
      updatedData.password = newPassword;
      changesMade = true;
    }

    if (!changesMade) {
      toast('No hay cambios para guardar.', { icon: 'ℹ️' });
      return;
    }

    try {
      await updateUser(user.id, updatedData);
      toast.success('Perfil actualizado exitosamente. ¡Mantén tu glamour!');
      
      if (newPassword || updatedData.email) {
        await login(updatedData.email || currentEmail, newPassword || ''); 
      } else {
          const updatedUserData = await getUserById(user.id);
      }

      setNewPassword('');
      setConfirmPassword('');
      const reFetchedUserData = await getUserById(user.id);
      setInitialUserData(reFetchedUserData);
      setCurrentName(reFetchedUserData.name);
      setCurrentEmail(reFetchedUserData.email);
      setAllergicReactions(reFetchedUserData.allergic_reactions || '');
      setTestSubjectStatus(reFetchedUserData.test_subject_status || false);

    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      const errorMessage = (err as any)?.response?.data?.message || 'Error al actualizar el perfil.';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <p className="flex-1 p-8 text-center text-pink-700">Cargando tu perfil...</p>
    );
  }

  if (error) {
    return (
      <p className="flex-1 p-8 text-center text-red-600">{error}</p>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
        <div className="flex items-center justify-center mb-6">
          <FaUserCircle className="text-pink-600 text-5xl mr-4" />
          <h2 className="text-3xl font-bold text-pink-700 font-serif">Mi Perfil GlamGiant</h2>
        </div>
        <p className="mb-8 text-center text-gray-600 text-lg font-serif">Aquí puedes gestionar tu información personal y preferencias.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Nombre Completo</span>
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              required
            />
          </label>
          {/* Correo Electrónico */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Correo Electrónico</span>
            <input
              type="email"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              required
            />
          </label>
          {/* Nueva Contraseña */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Nueva Contraseña (dejar en blanco para no cambiar)</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            />
          </label>
          {/* Confirmar Nueva Contraseña */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Confirmar Nueva Contraseña</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            />
          </label>

          {(user?.role === 'tester' || user?.role === 'admin' || user?.role === 'employee') && (
            <>
              {/* Sujeto de Prueba */}
              <label className=" flex items-center space-x-3 mt-4">
                <input
                  type="checkbox"
                  checked={testSubjectStatus}
                  onChange={(e) => setTestSubjectStatus(e.target.checked)}
                  className="form-checkbox h-6 w-6 text-pink-600 rounded-md focus:ring-pink-400 transition"
                />
                <span className="text-gray-700 font-semibold text-lg">¿Es sujeto de prueba? </span>
              </label>
              {/* Reacciones Alérgicas */}
              <label className="block">
                <span className="text-gray-700 font-semibold">Reacciones Alérgicas</span>
                <textarea
                  value={allergicReactions}
                  onChange={(e) => setAllergicReactions(e.target.value)}
                  placeholder="Cualquier reacción alérgica documentada (ej: enrojecimiento, picazón)"
                  className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-400 focus:border-transparent transition"
                  rows={3}
                />
              </label>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <FaSave className="text-xl" />
            <span>Guardar Cambios</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;