import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../lib/axios';
import { SignInSuccessAlert, SignInErrorAlert } from '../../lib/toast';

const SignInPage = () => {
  const [isSingIn, setIsSignIn] = useState(true);
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
        SignInSuccessAlert();
      }
    } catch (error) {
      console.log(error);
      SignInErrorAlert();
    }
  };
  const handleSignUp = async () => {
    try {
      const response = await axios.post('/auth/register', {
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
        SignInSuccessAlert();
      }
    } catch (error) {
      console.log(error);
      SignInErrorAlert();
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center w-full h-[800px]">
        {isSingIn ? (
          <h2 className="text-3xl">SIGN IN</h2>
        ) : (
          <h2 className="text-3xl">SIGN UP</h2>
        )}
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
            {isSingIn ? (
              <Button onClick={handleClickSignIn} variant="contained">
                Sign In
              </Button>
            ) : (
              <Button onClick={handleSignUp} variant="contained">
                Sign Up
              </Button>
            )}

            <div className="flex justify-between px-1">
              <a href="#">Forgot password?</a>
              {isSingIn ? (
                <a
                  onClick={() => {
                    setIsSignIn(false);
                  }}
                  href="#"
                >
                  Sign Up
                </a>
              ) : (
                <a
                  onClick={() => {
                    setIsSignIn(true);
                  }}
                  href="#"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
