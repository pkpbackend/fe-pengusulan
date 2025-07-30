import { useCallback, useState, useEffect } from "react";

// ** hooks
import { useDeleteUsulanDocumentMutation } from "../../../../domains/dokumen";
// ** Third Party Components
import classnames from "classnames";
import { Check, Download, Edit2, Trash2 } from "react-feather";
import {
  Alert,
  Badge,
  Table,
  UncontrolledTooltip,
  UncontrolledAccordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Label,
} from "reactstrap";
import VerminModal from "./VerminModal";
import VerminValidationModal from "./VerminValidationModal";
import { useUsulanVerminQuery } from "../../../../domains";
import SendEmailNotification from "./SendEmailNotification";
import LinkS3 from "../../../../../../components/LinkS3";
import sweetalert from "@src/utility/sweetalert";
import { useSelector } from "react-redux";

const USULAN_VERMIN_STATUS_UPDATE_ACTION_CODE = "usulan_vermin_status_update";
const USULAN_VERMIN_DOKUMEN_STATUS_UPDATE_ACTION_CODE =
  "usulan_vermin_dokumen_status_update";

const VerminAlert = ({ status }) => {
  let displayText = "Belum Verifikasi";
  let alertColor = "secondary";
  if (status === 1) {
    displayText = "Vermin Lengkap";
    alertColor = "primary";
  }
  if (status === 0) {
    displayText = "Vermin Tidak Lengkap";
    alertColor = "danger";
  }
  return (
    <Alert color={alertColor}>
      <div className="alert-body d-flex align-items-center justify-content-center">
        <span className="ms-50 fs-4">{displayText}</span>
      </div>
    </Alert>
  );
};
const VerminCard = (props) => {
  const acl = useSelector((state) => state.auth.user?.Role?.accessMenu);
  const currentUser = useSelector((state) => state.auth.user);

  const { usulan, documents, verminId, documentPdf } = props;
  const [canVermin, setCanVermin] = useState(false);
  const { data: vermin } = useUsulanVerminQuery(usulan?.id, {
    skip: !usulan?.id,
  });

  useEffect(() => {
    if (documents.length > 0) {
      let vermin = true;

      for (const dokumen of documents) {
        if (dokumen.required && !dokumen.verminDocument) {
          break;
        }
      }

      //check vermin
      for (const dokumen of documents) {
        if (dokumen.isRequired) {
          if (!dokumen.verminDocument) {
            vermin = false;
            break;
          }
          if (dokumen.verminDocument?.lengkap == null) {
            vermin = false;
            break;
          }
        }
      }

      setCanVermin(vermin);
    }
  }, [documents]);

  // query
  const [deleteDokumen] = useDeleteUsulanDocumentMutation();

  // local state
  const [toggleValidasiVermin, setToggleValidasiVermin] = useState(false);

  const [toggleVermin, setToggleVermin] = useState({
    open: false,
    document: null,
    usulan: null,
  });

  // components
  const renderStatus = (status) => {
    if (status !== null && Number(status) === 0) {
      return <Badge color="danger">Tidak Sesuai</Badge>;
    } else if (Number(status) === 1) {
      return <Badge color="primary">Sudah Verifikasi</Badge>;
    }

    return <Badge>Belum di Verifikasi</Badge>;
  };

  const memoizedDeleteBerkas = useCallback(
    (id) => {
      const hapusBerkas = async () => {
        sweetalert
          .fire({
            title: "Hapus Berkas",
            text: "Apakah anda yakin menghapus berkas ini?",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Hapus",
            icon: "warning",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
              try {
                await deleteDokumen(id).unwrap();
                return true;
              } catch (error) {
                sweetalert.showValidationMessage(`Request failed: ${error}`);
              }
            },
          })
          .then((result) => {
            if (result.isConfirmed) {
              sweetalert.fire("Sukses", "Hapus berkas berhasil...", "success");
            }
          });
      };
      hapusBerkas();
    },
    [deleteDokumen]
  );

  let canAction = usulan.statusVermin !== 1;
  return (
    <>
      <UncontrolledAccordion
        className="shadow"
        style={{ borderRadius: "0.428rem" }}
        defaultOpen="data-document-vermin"
      >
        <AccordionItem>
          <AccordionHeader
            targetId="data-document-vermin"
            className="title-accordion-text"
          >
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "100%", paddingRight: "1rem" }}
            >
              Verifikasi Admin
              {acl.includes(USULAN_VERMIN_STATUS_UPDATE_ACTION_CODE) ? (
                <div className="d-flex">
                  {vermin && (
                    <SendEmailNotification
                      verminId={vermin?.id}
                      documentPdf={documentPdf}
                    />
                  )}
                  <span
                    className={classnames("btn btn-primary btn-sm", {
                      disabled: !canVermin,
                    })}
                    tabIndex={-1}
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setToggleValidasiVermin(true);
                    }}
                    style={{ marginLeft: 8 }}
                    disabled={!canVermin}
                  >
                    <Check size={14} /> Verifikasi
                  </span>
                </div>
              ) : null}
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="data-document-vermin">
            <Table size="sm" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  {currentUser?.Role.nama == "Super Admin" && <th>Kode</th>}
                  <th>Dokumen</th>
                  <th>Status</th>
                  <th>Komentar</th>
                  <th>File</th>
                  {canAction ? <th>Aksi</th> : null}
                </tr>
              </thead>
              <tbody>
                {documents &&
                  documents.map((document, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {currentUser?.Role.nama == "Super Admin" && (
                          <td>D{document.id}</td>
                        )}
                        <td
                          style={{
                            color: document.verminDocument?.file
                              ? "blue"
                              : "black",
                          }}
                        >
                          {document.nama}{" "}
                          {document.isRequired ? (
                            <span className="text-danger">*</span>
                          ) : null}
                        </td>
                        <td colSpan={document.nama === "Jumlah RTLH" ? 4 : 0}>
                          {document.nama === "Jumlah RTLH"
                            ? '-' // todo get data jumlah RTLH
                            : renderStatus(document.verminDocument?.lengkap)}
                        </td>
                        {document.nama === "Jumlah RTLH" ? null : (
                          <td>{document.verminDocument?.keterangan || "-"}</td>
                        )}
                        {document.nama === "Jumlah RTLH" ? null : (
                          <td>
                            {document.verminDocument?.file ? (
                              <>
                                <LinkS3
                                  id={"ViewDocumentButton" + index}
                                  rel="noopener noreferrer"
                                  href={document.verminDocument?.file}
                                  model={document.verminDocument?.model}
                                >
                                  <Download size={16} color="blue" />
                                </LinkS3>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={"ViewDocumentButton" + index}
                                >
                                  Lihat Dokumen
                                </UncontrolledTooltip>
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                        )}
                        {}
                        {document.nama === "Jumlah RTLH" ||
                        !canAction ? null : (
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <div
                                title="edit"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setToggleVermin({
                                    open: true,
                                    document,
                                    usulan,
                                    verminId,
                                  });
                                }}
                              >
                                <Edit2 size={16} />
                              </div>

                              {document.verminDocument && (
                                <div
                                  id={"DeleteDocumentButton" + index}
                                  style={{ cursor: "pointer" }}
                                  title="Hapus"
                                  onClick={() =>
                                    memoizedDeleteBerkas(
                                      document.verminDocument?.id
                                    )
                                  }
                                >
                                  <Trash2 size={16} color="red" />
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </AccordionBody>
          <div
            style={{
              padding: 30,
              marginTop: -12,
              marginLeft: 13,
              marginRight: 13,
              marginBottom: 10,
              borderRadius: 6,
              backgroundColor: "#FFECD9",
            }}
          >
            <h4
              className="alert-heading text-center"
              style={{ fontSize: 24, fontWeight: "bold" }}
            >
              Catatan
            </h4>
            <br></br>
            <div>
              <span>
                Usulan Diproses Lebih Lanjut Mempertimbangkan Kebijakan
                Pemerintah dan Ketersediaan Anggaran.
              </span>
              {/* <br></br>
            <div
              style={{
                marginLeft: 10,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span>a. Arahan Kebijakan Menteri</span>
              <span>b. Ketersediaan Anggaran; dan/atau</span>
              <span>c. Kebijakan Prioritas</span>
            </div> */}
              <br></br>
              <span>
                Sesuai Peraturan Menteri PUPR No 7 Tahun 2022 Tentang
                Pelaksanaan Bantuan Pembangunan Perumahan dan Penyediaan Rumah
                Khusus.
              </span>
            </div>
          </div>
          <div style={{ padding: "0 1rem 1rem 1rem" }}>
            <div className="mt-1">
              <VerminAlert status={vermin?.status ?? ""} />
            </div>
            {vermin?.keterangan ? (
              <div className="mt-1">
                <Label style={{ fontWeight: 600 }}>Keterangan:</Label>
                <p style={{ marginBottom: 0 }}>{vermin?.keterangan ?? "-"}</p>
              </div>
            ) : null}
          </div>
        </AccordionItem>
      </UncontrolledAccordion>
      {toggleVermin.open === true && (
        <VerminModal toggle={toggleVermin} setToggle={setToggleVermin} />
      )}
      {toggleValidasiVermin === true && (
        <VerminValidationModal
          toggle={toggleValidasiVermin}
          setToggle={setToggleValidasiVermin}
          data={{
            id: vermin.id,
            status: vermin.status,
            keterangan: vermin.keterangan,
            UsulanId: usulan.id,
            KroId: usulan.ProOutput?.id,
            RoId: usulan.ProSubOutput?.id,
            uraian: usulan.uraian,
            anggaran: usulan.anggaran,
          }}
        />
      )}
    </>
  );
};

export default VerminCard;
