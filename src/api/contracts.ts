import { useAxios } from "../hooks/useAxios";
import { ContractType, GetParamsType } from "../types/type";

export const editContracts = async (id: number, data: ContractType) => {
  const response = await useAxios().put(`/api/staff/contracts/${id}`, data);
  return response.data;
};

export const createContracts = async (data: ContractType) => {
  const response = await useAxios().post("/api/staff/contracts/create", data);
  return response.data;
};

export const getContracts = async (params: GetParamsType) => {
  const response = await useAxios().get("/api/staff/contracts/all", {
    params,
  });
  return response.data;
};

export const getCourses = async () => {
  const response = await useAxios().get("/api/staff/courses");
  return response.data;
};

export const uploadFileAttachment = async (file: File) => {
  const response = await useAxios().post(
    "/api/staff/upload/contract/attachment",
    {
      files: file,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
