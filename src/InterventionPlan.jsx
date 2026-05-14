import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import "./InterventionPlan.css";

function InterventionPlan({
  data,
  token,
  onBack
}) {

  // 🔥 STATES
  const [completed, setCompleted] = useState({});
  const [reflection, setReflection] = useState("");
  const [savingReflection, setSavingReflection] =
    useState(false);

  // 🔥 INTERVENCIONES
  const interventions = Array.isArray(data?.interventions)
    ? data.interventions
    : [];

  // 🔥 BOTÓN NATIVO ATRÁS DEL NAVEGADOR
  useEffect(() => {

    const handleBrowserBack = () => {

      if (onBack) {
        onBack();
      }

    };

    // 🔥 AGREGAR ESTADO AL HISTORIAL
    window.history.pushState(
      null,
      "",
      window.location.pathname
    );

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

  // 🔥 TOTAL ACTIVIDADES
  const totalActivities = useMemo(() => {

    let total = 0;

    interventions.forEach(section => {

      if (
        section &&
        Array.isArray(section.items)
      ) {

        total += section.items.length;

      }

    });

    return total;

  }, [interventions]);

  // 🔥 VALIDACIÓN
  if (!data) return null;

  // 🔥 COMPLETADAS
  const completedCount =
    Object.values(completed).filter(Boolean).length;

  // 🔥 PROGRESO
  const progress =
    totalActivities > 0
      ? (completedCount / totalActivities) * 100
      : 0;

  // 🔥 MENSAJE REEVALUACIÓN
  const getReevaluationMessage = () => {

    const level =
      data.level?.toLowerCase() || "";

    // 🟢 ESTABLE
    if (
      level.includes("verde") ||
      level.includes("estable")
    ) {

      return {

        days: 7,

        title: "Monitoreo preventivo",

        message:
          "Tu bienestar emocional parece estable. Recomendamos repetir la evaluación en 7 días para continuar monitoreando tu estado emocional y mantener hábitos protectores."

      };

    }

    // 🟡 MODERADO
    if (
      level.includes("amarillo") ||
      level.includes("moderado")
    ) {

      return {

        days: 5,

        title: "Seguimiento emocional",

        message:
          "Se identifican algunos indicadores emocionales que vale la pena seguir observando. Te recomendamos repetir la evaluación en aproximadamente 5 días."

      };

    }

    // 🟠 ALTO
    if (
      level.includes("naranja")
    ) {

      return {

        days: 3,

        title: "Seguimiento cercano",

        message:
          "Tu evaluación refleja señales emocionales importantes. Recomendamos realizar nuevamente la evaluación en 3 días para monitorear cambios emocionales."

      };

    }

    // 🔴 CRÍTICO
    return {

      days: 2,

      title: "Monitoreo prioritario",

      message:
        "Se identifican indicadores emocionales de alta intensidad. Es recomendable monitorear nuevamente tu estado emocional dentro de las próximas 24 a 48 horas."

    };

  };

  const reevaluation =
    getReevaluationMessage();

  // 🔥 COMPLETAR ACTIVIDAD
  const handleComplete = async (title) => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/intervention/complete/",
        {
          evaluation_id: data.id,
          title
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCompleted(prev => ({
        ...prev,
        [title]: true
      }));

    } catch (err) {

      console.log(err);

      alert(
        "Error al guardar actividad"
      );

    }

  };

  // 🔥 GUARDAR REFLEXIÓN
  const saveReflection = async () => {

    // 🔴 VALIDAR VACÍO
    if (!reflection.trim()) {

      alert(
        "Por favor escribe cómo te sentiste realizando el plan."
      );

      return;

    }

    try {

      setSavingReflection(true);

      await axios.post(
        "http://127.0.0.1:8000/api/intervention/reflection/",
        {
          evaluation_id: data.id,
          reflection
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        "Reflexión guardada correctamente"
      );

      // 🔥 IR A INTERPRETACIÓN
      if (data.onViewInterpretation) {
        data.onViewInterpretation();
      }

    } catch (err) {

      console.log(err);

      alert(
        "Error guardando reflexión"
      );

    } finally {

      setSavingReflection(false);

    }

  };

  return (

    <div className="plan-wrapper">

      <div className="plan-card">

        {/* HEADER */}

        <div className="plan-header">

          <h1>
            Plan de acompañamiento emocional
          </h1>

          <p>
            Completa actividades reales para fortalecer
            tu bienestar emocional.
          </p>

          {/* PROGRESO */}

          <div className="progress-box">

            <div className="progress-info">

              <span>
                Progreso del plan
              </span>

              <strong>
                {completedCount} / {totalActivities}
              </strong>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`
                }}
              />

            </div>

          </div>

        </div>

        {/* CONTENIDO */}

        <div className="plan-content">

          {interventions.map((section, index) => (

            <div
              key={index}
              className="plan-section"
            >

              <div className="section-header">

                <span className="section-tag">

                  {section?.section
                    ?.replaceAll("_", " ")
                    ?.toUpperCase()}

                </span>

              </div>

              <div className="section-items">

                {Array.isArray(section?.items) &&
                  section.items.map((item, i) => {

                    const isDone =
                      completed[item.title];

                    return (

                      <div
                        key={i}
                        className={`recommendation-card ${
                          isDone
                            ? "completed-card"
                            : ""
                        }`}
                      >

                        <div className="card-top">

                          <h2>{item.title}</h2>

                          {isDone && (

                            <span className="done-badge">
                              ✔ Realizado
                            </span>

                          )}

                        </div>

                        <p className="section-message">
                          {item.message}
                        </p>

                        <div className="section-action">
                          {item.action}
                        </div>

                        <button
                          className={
                            isDone
                              ? "completed-button"
                              : "complete-button"
                          }
                          disabled={isDone}
                          onClick={() =>
                            handleComplete(item.title)
                          }
                        >

                          {isDone
                            ? "Actividad completada"
                            : "Marcar como realizada"}

                        </button>

                      </div>

                    );

                  })}

              </div>

            </div>

          ))}

        </div>

        {/* REFLEXIÓN */}

        {progress === 100 && (

          <>

            <div className="reflection-card">

              <h2>
                Reflexión emocional final
              </h2>

              <p>
                ¿Cómo te sentiste realizando
                este plan de acompañamiento?
              </p>

              <textarea
                placeholder="Escribe aquí cómo te sentiste..."
                value={reflection}
                onChange={(e) =>
                  setReflection(e.target.value)
                }
              />

              <button
                className="save-reflection-button"
                onClick={saveReflection}
                disabled={savingReflection}
              >

                {savingReflection
                  ? "Guardando..."
                  : "Guardar reflexión"}

              </button>

            </div>

            {/* 🔥 REEVALUACIÓN */}

            <div className="reevaluation-card">

              <h2>
                {reevaluation.title}
              </h2>

              <p>
                {reevaluation.message}
              </p>

              <div className="reevaluation-days">

                Próxima evaluación sugerida:
                <strong>
                  {" "}
                  {reevaluation.days} días
                </strong>

              </div>

              <button
                className="reevaluation-button"
                onClick={() => {

                  if (onBack) {
                    onBack();
                  }

                }}
              >
                Realizar nueva evaluación
              </button>

            </div>

          </>

        )}

      </div>

    </div>

  );

}

export default InterventionPlan;