// ** React Imports
import { Fragment, useCallback, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs/custom";
import { TIPE_USULAN } from "@constants/usulan";
import { useUsulanQuery } from "../../domains";
import Filter from "./components/Filter";
import { ListTable } from "./components/Table";

// ** Third Party Components
import _ from "lodash";
import moment from "moment";
import { Eye, PlusSquare } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  PopoverBody,
  PopoverHeader,
  Row,
  UncontrolledPopover,
} from "reactstrap";
import ExportExcelButton from "./components/ExportExcelButton";
import getStatusPengusulan from "./shared/getStatusPengusulan";
import getKonregPoolStatus from "./shared/getKonregPoolStatus";
import { useSelector } from "react-redux";

const RenderStatus = ({ data }) => {
  const { currentStep, steps } = getStatusPengusulan(data);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Button
        id={`Popover-status-${data.id}`}
        size="sm"
        color={
          currentStep.status === "finish"
            ? "success"
            : currentStep.status === "revision"
            ? "danger"
            : "secondary"
        }
        className="badge"
      >
        {currentStep.label}
      </Button>

      <UncontrolledPopover
        target={`Popover-status-${data.id}`}
        trigger="focus"
        placement="top"
      >
        <PopoverHeader>Status</PopoverHeader>
        <PopoverBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {steps.map((step, index) => {
              let color = "secondary";
              if (step.status === "finish") {
                color = "success";
              }
              if (step.status === "revision") {
                color = "danger";
              }
              return (
                <div key={step.id}>
                  <Badge color={color}>{step.title}</Badge>
                </div>
              );
            })}
          </div>
        </PopoverBody>
      </UncontrolledPopover>
    </div>
  );
};
const defaultFiltered = [
  { id: "in$statusTerkirim", value: ["terkirim", "revisi"] },
];

const USULAN_CREATE_ACTION_CODE = "usulan_create";

