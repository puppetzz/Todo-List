import Nav from '../../components/Nav';
import TaskCard from '../../components/Task';
import axios from '../../lib/axios';
import { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import { Task } from '../../type/task';
import useUser from '../../hooks/useUser';
import { Button } from '@mui/material';
import TaskDetail from '../../components/TaskDetail';

const TodoListPages = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const user = useUser();

  const handleCloseDetail = () => {
    setIsShowDetail(false);
  };

  const getTasks = async (userId: string = '', search: string = '') => {
    const response =
      userId === ''
        ? await axios.get('/task', {
            params: { page: page, limit: 7, search: search },
          })
        : await axios.get(`/task/user/${userId}`, {
            params: { page: page, limit: 7, search: search },
            headers: { Authorization: `Bearer ${user?.accessToken}` },
          });

    console.log(response.data.data);
    setTasks(response.data.data);
    setPage(response.data.page);
    setTotalPage(response.data.totalPage);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPage(page);
  };

  const handleReload = async () => {
    if (user) {
      await getTasks(user.id);
    } else {
      await getTasks();
    }
  };

  useEffect(() => {
    if (user) {
      getTasks(user.id);
    } else {
      getTasks();
    }
  }, [page]);

  return (
    <div>
      <Nav />
      <TaskDetail
        work={'add'}
        task={{
          _id: '',
          title: 'New Task',
          content: 'New Task',
          status: 'todo',
          assignee: { _id: user?.id, username: user?.username },
          assignor: { _id: user?.id, username: user?.username },
          createAt: Date(),
        }}
        visible={isShowDetail}
        onClose={handleCloseDetail}
        reload={handleReload}
      />
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-between items-center w-[700px]">
          <div className="w-[550px] my-4 rounded-full bg-slate-600 bg-opacity-5">
            <input
              className="bg-transparent font-montserrat text-lg outline-none mx-5 w-[500px] h-[50px] text-black"
              type="text"
              placeholder="Search"
              onChange={(e) => {
                if (user) {
                  getTasks(user.id, e.target.value);
                } else {
                  getTasks(e.target.value);
                }
              }}
            />
          </div>
          <Button
            style={{ borderRadius: '999px', height: '50px' }}
            variant="contained"
            onClick={() => {
              if (user) {
                setIsShowDetail(true);
              } else {
                alert('Please login to create new task');
              }
            }}
          >
            New Task
          </Button>
        </div>
        <div className="flex flex-col w-[700px] h-[700px] rounded-lg shadow-lg bg-slate-50">
          <div className="h-[630px] pt-5">
            {tasks.map((task) => {
              return (
                <TaskCard key={task._id} task={task} reload={handleReload} />
              );
            })}
          </div>
          <div className="flex justify-center py-5 static ">
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={totalPage}
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoListPages;
