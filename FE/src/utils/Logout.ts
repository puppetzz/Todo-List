const Logout = () => {
  localStorage.removeItem('userData');
  window.location.reload();
}

export default Logout;