// import { createSlice } from "@reduxjs/toolkit";
// import { login } from "../action/userAction";

// export const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     isLoading: false,
//     currentUser: null, // chứa thông tin user đã đăng nhập
//     isError: false,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.currentUser = action.payload;
//         // Lưu vào localStorage trong component khi cần
//       })
//       .addCase(login.rejected, (state) => {
//         state.isLoading = false;
//         state.isError = true;
//       });
//   },
// });

// export default userSlice.reducer;
