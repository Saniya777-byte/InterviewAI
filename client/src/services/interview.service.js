import axiosInstance from "@/lib/axios";

export const startInterview = async () => {
  const response = await axiosInstance.post(
    "/interview/start",
    {}
  );

  return response.data;
};

export const sendMessage = async (sessionId, content) => {
  const response = await axiosInstance.post(
    "/interview/message",
    {
      sessionId,
      content,
    }
  );

  return response.data;
};

export const endInterview = async (sessionId) => {
  const response = await axiosInstance.post(
    "/interview/end",
    {
      sessionId,
    }
  );

  return response.data;
};

export const getInterview = async (id) => {
  const response = await axiosInstance.get(
    `/interview/${id}`
  );

  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await axiosInstance.get("/interview/history");
  return response.data;
};