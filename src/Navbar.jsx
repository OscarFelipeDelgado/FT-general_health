import "./Navbar.css";

function Navbar({ setView, logout }) {

  return (
    <div className="navbar">

      <div className="navbar-left">
        <h2>🧠 Mental Health</h2>
      </div>

      <div className="navbar-right">

        <button
          className="nav-btn"
          onClick={() => setView("home")}
        >
          Inicio
        </button>

        <button
          className="nav-btn"
          onClick={() => setView("profile")}
        >
          Mi perfil
        </button>

        <button
          className="nav-btn"
          onClick={() => setView("evaluation")}
        >
          Evaluación
        </button>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Cerrar sesión
        </button>

      </div>

    </div>
  );
}

export default Navbar;