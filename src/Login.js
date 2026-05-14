import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ setToken, goRegister }) { // 👈 agregado goRegister
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    axios.post("http://127.0.0.1:8000/api/token/", {
      username,
      password
    })
    .then(res => {
      setToken(res.data.access);
      localStorage.setItem("token", res.data.access);
    })
    .catch(err => {
      alert("Credenciales incorrectas o error de conexión");
      console.log(err);
    });
  };

  return (
    <div className="login-wrapper">

      {/* IZQUIERDA */}
      <div className="login-left">
        <div className="logo"></div>

        <h1>Estás en un lugar seguro</h1>

        <p>
          Aquí puedes tomarte un momento para ti,
          sin juicios y en total privacidad.
        </p>
      </div>

      {/* DERECHA */}
      <div className="login-right">

        <div className="card">
          <h2>Bienvenido de nuevo</h2>
          <p>Tomemos un momento para ti 💚</p>

          {/* USERNAME */}
          <div className="input-group">
            <span>📧</span>
            <input
              placeholder="Tu correo"
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <span>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              onChange={e => setPassword(e.target.value)}
            />
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>

          <p className="forgot">¿Olvidaste tu contraseña?</p>

          <button className="btn" onClick={handleLogin}>
            Entrar con calma 🍃
          </button>

          {/* 🔥 NUEVO BOTÓN */}
          <button
            className="btn"
            style={{
              marginTop: "10px",
              background: "#e0e0e0",
              color: "#333"
            }}
            onClick={goRegister}
          >
            Crear cuenta
          </button>

          <div className="divider">o continúa con</div>

          {/* SOCIAL LOGIN */}
          <div className="socials">
            <button>G</button>
            <button></button>
            <button>□</button>
          </div>

          <small className="secure">
            🔒 Tu información está protegida
          </small>
        </div>

      </div>

    </div>
  );
}

export default Login;