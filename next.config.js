/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "images.samsung.com" },
      { protocol: "https", hostname: "i01.appmifile.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Supabase Storage (product images)
      { protocol: "https", hostname: "*.supabase.co" },
      // CashMóvil shop images
      { protocol: "https", hostname: "cashmovil.shop" },
      // Back Market (cdn-cgi proxy + origin cloudfront)
      { protocol: "https", hostname: "www.backmarket.es" },
      { protocol: "https", hostname: "backmarket.es" },
      { protocol: "https", hostname: "d2e6ccujb3mkqf.cloudfront.net" },
    ],
  },
};

module.exports = nextConfig;
