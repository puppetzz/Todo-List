import TodoListPages from './pages/TodoList';
import SignInPage from './pages/singin';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignInPage />}></Route>
        <Route path="/todo-list" element={<TodoListPages />}></Route>
        <Route path="*" element={<div>404</div>}></Route>
      </Routes>
    </>
  );
};

export default App;
