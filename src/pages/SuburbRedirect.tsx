import { Navigate, useParams } from "react-router-dom";

const LEGACY_SUBURB_TARGETS: Record<string, string> = {
  bangor: "bangor-2234",
  menai: "menai-2234",
  illawong: "illawong-2234",
  "alfords-point": "alfords-point-2234",
  sutherland: "sutherland-2232",
  kirrawee: "kirrawee-2232",
  kareela: "kareela-2232",
  como: "como-2226",
  gymea: "gymea-2227",
  miranda: "miranda-2228",
  cronulla: "cronulla-2230",
  "barden-ridge": "barden-ridge-2234",
  caringbah: "caringbah-2229",
  jannali: "jannali-2226",
  "oyster-bay": "oyster-bay-2225",
  padstow: "padstow-2211",
  sylvania: "sylvania-2224",
};

/** Client-side counterpart to the permanent Netlify legacy suburb redirects. */
const SuburbRedirect = () => {
  const { suburb } = useParams<{ suburb: string }>();
  const target = suburb ? LEGACY_SUBURB_TARGETS[suburb] : undefined;
  return <Navigate to={target ? `/areas/${target}` : "/areas"} replace />;
};

export default SuburbRedirect;
