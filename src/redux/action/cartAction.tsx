import { AppDispatch, RootState } from "../store"; // tùy theo bạn tổ chức project
import { setCart } from "../slide/cartSlice";
import Swal from "sweetalert2";

// Helper để lưu cart vào localStorage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveCartToLocalStorage = (cart: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const addtoCart = (newOrders: { dishId: number; quantity: number }[]) =>
    (dispatch: AppDispatch, getState: () => RootState) => {
      const { cart } = getState().cart;
      const updatedCart = [...cart];
  
      newOrders.forEach(order => {
        const index = updatedCart.findIndex(item => item.dishId === order.dishId);
        if (index === -1) {
          updatedCart.push({ ...order });
        } else {
          // 🔥 Clone object con trước khi thay đổi
          const existingItem = { ...updatedCart[index] };
          existingItem.quantity += order.quantity;
          updatedCart[index] = existingItem;
        }
      });
  
      saveCartToLocalStorage(updatedCart);
      dispatch(setCart(updatedCart));
  
      Swal.fire({
        icon: 'success',
        title: 'Đã thêm vào giỏ hàng!',
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    };
  

export const removeItem = (dishId: number) => 
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { cart } = getState().cart;
    const updatedCart = cart.filter(item => item.dishId !== dishId);
    saveCartToLocalStorage(updatedCart);
    dispatch(setCart(updatedCart));
};

export const increaseQuantity = (dishId: number) => 
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { cart } = getState().cart;
    const updatedCart = cart.map(item => 
      item.dishId === dishId ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCartToLocalStorage(updatedCart);
    dispatch(setCart(updatedCart));
};

export const decreaseQuantity = (dishId: number) => 
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { cart } = getState().cart;
    const updatedCart = cart.map(item => 
      item.dishId === dishId ? { ...item, quantity: item.quantity - 1 } : item
    );
    saveCartToLocalStorage(updatedCart);
    dispatch(setCart(updatedCart));
};

export const resetCart = () => (dispatch: AppDispatch) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
  }
  dispatch(setCart([]));
};
