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
import Sidebar from '../components/Sidebar';

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
    // No precargar la contraseña por seguridad
    setPassword('');
    setRole(userToEdit.role);
    setTestSubjectStatus(userToEdit.test_subject_status || false);
    setAllergicReactions(userToEdit.allergic_reactions || '');
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
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
        toast.success('Usuario actualizado exitosamente.');
      } else {
        await createUser(userData as CreateUserDto); 
        toast.success('Usuario creado exitosamente.');
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      toast.error('Error al guardar el usuario.');
    }
  };

  // Solo el Admin puede acceder a esta página
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <section className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Acceso Denegado</h2>
            <p>No tienes permisos para ver la gestión de usuarios.</p>
          </section>
        </main>
      </div>
    );
  }

  if (loading) return <p className="p-8">Cargando usuarios...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition flex items-center mb-6"
        >
          <FaPlusSquare className="mr-2" /> {showForm ? 'Ocultar Formulario' : 'Nuevo Usuario'}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Nombre</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre completo"
                  className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Correo Electrónico</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Contraseña (dejar en blanco para no cambiar)</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditing ? "********" : "********"}
                  className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                  required={!isEditing} 
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Rol</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'client' | 'tester' | 'employee')}
                  className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                >
                  <option value="client">Cliente</option>
                  <option value="employee">Empleado</option>
                  <option value="tester">Tester</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
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
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition flex-grow"
                >
                  {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Listado de Usuarios</h3>
          {users.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Nombre</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Rol</th>
                    <th className="py-2 px-4 border-b text-left">Sujeto Prueba</th>
                    <th className="py-2 px-4 border-b text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => ( 
                    <tr key={userItem.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{userItem.name}</td>
                      <td className="py-2 px-4 border-b">{userItem.email}</td>
                      <td className="py-2 px-4 border-b capitalize">{userItem.role}</td> 
                      <td className="py-2 px-4 border-b">{userItem.test_subject_status ? 'Sí' : 'No'}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(userItem)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(userItem.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <FaTrash />
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
      </main>
    </div>
  );
};

export default UsersManagement;