// ** Utils
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";

// ** Third Party Components
import Cleave from "cleave.js/react";
import classnames from "classnames";
import Select from "react-select"; // eslint-disable-line
import { Controller, useWatch, useFormContext } from "react-hook-form";
import { Trash } from "react-feather";

// ** Reactstrap Imports
import { Label, Row, Col, Button, FormFeedback } from "reactstrap";

import { useProvinsiQuery } from "@globalapi/wilayah";

const FormSasaranDirektif = (props) => {
  const {
    index,
    hookForm: { remove },
  } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const listSasaran = useWatch({
    control,
    name: "sasarans",
  });

  const selectedProvinceIds =
    listSasaran?.length > 0
      ? listSasaran.map((sasaran) => sasaran?.provinsi?.id).filter(Boolean)
      : [];

  // ** query
  const queryProvinsi = useProvinsiQuery();

  // error populations
  let error = {};
  if (errors.sasarans) {
    if (errors.sasarans[index]) {
      error = errors.sasarans[index];
    }
  }

  return (
    <Col md="12">
      <hr></hr>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h5 className="mb-0">Sasaran {index + 1}</h5>
        <Button
          size="sm"
          color="danger"
          className="btn-next"
          onClick={() => {
            remove(index);
          }}
        >
          <Trash size={14} className="align-middle ms-0 me-0" />
        </Button>
      </div>
      <Row>
        <Col md="6" className="mb-1 mb-md-0">
          <Label className="form-label" for="provinsi">
            Provinsi
          </Label>
          <Controller
            id="provinsi"
            name={`sasarans.${index}.provinsi`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={error.provinsi}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih provinsi..."
                  className={classnames("react-select", {
                    "is-invalid": error.provinsi,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nama}
                  isOptionDisabled={(option) => {
                    const isSelected = selectedProvinceIds.includes(option.id);
                    return isSelected;
                  }}
                  value={
                    queryProvinsi?.data?.find(
                      (c) => c.id === (value?.id || 0)
                    ) || ""
                  }
                  options={queryProvinsi?.data || []}
                  isLoading={queryProvinsi?.isLoading || false}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
        <Col md="6" className="mb-1 mb-md-0">
          <Label className="form-label" for={`sasarans.${index}.jumlahUnit`}>
            Jumlah Unit
          </Label>
          <Controller
            id={`sasarans.${index}.jumlahUnit`}
            name={`sasarans.${index}.jumlahUnit`}
            control={control}
            render={({ field }) => {
              return (
                <Cleave
                  className={classnames("form-control", {
                    "is-invalid": error.jumlahUnit,
                  })}
                  placeholder="10,000"
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.rawValue);
                  }}
                  value={field.value}
                  min={1}
                />
              );
            }}
          />
          {error.jumlahUnit && (
            <FormFeedback>{error.jumlahUnit.message}</FormFeedback>
          )}
        </Col>
      </Row>
    </Col>
  );
};

export default FormSasaranDirektif;
