import api from "../api/api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  return await api.post('/auth/login', data);
};

export const register = async (data: RegisterData) => {
    console.log(JSON.stringify(data, null, 2));
    console.log(
      `name: ${data.name}, email: ${data.email}, password: ${data.password}`
    )
    
    
  return await api.post('/auth/register', data);
};
