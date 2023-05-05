import BaseAxios from "@/store/setUpAxios";

export const _getListDutyServices = (paginate, data) => {
  return BaseAxios({
    url: `/api/shift/get-shift`,
    method: "POST",
    data,
  });
};

export const _updateDutyServices = (id, data) => {
  return BaseAxios({
    url: `/api/shift/update-shift/${id}`,
    method: "POST",
    data,
  });
};

export const _deleteDutyServices = (id) => {
  return BaseAxios({
    url: `/api/shift/delete/${id}`,
    method: "POST",
  });
};

export const _createDutyServices = (data) => {
  return BaseAxios({
    url: "/api/shift/create-shift-handler",
    method: "POST",
    data,
  });
};

export const _searchDutyServices = (paginate, data) => {
  return BaseAxios({
    url: `/api/shift/show`,
    method: "POST",
    data,
  });
};
