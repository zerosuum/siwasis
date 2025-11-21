import { proxyJSON } from "./_api";

export async function getPeriodes() {
  return proxyJSON("/periode");
}