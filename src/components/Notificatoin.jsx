/**
 * This component is used to display notifications to the user about the actions
 * success, failure etc
 */
const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }
  const { message, status } = notification;
  return <div className={status}>{message}</div>;
};

export default Notification;
