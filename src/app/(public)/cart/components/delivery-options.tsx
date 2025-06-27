"use client";

import { DeliveryFeeOption } from "@/hooks/useDeliveryOptions";
import { useGetDeliveryFeeListQuery } from "@/queries/useOrder";

type Props = {
  selectedDelivery: DeliveryFeeOption | null;
  setSelectedDelivery: React.Dispatch<React.SetStateAction<DeliveryFeeOption | null>>;
};

function DeliveryOptions({ selectedDelivery, setSelectedDelivery }: Props) {
  const { data, isLoading, error } = useGetDeliveryFeeListQuery();

  if (isLoading) {
    return <div className="p-4">Đang tải tuỳ chọn giao hàng...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Lỗi tải dữ liệu giao hàng</div>;
  }

  return (
    <div className="p-4 bg-white mt-2">
      <h3 className="text-lg font-medium mb-4">Tuỳ chọn giao hàng</h3>

      {data?.payload.data.filter((option) => option.isActive).map((option) => (
        <div
          key={option.code}
          className={`p-4 rounded-lg border mb-2 cursor-pointer ${
            selectedDelivery?.code === option.code
              ? "border-green-500"
              : "border-gray-200"
          }`}
          onClick={() => setSelectedDelivery(option)}
        >
          <input
            type="radio"
            id={`delivery-${option.code}`}
            name="deliveryOption"
            value={option.code}
            checked={selectedDelivery?.code === option.code}
            onChange={() => setSelectedDelivery(option)}
            className="hidden"
          />
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">{option.label}</span>
              {option.estimatedTime && (
                <span className="ml-2">• {option.estimatedTime}</span>
              )}
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
  );
}

export default DeliveryOptions;
