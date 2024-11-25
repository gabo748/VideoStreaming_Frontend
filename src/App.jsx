import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoStreaming from "./components/VideoStreaming";
import VideoList from "./components/VideoList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CategoryQuiz from "./components/CategoryQuiz";
import CategoryVideosList from "./components/CategoryVideosList.jsx";
import FavoriteList from "./components/FavoriteList";
import LogoutButton from "./components/LogoutButton"; // Importamos el nuevo componente
import { Toaster } from "react-hot-toast";

function App() {
  const [videoId, setVideoId] = useState("");

  const ProtectedRoute = ({ element }) => {
    return (
      <div className="relative min-h-screen bg-gray-100 dark:bg-gray-800">
        <LogoutButton /> {/* Botón de cerrar sesión */}
        {element}
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Rutas protegidas */}
          <Route
            path="/videos"
            element={<ProtectedRoute element={<VideoList onPlay={setVideoId} />} />}
          />
          <Route
            path="/upload"
            element={<ProtectedRoute element={<VideoStreaming />} />}
          />
          <Route
            path="/player"
            element={
              <ProtectedRoute
                element={
                  <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-lg font-semibold mb-4">Reproduciendo Video</h2>
                    <video
                      src={`http://localhost:8080/api/v1/videos/stream/${videoId}`}
                      controls
                      className="rounded border"
                      style={{ width: 500, height: 500 }}
                    />
                  </div>
                }
              />
            }
          />
          <Route
            path="/category-quiz"
            element={<ProtectedRoute element={<CategoryQuiz />} />}
          />
          <Route
            path="/videos/category/:category"
            element={<ProtectedRoute element={<CategoryVideosList onPlay={setVideoId} />} />}
          />
          <Route
            path="/favorites"
            element={<ProtectedRoute element={<FavoriteList />} />}
          />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
