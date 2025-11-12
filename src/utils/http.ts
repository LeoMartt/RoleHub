// src/utils/http.ts
export function isAbortError(err: any) {
  return (
    err?.code === "ERR_CANCELED" ||              // axios
    err?.name === "CanceledError" ||            // axios/fetch
    err?.message?.toLowerCase?.() === "canceled" ||
    err?.__CANCEL__ === true
  );
}
