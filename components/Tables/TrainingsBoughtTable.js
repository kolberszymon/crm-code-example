import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel
} from "@tanstack/react-table";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Icons from "../../constants/icons";
import { formatNumberWithSpaces } from "@/helpers/formatNumberWithSpaces";
import Link from "next/link";
import { MulticolorTitleTile } from "../Custom/MulticolorTitleTile";
import { Currency } from "@prisma/client";
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

const PageButton = ({ page, isActive, onClick }) => (
  <button
    className={`rounded-full w-[30px] h-[30px] flex items-center justify-center ${
      isActive ? 'bg-main-green text-white' : 'bg-[#ebefee] text-black'
    }`}
    onClick={onClick}
  >
    {page}
  </button>
);

export const TrainingsBoughtTable = ({ tableData, setSelectedRowValues, searchValue }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(tableData);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const filteredData = useMemo(() => {
    return data.filter(row => 
      row.id.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  const renderPageButtons = () => {
    let pages = [];
    const currentPage = pageIndex + 1;

    // Always show first page
    pages.push(
      <PageButton
        key={1}
        page={1}
        isActive={currentPage === 1}
        onClick={() => table.setPageIndex(0)}
      />
    );

    if (currentPage > 3) {
      pages.push(<span key="ellipsis1">...</span>);
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(pageCount - 1, currentPage + 1); i++) {
      pages.push(
        <PageButton
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={() => table.setPageIndex(i - 1)}
        />
      );
    }

    if (currentPage < pageCount - 2) {
      pages.push(<span key="ellipsis2">...</span>);
    }

    // Always show last page
    if (pageCount > 1) {
      pages.push(
        <PageButton
          key={pageCount}
          page={pageCount}
          isActive={currentPage === pageCount}
          onClick={() => table.setPageIndex(pageCount - 1)}
        />
      );
    }

    return pages;
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllPageRowsSelected(),
              indeterminate: table.getIsSomePageRowsSelected(),
              onChange: table.getToggleAllPageRowsSelectedHandler(),
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
        accessorKey: "buyer",
        header: "Kupujący",
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
        accessorKey: "price",
        header: "Cena szkolenia",
        cell: ({ getValue, row }) => {
          
          return (
            <div className="flex items-center justify-start gap-1">
              {row.original.currency === Currency.TOKENS && <Icons.CoinImage w={16} h={16} />}          
              <span>{formatNumberWithSpaces(getValue())}</span>
              {row.original.currency === Currency.PLN && <p>PLN</p>}
            </div>
          )
        },
      },
      {
        accessorKey: "name",
        header: "Nazwa szkolenia",
      },

      {
        accessorKey: "category",
        header: "Kategoria",
        cell: ({ getValue }) => {
          return <div className="flex items-center justify-start"><MulticolorTitleTile title={getValue()} color={"blue"} /></div>;
        },
      },
      {
        accessorKey: "view",
        displayKey: "view",
        header: () => {
          <></>;
        },
        cell: ({ getValue }) => (
          <Link href={`/admin/merchants/transaction/1`}>
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
    },
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

  const pageCount = table.getPageCount();

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
            {filteredData.length} elementów
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
          {renderPageButtons()}
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
