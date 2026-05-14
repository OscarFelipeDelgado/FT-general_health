import "./Result.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Result({ data, onBack }) {

  if (!data) return <h2>Sin resultados</h2>;

  const maxScore = 100;

  const categoryData = data.category_scores || {};

  const labelMap = {
    ansiedad: "Ansiedad",
    estres: "Estrés",
    depresion: "Depresión",
    bienestar: "Bienestar"
  };

  const orderedCategories = [
    "ansiedad",
    "estres",
    "depresion",
    "bienestar"
  ];

  // 🔥 CATEGORÍA DOMINANTE
  const dominantCategory = orderedCategories.reduce((a, b) =>
    (categoryData[a] || 0) > (categoryData[b] || 0)
      ? a
      : b
  );

  // 🎨 COLORES EMOCIONALES
  const emotionColors = {
    ansiedad: "#f1c40f",
    estres: "#e67e22",
    depresion: "#8e44ad",
    bienestar: "#2ecc71",
    critico: "#35699c"
  };

  const dominantColor =
    data.level === "Crítico"
      ? emotionColors.critico
      : emotionColors[dominantCategory];

  const categoryLabels = orderedCategories.map(
    key => labelMap[key]
  );

  // 🔥 LOS VALORES YA VIENEN CORRECTOS DEL BACKEND
  const categoryValues = orderedCategories.map(key => {

    const value = categoryData[key] || 0;

    if (key === "bienestar") {
      return value;
    }

    return value;
  });

  const percentage =
    data.progress !== undefined
      ? data.progress
      : Math.max(...categoryValues);

  // 📊 GRÁFICA DINÁMICA
  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Análisis emocional",

        data: categoryValues,

        backgroundColor: orderedCategories.map(
          key => emotionColors[key]
        ),

        borderColor: orderedCategories.map(
          key => emotionColors[key]
        ),

        borderWidth: 2,
        borderRadius: 10
      }
    ]
  };

  // ⚙️ OPCIONES DE GRÁFICA
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const getFeedback = () => {
    return data.message || "Este resultado refleja tu estado emocional actual.";
  };

  return (
    <div className="result-wrapper">

      <div className="result-card">

        <div className="hero-card">

          <h1>Tu resultado emocional</h1>

          <div
            className="status-badge"
            style={{
              background: dominantColor
            }}
          >
            {data.level}
          </div>

          <p className="hero-description">
            {getFeedback()}
          </p>

          <div className="score-section">
            <span>Puntaje emocional</span>
            <strong>
              {percentage} / {maxScore}
            </strong>
          </div>

          <div className="bar-container">

            <div
              className="bar-fill"
              style={{
                width: `${percentage}%`,
                background: dominantColor
              }}
            ></div>

          </div>

        </div>

        <div className="summary-grid">
          {orderedCategories.map((key, index) => {

            const isDominant =
              categoryValues[index] === Math.max(...categoryValues);

            return (
              <div
                key={index}
                className="summary-card"
                style={{
                  border: isDominant
                    ? `2px solid ${dominantColor}`
                    : "none",

                  background: isDominant
                    ? `${dominantColor}15`
                    : "white"
                }}
              >
                <span>{labelMap[key]}</span>

                <strong>
                  {categoryValues[index]} / 100
                </strong>

              </div>
            );

          })}
        </div>

        {categoryLabels.length > 0 && (

          <div className="chart-section">

            <h3>
              Análisis emocional detallado
            </h3>

            <Bar
              data={categoryChartData}
              options={chartOptions}
            />

          </div>

        )}

        {data.alerts && data.alerts.length > 0 && (

          <div className="alert-card">

            <h3>Alertas</h3>

            {data.alerts.map((a, i) => (
              <p key={i}>
                ⚠️ {a}
              </p>
            ))}

          </div>

        )}

        <button
          className="plan-button"
          style={{
            background: dominantColor
          }}
          onClick={() => data.onViewPlan()}
        >
          Ver plan de acompañamiento emocional
        </button>

        <p className="timestamp">
          Evaluación generada correctamente
        </p>

        <button onClick={onBack}>
          Volver a responder la evaluación
        </button>

      </div>

    </div>
  );
}

export default Result;