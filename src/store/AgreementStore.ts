import { makeAutoObservable, runInAction } from "mobx";
import toast from "react-hot-toast";
import { ContractType, ResponseDataType } from "../types/type";
import {
  createContracts,
  editContracts,
  getContracts,
  getCourses,
} from "../api/contracts";
import axios, { AxiosError } from "axios";

class AgreementStore {
  allContracts: ResponseDataType = { contracts: [], total: 0 };
  courses = [];
  current = 1;
  pageSize = 10;
  search = "";
  editContract: ContractType | null = null;
  loading = false;
  isModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getCourses() {
    try {
      const res = await getCourses();
      runInAction(() => {
        this.courses = res.data.courses;
      });
    } catch (error) {
      console.error("Xatolik:", error);
    }
  }

  async getAllContracts() {
    try {
      this.setIsLoading(true);
      const response = await getContracts({
        page: this.current,
        perPage: this.pageSize,
        search: this.search,
      });

      runInAction(() => {
        this.allContracts = response.data;
      });
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      this.setIsLoading(false);
    }
  }

  async handleSubmit(contract: ContractType, id?: number) {
    try {
      this.setIsLoading(true);
      let res;
      if (id) {
        res = await editContracts(id, contract);
      } else {
        res = await createContracts(contract);
      }
      return res;
    } catch (error: AxiosError | unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data.error.errId === 165
      ) {
        toast.error("Takrorlangan ma'lumot");
      } else {
        toast.error("Xatolik yuz berdi!");
      }
    } finally {
      this.setIsLoading(false);
    }
  }

  setPagination = (current: number, pageSize: number) => {
    this.current = current;
    this.pageSize = pageSize;
  };

  setSearch(search: string) {
    this.search = search;
  }

  setIsLoading(loading: boolean) {
    this.loading = loading;
  }

  setEditContract(contract: ContractType | null) {
    this.editContract = contract;
  }

  setIsModalOpen(isModalOpen: boolean) {
    this.isModalOpen = isModalOpen;
  }
}

const agreementStore = new AgreementStore();
export default agreementStore;
