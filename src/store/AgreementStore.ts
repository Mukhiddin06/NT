import { makeAutoObservable, runInAction } from "mobx";
import { useAxios } from "../hooks/useAxios";
import toast from "react-hot-toast";
import { UploadFile } from "antd";
import { ContractType } from "../types/type";

class AgreementStore {
  contracts = [];
  page = 1;
  perPage = 10;
  total = 0;
  search = "";
  token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : null;

  files: UploadFile[] = [];
  name = "";
  course = "";
  refresh = false;

  contract: ContractType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchContracts() {
    try {
      const response = await useAxios().get("/api/staff/contracts/all", {
        params: {
          page: this.page,
          perPage: this.perPage,
          search: this.search,
        },
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : "",
        },
      });
      runInAction(() => {
        this.contracts = response.data.data.contracts;
        this.total = response.data.data.total;
      });
    } catch (error) {
      console.error("Xatolik:", error);
    }
  }

  setPagination = (page: number, perPage: number) => {
    this.page = page;
    this.perPage = perPage;
    this.fetchContracts();
  };
  setSearch(search: string) {
    this.search = search;
    this.fetchContracts(); 
  }

  setFiles(files: UploadFile[]) {
    this.files = files;
  }

  setName(name: string) {
    this.name = name;
  }

  setCourse(course: string) {
    this.course = course;
  }

  async uploadFileAttachment() {
    const response = await useAxios().post(
      "/api/staff/upload/contract/attachment",
      {
        files: this.files[0].originFileObj,
      },
      {
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : "",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }

  async handleCreateSubmit() {
    try {
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

        await useAxios().post("/api/staff/contracts/create", contractData, {
          headers: {
            Authorization: this.token ? `Bearer ${this.token}` : "",
          },
        });
        runInAction(() => {
          this.refresh = !this.refresh;
          this.files = [];
        });
        this.fetchContracts();
        toast.success("Shartnoma muvaffaqiyatli yaratildi!");
      } else {
        toast.error("Xatolik yuz berdi!");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi!");
    }
  }

  async fetchGetById(id: number) {
    try {
      const response = await useAxios().get(`/api/staff/contracts/${id}`, {
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : "",
        },
      });
      runInAction(() => {
        this.contract = response.data.data;
      });
    } catch (error) {
      console.log("Xatolik:", error);
    }
  }

  async fetchPutContract(id: number) {
    try {
      const response = await this.uploadFileAttachment();

      if (response.status === 200) {
        const contractUpdateData = {
          title: this.name,
          courseId: this.course,
          attachment: {
            size: response.data.data[0].size,
            url: response.data.data[0].path,
            origName: response.data.data[0].fileName,
          },
        };

        await useAxios().put(`/api/staff/contracts/${id}`, contractUpdateData, {
          headers: {
            Authorization: this.token ? `Bearer ${this.token}` : "",
          },
        });
        runInAction(() => {
          this.contracts = response.data.data.contracts;
          this.total = response.data.data.total;
        });
        this.fetchContracts();
        toast.success("Shartnoma muvaffaqiyatli o'zgartirildi!");
      }
    } catch (error) {
      toast.error("Shartnoma o'zgartirilmadi!");
      console.error("Xatolik:", error);
    }
  }
}

const agreementStore = new AgreementStore();
export default agreementStore;
