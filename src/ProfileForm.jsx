import { useEffect, useState } from "react";
import axios from "axios";
import "./Login.css";

function ProfileForm({
  onBack,
  onContinue,
  token,
  isEdit = false
}) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    document_id: "",
    phone: "",
    email: "",
    gender: "",
    age: "",
    location: ""
  });

  // 🔥 CARGAR DATOS SI ES EDICIÓN
  useEffect(() => {

    if (!isEdit || !token) return;

    setLoading(true);

    axios.get(
      "http://127.0.0.1:8000/api/profile/",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {

      setForm({
        username: res.data.username || "",
        password: "",
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        document_id: res.data.document_id || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        gender: res.data.gender || "",
        age: res.data.age || "",
        location: res.data.location || ""
      });

    })
    .catch(err => {

      console.log(err);

      alert(
        err?.response?.data?.error ||
        "Error cargando perfil"
      );
    })
    .finally(() => {
      setLoading(false);
    });

  }, [isEdit, token]);

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 VALIDACIONES FRONT
  const validateForm = () => {

    if (
      !form.first_name ||
      !form.last_name ||
      !form.document_id ||
      !form.phone ||
      !form.email ||
      !form.gender ||
      !form.age ||
      !form.location
    ) {

      alert("Todos los campos son obligatorios");

      return false;
    }

    if (!isEdit) {

      if (!form.username || !form.password) {

        alert("Usuario y contraseña son obligatorios");

        return false;
      }
    }

    return true;
  };

  // 🔥 REGISTRAR NUEVO USUARIO
  const handleRegister = () => {

    if (!validateForm()) return;

    setLoading(true);

    axios.post(
      "http://127.0.0.1:8000/api/register/",
      form
    )
    .then(res => {

      alert("✅ Usuario registrado correctamente");

      if (onBack) {
        onBack();
      }

    })
    .catch(err => {

      console.log(err);

      alert(
        err?.response?.data?.error ||
        "Error registrando usuario"
      );
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // 🔥 ACTUALIZAR PERFIL
  const handleUpdate = () => {

    if (!validateForm()) return;

    setLoading(true);

    axios.put(
      "http://127.0.0.1:8000/api/profile/update/",
      {
        first_name: form.first_name,
        last_name: form.last_name,
        document_id: form.document_id,
        phone: form.phone,
        email: form.email,
        gender: form.gender,
        age: form.age,
        location: form.location
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {

      alert("✅ Perfil actualizado correctamente");

      if (onContinue) {
        onContinue();
      }

    })
    .catch(err => {

      console.log(err);

      alert(
        err?.response?.data?.error ||
        "Error actualizando perfil"
      );
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="login-wrapper">

      {/* IZQUIERDA */}
      <div className="login-left">

        <div className="logo"></div>

        <h1>
          {
            isEdit
              ? "Actualiza tu información"
              : "Crea tu espacio seguro"
          }
        </h1>

        <p>
          {
            isEdit
              ? "Mantén tu información personal actualizada para una mejor experiencia."
              : "Tu bienestar emocional importa. Completa tu registro para comenzar."
          }
        </p>

      </div>

      {/* DERECHA */}
      <div className="login-right">

        <div className="card">

          <h2>
            {
              isEdit
                ? "Editar perfil"
                : "Crear cuenta"
            }
          </h2>

          <p>
            {
              isEdit
                ? "Actualiza tus datos personales"
                : "Registra tus datos personales"
            }
          </p>

          {/* USERNAME */}
          <div className="input-group">
            <input
              name="username"
              placeholder="Usuario"
              value={form.username}
              onChange={handleChange}
              disabled={isEdit}
            />
          </div>

          {/* PASSWORD SOLO EN REGISTER */}
          {
            !isEdit && (
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            )
          }

          {/* NOMBRES */}
          <div className="input-group">
            <input
              name="first_name"
              placeholder="Nombres"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>

          {/* APELLIDOS */}
          <div className="input-group">
            <input
              name="last_name"
              placeholder="Apellidos"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>

          {/* DOCUMENTO */}
          <div className="input-group">
            <input
              name="document_id"
              placeholder="Documento"
              value={form.document_id}
              onChange={handleChange}
            />
          </div>

          {/* CELULAR */}
          <div className="input-group">
            <input
              name="phone"
              placeholder="Celular"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* CORREO */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* GÉNERO */}
          <div className="input-group">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                outline: "none"
              }}
            >
              <option value="">Género</option>

              <option value="M">
                Masculino
              </option>

              <option value="F">
                Femenino
              </option>

              <option value="O">
                Otro
              </option>

            </select>
          </div>

          {/* EDAD */}
          <div className="input-group">
            <input
              type="number"
              name="age"
              placeholder="Edad"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          {/* CIUDAD */}
          <div className="input-group">
            <input
              name="location"
              placeholder="Ciudad"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* BOTÓN PRINCIPAL */}
          <button
            className="btn"
            disabled={loading}
            onClick={
              isEdit
                ? handleUpdate
                : handleRegister
            }
            style={{
              opacity: loading ? 0.7 : 1
            }}
          >
            {
              loading
                ? "Procesando..."
                : (
                  isEdit
                    ? "Actualizar perfil"
                    : "Crear cuenta"
                )
            }
          </button>

          {/* BOTÓN VOLVER SOLO EN REGISTER */}
          {
            !isEdit && (
              <button
                className="btn"
                onClick={onBack}
                style={{
                  marginTop: "10px",
                  background: "#dfe7e1",
                  color: "#2f4f3f"
                }}
              >
                Volver al login
              </button>
            )
          }

        </div>

      </div>

    </div>
  );
}

export default ProfileForm;