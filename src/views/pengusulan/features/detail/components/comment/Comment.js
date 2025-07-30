import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Alert,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import Avatar from "@components/avatar";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useCreateCommentMutation } from "../../../../domains";
import moment from "moment";
import "moment/locale/id";

import "./comment.scss";
import sweetalert from "@src/utility/sweetalert";

const Comment = ({ usulanId, comments = [] }) => {
  const [createComment, resultCreateComment] = useCreateCommentMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
    },
    resolver: yupResolver(
      Yup.object({
        message: Yup.string()
          .typeError("Komentar tidak boleh kosong")
          .required("Komentar tidak boleh kosong"),
      })
    ),
  });
  async function onSubmit(values) {
    try {
      await createComment({
        id: usulanId,
        message: values.message,
      }).unwrap();
      reset();
      sweetalert.fire({
        icon: "success",
        title: "Berhasil",
        html: "Komentar berhasil disimpan",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      sweetalert.fire({
        icon: "error",
        title: "Gagal",
        html: error?.data?.message ?? "Komentar gagal disimpan",
        type: "error",
      });
    }
  }
  return (
    <UncontrolledAccordion
      className="shadow"
      style={{ borderRadius: "0.428rem" }}
      defaultOpen="data-comment"
    >
      <AccordionItem>
        <AccordionHeader
          targetId="data-comment"
          className="title-accordion-text"
        >
          Komentar
        </AccordionHeader>
        <AccordionBody accordionId="data-comment">
          {comments.length > 0 ? (
            <div className="comments-wrapper">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item-wrapper">
                  <div className="comment-item">
                    <Avatar
                      className="mr-1"
                      initials
                      content={comment?.User?.nama}
                    />
                    <div className="comment-item-header">
                      <div className="comment-item-title">
                        {comment?.User?.nama ?? ""}
                      </div>
                      <div className="comment-item-date">
                        {moment(comment?.createdAt).format("LL")}
                      </div>
                    </div>
                  </div>

                  <div className="comment-item-description">
                    {comment?.message ?? ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert color="secondary">
              <div className="alert-body d-flex align-items-center justify-content-center">
                <span className="ms-50 fs-5">Belum ada komentar</span>
              </div>
            </Alert>
          )}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1">
              <Label for="message" className="form-label">
                Komentar
              </Label>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Input
                    id="message"
                    placeholder="Masukan komentar anda"
                    invalid={errors.message}
                    type="textarea"
                    {...field}
                  />
                )}
              />
              {errors.message && (
                <FormFeedback>{errors.message.message}</FormFeedback>
              )}
            </div>
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                color="primary"
                disabled={resultCreateComment.isLoading}
              >
                Simpan
              </Button>
            </div>
          </Form>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default Comment;
