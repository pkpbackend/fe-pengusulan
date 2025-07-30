// ** React Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { formSchemaPengembang } from "./schema";
import {
  useDesaQuery,
  useKabupatenQuery,
  useKecamatanQuery,
  useProvinsiQuery,
} from "@globalapi/wilayah";
import { usePengembangQuery } from "@globalapi/usulan";

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
import { useSelector } from "react-redux";

const FormPengembang = (props) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

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
    setValue,
  } = useForm({
    defaultValues: {
      pengembang: formData.pengembang || "",
      nikPicPengusul: formData.nikPicPengusul || "",
      namaPicPengusul: formData.namaPicPengusul || "",
      telpPicPengusul: formData.telpPicPengusul || "",
      perusahaanPengusul: formData.perusahaanPengusul || "",
      asosiasiPengusul: formData.asosiasiPengusul || "",
      namaDirekturPengusul: formData.namaDirekturPengusul || "",
      telpDirekturPengusul: formData.telpDirekturPengusul || "",
      emailPengusul: formData.emailPengusul || "",
      alamatPengusul: formData.alamatPengusul || "",
      provinsiPengusul: formData.provinsiPengusul || "",
      kabupatenPengusul: formData.kabupatenPengusul || "",
      kecamatanPengusul: formData.kecamatanPengusul || "",
      desaPengusul: formData.desaPengusul || "",

      noSurat: formData.noSurat || "",
      tanggalSurat: formData.tanggalSurat || null,
      tahunBantuanPsu: formData.tahunBantuanPsu || "",
    },
    resolver: yupResolver(formSchemaPengembang()),
  });
  const provinsiId = watch("provinsiPengusul");
  const kabupatenId = watch("kabupatenPengusul");
  const kecamatanId = watch("kecamatanPengusul");
  const pengembang = watch("pengembang");

  // ** query
  const queryProvinsi = useProvinsiQuery();
  const queryPengembang = usePengembangQuery();
  const queryKabupaten = useKabupatenQuery(provinsiId, {
    skip: !provinsiId || provinsiId === "",
  });
  const queryKecamatan = useKecamatanQuery(kabupatenId, {
    skip: !kabupatenId || kabupatenId === "",
  });
  const queryDesa = useDesaQuery(kecamatanId, {
    skip: !kecamatanId || kecamatanId === "",
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name === "provinsiPengusul") {
        setValue("kabupatenPengusul", "", { shouldDirty: true });
        setValue("kecamatanPengusul", "", { shouldDirty: true });
        setValue("desaPengusul", "", { shouldDirty: true });
      }
      if (type === "change" && name === "kabupatenPengusul") {
        setValue("kecamatanPengusul", "", { shouldDirty: true });
        setValue("desaPengusul", "", { shouldDirty: true });
      }
      if (type === "change" && name === "kecamatanPengusul") {
        setValue("desaPengusul", "", { shouldDirty: true });
      }
      if (type === "change" && name === "tanggalSurat") {
        const result = getFiscalYearRange(value.tanggalSurat);
        setOptionsTahun(result);
      }
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  useEffect(() => {
    const dataPengembang = queryPengembang?.data?.find(
      (c) => c.id === Number(currentUser.PengembangId)
    );
    if (dataPengembang) {
      setValue("pengembang", dataPengembang);
    }
  }, [formData.pengembang, queryPengembang?.data, pengembang.id, setValue]);

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setFormData((val) => ({
        ...val,
        ...data,
        tahunBantuanPsu: Number(data.tahunBantuanPsu),
        pengembang: queryPengembang?.data?.find(
          (c) => c.id === Number(data.pengembang.id)
        ),
        provinsiPengusul: queryProvinsi?.data?.find(
          (c) => c.id === Number(data.provinsiPengusul)
        ),
        kabupatenPengusul: queryKabupaten?.data?.find(
          (c) => c.id === Number(data.kabupatenPengusul)
        ),
        kecamatanPengusul: queryKecamatan?.data?.find(
          (c) => c.id === Number(data.kecamatanPengusul)
        ),
        desaPengusul: queryDesa?.data?.find(
          (c) => c.id === Number(data.desaPengusul)
        ),
      }));
      stepper.next();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <h5>Data Pengembang</h5>
        <Col md="12" className="mb-1">
          <Label className="form-label" for="pengembang.id">
            Pengembang
          </Label>
          <Controller
            id="pengembang.id"
            name="pengembang.id"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.pengembang}>
                <Select
                  value={
                    queryPengembang?.data?.find(
                      (pengembang) => pengembang.id === value
                    ) || ""
                  }
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih pengembang..."
                  className={classnames("react-select", {
                    "is-invalid": errors.pengembang,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.id);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => {
                    return `${option.namaPerusahaan} (${option.nama})`;
                  }}
                  options={
                    queryPengembang?.data?.filter((data) => {
                      if (currentUser.PengembangId) {
                        return data.id === currentUser.PengembangId;
                      }

                      return true;
                    }) || []
                  }
                  isLoading={queryPengembang?.isLoading || false}
                />
              </CustomInputWrapper>
            )}
          />
          {errors.pengembang && (
            <FormFeedback>{errors.pengembang.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label">Nama</Label>
          <Input value={pengembang?.nama} disabled />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label">Nama Perusahaan</Label>
          <Input value={pengembang?.namaPerusahaan} disabled />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label">Nomor HP</Label>
          <Input value={pengembang?.telpPenanggungJawab} disabled />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label">NPWP</Label>
          <Input value={pengembang?.npwp} disabled />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label">Email</Label>
          <Input value={pengembang?.email} disabled />
        </Col>
      </Row>
      <hr className="mb-2" />
      <Row>
        <h5>Data Pengusul</h5>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="nikPicPengusul">
            NIK PIC Perusahaan Pengusul
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
            Nama PIC Perusahaan Pengusul
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
          <Label className="form-label" for="telpPicPengusul">
            No HP PIC Perusahaan Pengusul
          </Label>
          <Controller
            id="telpPicPengusul"
            name="telpPicPengusul"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                placeholder="cth: 081xxxx"
                invalid={errors.telpPicPengusul && true}
                {...field}
              />
            )}
          />
          {errors.telpPicPengusul && (
            <FormFeedback>{errors.telpPicPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="perusahaanPengusul">
            Nama Perusahaan
          </Label>
          <Controller
            id="perusahaanPengusul"
            name="perusahaanPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: PT. X"
                invalid={errors.perusahaanPengusul && true}
                {...field}
              />
            )}
          />
          {errors.perusahaanPengusul && (
            <FormFeedback>{errors.perusahaanPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="asosiasiPengusul">
            Nama Asosiasi
          </Label>
          <Controller
            id="asosiasiPengusul"
            name="asosiasiPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: Asosiasi X"
                invalid={errors.asosiasiPengusul && true}
                {...field}
              />
            )}
          />
          {errors.asosiasiPengusul && (
            <FormFeedback>{errors.asosiasiPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="namaDirekturPengusul">
            Nama Direktur
          </Label>
          <Controller
            id="namaDirekturPengusul"
            name="namaDirekturPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: Elad Oktarizo"
                invalid={errors.namaDirekturPengusul && true}
                {...field}
              />
            )}
          />
          {errors.namaDirekturPengusul && (
            <FormFeedback>{errors.namaDirekturPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="telpDirekturPengusul">
            No. HP Direktur
          </Label>
          <Controller
            id="telpDirekturPengusul"
            name="telpDirekturPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: 081xxx"
                invalid={errors.telpDirekturPengusul && true}
                {...field}
              />
            )}
          />
          {errors.telpDirekturPengusul && (
            <FormFeedback>{errors.telpDirekturPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="emailPengusul">
            Email Perusahaan
          </Label>
          <Controller
            id="emailPengusul"
            name="emailPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: email@perusahaan.com"
                invalid={errors.emailPengusul && true}
                {...field}
              />
            )}
          />
          {errors.emailPengusul && (
            <FormFeedback>{errors.emailPengusul.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="alamatPengusul">
            Alamat Perusahaan
          </Label>
          <Controller
            id="alamatPengusul"
            name="alamatPengusul"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="cth: Jl xxxxx"
                invalid={errors.alamatPengusul && true}
                {...field}
              />
            )}
          />
          {errors.alamatPengusul && (
            <FormFeedback>{errors.alamatPengusul.message}</FormFeedback>
          )}
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="provinsiPengusul">
            Provinsi
          </Label>
          <Controller
            id="provinsiPengusul"
            name="provinsiPengusul"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.provinsiPengusul}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih provinsi..."
                  className={classnames("react-select", {
                    "is-invalid": errors.provinsiPengusul,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.id);
                  }}
                  value={
                    queryProvinsi?.data?.find(
                      (provinsi) => provinsi.id === value
                    ) || ""
                  }
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nama}
                  options={queryProvinsi?.data || []}
                  isLoading={queryProvinsi?.isLoading || false}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="kabupatenPengusul">
            Kabupaten
          </Label>
          <Controller
            id="kabupatenPengusul"
            name="kabupatenPengusul"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.kabupatenPengusul}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih kabupaten..."
                  className={classnames("react-select", {
                    "is-invalid": errors.kabupatenPengusul,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.id);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nama}
                  value={
                    queryKabupaten?.data?.find((c) => c.id === value) || ""
                  }
                  options={queryKabupaten?.data || []}
                  isLoading={queryKabupaten?.isLoading || false}
                  isDisabled={!provinsiId || provinsiId === "0"}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="kecamatanPengusul">
            Kecamatan
          </Label>
          <Controller
            id="kecamatanPengusul"
            name="kecamatanPengusul"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.kecamatanPengusul}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih kecamatan..."
                  className={classnames("react-select", {
                    "is-invalid": errors.kecamatanPengusul,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.id);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nama}
                  value={
                    queryKecamatan?.data?.find((c) => c.id === value) || ""
                  }
                  options={queryKecamatan?.data || []}
                  isLoading={queryKecamatan?.isLoading || false}
                  isDisabled={!kabupatenId || kabupatenId === "0"}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="desaPengusul">
            Desa/Kelurahan
          </Label>
          <Controller
            id="desaPengusul"
            name="desaPengusul"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.desaPengusul}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih desa..."
                  className={classnames("react-select", {
                    "is-invalid": errors.desaPengusul,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.id);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nama}
                  value={queryDesa?.data?.find((c) => c.id === value) || ""}
                  options={queryDesa?.data || []}
                  isLoading={queryDesa?.isLoading || false}
                  isDisabled={!kecamatanId || kecamatanId === "0"}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
      </Row>
      <br></br>
      <Row>
        <h5>Administrasi</h5>
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
          <Label className="form-label" for="tahunBantuanPsu">
            Tahun Anggaran
          </Label>
          <Controller
            id="tahunBantuanPsu"
            name="tahunBantuanPsu"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.tahunBantuanPsu}>
                <Select
                  menuPlacement="auto"
                  options={optionsTahun}
                  placeholder="Silahkan pilih tahun..."
                  className={classnames("react-select", {
                    "is-invalid": errors.tahunBantuanPsu,
                  })}
                  classNamePrefix="select"
                  onChange={(value) => {
                    onChange(value.value);
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

export default FormPengembang;
