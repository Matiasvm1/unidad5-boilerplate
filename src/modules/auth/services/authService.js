import { instance } from '../../shared/api/axiosInstance';

// endpoint (sesion como admin) POST /api/auth/admin/login -> { token, role }
async function loginAdmin({ email, password }) {
  const response = await instance.post('api/auth/admin/login', {
    email,
    password,
  });

  return response.data;
}

// endpoint (sesion como paciente)POST /api/auth/patient/login -> { token, role, dni, patientId }
// dni viaja como numero y fullName opcional (si esta o no)
async function loginPatient({ email, dni, fullName }) {
  const body = { email, dni: Number(dni) };

  if (fullName) {
    body.fullName = fullName;
  }

  const response = await instance.post('api/auth/patient/login', body);

  return response.data;
}

//en loginPatient los inputs de html siempre guardan texto pero el back exige
// que el dni siempre sea numero y el fullName solo si el user escribio algo

export { loginAdmin, loginPatient };
