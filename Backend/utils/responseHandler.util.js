export const responseHandler = (success, status, messageOrData) => {
  if (success) {
    return { success: true, status, data: messageOrData };
  } else {
    return { success: false, status, error: { message: messageOrData } };
  }
};
