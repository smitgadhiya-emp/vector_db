export const messageConsumeFromQueue = async (message: any) => {
  try {
    console.log("Message received from queue: ", message);
  } catch (error) {
    return error;
  }
};
