import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Label, Alert } from "flowbite-react";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/login/validate",
        new URLSearchParams(credentials),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
      setMessage("Inicio de sesión exitoso");
      // Redirigir al usuario a la lista de videos
      setTimeout(() => navigate("/videos"), 1500);
    } catch (error) {
      console.error(error);
      setMessage("Error al iniciar sesión. Verifique sus credenciales.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Iniciar Sesión</h2>
        {message && (
          <Alert color={message.includes("exitoso") ? "success" : "failure"}>
            {message}
          </Alert>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label value="Nombre de Usuario" />
            <TextInput
              type="text"
              name="username"
              placeholder="Ingrese su nombre de usuario"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label value="Contraseña" />
            <TextInput
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p>
            ¿No tienes una cuenta?{" "}
            <Button onClick={() => navigate("/register")} color="link">
              Crea tu cuenta
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
