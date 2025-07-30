import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { useKecamatanQuery, useDesaQuery } from "@globalapi/wilayah";
import { useUsulanQuery } from "../../../../pengusulan/domains";
import { useUpdateUsulanMutation } from "../../../domains";
import sweetalert from "@src/utility/sweetalert";

const defaultValues = {
  KecamatanId: "",
  DesaId: "",
  KdUsulanId: "",
};

const FormEditUsulan = ({ toggle, onClose }) => {
  const { DirektoratId, recordActive, open } = toggle;

  const [loading, setLoading] = useState(false);

  const [updateUsulan] = useUpdateUsulanMutation();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    // resolver: yupResolver(formSchemaReguler())
  });

  const KecamatanId = watch("KecamatanId");
  const DesaId = watch("DesaId");
  const KdUsulanId = watch("KdUsulanId");

  const queryKecamatan = useKecamatanQuery(recordActive?.CityId, {
    skip: !recordActive?.CityId || recordActive?.CityId === "0",
  });
  const queryDesa = useDesaQuery(KecamatanId, {
    skip: !KecamatanId || KecamatanId === "0",
  });
  const [usulanAttr, setUsulanAttr] = useState({
    filtered: null,
    page: 1,
    pageSize: 100,
  });
  const queryUsulan = useUsulanQuery(usulanAttr);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name === "DesaId") {
        setUsulanAttr((val) => ({
          ...val,
          filtered: [
            // {id: 'DirektoratId', value: DirektoratId},
            { id: "DesaId", value: value.DesaId },
          ],
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, DirektoratId]);

  const onSubmit = async ({ KecamatanId, DesaId, KdUsulanId }) => {
    if (!KecamatanId || !DesaId || !KdUsulanId) return;

    setLoading(true);

    try {
      const payload = {
        PenetapanId: recordActive?.PenetapanId,
        UsulanId: recordActive?.UsulanId,
        KecamatanId,
        DesaId,
        KdUsulanId,
      };
      await updateUsulan(payload).unwrap();

      sweetalert
        .fire("Sukses", `Berhasil mengubah Usulan Penetapan`, "success")
        .then(() => onClose());
    } catch (error) {
      sweetalert.fire("Gagal", `Gagal mengubah Usulan Penetapan`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("KecamatanId", recordActive?.KecamatanId);
    setValue("DesaId", recordActive?.DesaId);
    setValue("KdUsulanId", recordActive?.KdUsulanId);
  }, [recordActive]);

  return (
    <Modal className="modal-lg" toggle={onClose} isOpen={open}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={onClose} className="bg-darkblue">
          <h5 style={{ color: "!white" }}>Edit Usulan</h5>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="2" className="mb-1">
              <label>Kecamatan</label>
            </Col>
            <Col md="10" className="mb-1">
              <Controller
                id="KecamatanId"
                name="KecamatanId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInputWrapper error={errors.KecamatanId}>
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPlacement="auto"
                      placeholder="Silahkan pilih kecamatan..."
                      // className={classnames("react-select", {
                      //   "is-invalid": errors.KecamatanId,
                      // })}
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
                    />
                  </CustomInputWrapper>
                )}
              />
            </Col>

            <Col md="2" className="mb-1">
              <label>Desa</label>
            </Col>
            <Col md="10" className="mb-1">
              <Controller
                id="DesaId"
                name="DesaId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInputWrapper error={errors.DesaId}>
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPlacement="auto"
                      placeholder="Silahkan pilih desa..."
                      // className={classnames("react-select", {
                      //   "is-invalid": errors.DesaId,
                      // })}
                      classNamePrefix="select"
                      onChange={(val) => {
                        onChange(val.id);
                        // setValue('KdUsulanId', '')
                      }}
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => option.nama}
                      value={queryDesa?.data?.find((c) => c.id === value) || ""}
                      options={queryDesa?.data || []}
                      isLoading={queryDesa?.isLoading || false}
                      isDisabled={!KecamatanId || KecamatanId === "0"}
                    />
                  </CustomInputWrapper>
                )}
              />
            </Col>

            <Col md="2" className="mb-1">
              <label>No. SK</label>
            </Col>
            <Col md="10" className="mb-1">
              <Controller
                id="KdUsulanId"
                name="KdUsulanId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInputWrapper error={errors.KdUsulanId}>
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPlacement="auto"
                      placeholder="Silahkan pilih usulan..."
                      // className={classnames("react-select", {
                      //   "is-invalid": errors.KdUsulanId,
                      // })}
                      classNamePrefix="select"
                      onChange={(val) => {
                        onChange(val.id);
                      }}
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => option.noUsulan}
                      value={
                        queryUsulan?.data?.data?.find((c) => c.id === value) ||
                        ""
                      }
                      options={queryUsulan?.data?.data || []}
                      isLoading={queryUsulan?.isLoading || false}
                      isDisabled={!DesaId || DesaId === "0"}
                    />
                  </CustomInputWrapper>
                )}
              />
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" onClick={onClose} outline>
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={!(KecamatanId && DesaId && KdUsulanId) || loading}
          >
            Simpan
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default FormEditUsulan;
