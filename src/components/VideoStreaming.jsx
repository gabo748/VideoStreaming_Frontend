import React, { useState, useEffect } from 'react';
import VideoLogo from "../assets/video-posting.png";
import { Alert, Button, Card, Label, Progress, Textarea, TextInput, Select } from 'flowbite-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function VideoStreaming() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    categoryId: "", // Nueva propiedad para la categoría
  });
  const [progress, setProgress] = useState(0);
  const [upload, setUpload] = useState(false);
  const [message, setMessage] = useState("");

  // Obtener las categorías del endpoint
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/videos/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function handleFieldChange(event) {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(formEvent) {
    formEvent.preventDefault();
    if (!selectedFile) {
      alert("Seleccione un archivo");
      return;
    }
    saveVideoToServer(selectedFile, meta);
  }

  function resetForm() {
    setMeta({
      title: "",
      description: "",
      categoryId: "",
    });
    setSelectedFile(null);
    setUpload(false);
  }

  async function saveVideoToServer(video, videoMetaData) {
    setUpload(true);
    try {
      let formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("categoryId", videoMetaData.categoryId); // Enviar el ID de la categoría
      formData.append("file", video);

      let response = await axios.post("http://localhost:8080/api/v1/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(progress);
        },
      });
      console.log(response);
      setMessage("Archivo subido exitosamente");
      setProgress(0);
      setUpload(false);
      resetForm();
      toast.success("Archivo subido correctamente");
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setMessage("Error al subir el archivo");
      setProgress(0);
      setUpload(false);
      toast.error("Error al subir el archivo");
    }
  }

  return (
    <div className="text-white">
      <Card className="flex">
        <h1>Subir Videos</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-2 block">
            <Label value="Título del Video" />
            <TextInput
              value={meta.title}
              placeholder="Ingrese el título del video"
              name="title"
              onChange={handleFieldChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="description" value="Descripción del Video" />
            </div>
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

          <div className="mb-4">
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

          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <img className="h-16 w-16 object-cover" src={VideoLogo} alt="Video preview" />
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

          <div>
            {upload && (
              <Progress progress={progress} textLabel="Subiendo..." size="lg" labelProgress labelText />
            )}
          </div>

          <div>
            {message &&
              (message === "Archivo subido exitosamente" ? (
                <Alert
                  color="success"
                  rounded
                  withBorderAccent
                  onDismiss={() => setMessage("")}
                >
                  <span className="font-medium">¡Éxito!</span> {message}
                </Alert>
              ) : (
                <Alert color="failure">
                  <span className="font-medium">¡Error!</span> {message}
                </Alert>
              ))}
          </div>

          <div className="flex justify-center">
            <Button disabled={upload} type="submit">
              Subir
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}