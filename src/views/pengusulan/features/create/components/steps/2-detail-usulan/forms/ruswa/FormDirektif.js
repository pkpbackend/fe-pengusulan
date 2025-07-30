// ** React Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { formSchemaDirektif } from "./schema";

// ** Third Party Components
import classnames from "classnames";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

// ** styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";

import { getFiscalYearRange } from "../shared/getFiscalYearRange";

const FormDirektif = (props) => {
  const navigate = useNavigate();
  // ** props
  const {
    stepper,
    form: { setFormData, formData },
  } = props;

  // ** local state
  const [optionsTahun, setOptionsTahun] = useState(() =>
    formData?.tanggalSurat
      ? getFiscalYearRange(new Date(formData?.tanggalSurat))
      : []
  );

  // ** Hooks
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nikPicPengusul: formData?.nikPicPengusul || "",
      namaPicPengusul: formData?.namaPicPengusul || "",
      noSurat: formData?.noSurat || "",
      tanggalSurat: formData?.tanggalSurat || null,
      tahunUsulan: formData?.tahunUsulan || "",
    },
    resolver: yupResolver(formSchemaDirektif()),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name === "tanggalSurat") {
        const result = getFiscalYearRange(value.tanggalSurat);
        setOptionsTahun(result);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setFormData((val) => ({
        ...val,
        ...data,
        tahunUsulan: Number(data.tahunUsulan),
      }));
      stepper.next();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <h5>PIC Usulan</h5>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="nikPicPengusul">
            NIK
          </Label>
          <Controller
            id="nikPicPengusul"
            name="nikPicPengusul"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                placeholder="cth: 190204xxxx"
                invalid={errors.nikPicPengusul && true}
                {...field}
              />
            )}
          />
          {errors.nikPicPengusul && (
            <FormFeedback>{errors.nikPicPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="namaPicPengusul">
            Nama
          </Label>
          <Controller
            id="namaPicPengusul"
            name="namaPicPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: elad oktarizo"
                invalid={errors.namaPicPengusul && true}
                {...field}
              />
            )}
          />
          {errors.namaPicPengusul && (
            <FormFeedback>{errors.namaPicPengusul.message}</FormFeedback>
          )}
        </Col>
      </Row>
      <br></br>
      <Row>
        <h5>Administrasi Usulan</h5>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="noSurat">
            No Surat Permohonan
          </Label>
          <Controller
            id="noSurat"
            name="noSurat"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: SK/123/123"
                invalid={errors.noSurat && true}
                {...field}
              />
            )}
          />
          {errors.noSurat && (
            <FormFeedback>{errors.noSurat.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="tanggalSurat">
            Tanggal Surat Permohonan
          </Label>
          <Controller
            id="tanggalSurat"
            name="tanggalSurat"
            control={control}
            render={({ field }) => (
              <CustomInputWrapper error={errors.tanggalSurat}>
                <Flatpickr
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.tanggalSurat,
                  })}
                  options={{
                    dateFormat: "d-m-Y",
                  }}
                  onChange={(date) => {
                    field.onChange(date[0]);
                  }}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="tahunUsulan">
            Tahun Anggaran
          </Label>
          <Controller
            id="tahunUsulan"
            name="tahunUsulan"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.tahunUsulan}>
                <Select
                  menuPlacement="auto"
                  options={optionsTahun}
                  placeholder="Silahkan pilih tahun anggaran..."
                  className={classnames("react-select", {
                    "is-invalid": errors.tahunUsulan,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.value);
                  }}
                  value={optionsTahun.find((c) => c.value === value) || ""}
                  isDisabled={optionsTahun.length === 0}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
        {formData.id ? (
          <Button
            color="secondary"
            className="btn-prev"
            onClick={() => navigate(`/pengusulan/${formData.id}`)}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">Batal</span>
          </Button>
        ) : (
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
        )}
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
  );
};

export default FormDirektif;
