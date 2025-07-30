import React from "react";

import { Printer } from "react-feather";
import { Button, Spinner } from "reactstrap";

import { useLazyExportExcelKonregPoolQuery } from "../../../domains";
import sweetalert from "@src/utility/sweetalert";

const ExportExcelButton = ({ filtered }) => {
  const { pageSize, ...rest } = filtered;
  const [trigger, { isLoading, isFetching }] =
    useLazyExportExcelKonregPoolQuery();

  async function handleExport() {
    try {
      const { data } = await trigger({ ...rest, withLimit: false });
      window.open(data);
    } catch (error) {
      sweetalert.fire("Gagal", "Gagal mengexport Excel", "error");
    }
  }

  return (
    <Button
      color="primary"
      outline
      size="sm"
      onClick={handleExport}
      disabled={isLoading || isFetching}
    >
      {isLoading || isFetching ? <Spinner size="sm" /> : <Printer size={14} />}
      Export Excel
    </Button>
  );
};

export default ExportExcelButton;
