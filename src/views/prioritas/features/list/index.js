// ** React Imports
import { Fragment, useCallback, useState } from "react";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs/custom";
import { TIPE_USULAN } from "@constants/usulan";
import Filter from "./components/Filter";
import { ListTable } from "./components/Table";

import {
  useJenisPrioritasQuery,
  useLampiranPrioritasDokumenMutation,
  usePrioritasQuery,
  useRangkaianProgramPrioritasQuery,
} from "../../domains/prioritas";

// ** Third Party Components
import _ from "lodash";
import { Check, Edit, X } from "react-feather";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import ExportExcelButton from "./components/ExportExcelButton";
import Details from "./components/modals/Details";
import EditChecklist from "./components/modals/EditChecklist";
import { useSelector } from "react-redux";

const RenderRecommendationListItem = ({
  children,
  usulanId,
  prioritasJenis,
}) => {
  const [lampiranPrioritasDokumen, resultLampiranPrioritasDokumen] =
    useLampiranPrioritasDokumenMutation();

  const handleLinkClick = async () => {
    try {
      // Lakukan pengambilan data lampiranPrioritasDokumen berdasarkan id dan jenisPrioritas
      const lampiranData = await lampiranPrioritasDokumen({
        id: usulanId,
        jenisPrioritas: prioritasJenis,
      });
      const uploadFiles = lampiranData.data;
      if (uploadFiles?.length > 0) {
        const lastUploadedFile = uploadFiles.slice(-1)?.[0];
        if (lastUploadedFile?.url) {
          window.open(lastUploadedFile?.url, "_blank", "noreferrer");
        }
      }
    } catch (error) {
      console.error("Error fetching lampiranData:", error);
    }
  };
  return (
    <li
      style={{ cursor: "pointer", marginBottom: "12px" }}
      onClick={handleLinkClick}
    >
      <Button
        color="link"
        disabled={resultLampiranPrioritasDokumen.isLoading}
        style={{
          textDecoration: "underline",
          padding: "0 1rem",
          textAlign: "left",
        }}
      >
        {children}
        {resultLampiranPrioritasDokumen.isLoading ? (
          <Spinner size="sm" style={{ marginLeft: "0.5rem" }} />
        ) : null}
      </Button>
    </li>
  );
};

const PRIORITAS_UPDATE_ACTION_CODE = "prioritas_update";

