import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-amber-900">
              Overnight Oats,
              <br />
              <span className="text-amber-600">Elevated</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Discover the perfect blend of convenience and nutrition with our artisanal overnight oats. Prepared with love, ready for your morning.
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Shop Now
            </button>
          </div>
          <div className="flex-1 relative h-[400px] w-full">
            <Image
              src="/images/oatjar1-trans.png"
              alt="Artisanal Overnight Oats Jar"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">
            Why Choose Our Overnight Oats?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4 p-6 rounded-xl hover:bg-amber-50 transition-colors">
                <div className="text-amber-600 text-4xl flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-amber-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">
            Our Signature Blends
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <Image
                src="/images/aioats1.png"
                alt="Classic Overnight Oats"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <Image
                src="/images/aioats2.png"
                alt="Berry Bliss Overnight Oats"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    icon: "🌱",
    title: "100% Natural",
    description: "Made with premium organic ingredients, sourced from trusted farmers."
  },
  {
    icon: "⏰",
    title: "Ready to Eat",
    description: "Perfect breakfast waiting for you every morning, no preparation needed."
  },
  {
    icon: "💪",
    title: "Nutrient Rich",
    description: "Packed with protein, fiber, and essential nutrients for a healthy start."
  }
];
