"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import DeliveryAddress from "./delivery-address";

// Import custom hooks
import { useCart } from "@/hooks/useCart";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { useDeliveryOptions } from "@/hooks/useDeliveryOptions";
import { useOrder } from "@/hooks/useOrder";
import { useDeliveryAddress } from "@/hooks/useDeliveryAdress";
import { PaymentMethod } from "@/constants/orders";
import { useGetDeliveryFeeListQuery } from "@/queries/useOrder";


const Cart = () => {
    const {data} = useGetDeliveryFeeListQuery()
  // Use custom hooks
  const { 
    dishes, 
    loading, 
    calculateSubtotal, 
    handleIncreaseQuantity, 
    handleDecreaseQuantity 
  } = useCart();

  const {
    deliveryAddress,
    showDetailInput,
    setShowDetailInput,
    handleAddressAdded,
    handleNotesChange,
    handleEditAddress,
    getFormattedAddress
  } = useDeliveryAddress();

  const {
    paymentMethod,
    showOptions,
    setShowOptions,
    handleSelectPayment
  } = usePaymentMethod();

  const {
    selectedDelivery,
    setSelectedDelivery,
    utensilsNeeded,
    setUtensilsNeeded,
    getDeliveryFee
  } = useDeliveryOptions();

  const {
    totalPrice,
    submitting,
    handleSubmitOrder
  } = useOrder({
    dishes,
    calculateSubtotal,
    deliveryAddress,
    selectedDelivery,
    getDeliveryFee,
    paymentMethod,
    utensilsNeeded
  });

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;

  return (
    <form
      onSubmit={handleSubmitOrder}
      className="flex flex-col h-full bg-gray-50"
    >
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
                <button type="button" className="text-blue-500 text-sm">
                  Chỉnh sửa
                </button>
              </div>
              <div className="flex items-center">
                <div className="border rounded-full overflow-hidden flex items-center">
                  <button
                    type="button"
                    className="px-3 py-2 bg-white"
                    onClick={() =>
                      handleDecreaseQuantity(dish.id, dish.quantity)
                    }
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
          <span>
            {getDeliveryFee().toLocaleString()}đ
          </span>
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
          <DeliveryAddress onAddressAdded={handleAddressAdded} />
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
                  <span className="font-medium">Chi tiết:</span>{" "}
                  {deliveryAddress.notes}
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

        {data?.payload.data.map((option) => (
          <div
            key={option.code}
            className={`p-4 rounded-lg border mb-2 cursor-pointer ${
              selectedDelivery === option.code
                ? "border-green-500"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedDelivery(option.code)}
          >
            <input
              type="radio"
              id={`delivery-${option.code}`}
              name="deliveryOption"
              value={option.id}
              checked={selectedDelivery === option.code}
              onChange={() => setSelectedDelivery(option.code)}
              className="hidden"
            />
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{option.label}</span>
                {option.estimatedTime && <span className="ml-2">• {option.estimatedTime}</span>}
              </div>
              <span>
                {option.baseFee ? `${option.baseFee.toLocaleString()}đ` : ""}
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
          <input type="hidden" name="paymentMethod" value={paymentMethod} />
        </div>

        {/* Other payment method options */}
        {showOptions && (
          <div className="mt-4 space-y-2">
            {Object.values(PaymentMethod).map((method) => (
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
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!deliveryAddress || dishes.length === 0 || submitting}
        >
          {submitting ? "Đang xử lý..." : "Đặt đơn"}
        </button>
      </div>
    </form>
  );
};

export default Cart;