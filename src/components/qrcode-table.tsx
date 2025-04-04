'use client'
import { getTableLink } from '@/lib/utils'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

export const QRCodeTable = ({
  token,
  tableNumber,
  width = 200
}: {
  token: string
  tableNumber: number
  width?: number
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = width + 70
    canvas.width = width
    const canvasContext = canvas.getContext('2d')!;
    canvasContext.fillStyle = '#fff';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = 'bold 20px sans-serif';
    canvasContext.textAlign = 'center';
    canvasContext.fillStyle = '#000';
    canvasContext.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, canvas.width + 29);
    canvasContext.fillText('Quét mã để đặt bàn', canvas.width / 2, canvas.width + 50);
    const virtalCanvas = document.createElement('canvas');
    QRCode.toCanvas(
      virtalCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      {
        width,
        margin: 4,
      },
      function (error) {
        if (error) {
          console.error(error);
        }
        canvasContext.drawImage(virtalCanvas, 0, 0, width, width);
      }
    );
  }, [token, tableNumber, width]);

  return <canvas ref={canvasRef} />;
}
