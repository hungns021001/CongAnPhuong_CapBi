import BaseAxios from "@/store/setUpAxios";

const FTRACKINGBOOK_API_URL = "/api/immigrantRouter";

export const getFTrackingBook = async (data) => {
  return await BaseAxios.post(`${FTRACKINGBOOK_API_URL}/get-immigrant`, { data })
};

export const updateFTrackingBook = async (id, data) => {
  return BaseAxios.post(`${FTRACKINGBOOK_API_URL}/get-immigrant/${id}`, { data })
};

export const deleteFTrackingBook = async (id) => {
  return await BaseAxios.post(`${FTRACKINGBOOK_API_URL}/delete/${id}`)
};

export const createFTrackingBook = async (data) => {
  return await BaseAxios.post(`${FTRACKINGBOOK_API_URL}/create-immigrant-handler`, { data })
};

