import "./Home.css";

function Home({ setView }) {
  return (
    <div className="home-wrapper">

      <div className="home-card">

        <h1>Bienvenido a tu espacio emocional</h1>

        <p className="subtitle">
          Este sistema te permite evaluar tu estado emocional de forma rápida,
          identificar patrones y recibir recomendaciones personalizadas basadas
          en tus respuestas.
        </p>

        <div className="home-section">
          <h3>¿Qué puedes hacer aquí?</h3>

          <ul>
            <li>🧠 Evaluar tu estado emocional en menos de 1 minuto</li>
            <li>🎯 Recibir recomendaciones según tu nivel emocional</li>
            <li>📈 Analizar tu evolución a lo largo del tiempo</li>
            <li>🛟 Obtener orientación en momentos de estrés o ansiedad</li>
          </ul>
        </div>

        <div className="home-section">
          <h3>¿Cómo funciona?</h3>

          <p>
            Responderás una serie de preguntas breves. Cada respuesta tiene un
            valor que permite calcular tu estado emocional actual y asignarte
            un nivel con recomendaciones específicas.
          </p>
        </div>

        <div className="home-section warning">
          <h3>Importante</h3>

          <p>
            Este sistema no reemplaza ayuda profesional. Si te sientes en una
            situación difícil, considera buscar apoyo especializado.
          </p>
        </div>

        <button
          className="start-btn"
          onClick={() => setView("evaluation")}
        >
          Comenzar evaluación
        </button>

      </div>

    </div>
  );
}

export default Home;