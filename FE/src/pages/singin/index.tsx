import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../lib/axios';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleClickSignIn = async () => {
    try {
      const response = await axios.post('/auth/login', {
        username: username,
        password: password,
      });

      const user = {
        id: response?.data?.id,
        username: response?.data?.username,
        accessToken: response?.data?.token?.accessToken,
        refreshToken: response?.data?.token?.refreshToken,
      };

      if (user.accessToken) {
        navigate('/todo-list');
        localStorage.setItem('userData', JSON.stringify(user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center w-full h-[800px]">
        <h2 className="text-3xl">SIGN IN</h2>
        <div className="flex justify-center flex-col space-y-5 w-[350px] h-[300px]">
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            label="Username"
            variant="outlined"
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            label="Password"
            variant="outlined"
          />
          <div className="flex flex-col">
            <Button onClick={handleClickSignIn} variant="contained">
              Sign In
            </Button>
            <div className="flex justify-between px-1">
              <a href="#">Forgot password?</a>
              <a href="#">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
