import { useState, useEffect } from "react";
import axios from "axios";
import "./Evaluation.css";
import api from "./config/api/axios";

function Evaluation({
  token,
  onFinish,
  onBack
}) {

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const positiveEmotions = [
  {
    label: "Nunca",
    emoji: "😣",
    bg: "#fee2e2",
    border: "#fca5a5"
  },
  {
    label: "Rara vez",
    emoji: "😕",
    bg: "#ffedd5",
    border: "#fdba74"
  },
  {
    label: "A veces",
    emoji: "😐",
    bg: "#f1f5f9",
    border: "#cbd5e1"
  },
  {
    label: "Frecuentemente",
    emoji: "🙂",
    bg: "#dcfce7",
    border: "#86efac"
  },
  {
    label: "Siempre",
    emoji: "😄",
    bg: "#bbf7d0",
    border: "#4ade80"
  }
];

const negativeEmotions = [
  {
    label: "Nunca",
    emoji: "😄",
    bg: "#bbf7d0",
    border: "#4ade80"
  },
  {
    label: "Rara vez",
    emoji: "🙂",
    bg: "#dcfce7",
    border: "#86efac"
  },
  {
    label: "A veces",
    emoji: "😐",
    bg: "#f1f5f9",
    border: "#cbd5e1"
  },
  {
    label: "Frecuentemente",
    emoji: "😕",
    bg: "#ffedd5",
    border: "#fdba74"
  },
  {
    label: "Siempre",
    emoji: "😣",
    bg: "#fee2e2",
    border: "#fca5a5"
  }
];

const negativeQuestions = [
  "¿Te has sentido emocionalmente abrumado?",
  "¿Has sentido presión constante por tus responsabilidades?",
  "¿Te ha costado relajarte incluso en momentos tranquilos?",
  "¿Sientes que tienes demasiadas cosas en mente al mismo tiempo?",
  "¿Te has sentido ansioso o inquieto?",
  "¿Has sentido preocupación excesiva por cosas pequeñas?",
  "¿Has sentido dificultad para controlar tus preocupaciones?",
  "¿Has sentido tensión física o nerviosismo sin razón clara?",
  "¿Te has sentido intranquilo incluso sin motivo aparente?",
  "¿Te has sentido sin energía o agotado?",
  "¿Has tenido pensamientos negativos con frecuencia?",
  "¿Te has sentido solo o desconectado de los demás?",
  "¿Has sentido poco interés en actividades que antes disfrutabas?",
  "¿Has sentido dificultad para encontrar motivación en tu día?"
];

  // ✅ IMÁGENES PERSONALIZADAS POR PREGUNTA
  const questionImages = {

    // 🟢 BIENESTAR
    1: "/images/Bienestar_1.jpg",
    2: "/images/Bienestar_2.jpg",
    3: "/images/Bienestar_3.jpg",
    4: "/images/Bienestar_4.jpg",
    5: "/images/Bienestar_5.jpg",

    // 🟠 ESTRÉS
    6: "/images/estres_1.jpg",
    7: "/images/estres_2.jpg",
    8: "/images/estres_3.jpg",
    9: "/images/estres_4.jpg",
    10: "/images/estres_5.jpg",

    // 🟡 ANSIEDAD
    11: "/images/Ansiedad_1.jpg",
    12: "/images/Ansiedad_2.jpg",
    13: "/images/Ansiedad_3.jpg",
    14: "/images/Ansiedad_4.jpg",
    15: "/images/Ansiedad_5.jpg",

    // 🔵 DEPRESIÓN
    16: "/images/Depresion_1.jpg",
    17: "/images/Depresion_2.jpg",
    18: "/images/Depresion_3.jpg",
    19: "/images/Depresion_4.jpg",
    20: "/images/Depresion_5.jpg"
  };

  // 🔥 BOTÓN NATIVO ATRÁS DEL NAVEGADOR
  useEffect(() => {

    const handleBrowserBack = () => {

      if (onBack) {
        onBack();
      }

    };

    // 🔥 AGREGA UN ESTADO AL HISTORIAL
    window.history.pushState(
      null,
      "",
      window.location.pathname
    );

    // 🔥 ESCUCHA EL BOTÓN ATRÁS
    window.addEventListener(
      "popstate",
      handleBrowserBack
    );

    return () => {

      window.removeEventListener(
        "popstate",
        handleBrowserBack
      );

    };

  }, [onBack]);

  // 🔥 CARGAR PREGUNTAS
  useEffect(() => {

    axios.get(
      `${API_URL}/api/questions/`
    )
      .then(res => {

        console.log(
          "PREGUNTAS:",
          res.data
        );

        setQuestions(res.data);

      })
      .catch(err => {

        console.log(
          "ERROR CARGANDO PREGUNTAS:",
          err
        );

      });

  }, []);

  // 🔥 GUARDAR RESPUESTA
  const handleChange = (
    questionId,
    optionId
  ) => {

    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));

  };

  // 🔥 ENVIAR EVALUACIÓN
  const handleSubmit = () => {

    if (
      Object.keys(answers).length !==
      questions.length
    ) {

      alert(
        "Responde todas las preguntas"
      );

      return;

    }

    const formatted =
      Object.keys(answers).map(qId => ({
        question_id: qId,
        response_option_id: answers[qId]
      }));

    console.log(
      "ENVIANDO:",
      formatted
    );

    setLoading(true);

    axios.post(
      `${API_URL}/api/evaluate/`,
      {
        answers: formatted
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => {

        console.log(
          "RESPUESTA BACK:",
          res.data
        );

        if (res.data.error) {

          alert(res.data.error);

          return;

        }

        onFinish(res.data);

      })
      .catch(err => {

        console.log(
          "ERROR COMPLETO:",
          err
        );

        if (err.response) {

          console.log(
            "ERROR BACK DETALLE:",
            err.response.data
          );

          alert(
            err.response.data.error ||
            "Error del servidor"
          );

        } else {

          alert(
            "No se pudo conectar con el servidor"
          );

        }

      })
      .finally(() =>
        setLoading(false)
      );

  };

  const current =
  questions[currentQuestion];

  const isNegative =
    negativeQuestions.includes(current?.text);

  const currentEmotions =
    isNegative
      ? negativeEmotions
      : positiveEmotions;

  return (

    <div className="evaluation-wrapper">

      <div className="evaluation-card">

        <div className="evaluation-header">

          <h1>
            Evaluación emocional
          </h1>

          <p>
            Responde con honestidad cómo
            te has sentido recientemente.
          </p>

        </div>

        {current && (

          <div className="question-screen">

            <div className="question-progress">

              Pregunta {currentQuestion + 1}
              {" "}de {questions.length}

            </div>

            <div className="navigation-buttons">

              {currentQuestion > 0 && (

                <button
                  className="back-btn"
                  onClick={() =>
                    setCurrentQuestion(
                      prev => prev - 1
                    )
                  }
                >
                  ← Pregunta anterior
                </button>

              )}

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${
                    (
                      (currentQuestion + 1)
                      / questions.length
                    ) * 100
                  }%`
                }}
              />

            </div>

            {/* ✅ IMAGEN DINÁMICA */}

            <img
              src={
                questionImages[
                  currentQuestion + 1
                ]
              }
              alt="emotion"
              className="emotion-image"
            />

            <h2 className="question-title">
              {current.text}
            </h2>

            <div className="emoji-options">

              {current.options.map(
                (opt, index) => (

                  <button
                    key={opt.id}
                    className={`emoji-card ${
                      answers[current.id] === opt.id
                        ? "selected"
                        : ""
                    }`}
                    style={{
                      background:
                        currentEmotions[index]?.bg,
                      border: `2px solid ${
                        currentEmotions[index]?.border
                      }`
                    }}
                    onClick={() => {

                      handleChange(
                        current.id,
                        opt.id
                      );

                      setTimeout(() => {

                        if (
                          currentQuestion <
                          questions.length - 1
                        ) {

                          setCurrentQuestion(
                            prev => prev + 1
                          );

                        }

                      }, 300);

                    }}
                  >

                    <div className="emoji">
                      {currentEmotions[index]?.emoji}
                    </div>

                    <span>
                      {opt.label}
                    </span>

                  </button>

                )
              )}

            </div>

            {currentQuestion ===
              questions.length - 1 && (

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >

                {loading
                  ? "Analizando estado emocional..."
                  : "Finalizar evaluación"}

              </button>

            )}

          </div>

        )}

      </div>

    </div>

  );

}

export default Evaluation;