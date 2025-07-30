import { CustomInputWrapper } from "@customcomponents/form/CustomInput";

// ** Third Party Components
import { Controller, useFormContext } from "react-hook-form";
import { Trash } from "react-feather";
import classnames from "classnames";
import Select from "react-select"; // eslint-disable-line

// ** Reactstrap Imports
import { Label, Row, Col, Button } from "reactstrap";

const FormBentukBantuan = (props) => {
  const {
    index,
    options,
    formData,
    hookForm: { remove },
  } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // error populations
  let error = {};
  if (errors.bentukBantuan) {
    if (errors.bentukBantuan[index]) {
      error = errors.bentukBantuan[index];
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
        <h5 className="mb-0">Prioritas {index + 1}</h5>
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
        <Col md="6">
          <Label className="form-label" for="bantuan">
            Bentuk Bantuan
          </Label>
          <Controller
            id="bantuan"
            name={`bentukBantuan.${index}.bantuan`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={error.bantuan}>
                <Select
                  options={options}
                  placeholder="Silahkan pilih bentuk bantuan..."
                  className={classnames("react-select", {
                    "is-invalid": error.bantuan,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.value);
                  }}
                  value={options.find((c) => c.value === (value || "")) || ""}
                  menuPlacement="auto"
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
        {Number(formData?.type?.value) === 5 && (
          <Col md="6" className="mb-1">
            <Label className="form-label" for="bersertaDrainase">
              Beserta Drainase
            </Label>
            <Controller
              id="bersertaDrainase"
              name={`bentukBantuan.${index}.bersertaDrainase`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={error.bersertaDrainase}>
                  <Select
                    options={[
                      {
                        value: "Tidak",
                        label: "Tidak",
                      },
                      {
                        value: "Ya",
                        label: "Ya",
                      },
                    ]}
                    placeholder="Silahkan pilih opsi drainase..."
                    className={classnames("react-select", {
                      "is-invalid": error.bersertaDrainase,
                    })}
                    classNamePrefix="select"
                    onChange={(val) => {
                      onChange(val.value);
                    }}
                    value={
                      [
                        {
                          value: "Tidak",
                          label: "Tidak",
                        },
                        {
                          value: "Ya",
                          label: "Ya",
                        },
                      ].find((c) => c.value === (value || "")) || ""
                    }
                    menuPlacement="auto"
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
        )}
      </Row>
    </Col>
  );
};

export default FormBentukBantuan;
