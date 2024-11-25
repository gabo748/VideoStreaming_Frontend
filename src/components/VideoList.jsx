import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VideoList({ onPlay }) {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const handlePlay = (videoId) => {
    onPlay(videoId);
    navigate("/player");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-screen-lg p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Todos las peliculas</h2>
          <div className="flex space-x-4">
            <Button onClick={() => navigate("/category-quiz")}>Sugerir Películas</Button>
            <Button onClick={() => navigate("/upload")}>Subir Trailer</Button>
            <Button onClick={() => navigate("/favorites")}>Ver mis favoritas</Button>
          </div>
        </div>
        <table className="table-auto w-full text-left border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-600">
            <tr>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Title</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Description</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-gray-200">Actions</th>
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
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">{video.description}</td>
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
