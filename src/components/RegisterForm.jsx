import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Label, Alert } from "flowbite-react";

export default function RegisterForm() {
  const [userData, setUserData] = useState({ email: "", username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/login/register",
        new URLSearchParams(userData),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
      setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/"), 3000); // Redirigir al login después de 3 segundos
    } catch (error) {
      console.error(error);
      setMessage("Error al registrar el usuario.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Crear Cuenta</h2>
        {message && (
          <Alert color={message.includes("exitoso") ? "success" : "failure"}>
            {message}
          </Alert>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label value="Correo Electrónico" />
            <TextInput
              type="email"
              name="email"
              placeholder="Ingrese su correo electrónico"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label value="Nombre de Usuario" />
            <TextInput
              type="text"
              name="username"
              placeholder="Ingrese su nombre de usuario"
              value={userData.username}
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
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Registrarme
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Button onClick={() => navigate("/")} color="link">
              Inicia sesión
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
