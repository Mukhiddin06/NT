
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
  id: number;
  title: string;
  attachment: AttachmentType;
  course: CourseType;
  createdAt?: string;
}

export interface ModalType {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id?: number
}

export interface FileTypes {
  type: string;
  name: string;
  size: number
  originFileObj?: File;
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