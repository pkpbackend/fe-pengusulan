import { Fragment, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import { PlusSquare, Eye, Trash, Edit, Printer } from "react-feather";
import moment from "moment";
import Breadcrumbs from "@components/breadcrumbs/custom";
import {
  usePenetapanQuery,
  useDeletePenetapanMutation,
  useExportExcelPenetapanMutation,
} from "../../domains";
import Filter from "./components/Filter";
import { ListTable } from "./components/Table";
import FormPenetapan from "./components/Form";
import sweetalert from "@src/utility/sweetalert";
import { useSelector } from "react-redux";

const PENETAPAN_CREATE_ACTION_CODE = "penetapan_create";
const PENETAPAN_UPDATE_ACTION_CODE = "penetapan_update";
const PENETAPAN_DELETE_ACTION_CODE = "penetapan_delete";

const List = (props) => {
  console.log("DEBUG ~ file: index.js:35 ~ List ~ props:", props);
  const acl = useSelector((state) => state.auth.user?.Role?.accessMenu);

  const [toggle, setToggle] = useState({
    dropdown: false,
  });
  const [formToggle, setFormToggle] = useState({
    DirektoratId: 1,
    open: false,
    isNew: false,
    record: {},
  });

  const [tableAttr, setTableAttr] = useState({
    page: 1,
    pageSize: 10,
  });

  const [deletePenetapan] = useDeletePenetapanMutation();

  const getColumns = useCallback(() => {
    const handleDelete = (row) => {
      sweetalert
        .fire({
          title: "Hapus",
          icon: "question",
          html: `Hapus penetapan dengan <br />No. SK <b>${row.noSk}</b>`,
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Batal",
        })
        .then((result) => {
          if (result.isConfirmed) {
            deletePenetapan(row.id).then(() => {
              sweetalert.fire(
                "Sukses",
                "Berhasil menghapus Penetapan",
                "success"
              );
            });
          }
        })
        .catch((error) => {
          sweetalert.fire("Gagal", "Gagal menghapus Penetapan", "error");
        });
    };
    const columns = [
      {
        Header: "No. SK",
        id: "noSk",
        width: 200,
        accessor: "noSk",
      },
      {
        Header: "Tanggal SK",
        width: 140,
        id: "tanggalSk",
        accessor: (row) => {
          return <span>{moment(row.tanggalSk).format("DD/MM/YYYY")}</span>;
        },
      },
      {
        Header: "Direktorat",
        width: 350,
        id: "direktorat",
        accessor: "Direktorat.name",
      },
      {
        Header: "Provinsi",
        width: 300,
        id: "provinsi",
        accessor: ({ PenetapanUsulans }) => {
          const provinsis = PenetapanUsulans.map(
            ({ Provinsi }) => Provinsi?.nama
          );
          return provinsis.join();
        },
      },
      {
        Header: "Kabupaten/Kota",
        width: 300,
        id: "city",
        accessor: ({ PenetapanUsulans }) => {
          const cities = PenetapanUsulans.map(({ City }) => City?.nama);
          return cities.join();
        },
      },
      {
        Header: "Kecamatan",
        width: 300,
        id: "kecamatan",
        accessor: ({ PenetapanUsulans }) => {
          let found = false;
          const kecamatans = PenetapanUsulans.map(
            ({ Kecamatan }) => {
              if (Kecamatan?.nama) found = true;
              return Kecamatan?.nama;
            },
            [found]
          );
          return found ? kecamatans.join() : "-";
        },
      },
      {
        Header: "Desa",
        width: 300,
        id: "desa",
        accessor: ({ PenetapanUsulans }) => {
          let found = false;
          const desas = PenetapanUsulans.map(
            ({ Desa }) => {
              if (Desa?.nama) found = true;
              return Desa?.nama;
            },
            [found]
          );
          return found ? desas.join() : "-";
        },
      },
      {
        Header: "Total Unit",
        width: 140,
        id: "totalUnit",
        accessor: "totalUnit",
      },
      {
        Header: "Keterangan",
        width: 300,
        id: "keterangan",
        accessor: "keterangan",
      },
      {
        Header: "Action",
        id: "action",
        sticky: "right",
        accessor: (row) => {
          return (
            <div>
              <Link to={`/penetapan/${row.id}`}>
                <Button
                  className="btn-icon"
                  color="primary"
                  size="sm"
                  style={{ display: "inline-block" }}
                >
                  <Eye size={16} />
                </Button>
              </Link>
              {acl.includes(PENETAPAN_UPDATE_ACTION_CODE) ? (
                <Button
                  className="btn-icon"
                  color="primary"
                  size="sm"
                  style={{ display: "inline-block", marginLeft: 4 }}
                  onClick={() =>
                    setFormToggle({
                      open: true,
                      isNew: false,
                      record: row,
                    })
                  }
                >
                  <Edit size={16} />
                </Button>
              ) : null}

              {acl.includes(PENETAPAN_DELETE_ACTION_CODE) ? (
                <Button
                  className="btn-icon"
                  color="danger"
                  size="sm"
                  style={{ display: "inline-block", marginLeft: 4 }}
                  onClick={() => handleDelete(row)}
                >
                  <Trash size={16} />
                </Button>
              ) : null}
            </div>
          );
        },
      },
    ];

    return columns;
  }, [acl, deletePenetapan]);

  const handleTableAttrChange = useCallback((params = {}) => {
    const { page, pageSize } = params;

    let tahun;
    if (params?.conditions?.length === 1) {
      tahun = params.conditions[0].value;
    }

    setTableAttr((val) => ({
      ...val,
      page: page || val.page,
      pageSize: pageSize || val.pageSize,
      // filtered: JSON.stringify(params.conditions),
      tahun,
    }));
  }, []);

  const { data, isFetching } = usePenetapanQuery(tableAttr);

  const [loadingExportExcel, setLoadingExportExcel] = useState(false);
  const [exportExcelPenetapan] = useExportExcelPenetapanMutation();

  const handleExportExcel = () => {
    let filter = {};

    if (tableAttr.filtered) {
      filter = {
        ...filter,
        filtered: tableAttr.filtered,
      };
    }

    if (tableAttr.tahun) {
      filter = {
        ...filter,
        tahun: tableAttr.tahun,
      };
    }

    if (!tableAttr.filtered && !tableAttr.tahun) {
      return sweetalert.fire(
        "Alert",
        "Silahkan pilih setidaknya 1 filter",
        "info"
      );
    }

    setLoadingExportExcel(true);
    exportExcelPenetapan(filter)
      .then((res) => {
        window.open(res.data.s3url);
      })
      .catch(() => {
        sweetalert.fire("Gagal", "Gagal mengexport Excel", "error");
      })
      .finally(() => setLoadingExportExcel(false));
  };

  return (
    <Fragment>
      <Breadcrumbs title="Penetapan" data={[{ title: "Penetapan" }]} />
      <Row>
        <Col sm="12">
          <Filter handleTableAttrChange={handleTableAttrChange} />
        </Col>
        <Col sm="12">
          <Card className="card-snippet">
            <CardHeader>
              <CardTitle>Daftar Penetapan</CardTitle>

              <div>
                <Button
                  onClick={handleExportExcel}
                  disabled={loadingExportExcel}
                  style={{
                    display: "inline-block",
                    marginBottom: 8,
                    marginRight: "1rem",
                  }}
                  size="sm"
                  color="primary"
                  outline
                >
                  {loadingExportExcel ? (
                    <Spinner size="sm" />
                  ) : (
                    <Printer size={14} />
                  )}
                  &nbsp;Export Excel
                </Button>
                {acl.includes(PENETAPAN_CREATE_ACTION_CODE) ? (
                  <Dropdown
                    style={{ display: "inline-block" }}
                    isOpen={toggle.dropdown}
                    toggle={() => {
                      setToggle((val) => ({
                        ...val,
                        dropdown: !val.dropdown,
                      }));
                    }}
                    size="sm"
                  >
                    <DropdownToggle color="primary" name="dropdown" caret>
                      <PlusSquare size={14} /> Tambah Penetapan
                    </DropdownToggle>
                    <DropdownMenu style={{ width: 180 }}>
                      <DropdownItem
                        style={{ width: "100%" }}
                        onClick={() => {
                          setFormToggle({
                            DirektoratId: 1,
                            open: true,
                            isNew: true,
                          });
                        }}
                      >
                        Rumah Susun
                      </DropdownItem>
                      <DropdownItem
                        style={{ width: "100%" }}
                        onClick={() => {
                          setFormToggle({
                            DirektoratId: 2,
                            open: true,
                            isNew: true,
                          });
                        }}
                      >
                        Rumah Khusus
                      </DropdownItem>
                      <DropdownItem
                        style={{ width: "100%" }}
                        onClick={() => {
                          setFormToggle({
                            DirektoratId: 3,
                            open: true,
                            isNew: true,
                          });
                        }}
                      >
                        Rumah Swadaya
                      </DropdownItem>

                      <DropdownItem
                        style={{ width: "100%" }}
                        onClick={() => {
                          setFormToggle({
                            DirektoratId: 4,
                            open: true,
                            isNew: true,
                          });
                        }}
                      >
                        PSU Rumah Umum
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ) : null}
              </div>
            </CardHeader>
            <ListTable
              columns={getColumns()}
              data={data || {}}
              isFetching={isFetching}
              tableAttr={tableAttr}
              handleTableAttrChange={handleTableAttrChange}
            />
            <FormPenetapan
              toggle={formToggle}
              onClose={() => setFormToggle({ open: false })}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default List;