const List = () => {
  const acl = useSelector((state) => state.auth.user?.Role?.accessMenu);

  const navigate = useNavigate();

  // ** local state
  const [tableAttr, setTableAttr] = useState({
    filtered: defaultFiltered,
    page: 1,
    pageSize: 10,
  });

  // ** queries
  const { data, isFetching, isLoading } = useUsulanQuery(tableAttr);

  const getColumns = useCallback(() => {
    const columns = [
      {
        Header: "Tanggal Surat",
        id: "tglSurat",
        accessor: (row) => moment(row.tglSurat).format("DD/MM/YYYY"),
        width: 170,
      },
      {
        Header: "Tanggal Usulan",
        id: "createdAt",
        width: 180,
        accessor: (row) => {
          if (row.direktif) {
            return "-";
          } else {
            return moment(row.createdAt).format("DD/MM/YYYY");
          }
        },
      },
      {
        Header: "Tahun Anggaran",
        id: "tahunProposal",
        width: 180,
        accessor: (row) =>
          row.DirektoratId === 4 ? row.tahunBantuanPsu : row.tahunProposal,
      },
      {
        Header: "Jenis Bantuan",
        id: "Direktorat.name",
        width: 330,
        accessor: (row) =>
          row.DirektoratId
            ? _.find(TIPE_USULAN, { direktorat: row.DirektoratId })?.name
            : "-",
      },
      {
        Header: "Jumlah Unit",
        id: "jumlahUnit",
        width: 150,
        accessor: ({ jumlahUsulan, jumlahUnit, DirektoratId }) =>
          DirektoratId === 4
            ? Number(jumlahUsulan).toLocaleString()
            : Number(jumlahUnit).toLocaleString(),
        Cell: ({ value }) => {
          return <div className="text-end">{value}</div>;
        },
      },
      {
        Header: "Uraian Pekerjaan",
        accessor: "uraian",
        width: 200,
      },
      {
        Header: "KRO",
        accessor: "ProOutput.nama",
      },
      {
        Header: "RO",
        accessor: "ProSubOutput.nama",
      },
      {
        Header: "Anggaran",
        id: "anggaran",
        width: 180,
        accessor: (row) => Number(row?.anggaran ?? 0).toLocaleString(),
        Cell: ({ value }) => <div className="text-end">{value}</div>,
      },
      {
        Header: "Provinsi",
        accessor: "Provinsi.nama",
      },
      {
        Header: "Kabupaten",
        accessor: "City.nama",
      },
      {
        Header: "Kecamatan",
        id: "Kecamatan.nama",
        accessor: ({ DirektoratId, Kecamatan }) =>
          DirektoratId === 1 || DirektoratId === 4
            ? Kecamatan
              ? Kecamatan.nama
              : "-"
            : "Tersebar",
      },
      {
        Header: "Desa",
        id: "Desa.nama",
        accessor: ({ DirektoratId, Desa }) =>
          DirektoratId === 1 || DirektoratId === 4
            ? Desa
              ? Desa.nama
              : "-"
            : "Tersebar",
      },
      {
        Header: "Nama PIC Pengusul",
        accessor: "picPengusul",
      },
      {
        Header: "Penerima Manfaat",
        accessor: "PenerimaManfaat.tipe",
      },
      {
        Header: "User Pengusul",
        accessor: "User.fullName",
      },
      {
        Header: "Instansi Pengusul",
        accessor: "instansi",
      },
      {
        Header: "Status",
        id: "status",
        sticky: "right",
        align: "center",
        Cell: ({ row }) => <RenderStatus data={row.original} />,
      },
      {
        Header: "Konreg Pool",
        id: "konregPool",
        align: "center",
        sticky: "right",
        width: 150,
        Cell: ({ row }) => {
          const status = getKonregPoolStatus(row.original);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Badge
                color={
                  status === "Sync"
                    ? "success"
                    : status === "Pool"
                    ? "primary"
                    : "secondary"
                }
              >
                {status}
              </Badge>
            </div>
          );
        },
      },
      {
        Header: "Aksi",
        id: "action",
        accessor: "id",
        sticky: "right",
        width: 100,
        showTitle: false,
        Cell: ({ value }) => {
          return (
            <div>
              <Link
                to={`/pengusulan/${value}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="btn-icon" color="primary" size="sm">
                  <Eye size={16} />
                </Button>
              </Link>
            </div>
          );
        },
      },
    ];

    return columns;
  }, []);

  const handleTableAttrChange = useCallback((params = {}) => {
    const { filtered = null, page, pageSize } = params;
    setTableAttr((val) => {
      return {
        ...val,
        page: page || val.page,
        pageSize: pageSize || val.pageSize,
        filtered,
      };
    });
  }, []);

  return (
    <Fragment>
      <Breadcrumbs title="Pengusulan" data={[{ title: "Pengusulan" }]} />
      <Row>
        <Col sm="12">
          <Filter
            loading={isFetching || isLoading}
            handleTableAttrChange={({ filtered, ...rest }) => {
              handleTableAttrChange({
                filtered: filtered
                  ? _.uniqBy([...filtered, ...defaultFiltered], "id")
                  : defaultFiltered,
                ...rest,
              });
            }}
          />
        </Col>
        <Col sm="12">
          <Card className="card-snippet">
            <CardHeader>
              <CardTitle>Daftar Pengusulan</CardTitle>
              <Row className="gy-1 gx-1 align-items-center">
                <Col xs="auto">
                  <div
                    className="form-check form-switch"
                    style={{ marginRight: "1.5rem" }}
                  >
                    <Input
                      id="list-filter-status-expired"
                      type="switch"
                      role="switch"
                      checked={tableAttr?.filtered
                        ?.find((filter) => filter.id === "in$statusTerkirim")
                        ?.value?.includes("expired")}
                      onChange={(val) => {
                        let prev = [
                          ...(tableAttr?.filtered ? tableAttr?.filtered : []),
                        ];

                        const findIndex = prev.findIndex(
                          (filter) => filter.id === "in$statusTerkirim"
                        );
                        if (findIndex === -1) {
                          prev.push({
                            id: "in$statusTerkirim",
                            value: ["expired"],
                          });
                        } else {
                          const currentValue = prev[findIndex].value;
                          const filterStatus = val.target.checked
                            ? currentValue.filter(
                                (status) =>
                                  status !== "terkirim" && status !== "revisi"
                              )
                            : currentValue.filter(
                                (status) => status !== "expired"
                              );
                          prev[findIndex] = {
                            id: "in$statusTerkirim",
                            value: val.target.checked
                              ? [...filterStatus, "expired"]
                              : [
                                  ...(filterStatus.length > 0
                                    ? filterStatus
                                    : ["terkirim", "revisi"]),
                                ],
                          };
                        }
                        handleTableAttrChange({
                          filtered: prev,
                          page: 1,
                        });
                      }}
                      disabled={isFetching || isLoading}
                    />

                    <Label for="list-filter-status-revisi" check>
                      Tampilkan expired
                    </Label>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="form-check form-switch">
                    <Input
                      id="list-filter-status-belum-terkirim"
                      type="switch"
                      role="switch"
                      disabled={isFetching || isLoading}
                      checked={tableAttr?.filtered
                        ?.find((filter) => filter.id === "in$statusTerkirim")
                        ?.value?.includes("belum terkirim")}
                      onChange={(val) => {
                        let prev = [
                          ...(tableAttr?.filtered ? tableAttr?.filtered : []),
                        ];
                        const findIndex = prev.findIndex(
                          (filter) => filter.id === "in$statusTerkirim"
                        );
                        if (findIndex === -1) {
                          prev.push({
                            id: "in$statusTerkirim",
                            value: ["belum terkirim"],
                          });
                        } else {
                          const currentValue = prev[findIndex].value;
                          const filterStatus = val.target.checked
                            ? currentValue.filter(
                                (status) =>
                                  status !== "terkirim" && status !== "revisi"
                              )
                            : currentValue.filter(
                                (status) => status !== "belum terkirim"
                              );
                          prev[findIndex] = {
                            id: "in$statusTerkirim",
                            value: val.target.checked
                              ? [...filterStatus, "belum terkirim"]
                              : [
                                  ...(filterStatus.length > 0
                                    ? filterStatus
                                    : ["terkirim", "revisi"]),
                                ],
                          };
                        }
                        handleTableAttrChange({
                          filtered: prev,
                          page: 1,
                        });
                      }}
                    />

                    <Label for="list-filter-status-belum-terkirim" check>
                      Tampilkan belum terkirim
                    </Label>
                  </div>
                </Col>
                <Col xs="auto">
                  <ExportExcelButton filtered={tableAttr} />
                </Col>
                {acl.includes(USULAN_CREATE_ACTION_CODE) ? (
                  <Col xs="auto">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => {
                        navigate("/pengusulan/create");
                      }}
                    >
                      <PlusSquare size={16} /> Tambah Pengusulan
                    </Button>
                  </Col>
                ) : null}
              </Row>
            </CardHeader>
            <ListTable
              columns={getColumns()}
              data={data || {}}
              isFetching={isFetching}
              tableAttr={tableAttr}
              handleTableAttrChange={(props) => {
                handleTableAttrChange({ ...tableAttr, ...props });
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default List;
