// ** utils
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";

// ** Third Party Components
import { Controller, useFormContext } from "react-hook-form";
import { Trash } from "react-feather";
import classnames from "classnames";
import Cleave from "cleave.js/react";

// ** Reactstrap Imports
import {
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";

const FormPerumahan = (props) => {
  const {
    index,
    hookForm: { remove },
  } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();
  // error populations
  let error = {};
  if (errors.perumahan) {
    if (errors.perumahan[index]) {
      error = errors.perumahan[index];
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
        }}
      >
        <h5>Perumahan {index + 1}</h5>
        <Button
          size="sm"
          color="danger"
          className="btn-next"
          onClick={() => {
            console.log("remove", index);
            remove(index);
          }}
        >
          <Trash size={14} className="align-middle ms-0 me-0" />
        </Button>
      </div>
      <Row>
        <Col md="12" className="mb-1">
          <Label className="form-label" for="namaPerumahan">
            Nama Perumahan
          </Label>
          <Controller
            id="namaPerumahan"
            name={`perumahan.${index}.namaPerumahan`}
            control={control}
            render={({ field }) => (
              <Input invalid={error.namaPerumahan && true} {...field} />
            )}
          />
          {error.namaPerumahan && (
            <FormFeedback>{error.namaPerumahan.message}</FormFeedback>
          )}
        </Col>
      </Row>
      <Row>
        <h5>Proporsi Jumlah Rumah (dalam keseluruhan daya tampung)</h5>
        <Col md="4">
          <Label className="form-label" for="jmlRumahUmum">
            Jumlah Rumah Umum
          </Label>
          <Row>
            <Col md="6" className="mb-1 mb-sm-0">
              <Controller
                id="jmlRumahUmum"
                name={`perumahan.${index}.jmlRumahUmum`}
                control={control}
                render={({ field }) => (
                  <CustomInputWrapper error={error.jmlRumahUmum}>
                    <InputGroup
                      className={classnames({
                        "is-invalid": error.jmlRumahUmum,
                      })}
                    >
                      <Cleave
                        {...field}
                        className={classnames("form-control", {
                          "is-invalid": error.jmlRumahUmum,
                        })}
                        placeholder="0"
                        options={{
                          numeral: true,
                          numeralThousandsGroupStyle: "thousand",
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.rawValue);
                        }}
                        min={0}
                      />
                      <InputGroupText>Unit</InputGroupText>
                    </InputGroup>
                  </CustomInputWrapper>
                )}
              />
              {error.jmlRumahUmum && (
                <FormFeedback>{error.jmlRumahUmum.message}</FormFeedback>
              )}
            </Col>
            <Col md="6">
              <Controller
                id="jmlRumahUmumPersentase"
                name={`perumahan.${index}.jmlRumahUmumPersentase`}
                control={control}
                render={({ field }) => (
                  <>
                    <InputGroup className="mb-2">
                      <Input {...field} readOnly />
                      <InputGroupText>%</InputGroupText>
                    </InputGroup>
                  </>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col md="4">
          <Label className="form-label" for="jmlRumahMenengah">
            Jumlah Rumah Menengah
          </Label>
          <Row>
            <Col md="6" className="mb-1 mb-sm-0">
              <Controller
                id="jmlRumahMenengah"
                name={`perumahan.${index}.jmlRumahMenengah`}
                control={control}
                render={({ field }) => (
                  <CustomInputWrapper error={error.jmlRumahMenengah}>
                    <InputGroup
                      className={classnames({
                        "is-invalid": error.jmlRumahMenengah,
                      })}
                    >
                      <Cleave
                        {...field}
                        className={classnames("form-control", {
                          "is-invalid": error.jmlRumahMenengah,
                        })}
                        placeholder="0"
                        options={{
                          numeral: true,
                          numeralThousandsGroupStyle: "thousand",
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.rawValue);
                        }}
                        min={0}
                      />
                      <InputGroupText>Unit</InputGroupText>
                    </InputGroup>
                  </CustomInputWrapper>
                )}
              />
              {error.jmlRumahMenengah && (
                <FormFeedback>{error.jmlRumahMenengah.message}</FormFeedback>
              )}
            </Col>
            <Col md="6">
              <Controller
                id="jmlRumahMenengahPersentase"
                name={`perumahan.${index}.jmlRumahMenengahPersentase`}
                control={control}
                render={({ field }) => (
                  <>
                    <InputGroup className="mb-2">
                      <Input {...field} readOnly />
                      <InputGroupText>%</InputGroupText>
                    </InputGroup>
                  </>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col md="4">
          <Label className="form-label" for="jmlRumahMewah">
            Jumlah Rumah Mewah
          </Label>
          <Row>
            <Col md="6" className="mb-1 mb-sm-0">
              <Controller
                id="jmlRumahMewah"
                name={`perumahan.${index}.jmlRumahMewah`}
                control={control}
                render={({ field }) => (
                  <CustomInputWrapper error={error.jmlRumahMewah}>
                    <InputGroup
                      className={classnames({
                        "is-invalid": error.jmlRumahMewah,
                      })}
                    >
                      <Cleave
                        {...field}
                        className={classnames("form-control", {
                          "is-invalid": error.jmlRumahMewah,
                        })}
                        placeholder="0"
                        options={{
                          numeral: true,
                          numeralThousandsGroupStyle: "thousand",
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.rawValue);
                        }}
                        min={0}
                      />
                      <InputGroupText>Unit</InputGroupText>
                    </InputGroup>
                  </CustomInputWrapper>
                )}
              />
              {error.jmlRumahMewah && (
                <FormFeedback>{error.jmlRumahMewah.message}</FormFeedback>
              )}
            </Col>
            <Col md="6">
              <Controller
                id="jmlRumahMewahPersentase"
                name={`perumahan.${index}.jmlRumahMewahPersentase`}
                control={control}
                render={({ field }) => (
                  <>
                    <InputGroup className="mb-2">
                      <Input {...field} readOnly />
                      <InputGroupText>%</InputGroupText>
                    </InputGroup>
                  </>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default FormPerumahan;
