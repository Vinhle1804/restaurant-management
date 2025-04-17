import { createAsyncThunk } from "@reduxjs/toolkit";
import userList from "../../data/userList";

export const login = createAsyncThunk("user/login", async (credentials, thunkAPI) => {
  const { email, password } = credentials;

  // Tìm user trong danh sách giả
  const user = userList.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    return user;
  } else {
    return thunkAPI.rejectWithValue("Email hoặc mật khẩu không đúng");
  }
});
