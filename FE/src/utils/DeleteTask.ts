import axios from "../lib/axios";

export const DeleteTask = async (id: string) => {
  const { data } = await axios.delete(`/tasks/${id}`);
  return data;
}