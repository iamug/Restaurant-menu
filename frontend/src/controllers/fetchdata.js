import API from "./api";
const token = localStorage.getItem("token");
const config = {
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": token,
  },
};

export async function FetchCategoryData() {
  if (!token) return false;
  if (token) {
    const res = await API.get("/api/user/category", config);
    if (!res) return false;
    return res.data;
  }
}

export async function FetchTableCategoryData() {
  if (!token) return false;
  if (token) {
    const res = await API.get("/api/user/tablecategory", config);
    if (!res) return false;
    return res.data;
  }
}

// //export default { GetUserData, LogoutUser };
