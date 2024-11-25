import React, { useState } from "react";
import { Button, Label, Radio } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import stringSimilarity from "string-similarity";

const questions = [
  {
    id: 1,
    question: "¿Qué prefieres en tus películas?",
    options: ["Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Terror"],
  },
  {
    id: 2,
    question: "¿Qué tipo de personajes prefieres en tus historias?",
    options: [
      "Héroes valientes",
      "Aventureros curiosos",
      "Comediantes",
      "Personas comunes",
      "Seres mágicos",
      "Monstruos",
    ],
  },
  {
    id: 3,
    question: "¿Qué entorno prefieres?",
    options: [
      "Ciudades modernas",
      "Lugares remotos",
      "Escenarios graciosos",
      "Contextos familiares",
      "Mundos mágicos",
      "Lugares oscuros",
    ],
  },
  {
    id: 4,
    question: "¿Qué sensación prefieres experimentar?",
    options: ["Adrenalina", "Exploración", "Diversión", "Conexión emocional", "Asombro", "Escalofríos"],
  },
  {
    id: 5,
    question: "¿Qué tipo de conflicto prefieres?",
    options: [
      "Batallas épicas",
      "Retos personales",
      "Conflictos cómicos",
      "Problemas emocionales",
      "Luchas mágicas",
      "Luchas contra el miedo",
    ],
  },
  {
    id: 6,
    question: "¿Qué prefieres en el desenlace?",
    options: [
      "Victorias épicas",
      "Nuevas aventuras",
      "Un final divertido",
      "Un mensaje reflexivo",
      "Misterios resueltos",
      "Sorpresas aterradoras",
    ],
  },
];

const validCategories = ["Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Terror"];

export default function CategoryQuiz() {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Para mostrar mensajes
  const [messageType, setMessageType] = useState(""); // 'success' o 'error'
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const handleResponseChange = (questionId, option) => {
    setResponses((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    const prompt = `Con base en las siguientes respuestas, determina la categoría de película más relevante:
    ${questions.map(
      (q) => `Pregunta: ${q.question}\nRespuesta: ${responses[q.id] || "Sin respuesta"}`
    ).join("\n")}.
    Las opciones posibles son: Acción, Aventura, Comedia, Drama, Fantasía, Terror.
    Responde con una sola de estas opciones.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Eres un asistente útil." },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content.trim();
      const bestMatch = stringSimilarity.findBestMatch(aiResponse, validCategories).bestMatch.target;

      setResult(bestMatch);
    } catch (err) {
      console.error("Error al interactuar con OpenAI:", err);
      setError(true);
    }

    setLoading(false);
  };

  const handleCategoryClick = () => {
    if (result) {
      navigate(`/videos/category/${result}`);
    }
  };

  const handleAddToFavorites = async () => {
    if (isAddingToFavorites) return;
    setIsAddingToFavorites(true);
    setFeedbackMessage(""); // Resetear mensaje de retroalimentación

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setFeedbackMessage("Error: Usuario no autenticado.");
      setMessageType("error");
      setIsAddingToFavorites(false);
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/v1/favorites/${userId}`,
        { name: result },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setFeedbackMessage("Categoría agregada a favoritos correctamente.");
      setMessageType("success");
    } catch (err) {
      console.error("Error al agregar a favoritos:", err);
      setFeedbackMessage("Error al agregar la categoría a favoritos.");
      setMessageType("error");
    }

    setIsAddingToFavorites(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-lg bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Encuesta: Descubre tu Categoría
        </h2>
        {result ? (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Categoría Recomendada: <span className="text-blue-500">{result}</span>
            </h3>
            {feedbackMessage && (
              <p
                className={`text-sm ${
                  messageType === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {feedbackMessage}
              </p>
            )}
            <div className="flex justify-center space-x-4">
              <Button onClick={handleCategoryClick}>
                {error ? "Reintentar" : "Ver películas de esa categoría"}
              </Button>
              <Button
                color="success"
                onClick={handleAddToFavorites}
                disabled={isAddingToFavorites}
              >
                {isAddingToFavorites ? "Agregando..." : "Agregar categoría a favoritos"}
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-6">
            {questions.map((q) => (
              <div key={q.id}>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  {q.question}
                </h4>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <Label
                      key={option}
                      className="flex items-center space-x-2 text-gray-800 dark:text-gray-100"
                    >
                      <Radio
                        name={`question-${q.id}`}
                        value={option}
                        checked={responses[q.id] === option}
                        onChange={() => handleResponseChange(q.id, option)}
                      />
                      <span>{option}</span>
                    </Label>
                  ))}
                </div>
              </div>
            ))}
            <Button type="button" className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "Procesando..." : "Ver Resultado"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
