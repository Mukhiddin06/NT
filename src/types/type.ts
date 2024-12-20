import { UploadFile } from "antd";

export interface AttachmentType {
  url: string;
  origName?: string;
  size?: number;
}

export interface CourseType {
  id?: number;
  name: string;
  createdAt?: string;
}

export interface ContractType {
  id?: number;
  title: string;
  attachment: AttachmentType;
  course?: CourseType;
  createdAt?: string;
}

export interface ModalType {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
}

export interface FileTypes {
  type: string;
  name: string;
  size: number;
  originFileObj?: File;
}

export interface ResponseDataType {
  contracts: ContractType[];
  total: number;
}

export interface GetParamsType {
  page: number;
  perPage: number;
  search: string;
}

export interface FormValues {
  courseId: string;
  title: string;
  file: UploadFile[];
}
// export interface CourseType {
//   createdAt: string;
//   disciplineId: string;
//   disciplineName: string;
//   hasCurriculum: string;
//   hasStudyMonths: string;
//   id: number;
//   imageIllustration?: string;
//   name: string

// }