const List = () => {
  const acl = useSelector((state) => state.auth.user?.Role?.accessMenu);

  // ** local state
  const [tableAttr, setTableAttr] = useState({
    page: 1,
    pageSize: 10,
  });

  const [toggleModalEdit, setToggleModalEdit] = useState({
    open: false,
    data: null,
  });

  const [toggleModalDetail, setToggleModalDetail] = useState({
    open: false,
    data: null,
  });

  // ** queries
  const { data, isFetching } = usePrioritasQuery(tableAttr);
  const { data: resRangkaianProgram } = useRangkaianProgramPrioritasQuery();
  const { data: resJenis } = useJenisPrioritasQuery();

  const getColumns = useCallback(() => {
    const columns = [
      {
        Header: "No Usulan",
        sticky: "left",
        width: 200,
        accessor: (row) => {
          return (
            <span
              className="span-link"
              onClick={() => {
                setToggleModalDetail({
                  open: true,
                  data: row,
                });
              }}
            >
              {row?.noUsulan}
            </span>
          );
        },
      },
      {
        Header: "Jenis Bantuan",
        id: "jenisBantuan",
        width: 350,
        accessor: (row) => {
          return (
            <span>
              {_.find(TIPE_USULAN, { direktorat: row.DirektoratId })?.name}
            </span>
          );
        },
      },
      {
        Header: "Provinsi",
        accessor: "Provinsi.nama",
        width: 250,
      },
      {
        Header: "Kabupaten",
        accessor: "City.nama",
        width: 250,
      },
      {
        Header: "Penerima Manfaat",
        accessor: "PenerimaManfaat.tipe",
        width: 300,
      },
      {
        Header: "Rekomendasi Usulan",
        width: 410,
        accessor: (row) => {
          const rekomendasi = row?.prioritasJenis?.map((x, index) => {
            for (const key of Object.keys(resJenis || {})) {
              if (Number(x) === Number(resJenis?.[key]?.keyPrioritas)) {
                return resJenis?.[key]?.label || "";
              }
            }
            return ""; // Handle jika tidak ada label yang cocok
          });

          return (
            <ol>
              {rekomendasi?.map((recomendation, i) => (
                <RenderRecommendationListItem
                  key={i}
                  usulanId={row.id}
                  prioritasJenis={row.prioritasJenis[i]}
                >
                  {recomendation}
                </RenderRecommendationListItem>
              ))}
            </ol>
          );
        },
      },

      // list di hide
      // {
      //   Header: "Rangkaian Pemrograman",
      //   width: 250,
      //   accessor: (row) => {
      //     // eslint-disable-next-line array-callback-return
      //     const rekomendasi = row?.prioritasRangkaianPemrograman?.map((x) => {
      //       for (const key of Object.keys(resRangkaianProgram || {})) {
      //         if (Number(x) === Number(key)) {
      //           return resRangkaianProgram[key] || "";
      //         }
      //       }
      //     });
      //     return (
      //       <ol>
      //         {rekomendasi?.map((x, i) => (
      //           <li key={i}>{x}</li>
      //         ))}
      //       </ol>
      //     );
      //   },
      // },
    ];

    for (const key of Object.keys(resRangkaianProgram || {})) {
      columns.push({
        Header: `CRP${key}`,
        id: `cl-${key}`,
        tooltip: resRangkaianProgram[key],
        width: 70,
        accessor: (row) => {
          const value = row?.prioritasRangkaianPemrograman?.filter(
            (x) => Number(x) === Number(key)
          )?.[0];
          if (Boolean(value)) {
            return (
              <div>
                <Check size={16} color="green" />
              </div>
            );
          } else {
            return (
              <div>
                <X size={16} color="red" />
              </div>
            );
          }
        },
      });
    }
    if (acl.includes(PRIORITAS_UPDATE_ACTION_CODE)) {
      columns.push({
        Header: "Aksi",
        id: "act",
        sticky: "right",
        width: 100,
        accessor: (row) => {
          return (
            <div>
              <Button
                size="sm"
                className="btn-icon"
                color="primary"
                onClick={() => {
                  setToggleModalEdit({
                    open: true,
                    data: row,
                  });
                }}
              >
                <Edit size={16} />
              </Button>
            </div>
          );
        },
      });
    }
    return columns;
  }, [acl, resJenis, resRangkaianProgram]);

  const handleTableAttrChange = useCallback((params = {}) => {
    const { filtered = null, sorted = null, page, pageSize } = params;

    setTableAttr((val) => ({
      ...val,
      page: page || val.page,
      pageSize: pageSize || val.pageSize,
      filtered,
      sorted,
    }));
  }, []);

  return (
    <Fragment>
      <Breadcrumbs title="Prioritas" data={[{ title: "Prioritas" }]} />
      <Row>
        <Col sm="12">
          <Filter handleTableAttrChange={handleTableAttrChange} />
        </Col>
        <Col sm="12">
          <Card className="card-snippet">
            <CardHeader>
              <CardTitle>Data Usulan Prioritas</CardTitle>
              <ExportExcelButton filtered={tableAttr} />
            </CardHeader>
            <ListTable
              columns={getColumns()}
              data={data || {}}
              isFetching={isFetching}
              tableAttr={tableAttr}
              handleTableAttrChange={handleTableAttrChange}
            />
          </Card>
        </Col>
      </Row>

      {toggleModalEdit.open && (
        <EditChecklist
          toggle={toggleModalEdit}
          setToggle={setToggleModalEdit}
        />
      )}

      {toggleModalDetail.open && (
        <Details toggle={toggleModalDetail} setToggle={setToggleModalDetail} />
      )}
    </Fragment>
  );
};

export default List;
