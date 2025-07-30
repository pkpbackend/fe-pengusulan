import { yupResolver } from "@hookform/resolvers/yup";
import classnames from "classnames";
import React from "react";
import Flatpickr from "react-flatpickr";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import * as yup from "yup";

import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSendToPenetapanMutation } from "../../../domains";
import sweetalert from "@src/utility/sweetalert";

const defaultValues = {
  noSk: "",
  tanggalSk: "",
};

const ModalSendToPenetapan = ({ open, onClose, usulan }) => {
  const [sendToPenetapan] = useSendToPenetapanMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(
      yup.object().shape({
        noSk: yup.string().required("No SK wajib diisi"),
        tanggalSk: yup.string().required("Tanggal SK wajib diisi"),
      })
    ),
  });

  const onSubmit = async (values) => {
    try {
      await sendToPenetapan({
        DirektoratId: usulan.DirektoratId,
        noSk: values.noSk,
        tanggalSk: values.tanggalSk,
        totalUnit: 1,
        usulans: [
          {
            UsulanId: usulan.id,
            CityId: usulan.CityId,
            ProvinsiId: usulan.ProvinsiId,
            jumlahUnit: 1,
          },
        ],
      }).unwrap();

      sweetalert
        .fire("Sukses", `Berhasil mengirim ke Penetapan`, "success")
        .then(() => onClose());
    } catch (error) {
      sweetalert.fire("Gagal", `Gagal mengirim ke Penetapan`, "error");
    }
  };

  return (
    <Modal
      isOpen={open}
      toggle={onClose}
      unmountOnClose
      centered
      backdrop={isSubmitting ? "static" : true}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={onClose}>Kirim ke Penetapan</ModalHeader>
        <ModalBody>
          <div className="mb-1">
            <Label for="noSk">No. SK</Label>
            <Controller
              name="noSk"
              control={control}
              render={({ field }) => (
                <Input
                  id="noSk"
                  invalid={errors.noSk && true}
                  placeholder="Masukan nomor sk"
                  {...field}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.noSk && <FormFeedback>{errors.noSk.message}</FormFeedback>}
          </div>
          <div>
            <Label for="tanggalSk">Tanggal</Label>
            <Controller
              name="tanggalSk"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className={classnames("form-control", {
                    "is-invalid": errors.tanggalSk,
                  })}
                  placeholder="Pilih tanggal sk"
                  options={{
                    dateFormat: "d-m-Y",
                  }}
                  disabled={isSubmitting}
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date[0]);
                  }}
                />
              )}
            />
            {errors.tanggalSk && (
              <FormFeedback>{errors.tanggalSk.message}</FormFeedback>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            onClick={onClose}
            outline
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : null}
            Kirim
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ModalSendToPenetapan;
