"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState, useCallback, FormEvent } from "react";
import { useDishListQuery } from "@/queries/useDish";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/redux/action/cartAction";
import type { AppDispatch } from "@/redux/store";
import Link from "next/link";
import DeliveryAddress, { Address } from "./delivery-address";
import { ChevronRight } from "lucide-react";
import { DishStatusType } from "@/constants/dishs";

enum PaymentMethod {
  MoMo = "MoMo",
  Cod = "COD",
}

interface Dish {
  id: number;
  quantity: number;
  name: string;
  price: number;
  description: string;
  image: string;
  status: DishStatusType;
}

const deliveryOptions = [
  {
    id: "priority",
    label: "Ưu tiên",
    time: "< 30 phút",
    price: 23000,
    description:
      "Đơn hàng của bạn sẽ được ưu tiên giao trong thời gian ngắn hơn. Bạn cũng sẽ nhận được một phiếu ưu đãi nếu đ...",
  },
  { id: "fast", label: "Nhanh", time: "30 phút", price: 18000 },
  { id: "saving", label: "Tiết kiệm", time: "45 phút", price: 14000 },
  { id: "later", label: "Đặt giao sau", time: "", price: 0 },
];

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [selectedDelivery, setSelectedDelivery] = useState("fast");
  const [utensilsNeeded, setUtensilsNeeded] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showDetailInput, setShowDetailInput] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MoMo);
  const [showOptions, setShowOptions] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null);
  
  const { data } = useDishListQuery();

  // Handle payment method selection
  const handleSelectPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setShowOptions(false);
  };

  // Handle address update including details
  const handleAddressUpdate = (updates: Partial<Address>) => {
    if (!deliveryAddress) return;
    
    const updatedAddress = { ...deliveryAddress, ...updates };
    setDeliveryAddress(updatedAddress);
    
    // Save updated address to localStorage
    localStorage.setItem('deliveryAddress', JSON.stringify(updatedAddress));
  };

  // Handle user input for notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleAddressUpdate({ notes: e.target.value });
  };

  // Handle edit address button click
  const handleEditAddress = () => {
    setShowDetailInput(true);
  };

  const handleIncreaseQuantity = (id: number) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id: number, quantity: number) => {
    if (quantity > 1) {
      dispatch(decreaseQuantity(id));
    } else {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) dispatch(removeItem(id));
      });
    }
  };

  // Handle when user adds or changes the main address
  const handleAddressAdded = (address: Address) => {
    setDeliveryAddress(address);
    // Save address to localStorage to retain it when refreshing the page
    localStorage.setItem('deliveryAddress', JSON.stringify(address));
  };

  // Format address for display
  const getFormattedAddress = () => {
    if (!deliveryAddress) return "";
    return `${deliveryAddress.addressDetail}, ${deliveryAddress.ward}, ${deliveryAddress.districtName}, ${deliveryAddress.provinceName}`;
  };

  const calculateSubtotal = useCallback(() => {
    return dishes.reduce(
      (total, dish) => total + dish.price * dish.quantity,
      0
    );
  }, [dishes]);

  // Handle order submission
  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng thêm địa chỉ giao hàng",
        icon: "error",
      });
      return;
    }
    
    if (dishes.length === 0) {
      Swal.fire({
        title: "Lỗi",
        text: "Giỏ hàng của bạn đang trống",
        icon: "error",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Construct order data
      const orderData = {
        items: dishes.map(dish => ({
          dishId: dish.id,
          quantity: dish.quantity,
          price: dish.price
        })),
        deliveryAddress: deliveryAddress,
        deliveryOption: selectedDelivery,
        paymentMethod: paymentMethod,
        utensilsNeeded: utensilsNeeded,
        subtotal: calculateSubtotal(),
        deliveryFee: deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0,
        totalPrice: totalPrice,
      };
      
      // Here you would normally send the order to your API
      console.log("Submitting order:", orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      Swal.fire({
        title: "Thành công!",
        text: "Đơn hàng của bạn đã được đặt thành công",
        icon: "success",
      });
      
      // Here you might want to clear the cart or redirect to an order confirmation page
      
    } catch (error) {
      console.error("Error submitting order:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    const deliveryFee =
      deliveryOptions.find((option) => option.id === selectedDelivery)?.price || 0;
  
    setTotalPrice(subtotal + deliveryFee);
  }, [dishes, selectedDelivery, calculateSubtotal]);

  useEffect(() => {
    // Check if there's an address in localStorage
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
      try {
        setDeliveryAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.error("Error parsing saved address", e);
      }
    }
    
    const fetchDishes = () => {
      setLoading(true);
      try {
        const dishIds = cart.map((item) => item.dishId);

        if (dishIds.length > 0 && data?.payload?.data) {
          const cartMap = new Map(
            cart.map((item) => [item.dishId, item.quantity])
          );

          const dishesWithQuantity = data.payload.data
            .filter((dish) => cartMap.has(dish.id))
            .map((dish) => ({
              ...dish,
              quantity: cartMap.get(dish.id) || 0,
            }));

          setDishes(dishesWithQuantity);
        } else {
          setDishes([]);
        }
      } catch (error) {
        console.error("Không thể lấy thông tin món ăn:", error);
        setDishes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [cart, data]);

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;

  return (
    <form onSubmit={handleSubmitOrder} className="flex flex-col h-full bg-gray-50">
      {/* Order summary */}
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>
          <Link href="/online/menu" className="text-blue-500 hover:underline">
            Thêm món
          </Link>
        </div>

        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <div key={dish.id} className="flex items-center py-2">
              <div className="h-20 w-20 bg-gray-200 mr-4 rounded">
                {dish.image && (
                  <Image
                    src={dish.image}
                    height={80}
                    width={80}
                    alt={dish.name}
                    className="w-full h-full object-cover mr-4"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{dish.name}</h3>
                <p className="text-gray-700">{dish.price.toLocaleString()}đ</p>
                <button type="button" className="text-blue-500 text-sm">Chỉnh sửa</button>
              </div>
              <div className="flex items-center">
                <div className="border rounded-full overflow-hidden flex items-center">
                  <button
                    type="button"
                    className="px-3 py-2 bg-white"
                    onClick={() => handleDecreaseQuantity(dish.id, dish.quantity)}
                  >
                    -
                  </button>
                  <span className="px-3">{dish.quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-2 bg-white"
                    onClick={() => handleIncreaseQuantity(dish.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Giỏ hàng của bạn đang trống
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="p-4 bg-white mt-2">
        <div className="flex justify-between mb-2">
          <span>Tổng tạm tính</span>
          <span>{calculateSubtotal().toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Phí áp dụng</span>
          <span>21.000đ</span>
        </div>
      </div>

      {/* Environmental options */}
      <div className="p-4 bg-white mt-2">
        <div className="flex justify-between items-center">
          <div>
            <div>Dụng cụ ăn uống</div>
            <p className="text-sm text-gray-500">
              Chỉ yêu cầu khi thật sự cần.
            </p>
          </div>
          <div className="relative inline-block w-10 align-middle select-none">
            <input
              type="checkbox"
              id="utensils-toggle"
              checked={utensilsNeeded}
              onChange={() => setUtensilsNeeded(!utensilsNeeded)}
              className="opacity-0 absolute h-0 w-0"
            />
            <label
              htmlFor="utensils-toggle"
              className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                utensilsNeeded ? "bg-green-500" : ""
              }`}
              style={{ width: "48px" }}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                  utensilsNeeded ? "translate-x-full" : ""
                }`}
              ></span>
            </label>
          </div>
        </div>
      </div>

      {/* Delivery address */}
      <div className="flex items-center justify-between mb-2 p-4">
        <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
        <div className="ml-auto flex items-center gap-2">
          <DeliveryAddress 
            onAddressAdded={handleAddressAdded} 
          />
        </div>
      </div>
      
      {deliveryAddress ? (
        <div className="p-4 bg-white mt-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500 mr-3">
              📍
            </div>
            <div>
              <h3 className="font-medium">{deliveryAddress.fullName}</h3>
              <h3 className="font-medium">{deliveryAddress.phone}</h3>
              <p className="text-sm text-gray-500">
                {getFormattedAddress().length > 50
                  ? `${getFormattedAddress().substring(0, 50)}...`
                  : getFormattedAddress()}
              </p>
            </div>
            <button 
              type="button"
              className="ml-auto"
              onClick={handleEditAddress}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Address details and instructions */}
          <div className="mt-2">
            {!deliveryAddress.notes ? (
              <button 
                type="button"
                className="text-blue-500 text-sm"
                onClick={() => setShowDetailInput(true)}
              >
                Thêm chi tiết địa chỉ và hướng dẫn giao hàng
              </button>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Chi tiết:</span> {deliveryAddress.notes}
                </p>
                <button 
                  type="button"
                  className="text-blue-500 text-sm mt-1"
                  onClick={() => setShowDetailInput(true)}
                >
                  Chỉnh sửa
                </button>
              </div>
            )}
            
            {showDetailInput && (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Nhập chi tiết địa chỉ và hướng dẫn cho tài xế..."
                  value={deliveryAddress.notes || ""}
                  onChange={handleNotesChange}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => setShowDetailInput(false)}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white mt-2">
          <div className="text-center text-gray-500">
            Vui lòng thêm địa chỉ giao hàng
          </div>
        </div>
      )}

      {/* Delivery options */}
      <div className="p-4 bg-white mt-2">
        <h3 className="text-lg font-medium mb-4">Tuỳ chọn giao hàng</h3>

        {deliveryOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 rounded-lg border mb-2 cursor-pointer ${
              selectedDelivery === option.id
                ? "border-green-500"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedDelivery(option.id)}
          >
            <input
              type="radio"
              id={`delivery-${option.id}`}
              name="deliveryOption"
              value={option.id}
              checked={selectedDelivery === option.id}
              onChange={() => setSelectedDelivery(option.id)}
              className="hidden"
            />
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{option.label}</span>
                {option.time && <span className="ml-2">• {option.time}</span>}
              </div>
              <span>
                {option.price ? `${option.price.toLocaleString()}đ` : ""}
              </span>
            </div>
            {option.description && (
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Payment info */}
      <div className="p-4 bg-white mt-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Thông tin thanh toán</h3>
          <button
            type="button"
            className="text-blue-500"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? "Đóng" : "Xem tất cả"}
          </button>
        </div>

        {/* Currently selected method */}
        <div className="flex items-center mt-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mr-3">
            <span>{paymentMethod.charAt(0)}</span>
          </div>
          <span>{paymentMethod}</span>
          <input 
            type="hidden" 
            name="paymentMethod" 
            value={paymentMethod} 
          />
        </div>

        {/* Other payment method options */}
        {showOptions && (
          <div className="mt-4 space-y-2">
            {(Object.values(PaymentMethod)).map((method) => (
              <div
                key={method}
                className={`flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded ${
                  paymentMethod === method ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectPayment(method)}
              >
                <input
                  type="radio"
                  id={`payment-${method}`}
                  name="paymentMethodRadio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => handleSelectPayment(method)}
                  className="mr-2"
                />
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mr-3">
                  <span>{method.charAt(0)}</span>
                </div>
                <label htmlFor={`payment-${method}`}>{method}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="p-4 text-center text-sm text-gray-500">
        <p>
          Bằng việc đặt đơn này, bạn đã đồng ý{" "}
          <a href="#" className="text-blue-500">
            Điều khoản Sử dụng
          </a>{" "}
          và{" "}
          <a href="#" className="text-blue-500">
            Quy chế Hoạt động
          </a>{" "}
          của chúng tôi
        </p>
      </div>

      {/* Total and order button */}
      <div className="p-4 bg-white border-t sticky bottom-0">
        <div className="flex justify-between items-center mb-2">
          <span>Tổng cộng</span>
          <div className="text-right">
            <span className="font-bold text-xl block">
              {totalPrice.toLocaleString()}đ
            </span>
          </div>
        </div>
        <button 
          type="submit"
          className={`w-full font-bold py-4 rounded-lg ${
            deliveryAddress && dishes.length > 0 && !submitting
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!deliveryAddress || dishes.length === 0 || submitting}
        >
          {submitting ? 'Đang xử lý...' : 'Đặt đơn'}
        </button>
      </div>
    </form>
  );
};

export default Cart;