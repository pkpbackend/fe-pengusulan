import sweetalert from "@src/utility/sweetalert";
import { Mail } from "react-feather";
import { useSendEmailNotificationMutation } from "../../../../domains";

function SendEmailNotification(props) {
  const { verminId, documentPdf } = props;
  const [sendEmailNotification] = useSendEmailNotificationMutation();

  function handleClick() {
    sweetalert
      .fire({
        title: "Konfirmasi",
        text: "Apakah anda yakin ingin mengirim notifikasi email ke PIC usulan ini?",
        type: "question",
        icon: "info",
        confirmButtonText: "Ya, Kirim",
        showCancelButton: true,
        cancelButtonText: "Batal",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const { namePdf, filePdf } = await documentPdf();
            await sendEmailNotification({
              VerminId: verminId,
              filePdf,
              namePdf,
            }).unwrap();
            return true;
          } catch (error) {
            sweetalert.showValidationMessage(
              `Gagal mengirim notifikasi email.`
            );
            return false;
          }
        },
        allowOutsideClick: () => !sweetalert.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          sweetalert.fire(
            "Berhasil",
            "Berhasil mengirim notifikasi email",
            "success"
          );
        }
      });
  }

  return (
    <span
      className="btn btn-secondary btn-sm"
      tabIndex={-1}
      role="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
      style={{ marginLeft: 8 }}
    >
      <Mail size={14} />
      Kirim notifikasi email
    </span>
  );
}

export default SendEmailNotification;
