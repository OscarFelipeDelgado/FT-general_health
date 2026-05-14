import "./EmotionalInterpretation.css";

function EmotionalInterpretation({ data, onBack }) {

  if (!data) return null;

  const analysis = data.analysis || [];
  const alerts = data.alerts || [];

  return (
    <div className="interpretation-wrapper">

      <div className="interpretation-card">

        <div className="interpretation-header">

          <h1>
            Interpretación emocional
          </h1>

          <p>
            Este análisis fue generado a partir de tus respuestas
            y permite comprender cómo se encuentra actualmente
            tu estado emocional.
          </p>

        </div>

        <div className="interpretation-content">

          {analysis.length > 0 ? (

            analysis.map((item, index) => (

              <div
                key={index}
                className="analysis-card"
              >
                <p>{item}</p>
              </div>

            ))

          ) : (

            <p>
              No hay interpretación disponible.
            </p>

          )}

        </div>

        {alerts.length > 0 && (

          <div className="alerts-section">

            <h2>Alertas emocionales</h2>

            {alerts.map((alert, index) => (

              <div
                key={index}
                className="alert-card"
              >
                ⚠️ {alert}
              </div>

            ))}

          </div>

        )}

        <button
          className="back-button"
          onClick={onBack}
        >
          Volver al plan emocional
        </button>

      </div>

    </div>
  );
}

export default EmotionalInterpretation;