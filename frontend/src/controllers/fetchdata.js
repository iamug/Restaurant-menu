// import API from "./api";

// export async function FetchAdminsData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/admins", config);
//     if (!res) return false;
//     return res.data;
//   }
// }

// export async function FetchPlansData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/plans", config);
//     if (!res) return false;
//     return res.data;
//   }
// }
// export async function FetchUsersData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/users", config);
//     if (!res) return false;
//     return res.data;
//   }
// }
// export async function FetchDriversData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/drivers", config);
//     if (!res) return false;
//     return res.data;
//   }
// }
// export async function FetchPartnersData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/partners", config);
//     if (!res) return false;
//     return res.data;
//   }
// }
// export async function FetchVehiclesData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/vehicles", config);
//     if (!res) return false;
//     return res.data;
//   }
// }

// export async function FetchTestCenterData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/testcenters", config);
//     if (!res) return false;
//     return res.data;
//   }
// }
// export async function FetchInspCentersData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/inspectioncenters", config);
//     if (!res) return false;
//     return res.data;
//   }
// }
// export async function FetchAdminsRolesData() {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   if (token) {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     };
//     const res = await API.get("/api/roles", config);
//     if (!res) return false;
//     return res.data;
//   }
// }

// export const Modules = [
//   {
//     name: "Users",
//     path: "/users",
//     icon: "",
//     id: "users",
//   },
//   {
//     name: "Drivers",
//     id: "drivers",
//   },
//   {
//     name: "Partners",
//     id: "partners",
//   },
//   {
//     name: "Plans",
//     id: "plans",
//   },
//   {
//     name: "Vehicles",
//     id: "vehicles",
//   },
//   {
//     name: "Bookings",
//     id: "bookings",
//   },
//   {
//     name: "Itineraries",
//     id: "itneraries",
//   },
//   {
//     name: "Tickets",
//     id: "tickets",
//   },
//   {
//     name: "FAQs",
//     id: "faqs",
//   },
//   {
//     name: "Request Repair",
//     id: "requestrepair",
//   },
//   {
//     name: "Report SOS",
//     id: "reportsos",
//   },
//   {
//     name: "Transactions",
//     id: "transactions",
//   },
//   {
//     name: "Admins",
//     id: "admins",
//     path: "/admins",
//     icon: "",
//     type: "multilevel",
//     children: [
//       {
//         name: "Admins",
//         id: "admins",
//         path: "/admins",
//       },
//     ],
//   },
//   {
//     name: "Roles and Permissions",
//     id: "rolesandpermissions",
//   },

//   {
//     name: "Drive Test",
//     id: "drivetest",
//   },
//   {
//     name: "Drive Test Centers",
//     id: "drivetestcenters",
//   },
//   {
//     name: "Vehicle Inspection",
//     id: "vehicleinspection",
//   },
//   {
//     name: "Vehicle Inspection Centers",
//     id: "vehicleinspectioncenters",
//   },
//   {
//     name: "Activity Logs",
//     id: "activitylogs",
//   },
// ];

// //export default { GetUserData, LogoutUser };
