import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Home from "./Home";
import Evaluation from "./Evaluation";
import Result from "./Result";
import ProfileForm from "./ProfileForm";
import InterventionPlan from "./InterventionPlan";
import EmotionalInterpretation from "./EmotionalInterpretation";
import Navbar from "./Navbar";
import API_URL from "./config/api/axios";

import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function App() {

  // 🔐 TOKEN
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  // 👀 CONTROL DE VISTAS
  const [view, setView] = useState("login");

  // 🔥 VALIDACIÓN PERFIL
  const [checkedProfile, setCheckedProfile] = useState(false);

  // 📊 DATA
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  // 🔥 RESULTADO
  const [result, setResult] = useState(null);

  // 🔓 LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    setCheckedProfile(false);

    setView("login");
  };

  // 🔥 VALIDAR TOKEN + PERFIL
  useEffect(() => {

    if (!token) return;

    // 🔥 VALIDAR PERFIL
    axios.get(
      `${API_URL}/api/check-profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {

      // 🔥 SI YA TIENE PERFIL → HOME
      if (res.data.has_profile) {
        setView("home");
      }

      // 🔥 SI NO TIENE PERFIL → CREAR PERFIL
      else {
        setView("profileSetup")
      }

      setCheckedProfile(true);

    })
    .catch(err => {

      console.log(err);

      logout();
    });

    // 🔵 DASHBOARD
    axios.get(
      `${API_URL}/api/dashboard/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => setData(res.data))
    .catch(err => console.log(err));

    // 🔵 HISTORIAL
    axios.get(
      `${API_URL}/api/history/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => setHistory(res.data))
    .catch(err => console.log(err));

  }, [token]);

  // 🔴 LOGIN / REGISTRO
  if (!token) {

    // 🔥 REGISTER
    if (view === "register") {

      return (
        <ProfileForm
          mode="register"
          onBack={() => setView("login")}
        />
      );
    }

    // 🔥 LOGIN
    return (
      <Login
        setToken={(t) => {

          localStorage.setItem("token", t);

          setToken(t);
        }}
        goRegister={() => setView("register")}
      />
    );
  }

  // 🔥 ESPERAR VALIDACIÓN
  if (token && !checkedProfile) {
    return <h2>Validando usuario...</h2>;
  }

  // 🔥 NAVBAR GLOBAL
  const renderNavbar = (
    <Navbar
      setView={setView}
      logout={logout}
    />
  );

  // 🟡 HOME
  if (view === "home") {

    return (
      <div>

        {renderNavbar}

        <Home setView={setView} />

      </div>
    );
  }

  // 🟠 PERFIL (EDITAR PERFIL)
  if (view === "profile") {
    return (
      <>
        {renderNavbar}

        <ProfileForm
          token={token}
          isEdit={true}
          onContinue={() => setView("home")}
        />
      </>
    );
  }

  // 🟢 EVALUACIÓN
  if (view === "evaluation") {

    return (
      <div>

        {renderNavbar}

        <Evaluation
          token={token}

          onFinish={(data) => {

            setResult(data);

            setView("result");

          }}

          onBack={() => {
            setView("home");
          }}
        />

      </div>
    );
  }

  // 🟣 RESULTADO
  if (view === "result") {

    return (
      <div>

        {renderNavbar}

        <Result
          data={{
            ...result,
            onViewPlan: () => setView("plan")
          }}
          onBack={() => setView("evaluation")}
        />

      </div>
    );
  }

  // 🧠 PLAN DE ACOMPAÑAMIENTO
  if (view === "plan") {

    return (
      <div>

        {renderNavbar}

        <InterventionPlan
          data={{
            ...result,
            onViewInterpretation: () =>
              setView("interpretation")
          }}
          onBack={() => setView("result")}
        />

      </div>
    );
  }

  // 🧠 INTERPRETACIÓN
  if (view === "interpretation") {

    return (
      <div>

        {renderNavbar}

        <EmotionalInterpretation
          data={result}
          onBack={() => setView("plan")}
        />

      </div>
    );
  }

  // 🔄 LOADING
  if (!data) {
    return <h2>Cargando...</h2>;
  }

  // 🔵 DASHBOARD
  return (
    <div>

      {renderNavbar}

      <div style={{ padding: "20px" }}>

        <h1>Dashboard Mental Health</h1>

        <h3>
          Total evaluaciones:
          {" "}
          {data.total_evaluations}
        </h3>

        <h3>
          Promedio score:
          {" "}
          {data.average_score}
        </h3>

        {/* 🔵 BARRAS */}
        <div
          style={{
            width: "500px",
            marginTop: "30px"
          }}
        >

          <Bar
            data={{
              labels: Object.keys(data.levels),

              datasets: [
                {
                  label: "Cantidad de evaluaciones",

                  data: Object.values(data.levels),

                  backgroundColor: [
                    "#2ecc71",
                    "#f39c12",
                    "#e74c3c",
                    "#8e44ad"
                  ]
                }
              ]
            }}
          />

        </div>

        {/* 🔵 LINEA */}
        <div
          style={{
            width: "700px",
            marginTop: "50px"
          }}
        >

          <h3>Evolución emocional</h3>

          <Line
            data={{
              labels: history.map(h =>
                h.created_at?.slice(0, 10)
              ),

              datasets: [
                {
                  label: "Evolución emocional",

                  data: history.map(h => h.score),

                  borderColor: "#6f967d",

                  backgroundColor: "#9bbfa9",

                  tension: 0.3
                }
              ]
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default App;