import React, { Fragment, useEffect, useState } from "react";
import {
  Form,
  FormFeedback,
  Row,
  Col,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { PlusSquare, Trash2 } from "react-feather";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProvinsiQuery, useKabupatenQuery } from "@globalapi/wilayah";
import { useUsulanQuery } from "../../../../pengusulan/domains";
import {
  useCreatePenetapanMutation,
  useUpdatePenetapanMutation,
} from "../../../domains";
import { formSchemaReguler } from "./schema";

import "@styles/react/libs/flatpickr/flatpickr.scss";
import sweetalert from "@src/utility/sweetalert";

const defaultValues = {
  noSk: "",
  tanggalSk: "",
  totalUnit: 0,
  keterangan: "",
  skPenetapan: "",
  DirektoratId: "",
  PenetapanUsulans: [],
};

const ListForm = ({ toggle, onClose }) => {
  const { DirektoratId, open, isNew, record } = toggle;

  const [loading, setLoading] = useState(false);

  const [createPenetapan] = useCreatePenetapanMutation();
  const [updatePenetapan] = useUpdatePenetapanMutation();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(formSchemaReguler()),
  });

  const [usulanActiveIndex, setUsulanActiveIndex] = useState();

  const ProvinsiActiveId = watch("ProvinsiActiveId");
  const CityActiveId = watch("CityActiveId");

  const queryProvinsi = useProvinsiQuery();
  const queryKabupaten = useKabupatenQuery(ProvinsiActiveId, {
    skip: !ProvinsiActiveId || ProvinsiActiveId === "0",
  });

  const [usulanAttr, setUsulanAttr] = useState({
    filtered: null,
    page: 1,
    pageSize: 100,
  });
  const queryUsulan = useUsulanQuery(usulanAttr);

  useEffect(() => {
    if (ProvinsiActiveId && usulanActiveIndex >= 0 && queryKabupaten.data) {
      const newPenetapanUsulans = [...getValues().PenetapanUsulans];
      newPenetapanUsulans[usulanActiveIndex]["optCity"] = queryKabupaten.data;
      setValue("PenetapanUsulans", newPenetapanUsulans);
    }
  }, [ProvinsiActiveId, usulanActiveIndex, queryKabupaten.data]);

  useEffect(() => {
    if (CityActiveId && usulanActiveIndex >= 0 && queryUsulan.data) {
      console.log("queryUsulan.data");
      console.log(queryUsulan.data);
      const newPenetapanUsulans = [...getValues().PenetapanUsulans];
      newPenetapanUsulans[usulanActiveIndex]["optUsulan"] =
        queryUsulan.data.data;
      setValue("PenetapanUsulans", newPenetapanUsulans);
    }
  }, [CityActiveId, usulanActiveIndex, queryUsulan.data]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        if (name === "PenetapanUsulans") {
          let totalUnit = 0;
          for (const usulan of value.PenetapanUsulans) {
            totalUnit += usulan.jumlahUnit;
          }
          setValue("totalUnit", totalUnit);
        }

        if (name === "ProvinsiActiveId") {
          setValue("CityActiveId", "0", { shouldDirty: true });
        }

        if (name === "CityActiveId") {
          setUsulanAttr((val) => ({
            ...val,
            filtered: [
              {
                id: "DirektoratId",
                value: isNew ? DirektoratId : record?.DirektoratId,
              },
              { id: "CityId", value: value.CityActiveId },
            ],
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, DirektoratId, record]);

  const onSubmit = async (data) => {
    setLoading(true);

    const dTanggalSk = new Date(data.tanggalSk);
    const tanggalSk = `${dTanggalSk.getFullYear()}-${
      dTanggalSk.getMonth() + 1
    }-${dTanggalSk.getDate()}`;

    try {
      if (isNew) {
        const payload = {
          ...data,
          DirektoratId,
          tanggalSk,
          // Hapus ini kalau di BE sudah disesuaikan
          usulans: data.PenetapanUsulans,
        };
        await createPenetapan(payload).unwrap();
      } else {
        const payload = {
          ...record,
          ...data,
          DirektoratId: record?.DirektoratId,
          tanggalSk,
          // Hapus ini kalau di BE sudah disesuaikan
          usulans: data.PenetapanUsulans,
        };
        await updatePenetapan(payload).unwrap();
      }

      sweetalert
        .fire(
          "Sukses",
          `Berhasil ${isNew ? "membuat" : "mengubah"} Penetapan`,
          "success"
        )
        .then(() => onClose());
    } catch (error) {
      sweetalert.fire(
        "Gagal",
        `Gagal ${isNew ? "membuat" : "mengubah"} Penetapan`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNew) {
      reset();
      setValue("totalUnit", 1);
      setValue("PenetapanUsulans", [
        {
          id: `new-${Math.random().toString()}`,
          ProvinsiId: "",
          CityId: "",
          City: {},
          optCity: [],
          jumlahUnit: 1,
          UsulanId: "",
          optUsulan: [],
        },
      ]);
    } else if (record) {
      const { noSk, tanggalSk, totalUnit, keterangan, PenetapanUsulans } =
        record;

      const newPenetapanUsulans = PenetapanUsulans
        ? PenetapanUsulans.map(({ ...penetapanUsulan }, index) => {
            return {
              ...penetapanUsulan,
              optCity: [],
              optUsulan: [],
            };
          })
        : [];

      setValue("noSk", noSk);
      setValue("tanggalSk", new Date(tanggalSk));
      setValue("totalUnit", totalUnit);
      setValue("keterangan", keterangan);
      setValue("PenetapanUsulans", newPenetapanUsulans);
    }
  }, [isNew, record]);

  const [isRUK, setIsRUK] = useState(false);

  useEffect(() => {
    if (isNew && DirektoratId === 4) {
      setIsRUK(true);
    } else if (!isNew && record?.DirektoratId === 4) {
      setIsRUK(true);
    } else {
      setIsRUK(false);
    }
  }, [isNew, DirektoratId, record]);

  const setFormValue = (field, value) => {
    setValue(field, value);
  };

  const filterUsulanByCityId = (CityId) => {
    setUsulanAttr((val) => ({
      ...val,
      filtered: [
        {
          id: "DirektoratId",
          value: isNew ? DirektoratId : record?.DirektoratId,
        },
        { id: "CityId", value: CityId },
      ],
    }));
  };

  return (
    <Modal isOpen={open} className="modal-xl" toggle={onClose}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={onClose} className="bg-darkblue">
          <h5 style={{ color: "!white" }}>
            {isNew ? "Tambah" : "Edit"} Penetapan
          </h5>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="1" className="mb-1">
              <Label className="form-label" for="noSk">
                No. SK
              </Label>
            </Col>
            <Col md="11" className="mb-1">
              <Controller
                id="noSk"
                name="noSk"
                control={control}
                render={({ field }) => (
                  <Input invalid={errors.noSk && true} {...field} />
                )}
              />
              {errors.noSk && (
                <FormFeedback>{errors.noSk.message}</FormFeedback>
              )}
            </Col>

            <Col md="1" className="mb-1">
              <Label className="form-label" for="tanggalSk">
                Tanggal
              </Label>
            </Col>
            <Col md="11" className="mb-1">
              <Controller
                id="tanggalSk"
                name="tanggalSk"
                control={control}
                render={({ field }) => (
                  <CustomInputWrapper error={errors.tanggalSk}>
                    <Flatpickr
                      {...field}
                      className={classnames("form-control", {
                        "is-invalid": errors.tanggalSk,
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
              {errors.tanggalSk && (
                <FormFeedback>{errors.tanggalSk.message}</FormFeedback>
              )}
            </Col>

            <Row>
              <Col md="1" className="mb-1">
                <Label className="form-label" for="jumlahUnit">
                  {!isRUK ? "Jumlah Unit" : "Lokasi"}
                </Label>
              </Col>
              <Col md="11" className="mb-1">
                <Controller
                  id="PenetapanUsulans"
                  name="PenetapanUsulans"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Fragment>
                      {value.map(
                        (
                          {
                            id,
                            ProvinsiId,
                            CityId,
                            City,
                            optCity,
                            jumlahUnit,
                            UsulanId,
                            Usulan,
                            optUsulan,
                          },
                          index
                        ) => {
                          const handleFieldChange = (iField, iValue) => {
                            const newValue = [...value];
                            newValue[index][iField] = iValue;
                            onChange(newValue);
                          };

                          const handleAddUsulan = () => {
                            const newValue = [...value];
                            newValue.push({
                              id: `new-${Math.random().toString()}`,
                              ProvinsiId: "",
                              CityId: "",
                              City: {},
                              optCity: [],
                              jumlahUnit: 1,
                              UsulanId: "",
                              optUsulan: [],
                            });
                            onChange(newValue);
                          };

                          const handleDeleteUsulan = () => {
                            const newValue = [...value];
                            newValue.splice(index, 1);
                            onChange(newValue);
                          };

                          return (
                            <Row key={id}>
                              <Col md="3" className="mb-1">
                                <CustomInputWrapper>
                                  <Select
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                    menuPlacement="auto"
                                    placeholder="Pilih provinsi..."
                                    classNamePrefix="select"
                                    getOptionValue={(option) => option.id}
                                    getOptionLabel={(option) => option.nama}
                                    options={queryProvinsi?.data || []}
                                    isLoading={
                                      queryProvinsi?.isLoading || false
                                    }
                                    onChange={(record) => {
                                      setFormValue(
                                        "ProvinsiActiveId",
                                        record.id
                                      );
                                      handleFieldChange(
                                        "ProvinsiId",
                                        record.id
                                      );
                                      setUsulanActiveIndex(index);
                                    }}
                                    value={
                                      queryProvinsi?.data?.find(
                                        (c) => c.id === ProvinsiId
                                      ) || ""
                                    }
                                  />
                                  {/* id: {JSON.stringify(test)} */}
                                </CustomInputWrapper>
                              </Col>
                              <Col md="3" className="mb-1">
                                <CustomInputWrapper>
                                  {optCity.length > 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                      menuPlacement="auto"
                                      placeholder="Pilih kabupaten/kota..."
                                      classNamePrefix="select"
                                      getOptionValue={(option) => option.id}
                                      getOptionLabel={(option) => option.nama}
                                      options={optCity}
                                      isLoading={
                                        queryKabupaten?.isLoading || false
                                      }
                                      isDisabled={
                                        !ProvinsiId || ProvinsiId === "0"
                                      }
                                      onChange={(record) => {
                                        setFormValue("CityActiveId", record.id);

                                        handleFieldChange("CityId", record.id);
                                        filterUsulanByCityId(record.id);

                                        setUsulanActiveIndex(index);
                                      }}
                                      value={
                                        optCity.find((c) => c.id === CityId) ||
                                        ""
                                      }
                                    />
                                  ) : (
                                    <Select
                                      placeholder={
                                        City?.nama || "Pilih kabupaten/kota..."
                                      }
                                      isDisabled
                                    />
                                  )}
                                </CustomInputWrapper>
                              </Col>
                              {!isRUK && (
                                <Col md="2" className="mb-1">
                                  <Input
                                    value={jumlahUnit}
                                    onChange={(event) => {
                                      const newJumlahUnit = event.target.value
                                        ? parseInt(event.target.value)
                                        : 1;
                                      handleFieldChange(
                                        "jumlahUnit",
                                        newJumlahUnit
                                      );
                                    }}
                                    type="number"
                                  />
                                </Col>
                              )}
                              <Col md="3" className="mb-1">
                                <CustomInputWrapper>
                                  {optUsulan.length > 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                      menuPlacement="auto"
                                      placeholder="Pilih usulan..."
                                      classNamePrefix="select"
                                      getOptionValue={(option) => option.id}
                                      getOptionLabel={(option) =>
                                        option.noUsulan
                                      }
                                      // options={queryUsulan?.data?.data || []}
                                      options={optUsulan}
                                      onChange={(record) =>
                                        handleFieldChange("UsulanId", record.id)
                                      }
                                      isLoading={
                                        queryUsulan?.isLoading || false
                                      }
                                      isDisabled={!CityId || CityId === "0"}
                                      value={
                                        optUsulan.find(
                                          (c) => c.id === UsulanId
                                        ) || ""
                                      }
                                    />
                                  ) : (
                                    <Select
                                      placeholder={
                                        Usulan?.noUsulan || "Pilih usulan..."
                                      }
                                      isDisabled
                                    />
                                  )}
                                </CustomInputWrapper>
                              </Col>
                              <Col md="1" className="mb-1">
                                {index === 0 ? (
                                  <a onClick={handleAddUsulan}>
                                    <PlusSquare style={{ color: "#7367f0" }} />
                                  </a>
                                ) : (
                                  <a onClick={handleDeleteUsulan}>
                                    <Trash2 style={{ color: "#ea5455" }} />
                                  </a>
                                )}
                              </Col>
                            </Row>
                          );
                        }
                      )}
                    </Fragment>
                  )}
                />
              </Col>
            </Row>

            <Col md="1" className="mb-1">
              <Label className="form-label" for="totalUnit">
                {!isRUK ? "Total Unit" : "Total Lokasi"}
              </Label>
            </Col>
            <Col md="11" className="mb-1">
              <Controller
                id="totalUnit"
                name="totalUnit"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="cth: 1"
                    invalid={errors.totalUnit && true}
                    {...field}
                    disabled
                  />
                )}
              />
              {errors.totalUnit && (
                <FormFeedback>{errors.totalUnit.message}</FormFeedback>
              )}
            </Col>

            <Col md="1" className="mb-1">
              <Label className="form-label" for="keterangan">
                Keterangan
              </Label>
            </Col>
            <Col md="11" className="mb-1">
              <Controller
                id="keterangan"
                name="keterangan"
                control={control}
                render={({ field }) => (
                  <Input
                    invalid={errors.keterangan && true}
                    {...field}
                    type="textarea"
                    rows={3}
                  />
                )}
              />
              {errors.keterangan && (
                <FormFeedback>{errors.keterangan.message}</FormFeedback>
              )}
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" onClick={onClose} outline>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            Simpan
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ListForm;
