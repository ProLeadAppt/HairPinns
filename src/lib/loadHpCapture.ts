export async function getHpCapture() {
  const mod = await import("./hpCapture");
  return mod.default || mod.hpCapture;
}
