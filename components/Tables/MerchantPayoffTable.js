import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Icons from "../../constants/icons";
import { MerchantType } from "../Custom/MerchantType";
import { formatNumberWithSpaces } from "@/helpers/formatNumberWithSpaces";
import Link from "next/link";

const IndeterminateCheckbox = ({ indeterminate, className = "", ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className + " cursor-pointer accent-main-green w-[16px] h-[16px]"
      }
      {...rest}
    />
  );
};

const TopUpAmountCell = React.memo(({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <div className="w-40 h-7 bg-white rounded-md border border-zinc-400 flex items-center px-2">
      <Icons.CoinImage w={16} h={16} className="mr-2" />
      <input
        className="w-full h-full text-xs font-normal text-zinc-950 outline-none border-none bg-transparent"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type="number"
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'textfield',
          appearance: 'textfield',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
});

export const MerchantPayoffTable = ({ tableData, setSelectedRowValues, searchValue }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState(tableData);
  
  const filteredData = useMemo(() => {
    return data.filter(row =>       
      row.merchantName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "merchantName",
        header: "Nazwa Merchanta",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start gap-1">
            {getValue()}
          </div>
        ),
      },
      {
        accessorKey: "merchantType",
        header: "Rodzaj",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start">
            <MerchantType type={getValue()} />
          </div>
        ),
      },
      {
        accessorKey: "merchantBalance",
        header: "Saldo merchanta",
        cell: ({ getValue, row }) => (
          <div className="flex items-center justify-start gap-1">
            <Icons.CoinImage w={16} h={16} />
            <span>{formatNumberWithSpaces(getValue())}</span>
            {row.original.justSentTokens && <Icons.ArrowUpGreenImage w={16} h={16} />}
          </div>
        ),
      },
      {
        accessorKey: "topUpAmount",
        header: "Kwota zasilenia",
        cell: ({ getValue, row, column, table }) => {
          return (
            <div className="flex items-center justify-start">
              <TopUpAmountCell
                getValue={getValue}
              row={row}
              column={column}
              table={table}
            />
          </div>
        )
        },
      },
      {
        accessorKey: "view",
        displayKey: "view",
        header: () => {
          <></>;
        },
        cell: ({ getValue, row }) => {          
          return (
          <Link href={`/admin/merchants/view/${row.original.merchantId}`}>
          <button className="flex items-center justify-center gap-1 bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors p-[4px]">
            <Icons.EyeImage w={16} h={16} />
          </button>
          </Link>
        )
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    state: {
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const newPagination = updater(table.getState().pagination);
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const newData = data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [columnId]: value,
            };
          }
          return row;
        });
        
        setData(newData);
       
      },
    },
  });

  useEffect(() => {
    const selectedRowsWithData = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => data[key]);
  
    setSelectedRowValues(selectedRowsWithData);
  }, [rowSelection, data]);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <>
      <table className="w-full border-collapse text-zinc-950">
        <thead className="bg-[#f6f7fa]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                    className="border-b font-medium text-xs text-[#0e1726] text-left"
                  style={{
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-sm p-2">
                Brak danych do wyświetlenia
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b px-[16px] py-[16px] text-xs"
                  style={{ textAlign: "left" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          )))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="w-full flex flex-row justify-between text-sm mt-[32px] h-[50px] items-center">
        <div className="text-zinc-950 flex flex-row items-center gap-[16px]">
          <p>
            Wyświetlono {table.getPaginationRowModel().rows.length} z{" "}
            {filteredData.length} elementów
          </p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border border-main-gray rounded-md px-[16px] py-[6px]"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row gap-2 items-center text-black">
          <button
            className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Image src="/icons/arrow-left-black.svg" width={16} height={16} alt="arrow left" />
          </button>

          <p className="rounded-full bg-main-green text-white w-[30px] h-[30px] flex items-center justify-center">
            {pageIndex + 1}
          </p>

          {table.getCanNextPage() && (
            <p className="rounded-full bg-[#ebefee] text-black w-[30px] h-[30px] flex items-center justify-center">
              {pageIndex + 2}
            </p>
          )}
          
          <button
            className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Image src="/icons/arrow-right-black.svg" width={16} height={16} alt="arrow right" />
          </button>
        </div>
      </div>
    </>
  );
};
