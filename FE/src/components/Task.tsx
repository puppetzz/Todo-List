import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import { checkStatusColor } from '../utils/CheckStatusColor';
import moment from 'moment';
import TaskDetail from './TaskDetail';
import { useState } from 'react';
import { Task } from '../type/task';
import axios from '../lib/axios';
import { DeleteErrorAlert, DeleteSuccessAlert } from '../lib/toast';
import useUser from '../hooks/useUser';

interface Props {
  task: Task;
  reload: () => void;
}

const TaskCard = (props: Props) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [work, setWork] = useState('get');
  const [status, setStatus] = useState(props.task.status);
  const statusColor = checkStatusColor(status);
  const user = useUser();

  const handleCloseDetail = () => {
    setIsShowDetail(false);
  };

  const handleUpdateTask = () => {
    if (status === 'todo') {
      updateStatus('inprogress');
      setStatus('inprogress');
    }
    if (status === 'inprogress') {
      updateStatus('done');
      setStatus('done');
    }
    if (status === 'done') return;
  };

  const updateStatus = async (status: string) => {
    try {
      await axios.patch(
        `/task/${props.task._id}`,
        {
          status: status,
        },
        {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`/task/${props.task._id}`, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      DeleteSuccessAlert();
    } catch (error) {
      console.log(error);
      DeleteErrorAlert();
    }
  };

  return (
    <div>
      {!isShowDetail ? (
        <></>
      ) : (
        <TaskDetail
          work={work}
          task={props.task}
          onClose={handleCloseDetail}
          reload={props.reload}
        />
      )}
      <div className="flex justify-between p-4 px-3 border-b-[1px]">
        <div>
          <div
            onClick={() => {
              setIsShowDetail(true);
              setWork('get');
            }}
            className={`flex items-center space-x-3 cursor-pointer ${
              status === 'done' ? 'line-through' : ''
            } hover:scale-110`}
          >
            <span className="text-lg font-montserrat">{props.task.title}</span>
          </div>
          <div>
            <span className="text-xs">
              {moment(props.task.createAt).format('HH:mm DD/MM/YYYY')}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={handleUpdateTask}
            className={`flex justify-center w-[100px] text-lg
          ${statusColor}`}
          >
            {status}
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsShowDetail(true);
                setWork('edit');
              }}
              className="hover:scale-110"
            >
              <img src={editIcon} alt="edit" className="w-6" />
            </button>

            <button
              className="hover:scale-110"
              onClick={() => {
                handleDeleteTask().then(() => {
                  props.reload();
                });
              }}
            >
              <img src={deleteIcon} alt="" className="w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
