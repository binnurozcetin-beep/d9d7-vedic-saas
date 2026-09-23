import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @fusionstrings/swisseph-wasi paketi bir .wasm dosyası içe aktarıyor;
  // Turbopack/webpack'in bunu bundle etmeye çalışıp hata vermesini önlemek
  // için bu paketi sunucu tarafında "external" olarak işaretliyoruz —
  // böylece Next.js onu paketlemeye çalışmaz, doğrudan Node.js çalışma
  // zamanında normal şekilde yüklenir.
  serverExternalPackages: ["@fusionstrings/swisseph-wasi"],
};

export default nextConfig;
