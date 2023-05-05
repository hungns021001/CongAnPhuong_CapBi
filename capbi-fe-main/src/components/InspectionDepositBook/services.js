import BaseAxios from "@/store/setUpAxios";

export const _getListFollowTheTextServices = (number) => {
  return BaseAxios({
    url: `/api/tracker/get-tracker?page=${number}`,
    method: "POST",
  });
};

export const _updateFollowTheTextServices = (id, data) => {
  return BaseAxios({
    url: `/api/tracker/update-tracker/${id}`,
    method: "POST",
    data,
  });
};

export const _deleteFollowTheTextServices = (id) => {
  return BaseAxios({
    url: `/api/tracker/delete/${id}`,
    method: "POST",
  });
};

export const _createFollowTheTextServices = (data) => {
  return BaseAxios({
    url: '/api/tracker/create-tracker-handler',
    method: 'POST',
    data
  })
}
