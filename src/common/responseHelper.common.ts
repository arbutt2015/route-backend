// response.js

// Function to send success response
export const sendSuccessResponse = (
  res: any,
  message: string,
  data: any,
  statusCode = 200,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Function to send error response
export const sendErrorResponse = (res: any, message: any, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
    },
  });
};
