import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel
} from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Icons from "../../constants/icons";
import { formatNumberWithSpaces } from "@/helpers/formatNumberWithSpaces";
import Link from "next/link";
import { parse } from "date-fns";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
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
}

export const MerchantHistoryTable = ({ tableData, setSelectedRowValues, searchValue, date }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(tableData);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState([])

  const filteredData = useMemo(() => {
    let filteredData = data

    if (date && date.from && date.to) {
      filteredData = filteredData.filter(row => {
        const transactionDate = parse(row.date, 'dd.MM.yyyy', new Date());
        
        return transactionDate >= new Date(date.from) && transactionDate <= new Date(date.to);
      });
    }

    filteredData = filteredData.filter(row => {
      return row.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.merchant.toLowerCase().includes(searchValue.toLowerCase())
    });

    return filteredData;
  }, [data, searchValue, date]);

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
        accessorKey: "id",
        header: "ID transkacji",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start gap-1">
            <button onClick={() => {
              navigator.clipboard.writeText(getValue());
              showToastNotificationSuccess("Sukces", "Skopiowano do schowka");
            }}>
              <Icons.CopyImage w={16} h={16} />
            </button>
            {getValue()}
          </div>
        ),
      },
      {
        accessorKey: "merchant",
        header: "Odbiorca",
      },
      {
        accessorKey: "date",
        header: "Data",
        header: ({ column }) => (
          <div className="flex items-center">
            Data
            <button
              onClick={() => {
                const isDesc = column.getIsSorted() === "desc";
                setSorting([{ id: "date", desc: !isDesc }]);
              }}
              className="ml-2"
            >
              <Icons.SortImage w={9} h={12} /> 
            </button>
          </div>
        ),
        cell: ({ getValue }) => getValue(),
        sortingFn: (rowA, rowB, columnId) => {
          const dateA = parse(rowA.getValue(columnId), 'dd.MM.yyyy', new Date());
          const dateB = parse(rowB.getValue(columnId), 'dd.MM.yyyy', new Date());
          return dateA.getTime() - dateB.getTime();
        },
      },
      {
        accessorKey: "time",
        header: "Godzina",
      },
      {
        accessorKey: "balance",
        header: "Saldo po transakcji",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start gap-1">
            <Icons.CoinImage w={16} h={16} />
            <span>{formatNumberWithSpaces(getValue())}</span>
          </div>
        ),
      },
      {
        accessorKey: "transactionAmount",
        header: ({ column }) => (
          <div className="flex items-center">
            Kwota transakcji
            <button
              onClick={() => {
                const isDesc = column.getIsSorted() === "desc";
                setSorting([{ id: "transactionAmount", desc: !isDesc }]);
              }}
              className="ml-2"
            >
              <Icons.SortImage w={9} h={12} /> 
            </button>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start gap-1">
            <Icons.CoinImage w={16} h={16} />
            <span>{formatNumberWithSpaces(getValue())}</span>
          </div>
        ),
      },
      {
        accessorKey: "view",
        displayKey: "view",
        header: () => {
          <></>;
        },
        cell: ({ row }) => (
          <Link href={`/admin/merchants/transaction/${row.original.id}`}>
            <button className="flex items-center justify-start gap-1 bg-[#f6f7f8] p-[4px] rounded-full hover:bg-gray-200 transition-colors">
              <Icons.EyeImage w={16} h={16} />
            </button>
          </Link>
        ),
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
      sorting
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
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const selectedRowsWithData = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => data[key]);

    setSelectedRowValues(selectedRowsWithData);
  }, [rowSelection]);

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
              <td colSpan={columns.length} className="text-sm text-center p-2">
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
          ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="w-full flex flex-row justify-between text-sm mt-[32px] h-[50px] items-center">
        <div className="text-zinc-950 flex flex-row items-center gap-[16px]">
          <p>
            Wyświetlono {table.getPaginationRowModel().rows.length} z{" "}
            {data.length} elementów
          </p>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              table.setPageSize(newSize);
              setPageSize(newSize);
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
            onClick={() => {
              table.previousPage();              
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <Image
              src="/icons/arrow-left-black.svg"
              width={16}
              height={16}
              alt="arrow left"
            />
          </button>
          <p className="rounded-full bg-main-green text-white w-[30px] h-[30px] flex items-center justify-center">
            {pageIndex + 1}
          </p>
          <button
            className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center"
            onClick={() => {
              table.nextPage();              
            }}
            disabled={!table.getCanNextPage()}
          >
            <Image
              src="/icons/arrow-right-black.svg"
              width={16}
              height={16}
              alt="arrow right"
            />
          </button>
        </div>
      </div>
    </>
  );
};
