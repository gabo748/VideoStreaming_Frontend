import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoStreaming from "./components/VideoStreaming";
import VideoList from "./components/VideoList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Toaster } from "react-hot-toast";

function App() {
  const [videoId, setVideoId] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/videos" element={<VideoList onPlay={setVideoId} />} />
          <Route path="/upload" element={<VideoStreaming />} />
          <Route
            path="/player"
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
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
