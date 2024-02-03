import PropTypes from "prop-types";
const LoginForm = ({
  handleFormSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <form onSubmit={handleFormSubmit}>
      <p>Log in to the application</p>
      <div>
        Username
        <input
          type="name"
          value={username}
          name="username"
          placeholder="username"
          onChange={handleUsernameChange}
          id="username"
        />
      </div>
      <div>
        Password
        <input
          type="password"
          placeholder="password"
          value={password}
          name="password"
          id="password"
          onChange={handlePasswordChange}
        />
      </div>
      <button id="login-button" type="submit">
        Login
      </button>
    </form>
  );
};
LoginForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default LoginForm;
