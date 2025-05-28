import React, { useEffect, useState } from 'react';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type User,
  type CreateUserDto,
  type UpdateUserDto,
} from '../api/users';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlusSquare } from 'react-icons/fa';

const UsersManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'client' | 'tester' | 'employee'>('client');
  const [testSubjectStatus, setTestSubjectStatus] = useState(false);
  const [allergicReactions, setAllergicReactions] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios.');
      setLoading(false);
      toast.error('Error al cargar los usuarios.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('client');
    setTestSubjectStatus(false);
    setAllergicReactions('');
    setIsEditing(false);
    setCurrentUserId(null);
    setShowForm(false);
  };

  const handleEdit = (userToEdit: User) => {
    setCurrentUserId(userToEdit.id);
    setName(userToEdit.name);
    setEmail(userToEdit.email);
    setPassword(''); 
    setRole(userToEdit.role);
    setTestSubjectStatus(userToEdit.test_subject_status || false);
    setAllergicReactions(userToEdit.allergic_reactions || '');
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
      try {
        await deleteUser(id);
        toast.success('Usuario eliminado exitosamente.');
        fetchUsers();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        toast.error('Error al eliminar el usuario.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones front-end
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      toast.error('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (!isEditing && !password.trim()) {
      toast.error('La contraseña es requerida para nuevos usuarios.');
      return;
    }
    if (password.trim() && password.length < 6) { 
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const userData: CreateUserDto | UpdateUserDto = {
      name,
      email,
      role,
      test_subject_status: testSubjectStatus,
      allergic_reactions: allergicReactions,
    };

    if (password) {
      userData.password = password;
    }

    try {
      if (isEditing && currentUserId) {
        await updateUser(currentUserId, userData as UpdateUserDto);
        toast.success('Usuario actualizado exitosamente. ¡Manteniendo GlamGiant en forma!');
      } else {
        await createUser(userData as CreateUserDto);
        toast.success('Usuario creado exitosamente. ¡Bienvenido a GlamGiant!');
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      const errorMessage = (err as any)?.response?.data?.message || 'Error al guardar el usuario.';
      toast.error(errorMessage);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex-1 p-8 bg-gray-100">
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-700 font-serif">Acceso Denegado</h2>
          <p className="text-gray-700">No tienes permisos para ver la gestión de usuarios. Esta sección es exclusiva para administradores.</p>
        </section>
      </div>
    );
  }

  if (loading) return <p className="flex-1 p-8 text-center text-pink-700">Cargando usuarios...</p>;
  if (error) return <p className="flex-1 p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="flex-1 p-8 bg-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-700 font-serif">Gestión de Usuarios</h2>

      <button
        onClick={() => { setShowForm(!showForm); resetForm(); }}
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mb-8 mx-auto"
      >
        <FaPlusSquare className="text-xl" />
        <span className="text-lg">{showForm ? 'Ocultar Formulario de Usuario' : 'Crear Nuevo Usuario'}</span>
      </button>

      {showForm && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-pink-100 mb-8">
          <h3 className="text-2xl font-bold text-center text-pink-600 mb-6">{isEditing ? 'Editar Datos de Usuario' : 'Registrar Nuevo Usuario'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-gray-700 font-semibold">Nombre Completo</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo del usuario"
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Correo Electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Contraseña {isEditing ? '(dejar en blanco para no cambiar)' : ''}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? "********" : "********"}
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                required={!isEditing}
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Rol del Usuario</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'client' | 'tester' | 'employee')}
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition bg-white"
              >
                <option value="client">Cliente</option>
                <option value="employee">Empleado</option>
                <option value="tester">Tester</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className=" flex items-center space-x-3 mt-4">
              <input
                type="checkbox"
                checked={testSubjectStatus}
                onChange={(e) => setTestSubjectStatus(e.target.checked)}
                className="form-checkbox h-6 w-6 text-pink-600 rounded-md focus:ring-pink-400 transition"
              />
              <span className="text-gray-700 font-semibold text-lg">¿Es sujeto de prueba?</span>
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Reacciones Alérgicas (si aplica)</span>
              <textarea
                value={allergicReactions}
                onChange={(e) => setAllergicReactions(e.target.value)}
                placeholder="Cualquier reacción alérgica documentada (ej: enrojecimiento, picazón)"
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                rows={3}
              />
            </label>
            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado de Usuarios */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
        <h3 className="text-2xl font-bold text-center text-pink-600 mb-6">Listado de Usuarios GlamGiant</h3>
        {users.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No hay usuarios registrados en el sistema. ¡Añade el primero!</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-pink-100 text-pink-800 text-left uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-pink-200">Nombre</th>
                  <th className="py-3 px-6 border-b border-pink-200">Email</th>
                  <th className="py-3 px-6 border-b border-pink-200">Rol</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-center">Sujeto Prueba</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-left">Reacciones Alérgicas</th> 
                  <th className="py-3 px-6 border-b border-pink-200 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="border-b border-gray-200 hover:bg-pink-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{userItem.name}</td>
                    <td className="py-3 px-6 text-left">{userItem.email}</td>
                    <td className="py-3 px-6 text-left capitalize">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold
                        ${userItem.role === 'admin' ? 'bg-purple-200 text-purple-800' : ''}
                        ${userItem.role === 'client' ? 'bg-blue-200 text-blue-800' : ''}
                        ${userItem.role === 'tester' ? 'bg-green-200 text-green-800' : ''}
                        ${userItem.role === 'employee' ? 'bg-yellow-200 text-yellow-800' : ''}
                      `}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {userItem.test_subject_status ? (
                        <span className="bg-emerald-200 text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold">Sí</span>
                      ) : (
                        <span className="bg-rose-200 text-rose-800 py-1 px-3 rounded-full text-xs font-semibold">No</span>
                      )}
                    </td>

                    <td className="py-3 px-6 text-left break-words max-w-xs md:max-w-md lg:max-w-lg"> 
                      {userItem.allergic_reactions || 'Ninguna'}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(userItem)}
                          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 transform hover:scale-110"
                          title="Editar Usuario"
                        >
                          <FaEdit className="text-md" />
                        </button>
                        <button
                          onClick={() => handleDelete(userItem.id)}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors duration-200 transform hover:scale-110"
                          title="Eliminar Usuario"
                        >
                          <FaTrash className="text-md" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;