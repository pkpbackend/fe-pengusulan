import styled from "styled-components"
import { useBlockLayout, useTable, useResizeColumns } from "react-table"
import { Table, Spinner } from "reactstrap"
import { useSticky } from "react-table-sticky"
import ReactPaginate from "react-paginate"

const Styles = styled.div`
  .table {
    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      position: relative;

      :last-child {
        border-right: 0;
      }
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
        background-color: white;
      }

      [data-sticky-last-left-td] {
        background-color: white;
        box-shadow: 2px 0px 2px #ccc;
      }

      [data-sticky-first-right-td] {
        background-color: white;
        box-shadow: -2px 0px 2px #ccc;
      }
    }

    .resizer {
      display: inline-block;
      background: #626262;
      width: 2px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: translateX(50%);
      z-index: 1;
      ${"" /* prevents from scrolling while dragging on touch devices */}
      touch-action:none;

      &.isResizing {
        background: red;
      }
    }
  }
`

export const ListTable = (props) => {
  const { columns, data, isFetching, tableAttr, handleTableAttrChange } = props

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: data?.data || []
      },
      useBlockLayout,
      useResizeColumns,
      useSticky
    )

  const handlePagination = (page) => {
    handleTableAttrChange({
      page: page.selected + 1
    })
  }

  // const pageCount = data?.count ? Math.ceil(data.count / tableAttr.pageSize) : 1
  const pageCount = data?.pages

  // Render the UI for your table
  return (
    <Styles>
      <div>
        <Table responsive bordered className="sticky" {...getTableProps()}>
          <thead className="header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      {...column.getHeaderProps()}
                      className={`text-truncate`}
                    >
                      {column.render("Header")}
                      {!column.sticky && (
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${
                            column.isResizing ? "isResizing" : ""
                          }`}
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          {!isFetching && (
            <tbody {...getTableBodyProps()} className="body">
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={`text-truncate`}
                        >
                          {cell.render("Cell")}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          )}
        </Table>
        {isFetching && (
          <div
            className="p-4"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner type="grow" color="primary" />
            <Spinner type="grow" color="primary" />
            <Spinner type="grow" color="primary" />
          </div>
        )}
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          forcePage={tableAttr.page - 1}
          onPageChange={handlePagination}
          pageCount={pageCount}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName="active"
          pageClassName="page-item"
          breakClassName="page-item"
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextClassName="page-item next-item"
          previousClassName="page-item prev-item"
          containerClassName={
            "pagination react-paginate separated-pagination pagination-sm justify-content-center pe-1 mt-1"
          }
        />
      </div>
    </Styles>
  )
}
