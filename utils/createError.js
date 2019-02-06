export const createError = (message, error) => {
  if (error && error.status === "unhandled") {
    return error;
  }

  return {
    message,
    status: "unhandled",
    error: error && error.message
  };
};

export default createError;
