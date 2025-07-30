// ** React Imports

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { formSchemaDirektif } from "./schema";

// ** Third Party Components
import Cleave from "cleave.js/react";
import {
  useForm,
  useWatch,
  FormProvider,
  useFieldArray,
} from "react-hook-form";
import { ArrowLeft, ArrowRight, Plus } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";

// ** Reactstrap Imports
import { Form, Row, Label, Col, Button } from "reactstrap";

// ** styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";

import FormSasaranDirektif from "./child/FormSasaranDirektif";

const JumlahUnitField = ({ control, setValue }) => {
  const sasarans = useWatch({ control, name: "sasarans" });
  const jumlahUnit = _.sumBy(sasarans, (sasaran) =>
    sasaran.jumlahUnit ? Number(sasaran.jumlahUnit) : 0
  );
  setValue("jumlahUnit", jumlahUnit);
  return (
    <>
      <Label className="form-label" for="jumlahUnit">
        Total Unit
      </Label>
      <Cleave
        className="form-control"
        options={{
          numeral: true,
          numeralThousandsGroupStyle: "thousand",
        }}
        value={jumlahUnit}
        
      />
    </>
  );
};

const FormDirektif = (props) => {
  // ** props
  const {
    stepper,
    form: { setFormData, formData },
  } = props;

  // ** Hooks
  const forms = useForm({
    defaultValues: {
      sasarans: formData.sasarans,
      jumlahUnit: formData.jumlahUnit,
    },
    resolver: yupResolver(formSchemaDirektif()),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = forms;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sasarans",
  });

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setFormData((val) => ({
        ...val,
        ...data,
      }));
      stepper.next();
    }
  };

  return (
    <FormProvider {...forms}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="12">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h5 className="mb-0">Daftar Kawasan/Lokasi</h5>
                {errors.sasarans && !Array.isArray(errors.sasarans) && (
                  <span className="text-danger">{errors.sasarans.message}</span>
                )}
              </div>

              <Button
                color="primary"
                size="md"
                className="btn-next"
                onClick={() => {
                  append({ meong: "" });
                }}
              >
                <Plus size={14} className="align-middle ms-sm-25 me-0"></Plus>
                <span className="align-middle d-sm-inline-block d-none">
                  Tambah Sasaran
                </span>
              </Button>
            </div>
          </Col>
          <Col md="12">
            <Row>
              {fields.map((field, index) => {
                return (
                  <div key={index}>
                    <FormSasaranDirektif
                      index={index}
                      field={field}
                      hookForm={{
                        remove,
                      }}
                    />
                  </div>
                );
              })}
            </Row>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col md="12">
            <h5 className="mb-1">Total Usulan</h5>
          </Col>
          <Col md="6" className="mb-1">
            <JumlahUnitField control={control} setValue={setValue} />
          </Col>
        </Row>
        <hr className="mb-4"></hr>
        <div className="d-flex justify-content-between">
          <Button
            color="secondary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Sebelumnya
            </span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">
              Selanjutnya
            </span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default FormDirektif;
