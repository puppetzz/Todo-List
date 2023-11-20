import { Task } from '../type/task';
import { TextField } from '@mui/material';
import { checkStatusColor } from '../utils/CheckStatusColor';
import { Button, FormControl, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import closeIcon from '../assets/close.svg';
import axios from '../lib/axios';
import { User } from '../type/user';
import useUser from '../hooks/useUser';

interface Props {
  task: Task;
  work: string;
  visible: boolean;
  onClose: () => void;
  reload: () => void;
}

const TaskDetail = (props: Props) => {
  if (!props.visible) return null;

  const [status, setStatus] = useState(props.task.status);
  const [title, setTitle] = useState(props.task.title);
  const [content, setContent] = useState(props.task.content);
  const [assigneeId, setAssigneeId] = useState(props.task.assignee._id);
  const [users, setUsers] = useState([]);
  const user = useUser();

  const statusColor = checkStatusColor(status);

  const handleUpdateTask = async () => {
    try {
      await axios.patch(`/task/${props.task._id}`, {
        title: title,
        content: content,
        status: status,
        assignee: assigneeId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateTask = async () => {
    try {
      await axios.post(`/task/`, {
        title: title,
        content: content,
        status: status,
        assignee: assigneeId,
        assignor: user.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUser = async () => {
    const res = await axios.get('/user');
    setUsers(res.data);
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`/task/${props.task._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.work !== 'get') {
      getAllUser();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-20">
      <div className="absolute m-auto left-0 right-0 top-0 bottom-0 w-[700px] h-[500px] bg-slate-50 shadow-md rounded-lg">
        <button onClick={props.onClose} className="absolute right-2 top-2">
          <img src={closeIcon} alt="Close" className="w-10" />
        </button>
        <div className="py-10 px-6">
          <div className="w-ful">
            <input
              onChange={(e) => setTitle(e.target.value)}
              className="text-5xl font-montserrat font-bold bg-transparent outline-none w-full"
              type="text"
              disabled={props.work === 'get' ? true : false}
              defaultValue={props.task.title}
            />
          </div>
          {props.work === 'get' ? (
            <div className=" font-montserrat text-xl">
              <span>status: </span>
              <span className={` ${statusColor}`}>{props.task.status}</span>
            </div>
          ) : (
            <div className=" font-montserrat text-xl">
              <span>status: </span>
              <select
                className={`bg-transparent appearance-none pl-2 ${statusColor} outline-none`}
                name="selectStatus"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                defaultValue={status}
              >
                <option className="text-red-500" value="todo">
                  todo
                </option>
                <option className="text-yellow-500" value="inprogress">
                  inprogress
                </option>
                <option className="text-green-500" value="done">
                  done
                </option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-between font-montserrat px-6 pb-10">
          <div className="">
            <div className="flex items-center">
              <span className="pr-8">Assign to:</span>
              {props.work === 'get' ? (
                <span className="font-semibold pl-2">
                  {props.task.assignee.username}
                </span>
              ) : (
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    labelId="Assign to"
                    id="Assign to"
                    defaultValue={props.task.assignee._id}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    {users.map((user: User) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
            <div className="block">
              <span className="pr-4">Assigned by:</span>
              <span className="font-semibold">
                {props.task.assignor.username}
              </span>
            </div>
          </div>
          <div>
            <span className="pr-3">Create At:</span>
            <span className="font-semibold">
              {moment(props.task.createAt).format('HH:mm DD/MM/YYYY')}
            </span>
          </div>
        </div>
        <div className="px-6">
          <div className="">
            <TextField
              onChange={(e) => setContent(e.target.value)}
              className="w-full"
              id="standard-textarea"
              label="Content"
              placeholder="Placeholder"
              rows={5}
              multiline
              disabled={props.work === 'get' ? true : false}
              variant="standard"
              defaultValue={props.task.content}
            />
          </div>
        </div>
        <div className="flex justify-center space-x-32 py-8">
          {props.work === 'get' ? (
            <Button
              className="w-32 hover:bg-red-500"
              style={{
                borderColor: '#FF0000',
                color: '#FF0000',
              }}
              variant="outlined"
              onClick={() => {
                handleDeleteTask().then(() => {
                  props.reload();
                });
                props.onClose();
              }}
            >
              Delete
            </Button>
          ) : (
            <Button
              className="w-32"
              variant="outlined"
              onClick={() => {
                if (props.work === 'add') {
                  handleCreateTask().then(() => {
                    props.reload();
                  });
                } else {
                  handleUpdateTask().then(() => {
                    props.reload();
                  });
                }
                props.onClose();
              }}
            >
              {props.work === 'add' ? 'Add' : 'Update'}
            </Button>
          )}
          <Button
            className="w-32 hover:bg-red-500"
            style={{
              borderColor: '#FF0000',
              color: '#FF0000',
            }}
            variant="outlined"
            onClick={props.onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
