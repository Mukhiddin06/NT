import { makeAutoObservable, runInAction } from "mobx";
import { useAxios } from "../hooks/useAxios";

class CoursesStore {
  coureses = []
  token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCourses() {
    try {
      const response = await useAxios().get("/api/staff/courses", {
        params:{},
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : "",
        },
      });
      runInAction(() => {
        this.coureses = response.data.data.courses;
      });
    } catch (error) {
      console.error("Xatolik:", error);
    }
  }
}

const coursesStore = new CoursesStore();
export default coursesStore;
