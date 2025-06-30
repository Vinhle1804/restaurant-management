"use client";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GetOrdersResType,
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import AddOrder from "@/app/manage/orders/add-order";
import EditOrder from "@/app/manage/orders/edit-order";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { getVietnameseOrderStatus, handleErrorApi } from "@/lib/utils";
import { OrderStatusValues } from "@/constants/orders";
import OrderStatics from "@/app/manage/orders/order-statics";
import orderTableColumns from "@/app/manage/orders/order-table-columns";
import { useOrderService } from "@/app/manage/orders/order.service";
import { Check, ChevronsUpDown, X, Filter } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfDay, format, startOfDay } from "date-fns";
import TableSkeleton from "@/app/manage/orders/table-skeleton";
import { GuestCreateOrdersResType } from "@/schemaValidations/guest.schema";
import { useGetOrderListQuery, useUpdateOrderMutation } from "@/queries/useOrder";
import { useTableListQuery } from "@/queries/useTable";
import { toast } from "sonner";
import { useAppContext } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";

export const OrderTableContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOrderIdEdit: (value: number | undefined) => {},
  orderIdEdit: undefined as number | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeStatus: (payload: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => {},
  orderObjectByGuestId: {} as OrderObjectByGuestID,
});

export type StatusCountObject = Record<
  (typeof OrderStatusValues)[number],
  number
>;
export type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};
export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function OrderTable() {
  const searchParam = useSearchParams();
  const {socket} = useAppContext()
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const orderListQuery = useGetOrderListQuery({
    fromDate,
    toDate,
  });
  const refetchOrderList = orderListQuery.refetch;
  const orderList = orderListQuery.data?.payload.data ?? [];
  const tableListQuery = useTableListQuery();
  const tableList = tableListQuery.data?.payload.data ?? [];
  const tableListSortedByNumber = tableList.sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) => a.number - b.number
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
  });
const updateOrderMutation = useUpdateOrderMutation()
  const { statics, orderObjectByGuestId, servingGuestByTableNumber } =
    useOrderService(orderList);

  const changeStatus = async (body: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => {
    try {
      await updateOrderMutation.mutateAsync(body)
    } catch (error) {
      handleErrorApi({ error, setError: () => {} })
    }
  };

  const table = useReactTable({
    data: orderList,
    columns: orderTableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  // Cập nhật filter khi selectedStatuses thay đổi
  useEffect(() => {
    table.getColumn("status")?.setFilterValue(selectedStatuses.length > 0 ? selectedStatuses : undefined);
  }, [selectedStatuses, table]);

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearStatusFilter = () => {
    setSelectedStatuses([]);
  };

  const removeStatus = (statusToRemove: string) => {
    setSelectedStatuses(prev => prev.filter(s => s !== statusToRemove));
  };

const getStatusButtonText = () => {
  if (selectedStatuses.length === 0) return "Tất cả trạng thái";
  if (selectedStatuses.length === 1) {
    return getVietnameseOrderStatus(
      selectedStatuses[0] as (typeof OrderStatusValues)[number]
    );
  }
  return `${selectedStatuses.length} trạng thái`;
};


  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    const refetch = () => {
      const now = new Date();
      if (now >= fromDate && now <= toDate) {
        refetchOrderList();
      }
    };

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
      } = data;

      toast("Alert", {
        description: `Mon ${name} (SL${quantity}) da duoc cap nhat sang trang thai "${getVietnameseOrderStatus(
          data.status
        )}"`,
      });
      refetch();
    }
    function onNewOrder(data: GuestCreateOrdersResType["data"]) {
      const { guest } = data[0];
      toast("Alert", {
        description: `Mon ${guest?.name} tai ban ${guest?.tableNumber} da dat ${data.length} don`,
      });
      refetchOrderList()
    }

    function onPayment(data:PayGuestOrdersResType['data']){
     const {guest} = data[0]
     toast('thanh toan thanh cong',{
      description: `Mon ${guest?.name} tai ban ${guest?.tableNumber} da thanh toan thanh cong ${data.length} don`,
     })
     refetchOrderList()

    }

    socket?.on("new-order", onNewOrder);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("update-order", onUpdateOrder);
    socket?.on("payment", onPayment)
    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("new-order", onNewOrder);
      socket?.off("payment", onPayment)

    };
  }, [fromDate, refetchOrderList, toDate, socket]);

  return (
    <OrderTableContext.Provider
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId,
      }}
    >
      <div className="w-full">
        <EditOrder
          id={orderIdEdit}
          setId={setOrderIdEdit}
          onSubmitSuccess={() => {}}
        />
        <div className=" flex items-center">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <span className="mr-2">Từ</span>
              <Input
                type="datetime-local"
                placeholder="Từ ngày"
                className="text-sm"
                value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setFromDate(new Date(event.target.value))}
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Đến</span>
              <Input
                type="datetime-local"
                placeholder="Đến ngày"
                value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setToDate(new Date(event.target.value))}
              />
            </div>
            <Button className="" variant={"outline"} onClick={resetDateFilter}>
              Reset
            </Button>
          </div>
          <div className="ml-auto">
            <AddOrder />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 py-4">
          <Input
            placeholder="Tên khách"
            value={
              (table.getColumn("guestName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("guestName")?.setFilterValue(event.target.value)
            }
            className="max-w-[100px]"
          />
          <Input
            placeholder="Số bàn"
            value={
              (table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("tableNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-[80px]"
          />
          
          {/* Improved Status Filter Popover */}
          <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedStatuses.length > 0 ? "default" : "outline"}
                role="combobox"
                aria-expanded={openStatusFilter}
                className={cn(
                  "w-fit min-w-[140px] justify-between gap-2 text-sm font-medium",
                  selectedStatuses.length > 0 && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="truncate">{getStatusButtonText()}</span>
                  {selectedStatuses.length > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <div className="flex items-center justify-between p-3 border-b">
                  <h4 className="font-medium text-sm">Lọc theo trạng thái</h4>
                  {selectedStatuses.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearStatusFilter}
                      className="h-auto p-1 text-xs hover:bg-destructive/10 hover:text-destructive"
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>
                <CommandGroup className="max-h-64 overflow-auto">
                  <CommandList>
                    {OrderStatusValues.map((status) => {
                      const isSelected = selectedStatuses.includes(status);
                      return (
                        <CommandItem
                          key={status}
                          onSelect={() => handleStatusToggle(status)}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-4 w-4 items-center justify-center rounded border-2",
                              isSelected 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "border-input"
                            )}>
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <span className="text-sm">
                              {getVietnameseOrderStatus(status)}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandList>
                </CommandGroup>
                {selectedStatuses.length > 0 && (
                  <div className="p-3 border-t bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-2">
                      Đã chọn {selectedStatuses.length} trạng thái
                    </div>
                    <Button
                      onClick={() => setOpenStatusFilter(false)}
                      size="sm"
                      className="w-full"
                    >
                      Áp dụng
                    </Button>
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Selected Status Badges */}
          {selectedStatuses.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedStatuses.map((status) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className="text-xs px-2 py-1 pr-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <span className="mr-1">
                    {getVietnameseOrderStatus(status as (typeof OrderStatusValues)[number])}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeStatus(status);
                    }}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        <OrderStatics
          statics={statics}
          tableList={tableListSortedByNumber}
          servingGuestByTableNumber={servingGuestByTableNumber}
        />
        {orderListQuery.isPending && <TableSkeleton />}
        {!orderListQuery.isPending && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={orderTableColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị{" "}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{orderList.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/orders"
            />
          </div>
        </div>
      </div>
    </OrderTableContext.Provider>
  );
}