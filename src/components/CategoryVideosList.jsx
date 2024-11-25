import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function CategoryVideosList({ onPlay }) {
  const { category } = useParams(); // Obtenemos la categoría desde la URL
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/videos/category/${category}`
        );
        setVideos(response.data);
      } catch (err) {
        console.error("Error al obtener los videos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [category]);

  const handlePlay = (videoId) => {
    onPlay(videoId);
    navigate("/player");
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando videos...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error al cargar los videos.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-screen-lg p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Videos de la Categoría: {category}
          </h2>
          <Button onClick={() => navigate("/category-quiz")}>Sugerir Otra Categoría</Button>
        </div>
        <table className="table-auto w-full text-left border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-600">
            <tr>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Título</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Descripción</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr
                key={video.videoId}
                className={`${
                  index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">{video.title}</td>
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">
                  {video.description}
                </td>
                <td className="border px-4 py-2">
                  <Button size="xs" color="info" onClick={() => handlePlay(video.videoId)}>
                    Play
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
