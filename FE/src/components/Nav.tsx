import avatar from '../assets/images/avt.jpg';
import useUser from '../hooks/useUser';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Logout from '../utils/Logout';

const Nav = () => {
  const user = useUser();
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-[260px] h-[30px]"></div>
        <div className="w-[260px]">
          <h3 className="text-5xl py-5 font-montserrat font-bold">MY TASKS</h3>
        </div>
        <div className="flex justify-end w-[260px] pr-5">
          {user ? (
            <div className="flex items-center">
              <span className="font-montserrat text-2xl">{user.username}</span>
              <img
                className="w-16 h-16 rounded-full mr-1"
                src={avatar}
                alt="avatar"
              />
              <div
                onClick={() => {
                  Logout();
                  navigate('/');
                }}
                className="ml-1 w-5 h-5"
              >
                <LogoutIcon />
              </div>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => {
                  navigate('/');
                }}
                variant="contained"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
