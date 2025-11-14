export function isAbortError(err: any) {
  return (
    err?.code === "ERR_CANCELED" ||             
    err?.name === "CanceledError" ||           
    err?.message?.toLowerCase?.() === "canceled" ||
    err?.__CANCEL__ === true
  );
}
