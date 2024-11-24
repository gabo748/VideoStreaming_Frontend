import React, { useState, useEffect } from "react";
import VideoLogo from "../assets/video-posting.png";
import {
  Alert,
  Button,
  Card,
  Label,
  Progress,
  Textarea,
  TextInput,
  Select,
} from "flowbite-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function VideoStreaming() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    categoryId: "",
  });
  const [progress, setProgress] = useState(0);
  const [upload, setUpload] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/videos/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFieldChange = (event) => {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (formEvent) => {
    formEvent.preventDefault();
    if (!selectedFile) {
      alert("Seleccione un archivo");
      return;
    }
    saveVideoToServer(selectedFile, meta);
  };

  const resetForm = () => {
    setMeta({
      title: "",
      description: "",
      categoryId: "",
    });
    setSelectedFile(null);
    setUpload(false);
  };

  const saveVideoToServer = async (video, videoMetaData) => {
    setUpload(true);
    try {
      const formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("categoryId", videoMetaData.categoryId);
      formData.append("file", video);

      await axios.post("http://localhost:8080/api/v1/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(progress);
        },
      });

      setMessage("Archivo subido exitosamente");
      setProgress(0);
      setUpload(false);
      resetForm();
      toast.success("Archivo subido correctamente");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMessage("Error al subir el archivo");
      setProgress(0);
      setUpload(false);
      toast.error("Error al subir el archivo");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-screen-md p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Subir Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label value="Título del Video" />
            <TextInput
              value={meta.title}
              placeholder="Ingrese el título del video"
              name="title"
              onChange={handleFieldChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description" value="Descripción del Video" />
            <Textarea
              value={meta.description}
              id="description"
              name="description"
              placeholder="Ingrese una descripción..."
              required
              rows={4}
              onChange={handleFieldChange}
            />
          </div>
          <div>
            <Label htmlFor="categoryId" value="Categoría" />
            <Select
              id="categoryId"
              name="categoryId"
              value={meta.categoryId}
              onChange={handleFieldChange}
              required
            >
              <option value="" disabled>
                Seleccione una categoría
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-16 w-16 object-cover"
                src={VideoLogo}
                alt="Video preview"
              />
            </div>
            <label className="block">
              <span className="sr-only">Seleccione un archivo</span>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </label>
          </div>
          {upload && (
            <Progress
              progress={progress}
              textLabel="Subiendo..."
              size="lg"
              labelProgress
              labelText
            />
          )}
          {message && (
            <Alert
              color={message.includes("exitosamente") ? "success" : "failure"}
            >
              <span className="font-medium">
                {message.includes("exitosamente") ? "¡Éxito!" : "¡Error!"}
              </span>{" "}
              {message}
            </Alert>
          )}
          <Button disabled={upload} type="submit" className="w-full">
            Subir Video
          </Button>
        </form>
      </div>
    </div>
  );
}
