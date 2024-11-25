import React from "react";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Limpia el localStorage
    navigate("/"); // Redirige al login
  };

  return (
    <div className="absolute top-4 right-4">
      <Button color="failure" size="sm" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
}
