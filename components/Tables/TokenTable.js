"use client";

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

export const TokenTable = ({ data, setSelectedRowValues, searchValue }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState([])

  const filteredData = useMemo(() => {
    return data.filter(row => 
      row.id.toLowerCase().includes(searchValue.toLowerCase())
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
          <div className="flex items-center">
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
        header: "ID doładowania",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start gap-1">
            <button onClick={() => navigator.clipboard.writeText(getValue())}>
              <Icons.CopyImage w={16} h={16} />
            </button>
            {getValue()}
          </div>
        ),
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
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    state: {
      rowSelection,
      pagination: { pageIndex, pageSize },
      sorting,
    },
    onPaginationChange: setPageIndex,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newPagination = updater(table.getState().pagination);
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const selectedRowsWithData = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => data[key]);

    setSelectedRowValues(selectedRowsWithData);
  }, [rowSelection]);

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
