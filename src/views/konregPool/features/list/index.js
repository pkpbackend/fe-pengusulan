// ** React Imports
import { Fragment, useCallback, useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components

import Breadcrumbs from "@components/breadcrumbs/custom";
import Filter from "./components/Filter";
import { ListTable } from "./components/Table";

import { useKonregPoolQuery } from "../../domains";

// ** Third Party Components
import moment from "moment";
import { Database, Eye } from "react-feather";
import { Button, Card, CardHeader, CardTitle, Col, Row } from "reactstrap";

import ExportExcelButton from "./components/ExportExcelButton";
import { useSyncKonregMutation } from "../../../pengusulan/domains";
import sweetalert from "@src/utility/sweetalert";
import { useSelector } from "react-redux";

const KONREG_BULK_SYNC_ACTION_CODE = "konreg_bulk_sync";
const KONREG_EXPORT_EXCEL_ACTION_CODE = "konreg_export_excel";

const List = () => {
  const acl = useSelector((state) => state.auth.user?.Role?.accessMenu);

  // ** local state
  const [tableAttr, setTableAttr] = useState({
    conditions: null,
    page: 1,
    pageSize: 10,
  });

  // ** queries
  const [syncKonreg] = useSyncKonregMutation();
  const { data, isFetching, isLoading } = useKonregPoolQuery(tableAttr);
  const getColumns = useCallback(() => {
    const columns = [
      {
        Header: "Tanggal Surat",
        id: "tglSurat",
        width: 170,
        accessor: (row) => {
          return (
            <span>{moment(row.Usulan.tglSurat).format("DD/MM/YYYY")}</span>
          );
        },
      },
      {
        Header: "Tanggal Usulan",
        id: "createdAt",
        width: 180,
        accessor: (row) => {
          if (!row?.Usulan.createdAt) {
            return <span>-</span>;
          } else {
            return (
              <span>{moment(row.Usulan.createdAt).format("DD/MM/YYYY")}</span>
            );
          }
        },
      },
      {
        Header: "Tahun Anggaran",
        id: "tahunProposal",
        width: 180,
        accessor: (row) => {
          if (row.Usulan.DirektoratId === 4) {
            return <span>{row.Usulan.tahunBantuanPsu}</span>;
          } else {
            return <span>{row.Usulan.tahunProposal}</span>;
          }
        },
      },
      {
        Header: "Tahun Konreg",
        id: "tahunKonreg",
        width: 180,
        accessor: "tahun",
      },
      {
        Header: "Status Konreg",
        id: "statusKonreg",
        width: 180,
        accessor: (row) => {
          let { status } = row;
          return (
            <div>
              <span>{status ? status.toUpperCase() : "-"}</span>
            </div>
          );
        },
      },
      {
        Header: "Konreg ID",
        accessor: "Usulan.siproId",
        id: "siproId",
        width: 200,
      },
      {
        Header: "Kegiatan",
        accessor: "Usulan.Direktorat.name",
        id: "kegiatan",
        width: 280,
      },
      {
        Header: "Uraian Pekerjaan",
        accessor: "Usulan.uraian",
        id: "uraian",
        width: 200,
      },
      {
        Header: "Jumlah Unit",
        id: "jumlahUnit",
        width: 150,
        accessor: (row) => {
          let { Usulan } = row;
          return (
            <div className="text-right">
              <span>{Number(Usulan.jumlahUnit || 0).toLocaleString()}</span>
            </div>
          );
        },
      },
      {
        Header: "KRO",
        accessor: "Usulan.ProOutput.nama",
        id: "kro",
        width: 400,
      },
      {
        Header: "RO",
        accessor: "Usulan.ProSubOutput.nama",
        id: "ro",
        width: 400,
      },
      {
        Header: "Anggaran",
        id: "anggaran",
        width: 200,
        accessor: (row) => {
          let { Usulan } = row;
          return (
            <div className="text-right">
              <span>{Number(Usulan.anggaran || 0).toLocaleString()}</span>
            </div>
          );
        },
      },
      {
        Header: "User Pengusul",
        id: "userPengusul",
        accessor: "Usulan.User.nama",
        width: 250,
      },
      {
        Header: "Provinsi",
        id: "provinsi",
        accessor: "Usulan.Provinsi.nama",
        width: 250,
      },
      {
        Header: "Kabupaten",
        id: "kabupaten",
        accessor: "Usulan.City.nama",
        width: 250,
      },
      {
        Header: "Nama PIC Pengusul",
        id: "pengusul",
        accessor: "Usulan.pengusul",
        width: 200,
      },
      {
        Header: "Instansi Pengusul",
        id: "instansi",
        accessor: "Usulan.instansi",
        width: 200,
      },
      {
        Header: "Penerima Manfaat",
        id: "penerimaManfaat",
        accessor: "Usulan.PenerimaManfaat.tipe",
        width: 200,
      },
      {
        Header: "Action",
        id: "action",
        sticky: "right",
        width: 105,
        accessor: (row) => {
          return (
            <div className="d-flex justify-content-center">
              <Link
                to={`/konregpool/${row.Usulan.id}`}
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
    const { conditions = null, page, pageSize } = params;

    setTableAttr((val) => ({
      ...val,
      page: page || val.page,
      pageSize: pageSize || val.pageSize,
      conditions,
    }));
  }, []);
  async function handleSyncKonreg() {
    sweetalert
      .fire({
        title: "Sync Pengusulan ke Konreg?",
        text: "Apakah anda yakin mensinkronasi pengusulan sesuai data dalam table?",
        showLoaderOnConfirm: true,
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Ya",
        preConfirm: async () => {
          try {
            await syncKonreg("all").unwrap();
            return true;
          } catch (error) {
            sweetalert.showValidationMessage(`${error?.data?.message}`);
          }
        },
        allowOutsideClick: () => !sweetalert.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          sweetalert.fire(
            "Sukses",
            "Berhasil mensinkronasi pengusulan sesuai data dalam table.",
            "success"
          );
        }
      });
  }
  return (
    <Fragment>
      <Breadcrumbs title="Konreg Pool" data={[{ title: "Konreg Pool" }]} />
      <Row>
        <Col sm="12">
          <Filter handleTableAttrChange={handleTableAttrChange} />
        </Col>
        <Col sm="12">
          <Card className="card-snippet">
            <CardHeader>
              <CardTitle>Daftar Konreg Pool</CardTitle>
              <div className="d-flex">
                {acl.includes(KONREG_BULK_SYNC_ACTION_CODE) ? (
                  <Button
                    style={{ marginRight: "1rem" }}
                    size="sm"
                    onClick={handleSyncKonreg}
                    color="success"
                  >
                    <Database size={14} /> Bulk Sync Konreg
                  </Button>
                ) : null}
                {acl.includes(KONREG_EXPORT_EXCEL_ACTION_CODE) ? (
                  <ExportExcelButton filtered={tableAttr} />
                ) : null}
              </div>
            </CardHeader>
            <ListTable
              columns={getColumns()}
              data={data || {}}
              isFetching={isFetching || isLoading}
              tableAttr={tableAttr}
              handleTableAttrChange={handleTableAttrChange}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default List;
