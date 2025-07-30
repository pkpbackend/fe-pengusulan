import React from "react";

import { Printer } from "react-feather";
import { Button, Spinner } from "reactstrap";
import { useLazyExportExcelUsulanQuery } from "../../../domains";
import sweetalert from "@src/utility/sweetalert";

const ExportExcelButton = ({ filtered }) => {
  const [trigger, { isLoading, isFetching }] = useLazyExportExcelUsulanQuery();

  async function handleExport() {
    try {
      const { data } = await trigger({ ...filtered, withLimit: false });
      // No open tab
      window.location = data.s3url;
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
