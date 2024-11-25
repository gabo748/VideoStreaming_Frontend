import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage
      if (!userId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/favorites/${userId}`);
        setFavorites(response.data);
      } catch (err) {
        console.error("Error al obtener las categorías favoritas:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleViewMovies = (category) => {
    navigate(`/videos/category/${category}`);
  };

  const handleDeleteFavorite = async (favoriteId) => {
    const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage
    if (!userId) {
      console.error("Usuario no autenticado.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/v1/favorites/${userId}/${favoriteId}`);
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));
      console.log(`Categoría favorita con ID ${favoriteId} eliminada correctamente.`);
    } catch (err) {
      console.error("Error al eliminar la categoría favorita:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando tus categorías favoritas...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error al cargar las categorías favoritas.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-screen-md p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mis Categorías Favoritas</h2>
          <Button size="sm" color="info" onClick={() => navigate("/videos")}>
            Volver a la lista de todas las películas
          </Button>
        </div>
        <table className="table-auto w-full text-left border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-600">
            <tr>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">ID</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Nombre</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Películas</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((favorite, index) => (
              <tr
                key={favorite.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                } hover:bg-gray-100 dark:hover-bg-gray-700`}
              >
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">{favorite.id}</td>
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">{favorite.name}</td>
                <td className="border px-4 py-2">
                  <Button
                    size="xs"
                    color="info"
                    onClick={() => handleViewMovies(favorite.name)}
                  >
                    Ver películas
                  </Button>
                </td>
                <td className="border px-4 py-2">
                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => handleDeleteFavorite(favorite.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
