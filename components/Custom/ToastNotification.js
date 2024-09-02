import { toast } from "react-toastify";

const ToastNotification = ({ title, description }) => (
  <div className="flex flex-col">
    <p className="font-bold text-sm text-zinc-950 font-montserrat">{title}</p>
    <p className="text-sm font-montserrat">{description}</p>
  </div>
);

export const showToastNotificationSuccess = (title, description) =>
  toast.success(<ToastNotification title={title} description={description} />, {
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    icon: false,
    progressStyle: {
      backgroundColor: "#015640",
    },
  });

export const showToastNotificationError = (title, description) =>
  toast.error(<ToastNotification title={title} description={description} />, {
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    icon: false,
    progressStyle: {
      backgroundColor: "#015640",
    },
  });
    