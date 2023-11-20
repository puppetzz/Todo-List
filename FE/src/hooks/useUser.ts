const useUser = () => {
  if (localStorage.getItem("userData") !== null) {
    const user = JSON.parse(localStorage.getItem("userData") as string)
    return user
  }
  return null
}

export default useUser