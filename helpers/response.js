module.exports = ({ res, status, message, data }) => {
  res.status = status;
  res.send({
    status,
    message,
    data,
  });
};
