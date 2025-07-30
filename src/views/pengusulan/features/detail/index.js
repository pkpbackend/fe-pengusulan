// ** React Imports
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs/custom";
import _ from "lodash";
import {
  useDeleteUsulanMutation,
  useDetailUsulanLocationsQuery,
  useDetailUsulanQuery,
  useSendUsulanMutation,
  useSyncKonregMutation,
  useUsulanVerminQuery,
} from "../../domains";
import {
  useMasterCategoryDocumentQuery,
  useUsulanDocumentQuery,
} from "../../domains/dokumen";
import RukDetail from "./components/details/RukDetail";
import RukPerumahanDetail from "./components/details/RukPerumahanDetail";
import RusunDetail from "./components/details/RusunDetail";
import RususDetail from "./components/details/RususDetail";
import RususSasaranDetail from "./components/details/RususSasaranDetail";
import RuswaDetail from "./components/details/RuswaDetail";
import RuswaSasaranDetail from "./components/details/RuswaSasaranDetail";
import VerminCard from "./components/vermin/VerminCard";
import VerminValidationModal from "./components/vermin/VerminValidationModal";

// ** Third Party Components
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Spinner,
  UncontrolledAccordion,
} from "reactstrap";

import { DIREKTORAT, TYPE_USULAN_ID, TYPE_USULAN_RUK } from "@constants/index";
import { compareSort } from "@src/utility/ObjectHelpers";
import sweetalert from "@src/utility/sweetalert";
import { getUser } from "@utils/LoginHelpers";
import { Edit2, FileText, RefreshCw, Send, Trash2 } from "react-feather";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ModalSendToPenetapan from "./components/ModalSendToPenetapan";
import Comment from "./components/comment/Comment";
import downloadPdfRuk from "./components/details/downloadPdf/downloadPdfRuk";
import downloadPdfRusun from "./components/details/downloadPdf/downloadPdfRusun";
import downloadPdfRusus from "./components/details/downloadPdf/downloadPdfRusus";
import downloadPdfRuswa from "./components/details/downloadPdf/downloadPdfRuswa";
import UsulanProgress from "./components/progress/Progress";
import VerlokCard from "./components/verlok/VerlokCard";
import VertekCard from "./components/vertek/VertekCard";

const StatusAlert = (props) => {
  if (props.statusTerkirim === "belum terkirim") {
    return (
      <Alert color="secondary">
        <div className="alert-body d-flex align-items-center justify-content-center">
          <span className="ms-50 fs-1">Pengusulan Belum Terkirim</span>
        </div>
      </Alert>
    );
  } else if (props.statusTerkirim === "terkirim") {
    return (
      <Alert color="primary">
        <div className="alert-body d-flex align-items-center justify-content-center">
          <span className="ms-50 fs-1">Pengusulan Terkirim</span>
        </div>
      </Alert>
    );
  }
};

function getVerminDocuments({
  masterDocuments,
  verminDocuments,
  jenisData,
  direktif,
  DirektoratId,
  type,
  PenerimaManfaatId,
}) {
  let newDokumen = [];
  masterDocuments = masterDocuments?.map((item) => {
    return (
      item.MasterDokumens &&
      item.MasterDokumens.map((dokumen) => newDokumen.push(dokumen))
    );
  });

  newDokumen = _.filter(newDokumen, (document) => {
    if (DirektoratId === 4) {
      return (
        typeof document.jenisData === "string"
          ? JSON.parse(document.jenisData)
          : []
      ).includes(Number(jenisData));
    }
    return (
      (typeof document.jenisData === "string"
        ? JSON.parse(document.jenisData)
        : []
      ).includes(Number(jenisData)) &&
      JSON.parse(document.jenisDirektif).includes(
        direktif ? Number(1) : Number(0)
      )
    );
  }).map((document) => {
    const verminDocument = _.find(
      verminDocuments,
      (item) => Number(item.MasterDokumenId) === Number(document.id)
    );
    const required = JSON.parse(document?.required);

    const isRequired =
      DirektoratId === 4
        ? Array.isArray(required) &&
          (required?.includes(Number(type)) || required?.includes("all"))
        : Array.isArray(required) &&
          (required?.includes(Number(PenerimaManfaatId)) ||
            required?.includes("all"));

    return {
      ...document,
      isRequired,
      verminDocument: verminDocument || null,
    };
  });

  return newDokumen;
}

