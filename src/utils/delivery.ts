import { DeliveryFeeOption } from "@/hooks/useDeliveryOptions";

export const getDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // bán kính Trái Đất (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const calculateDeliveryFee = (
  distance: number,
  option: DeliveryFeeOption
) => {
  const base = option.baseFee;
  const extraPerKm = option.extraFeePerKm;
  const maxKm = option.maxDistance;

  if (distance <= maxKm) return base;

  const extraDistance = distance - maxKm;
  return base + extraDistance * extraPerKm;
};