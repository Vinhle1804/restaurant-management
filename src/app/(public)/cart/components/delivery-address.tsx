"use client";
import React, { useState, useEffect } from 'react';
import { useDeliveryAddress } from '@/hooks/useDeliveryAdress';
import AddressList from './address-list';


function DeliveryAddress() {


  const {
    deliveryAddress,
    showDetailInput,
    setShowDetailInput,
  } = useDeliveryAddress();

  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (deliveryAddress?.addressNotes) {
      setNotes(deliveryAddress.addressNotes);
    }
  }, [deliveryAddress]);

  const handleSaveNotes = () => {
    // Giả sử bạn có logic truyền lên cha hoặc cập nhật tạm thời
    console.log("Ghi chú đã nhập:", notes);
    setShowDetailInput(false);
    // Nếu cần cập nhật lại vào deliveryAddress, phải có setDeliveryAddress (nếu được truyền từ hook)
  };

  if (!deliveryAddress) {
    return <div className="p-4 bg-white mt-2">Không có địa chỉ mặc định.</div>;
    
  }

  const getFormattedAddress = () => {
    return `${deliveryAddress.provinceName}, ${deliveryAddress.districtName}, ${deliveryAddress.wardName}, ${deliveryAddress.addressDetail}`;
  };

  return (
    <div className="p-4 bg-white mt-2">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500 mr-3">
          📍
        </div>
        <div>
          <h3 className="font-medium">{deliveryAddress.recipientName}</h3>
          <h3 className="font-medium">{deliveryAddress.recipientPhone}</h3>
          <p className="text-sm text-gray-500">
            {getFormattedAddress().length > 50
              ? `${getFormattedAddress().substring(0, 100)}...`
              : getFormattedAddress()}
          </p>
          {deliveryAddress.addressNotes && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Ghi chú:</span> {deliveryAddress.addressNotes}
            </p>
          )}
        </div>

        <button
          type="button"
          className="ml-auto"
          onClick={() => setShowDetailInput(!showDetailInput)}
        >
          <AddressList deliveryAddress={deliveryAddress} />
        </button>
      </div>

      {showDetailInput && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded"
            rows={2}
            placeholder="Nhập chi tiết địa chỉ và hướng dẫn cho tài xế..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={handleSaveNotes}
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryAddress;
