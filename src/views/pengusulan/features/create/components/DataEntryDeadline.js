import React, { useEffect } from "react";
import { useUsulanSettingQuery } from "@src/views/pengusulan/domains";
import moment from "moment";
import { Alert } from "reactstrap";
import { Info } from "react-feather";
import "moment/locale/id";

const DataEntryDeadline = ({ jenisUsulan, onIsValidChange }) => {
  let beforeKey = "";
  let afterKey = "";
  switch (jenisUsulan) {
    case 1:
      beforeKey = "rusun_limit_dari";
      afterKey = "rusun_limit_sampai";
      break;
    case 2:
      beforeKey = "rusus_limit_dari";
      afterKey = "rusus_limit_sampai";
      break;
    case 3:
      beforeKey = "swadaya_limit_dari";
      afterKey = "swadaya_limit_sampai";
      break;
    case 4:
      beforeKey = "ruk_limit_dari";
      afterKey = "ruk_limit_sampai";
      break;
    default:
      break;
  }

  const queryBefore = useUsulanSettingQuery(beforeKey, { skip: !jenisUsulan });
  const queryAfter = useUsulanSettingQuery(afterKey, { skip: !jenisUsulan });
  const isValidDate = moment().isBetween(
    queryBefore?.data?.value,
    queryAfter?.data?.value
  );

  useEffect(() => {
    if (isValidDate) {
      onIsValidChange?.(true);
    } else {
      onIsValidChange?.(false);
    }
  }, [isValidDate, onIsValidChange]);

  const formateBefore = queryBefore?.data?.value
    ? moment(queryBefore?.data?.value).format("LL")
    : null;
  const formateAfter = queryAfter?.data?.value
    ? moment(queryAfter?.data?.value).format("LL")
    : null;

  return jenisUsulan ? (
    <>
      <Alert className="p-1" color={isValidDate ? "warning" : "danger"}>
        <div className="d-flex gap-50 align-items-center">
          <Info size={16} />

          {isValidDate ? (
            `Batas waktu pengajuan usulan ${formateBefore} sampai dengan ${formateAfter}`
          ) : (
            <>
              {!formateAfter || !formateAfter
                ? "Batas waktu pengajuan usulan belum ditentukan"
                : `Sudah melampaui batas waktu pengajuan usulan ${formateBefore} - ${formateAfter}`}
            </>
          )}
        </div>
      </Alert>
    </>
  ) : null;
};

export default DataEntryDeadline;
