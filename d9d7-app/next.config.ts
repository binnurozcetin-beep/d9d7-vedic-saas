import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sweph, native bir Node.js eklentisidir (.node dosyası). Turbopack/webpack'in
  // bunu bundle etmeye çalışıp hata vermesini önlemek için sunucu tarafında
  // "external" olarak işaretliyoruz — Next.js onu paketlemeye çalışmaz,
  // doğrudan Node.js çalışma zamanında normal require ile yüklenir.
  serverExternalPackages: ["sweph"],
};

export default nextConfig;
