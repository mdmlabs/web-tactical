import { Notify } from "quasar";

/**
 * Notification composable. Replaces mixins.js notify methods.
 */
export function useNotification() {
  function notifySuccess(msg: string, timeout = 2000) {
    Notify.create({
      type: "positive",
      message: msg,
      timeout,
    });
  }

  function notifyError(msg: string, timeout = 2000) {
    Notify.create({
      type: "negative",
      message: msg,
      timeout,
    });
  }

  function notifyWarning(msg: string, timeout = 2000) {
    Notify.create({
      type: "warning",
      message: msg,
      timeout,
    });
  }

  function notifyInfo(msg: string, timeout = 2000) {
    Notify.create({
      type: "info",
      message: msg,
      timeout,
    });
  }

  return { notifySuccess, notifyError, notifyWarning, notifyInfo };
}
