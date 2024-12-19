import { makeAutoObservable, runInAction } from "mobx";
import { useAxios } from "../hooks/useAxios";
import toast from "react-hot-toast";
import { UploadFile } from "antd";
import { AttachmentType, ContractType } from "../types/type";

class AgreementStore {
  allContracts = { contracts: [], total: 0 };
  coureses = [];
  page = 1;
  perPage = 10;
  search = "";
  file: UploadFile | null = null;
  name = "";
  course = "";
  refresh = false;
  editFile: AttachmentType | null = null;
  contract: ContractType | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getCourses() {
    try {
      const response = await useAxios().get("/api/staff/courses", {
        params: {},
      });
      runInAction(() => {
        this.coureses = response.data.data.courses;
      });
    } catch (error) {
      console.error("Xatolik:", error);
    }
  }

  async getContracts() {
    try {
      this.loading = true;
      const response = await useAxios().get("/api/staff/contracts/all", {
        params: {
          page: this.page,
          perPage: this.perPage,
          search: this.search,
        },
      });
      runInAction(() => {
        this.allContracts = response.data.data;
      });
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      this.loading = false;
    }
  }

  setPagination = (page: number, perPage: number) => {
    this.page = page;
    this.perPage = perPage;
  };

  setSearch(search: string) {
    this.search = search;
  }

  setFiles(file: UploadFile) {
    this.file = file;
  }

  setName(name: string) {
    this.name = name;
  }

  setCourse(course: string) {
    this.course = course;
  }

  setEditFile(attachment: AttachmentType) {
    this.editFile = attachment;
  }

  async uploadFileAttachment() {
    const response = await useAxios().post(
      "/api/staff/upload/contract/attachment",
      {
        files: this.file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  }

  async handleCreateSubmit() {
    try {
      this.loading = true;
      const response = await this.uploadFileAttachment();
      if (response.status === 200) {
        const contractData = {
          title: this.name,
          courseId: this.course,
          attachment: {
            size: response.data.data[0].size,
            url: response.data.data[0].path,
            origName: response.data.data[0].fileName,
          },
        };

        await useAxios()
          .post("/api/staff/contracts/create", contractData)
          .then(() => {
            this.getContracts();
            toast.success("Shartnoma muvaffaqiyatli yaratildi!");
          });
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi!");
    } finally {
      this.loading = false;
    }
  }

  async getById(id: number) {
    try {
      const response = await useAxios().get(`/api/staff/contracts/${id}`);
      runInAction(() => {
        this.contract = response.data.data;
      });
    } catch (error) {
      console.log("Xatolik:", error);
    }
  }

  async putContract(id: number) {
    try {
      this.loading = true;
      let attachmentData = this.editFile;
      if (this.file) {
        const response = await this.uploadFileAttachment();
        attachmentData = {
          size: response.data.data[0].size,
          url: response.data.data[0].path,
          origName: response.data.data[0].fileName,
        };
      }

      const contractUpdateData = {
        title: this.name,
        courseId: this.course,
        attachment: attachmentData,
      };
      await useAxios()
        .put(`/api/staff/contracts/${id}`, contractUpdateData)
        .then(() => {
          this.getContracts();
          toast.success("Shartnoma muvaffaqiyatli o'zgartirildi!");
        });
    } catch (error) {
      toast.error("Shartnoma o'zgartirilmadi!");
      console.error("Xatolik:", error);
    } finally {
      this.loading = false;
    }
  }
}

const agreementStore = new AgreementStore();
export default agreementStore;