const USULAN_CREATE_ACTION_CODE = "usulan_create";
const USULAN_UPDATE_ACTION_CODE = "usulan_update";
const USULAN_DELETE_ACTION_CODE = "usulan_delete";
const USULAN_VERMIN_UPDATE_ACTION_CODE = "usulan_vermin_update";
const USULAN_VERTEK_UPDATE_ACTION_CODE = "usulan_vertek_update";
const USULAN_VERMIN_STATUS_UPDATE_ACTION_CODE = "usulan_vermin_status_update";

const Detail = () => {
  const acl = useSelector((state) => state.auth.user?.Role?.accessMenu);

  let allowSend = false;
  const { user } = getUser();
  const [deleteUsulan] = useDeleteUsulanMutation();
  const [sendToPenetapan, setSendToPenetapan] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  // ** local state
  const [toggleValidasiVermin, setToggleValidasiVermin] = useState(false);

  // ** query
  const {
    data: usulan,
    isFetching,
    error,
  } = useDetailUsulanQuery(params.id, {
    refetchOnMountOrArgChange: true,
  });
  const [sendUsulan] = useSendUsulanMutation();
  const [syncKonreg] = useSyncKonregMutation();

  const { data: locations, isFetching: isFetchingLocations } =
    useDetailUsulanLocationsQuery(params.id, {
      refetchOnMountOrArgChange: true,
    });

  const { data: vermin } = useUsulanVerminQuery(usulan?.id, {
    skip: !usulan?.id,
  });
  const { data: dataVerminDokuments } = useUsulanDocumentQuery(
    {
      model: "Vermin",
      ModelId: vermin?.id,
    },
    { skip: !vermin?.id }
  );

  const {
    data: dataMasterDocuments,
    isLoading: isLoadingMasterDocuments,
    isFetching: isFetchingMasterDocuments,
  } = useMasterCategoryDocumentQuery(
    {
      DirektoratId: usulan?.DirektoratId,
    },
    { skip: !usulan?.DirektoratId }
  );

  const masterDocuments =
    usulan?.DirektoratId === 4
      ? dataMasterDocuments?.data
          .map((kategoriDokumen) => {
            let { MasterDokumens } = kategoriDokumen;
            MasterDokumens = MasterDokumens.filter((dokumen) => {
              let { jenisBantuan } = dokumen;
              if (jenisBantuan) jenisBantuan = JSON.parse(jenisBantuan);
              else jenisBantuan = {};

              // if usulan ruk form 2022 keatas
              if (Object.keys(TYPE_USULAN_RUK).includes(String(usulan.type))) {
                // jika typenya 7 / 8 yaitu typenya pengembang. maka dokumen mereka sama
                const usulanType = [7, 8].includes(Number(usulan.type))
                  ? 7
                  : Number(usulan?.type);
                if (Number(dokumen?.type) === usulanType) return true;

                return false;
              }

              switch (Number(usulan.type)) {
                case TYPE_USULAN_ID.UMUM:
                  if (Number(jenisBantuan.umum) !== 1) return false;
                  break;

                case TYPE_USULAN_ID.SEKALA_BESAR:
                  if (Number(jenisBantuan.sekalaBesar) !== 1) return false;
                  break;

                case TYPE_USULAN_ID.BANTUAN_PSU_KOMUNITAS:
                  if (Number(jenisBantuan.bantuanPsuKomunitas) !== 1)
                    return false;
                  break;

                case TYPE_USULAN_ID.SWADAYA:
                  if (Number(jenisBantuan.swadaya) !== 1) return false;
                  break;

                case null:
                case undefined:
                  if (Number(jenisBantuan.umum) !== 1) return false;
                  break;

                default:
                  break;
              }

              if (Object.keys(jenisBantuan).length < 1) {
                return false;
              }

              return true;
            });
            return {
              ...kategoriDokumen,
              MasterDokumens,
            };
          })
          .map((item) => {
            let { MasterDokumens } = item;
            MasterDokumens = MasterDokumens.sort((a, b) => {
              return compareSort(a, b, "sort");
            });

            return {
              ...item,
              MasterDokumens,
            };
          })
      : dataMasterDocuments?.data;

  function handleDeleteUsulan() {
    sweetalert
      .fire({
        title: "Konfirmasi Hapus",
        text: "Apakah anda yakin ingin hapus usulan ini?",
        type: "warning",
        icon: "info",
        confirmButtonText: "Ya",
        confirmButtonColor: "#d33",
        showCancelButton: true,
        cancelButtonText: "Batal",
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return deleteUsulan(usulan.id)
            .then(() => true)
            .catch((error) => {
              sweetalert.showValidationMessage(`Request failed: ${error}`);
            });
        },
        allowOutsideClick: () => !sweetalert.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          sweetalert.fire(
            "Berhasil",
            "Berhasil menghapus usulan...",
            "success"
          );
          navigate(`/pengusulan/list`);
        }
      });
  }

  function getDocumentPdf(base64 = false) {
    const documents = getVerminDocuments({
      masterDocuments,
      verminDocuments: dataVerminDokuments,
      jenisData: usulan.DirektoratId === 4 ? [1] : usulan.jenisData,
      direktif: usulan.direktif,
      DirektoratId: usulan.DirektoratId,
      type: usulan.type,
      PenerimaManfaatId: usulan.PenerimaManfaatId,
    });
    if (usulan.DirektoratId === 1) {
      return downloadPdfRusun({
        return64: base64,
        usulan,
        documents,
      });
    }

    if (usulan.DirektoratId === 2) {
      return downloadPdfRusus({
        return64: base64,
        usulan,
        documents,
        locations,
        isAdmin: user?.Role?.admin,
      });
    }
    if (usulan.DirektoratId === 3) {
      return downloadPdfRuswa({
        return64: base64,
        usulan,
        documents,
        locations: usulan.Sasarans,
      });
    }
    if (usulan.DirektoratId === 4) {
      return downloadPdfRuk({
        return64: base64,
        usulan,
        documents,
      });
    }
  }

  async function handleSendUsulan() {
    sweetalert
      .fire({
        title: "Konfirmasi mengirim pengusulan!",
        text: "Pastikan data dan dokumen-dokumen yang dimasukan adalah benar, setelah terkirim data/dokumen tidak bisa diedit lagi",
        showLoaderOnConfirm: true,
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Kirim",
        preConfirm: async () => {
          try {
            await sendUsulan(usulan.id).unwrap();
            return true;
          } catch (error) {
            sweetalert.showValidationMessage(`${error?.data?.message}`);
          }
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          sweetalert.fire("Sukses", "Berhasil mengirim pengusulan", "success");
        }
      });
  }

  async function handleSyncKonreg() {
    sweetalert
      .fire({
        title: "Sinkronasi konreg?",
        text: "Apakah anda yakin ingin sinkronasi ini?",
        showLoaderOnConfirm: true,
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Iya",
        preConfirm: async () => {
          try {
            await syncKonreg(usulan.id).unwrap();
            return true;
          } catch (error) {
            sweetalert.showValidationMessage(`${error?.data?.message}`);
          }
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          sweetalert.fire(
            "Sukses",
            "Berhasil sinkronasi pengusulan",
            "success"
          );
        }
      });
  }

  if (error?.status === 404) {
    sweetalert
      .fire({
        title: "404 Not Found",
        text: "Data Pengusulan tidak ditemukan",
        icon: "error",
        confirmButtonText: "Kembali",
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate("/pengusulan/list");
        }
      });
  }

  const documents = getVerminDocuments({
    masterDocuments,
    verminDocuments: dataVerminDokuments,
    jenisData: usulan?.DirektoratId === 4 ? [1] : usulan?.jenisData,
    direktif: usulan?.direktif,
    DirektoratId: usulan?.DirektoratId,
    type: usulan?.type,
    PenerimaManfaatId: usulan?.PenerimaManfaatId,
  });

  allowSend =
    documents.length > 0 &&
    documents.filter((doc) => {
      return doc?.isRequired && !doc.verminDocument;
    }).length === 0;

  return (
    <Fragment>
      <Breadcrumbs
        title="Detail Pengusulan"
        data={[
          { title: "Pengusulan", link: `/pengusulan/list` },
          { title: "Detail Pengusulan" },
        ]}
      />
      <Row>
        {usulan ? (
          <Col sm="12">
            <UsulanProgress data={usulan} />
          </Col>
        ) : null}

        <Col sm="12">
          <StatusAlert
            statusTerkirim={usulan?.statusTerkirim || "belum terkirim"}
          />
        </Col>
      </Row>
      {usulan && (
        <div
          className="mb-1 d-flex"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div className="d-flex">
            {/* {acl.includes(USULAN_VERMIN_UPDATE_ACTION_CODE) ? (
              <Button onClick={handleSyncKonreg} color="success">
                <RefreshCw size={14} /> Sync Konreg
              </Button>
            ) : null} */}
            {acl.includes(USULAN_VERMIN_STATUS_UPDATE_ACTION_CODE) ? (
              <>
                {usulan?.statusVertek === 1 &&
                  usulan?.statusPenetapanId === null && (
                    <>
                      {usulan?.DirektoratId === DIREKTORAT.SWADAYA &&
                      [2, 3, 4].includes(Number(usulan?.jenisData)) ? null : (
                        <Button
                          onClick={() => {
                            setSendToPenetapan(true);
                          }}
                          className="ms-1"
                          color="primary"
                        >
                          <Send size={14} /> Kirim ke Penetapan
                        </Button>
                      )}
                    </>
                  )}
              </>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {acl.includes(USULAN_UPDATE_ACTION_CODE) ? (
              <span
                className="btn btn-secondary btn-sm"
                tabIndex={-1}
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return getDocumentPdf();
                }}
                style={{ marginLeft: 8 }}
              >
                <FileText size={14} />
                Download PDF
              </span>
            ) : null}
            {acl.includes(USULAN_DELETE_ACTION_CODE) ? (
              <Button color="danger" onClick={handleDeleteUsulan}>
                <Trash2 size={14} /> Hapus Usulan
              </Button>
            ) : null}
          </div>
        </div>
      )}
      {usulan && (
        <Row className="mb-2">
          <Col sm="5" className="mb-2">
            <Row>
              <Col md="12" className="mb-2">
                <UncontrolledAccordion
                  className="shadow"
                  style={{ borderRadius: "0.428rem" }}
                  defaultOpen="data-pengusulan"
                >
                  <AccordionItem>
                    <AccordionHeader
                      targetId="data-pengusulan"
                      className="title-accordion-text"
                    >
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{ width: "100%", paddingRight: "1rem" }}
                      >
                        Data Pengusulan
                        {usulan && vermin ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            {(usulan.statusTerkirim === "belum terkirim" ||
                              usulan.statusTerkirim === "revisi") &&
                              vermin.status !== 1 &&
                              acl.includes(USULAN_UPDATE_ACTION_CODE) && (
                                <Link
                                  className="btn btn-primary btn-sm"
                                  to={`/pengusulan/${usulan?.id}/edit`}
                                  title="Edit"
                                >
                                  <Edit2 size={14} />
                                </Link>
                              )}
                          </div>
                        ) : null}
                      </div>
                    </AccordionHeader>
                    <AccordionBody accordionId="data-pengusulan">
                      <Row>
                        <Col md="12">
                          {isFetching && <Spinner />}
                          {!isFetching &&
                            usulan &&
                            usulan?.DirektoratId === 1 && (
                              <RusunDetail usulan={usulan} />
                            )}
                          {!isFetching &&
                            usulan &&
                            usulan?.DirektoratId === 2 && (
                              <RususDetail usulan={usulan} />
                            )}
                          {!isFetching &&
                            usulan &&
                            usulan?.DirektoratId === 3 && (
                              <RuswaDetail usulan={usulan} />
                            )}
                          {!isFetching &&
                            usulan &&
                            usulan?.DirektoratId === 4 && (
                              <RukDetail usulan={usulan} />
                            )}
                        </Col>
                      </Row>
                    </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
              </Col>
              <Col md="12">
                <Comment
                  usulanId={usulan?.id}
                  comments={usulan?.CommentUsulans}
                />
              </Col>
            </Row>
          </Col>
          <Col sm="7">
            <Row>
              {(acl.includes(USULAN_CREATE_ACTION_CODE) ||
                Number(user.id) === Number(usulan.userId)) &&
                usulan?.statusTerkirim !== "terkirim" && (
                  <Col sm="12">
                    <Card className="card-snippet">
                      <CardBody>
                        {allowSend ? (
                          <Button
                            block
                            color="primary"
                            onClick={handleSendUsulan}
                            disabled={!allowSend}
                          >
                            Kirim Pengusulan
                          </Button>
                        ) : (
                          <Button block disabled={true}>
                            Upload Dokumen Untuk Mengirim Pengusulan
                          </Button>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                )}

              {acl.includes(USULAN_VERMIN_UPDATE_ACTION_CODE) ? (
                <Col sm="12" className="mb-2">
                  {(isFetchingMasterDocuments || isLoadingMasterDocuments) && (
                    <Spinner />
                  )}
                  {(!isFetchingMasterDocuments || !isLoadingMasterDocuments) &&
                    dataMasterDocuments?.data?.length > 0 &&
                    vermin && (
                      <>
                        <VerminCard
                          status={vermin.status}
                          documents={documents}
                          verminId={vermin?.id}
                          usulan={usulan}
                          documentPdf={() => getDocumentPdf(true)}
                        />
                      </>
                    )}
                </Col>
              ) : null}

              {usulan && usulan?.DirektoratId !== 4 ? (
                <>
                  {acl.includes(USULAN_VERTEK_UPDATE_ACTION_CODE) ? (
                    <Col sm="12" className="mb-2">
                      <VertekCard locations={locations} usulan={usulan} />
                    </Col>
                  ) : null}
                </>
              ) : null}

              {usulan && usulan?.DirektoratId === 4 ? (
                <>
                  {acl.includes(USULAN_VERTEK_UPDATE_ACTION_CODE) && (
                    <Col sm="12" className="mb-2">
                      <VerlokCard usulan={usulan} />
                    </Col>
                  )}
                </>
              ) : null}
            </Row>
          </Col>
        </Row>
      )}
      {usulan && usulan.DirektoratId === 3 && (
        <RuswaSasaranDetail
          jenisData={usulan.jenisData}
          locations={usulan.Sasarans}
        />
      )}
      {usulan && usulan.DirektoratId === 4 && (
        <RukPerumahanDetail
          locations={usulan.UsulanPerumahans}
          type={usulan.type}
        />
      )}
      {usulan && usulan.DirektoratId === 2 && usulan.Sasarans?.length > 0 && (
        <RususSasaranDetail sasarans={usulan.Sasarans} />
      )}
      {toggleValidasiVermin === true && (
        <VerminValidationModal
          toggle={toggleValidasiVermin}
          setToggle={setToggleValidasiVermin}
          usulan={usulan}
        />
      )}
      <ModalSendToPenetapan
        open={sendToPenetapan}
        onClose={() => {
          setSendToPenetapan(false);
        }}
        usulan={usulan}
      />
    </Fragment>
  );
};

export default Detail;
