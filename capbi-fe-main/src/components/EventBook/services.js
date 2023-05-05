import BaseAxios from "@/store/setUpAxios";

export const _getListFollowTheTextServices = (number) => {
  return BaseAxios({
    url: `/api/calendar/get-calendar?page=${number}`,
    method: "POST",
  });
};

export const _updateFollowTheTextServices = (id, data) => {
  return BaseAxios({
    url: `/api/calendar/update-calendar/${id}`,
    method: "POST",
    data,
  });
};

export const _deleteFollowTheTextServices = (id) => {
  return BaseAxios({
    url: `/api/calendar/delete/${id}`,
    method: "POST",
  });
};

export const _createFollowTheTextServices = (data) => {
  return BaseAxios({
    url: 'api/calendar/create-handle',
    method: 'POST',
    data
  })
}
