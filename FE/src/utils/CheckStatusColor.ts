export const checkStatusColor = (status: string): string => {
  if (status === 'todo') return 'text-red-500'
  if (status === 'inprogress') return 'text-yellow-500'
  return 'text-green-500'
}