// ** React Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { formSchemaReguler } from "./schema";

// ** Third Party Components
import classnames from "classnames";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

// ** styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";

import { getFiscalYearRange } from "../shared/getFiscalYearRange";

const FormReguler = (props) => {
  const user = useSelector((state) => state.auth.user);
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
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      nikPicPengusul: formData?.nikPicPengusul || "",
      namaPicPengusul: formData?.namaPicPengusul || "",
      jabatanPicPengusul: formData?.jabatanPicPengusul || "",
      emailPicPengusul: formData?.emailPicPengusul || "",
      telpPicPengusul: formData?.telpPicPengusul || "",
      noSurat: formData?.noSurat || "",
      tanggalSurat: formData?.tanggalSurat || "",
      tahunUsulan: formData?.tahunUsulan || "",
      instansiPengusul: formData?.instansiPengusul || "",
      alamatInstansiPengusul: formData?.alamatInstansiPengusul || "",
      ttdSuratUsulan: formData?.ttdSuratUsulan || "",
    },
    resolver: yupResolver(formSchemaReguler()),
  });

  useEffect(() => {
    setValue("instansiPengusul", user?.instansi || "", { shouldDirty: true });
    setValue("alamatInstansiPengusul", user?.alamatInstansi || "", {
      shouldDirty: true,
    });
  }, [user, setValue]);

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

  const ttdSuratUsulanOptions = [
    { value: "Bupati", label: "Bupati" },
    { value: "Walikota", label: "Walikota" },
  ];
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
        <Col md="6" className="mb-1">
          <Label className="form-label" for="jabatanPicPengusul">
            Jabatan
          </Label>
          <Controller
            id="jabatanPicPengusul"
            name="jabatanPicPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: supervisor"
                invalid={errors.jabatanPicPengusul && true}
                {...field}
              />
            )}
          />
          {errors.jabatanPicPengusul && (
            <FormFeedback>{errors.jabatanPicPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="emailPicPengusul">
            Email
          </Label>
          <Controller
            id="emailPicPengusul"
            name="emailPicPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: pic@email.com"
                invalid={errors.emailPicPengusul && true}
                {...field}
              />
            )}
          />
          {errors.emailPicPengusul && (
            <FormFeedback>{errors.emailPicPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="telpPicPengusul">
            No. Telepon
          </Label>
          <Controller
            id="telpPicPengusul"
            name="telpPicPengusul"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                placeholder="cth: 0361777777"
                invalid={errors.telpPicPengusul && true}
                {...field}
              />
            )}
          />
          {errors.telpPicPengusul && (
            <FormFeedback>{errors.telpPicPengusul.message}</FormFeedback>
          )}
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="instansiPengusul">
            Instansi/Lembaga
          </Label>
          <Controller
            id="instansiPengusul"
            name="instansiPengusul"
            control={control}
            render={({ field }) => <Input disabled={true} {...field} />}
          />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="alamatInstansiPengusul">
            Alamat Instansi
          </Label>
          <Controller
            id="alamatInstansiPengusul"
            name="alamatInstansiPengusul"
            control={control}
            render={({ field }) => <Input disabled={true} {...field} />}
          />
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
          <Label className="form-label" for="ttdSuratUsulan">
            Penandatangan Surat Usulan
          </Label>
          <Controller
            id="ttdSuratUsulan"
            name="ttdSuratUsulan"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.ttdSuratUsulan}>
                <Select
                  menuPlacement="auto"
                  options={ttdSuratUsulanOptions}
                  placeholder="Silahkan pilih penandatangan surat usulan..."
                  className={classnames("react-select", {
                    "is-invalid": errors.ttdSuratUsulan,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.value);
                  }}
                  value={
                    ttdSuratUsulanOptions.find((c) => c.value === value) || ""
                  }
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
                  value={
                    optionsTahun.find((option) => option.value === value) || ""
                  }
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
export default FormReguler;
