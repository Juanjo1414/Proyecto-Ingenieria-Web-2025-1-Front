import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser, type User, type UpdateUserDto } from '../api/users';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar'; 

const UserProfile: React.FC = () => {
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados del formulario para la información del usuario
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
        setError('Usuario no autenticado.');
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
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del perfil:', err);
        setError('Error al cargar tu perfil.');
        setLoading(false);
        toast.error('Error al cargar tu perfil.');
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('No se pudo actualizar el perfil: usuario no autenticado.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    const updatedData: UpdateUserDto = {};
    let changesMade = false;

    // Comparar con los datos iniciales para enviar solo lo que cambió
    if (initialUserData) {
        if (currentName !== initialUserData.name) {
            updatedData.name = currentName;
            changesMade = true;
        }
        if (currentEmail !== initialUserData.email) {
            updatedData.email = currentEmail;
            changesMade = true;
        }
        if (allergicReactions !== (initialUserData.allergic_reactions || '')) {
            updatedData.allergic_reactions = allergicReactions;
            changesMade = true;
        }
        if (testSubjectStatus !== (initialUserData.test_subject_status || false)) {
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
      const updatedUser = await updateUser(user.id, updatedData);
      toast.success('Perfil actualizado exitosamente.');
      setNewPassword('');
      setConfirmPassword('');

      //Actualizar el contexto de autenticación si el nombre o email cambiaron
      if (updatedData.name || updatedData.email) {
          if(updatedUser && (updatedUser.name !== user.name || updatedUser.email !== user.email)) {
              login(currentEmail, newPassword || '');
          }
      }

    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      const errorMessage = (err as any).response?.data?.message || 'Error al actualizar el perfil.';
      toast.error(errorMessage);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <p className="text-center text-gray-700">Cargando perfil...</p>
      </main>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <p className="text-center text-red-600">{error}</p>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
          <p className="mb-4">Gestiona tu información personal.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Nombre</span>
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Correo Electrónico</span>
              <input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Nueva Contraseña (dejar en blanco para no cambiar)</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="********"
                className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Confirmar Nueva Contraseña</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
              />
            </label>

            {(user?.role === 'tester' || user?.role === 'admin' || user?.role === 'employee') && ( 
              <>
                <label className="block flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={testSubjectStatus}
                    onChange={(e) => setTestSubjectStatus(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-pink-600"
                  />
                  <span className="text-gray-700">¿Sujeto de prueba?</span>
                </label>
                <label className="block">
                  <span className="text-gray-700">Reacciones Alérgicas</span>
                  <textarea
                    value={allergicReactions}
                    onChange={(e) => setAllergicReactions(e.target.value)}
                    placeholder="Cualquier reacción alérgica documentada"
                    className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                    rows={2}
                  />
                </label>
              </>
            )}

            <button
              type="submit"
              className="bg-pink-600 text-white py-2 px-4 rounded w-full hover:bg-pink-700 transition"
            >
              Guardar Cambios
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;