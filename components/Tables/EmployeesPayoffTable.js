"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Icons from "../../constants/icons";
import { formatNumberWithSpaces } from "@/helpers/formatNumberWithSpaces";
import Link from "next/link";
import { StatusTile } from "../Custom/StatusTile";
import { MulticolorTitleTile } from "../Custom/MulticolorTitleTile";

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
    <div className="w-40 h-7 bg-white rounded-md border border-zinc-400 justify-center items-center flex flex-row gap-[8px] p-[13px]">
      <Icons.CoinImage w={16} h={16} />
      <input
        className="text-xs font-normal text-zinc-950 outline-none border-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
});

export const EmployeesPayoffTable = ({ tableData, setSelectedRowValues }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(tableData);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

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
        accessorKey: "name",
        header: "Pracownik",
      },
      {
        accessorKey: "payment",
        header: "Zwrot",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start">
            <MulticolorTitleTile title={getValue()} color="blue" />
          </div>
        ),
      },
      {
        accessorKey: "merchant",
        header: "Merchant",
      },
      {
        accessorKey: "balance",
        header: "Saldo Pracownika",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-start gap-1">
            <Icons.CoinImage w={16} h={16} />
            <span>{formatNumberWithSpaces(getValue())}</span>
          </div>
        ),
      },
      {
        accessorKey: "isPaymentRecurrent",
        header: "Płatność cykliczna",
        cell: ({ getValue }) => {
          let status, title;

          if (getValue() === true) {
            status = "greenLight";
            title = "Aktywna";
          } else {
            status = "redLight";
            title = "Nieaktywna";
          }

          return (
            <div className="flex items-center justify-start">
              <StatusTile title={title} status={status} />
            </div>
          );
        },
      },
      {
        accessorKey: "topUpAmount",
        header: "Kwota zasilenia",
        cell: ({ getValue, row, column, table }) => (
          <div className="flex items-center justify-start">
            <TopUpAmountCell
              getValue={getValue}
              row={row}
              column={column}
              table={table}
            />
          </div>
        ),
      },
      {
        accessorKey: "view",
        displayKey: "view",
        header: () => {
          <></>;
        },
        cell: ({ getValue }) => (
          <Link href={`/admin/employees/view/1`}>
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
    data,
    state: {
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
          {table.getRowModel().rows.map((row) => (
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
          ))}
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
              setPageIndex(table.getState().pagination.pageIndex);
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
              setPageIndex(table.getState().pagination.pageIndex);
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