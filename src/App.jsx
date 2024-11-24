import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import VideoStreaming from './components/VideoStreaming';
import VideoList from './components/VideoList';
import { Toaster } from 'react-hot-toast';

function App() {
  const [videoId, setVideoId] = useState('');

  return (
    <Router>
      <div className="flex flex-col items-center space-y-6 py-6">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
          Video Streaming App
        </h1>
        <Routes>
          <Route
            path="/"
            element={<VideoList onPlay={setVideoId} />}
          />
          <Route
            path="/upload"
            element={<VideoStreaming />}
          />
          <Route
            path="/player"
            element={
              <div>
                <h2 className="text-lg font-semibold">Playing Video</h2>
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