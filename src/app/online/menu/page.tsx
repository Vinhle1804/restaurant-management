import MenuOrder from "./menu-order";
import ReduxProvider from "@/redux/redux-provider";

export default function MenuPage() {
  return (
    <ReduxProvider>
      <div className="max-w-[400px] mx-auto space-y-4">
        <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
        <MenuOrder />
      </div>
    </ReduxProvider>
  );
}
