import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-warm-ivory text-[#1c1b1b] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          alt="High fashion editorial background"
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 scale-105"
          src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2940&auto=format&fit=crop"
        />
        <div className="relative z-20 text-center px-6">
          <span className="text-[10px] text-champagne-gold uppercase tracking-[0.4em] font-semibold mb-3 block">
            OUR STORY
          </span>
          <h1 className="font-serif text-4xl md:text-[64px] text-white font-bold leading-none tracking-tight max-w-4xl">
            Crafting Elegance Since 2020
          </h1>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative overflow-hidden rounded-2xl shadow-sm">
            <img
              alt="Artisan fabric details"
              className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-[2000ms]"
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-8 space-y-6">
            <span className="text-[10px] text-champagne-gold tracking-[0.3em] uppercase block font-semibold">
              THE VISION
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 leading-tight">
              Where Craft Meets Couture
            </h2>
            <div className="space-y-6 text-neutral-500 font-light text-sm md:text-base leading-relaxed">
              <p>
                At YOUR STYLE, we believe that true elegance is a silent dialogue
                between the artisan and the wearer. Born in the heart of
                contemporary design, our atelier serves as a sanctuary for those
                who appreciate the poetry in a perfectly executed stitch and the
                soul of ethically sourced materials.
              </p>
              <p>
                Our philosophy is rooted in the "less but better" mandate. We
                reject the ephemeral nature of trend-cycles in favor of
                architectural silhouettes that command presence through quiet
                confidence. Every piece we create is a testament to our
                uncompromising pursuit of quality and heritage craftsmanship.
              </p>
              <p>
                By blending traditional tailoring techniques with modern
                innovation, we define a new era of luxury—one that is conscious,
                deliberate, and timelessly sophisticated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#f3ece9]/60 border-y border-silk py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Sustainability */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-champagne-gold flex items-center justify-center bg-white text-champagne-gold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-800">SUSTAINABILITY</h3>
              <p className="text-neutral-500 font-light text-sm max-w-xs leading-relaxed">
                Honoring our planet through ethical sourcing and a circular production model that minimizes waste.
              </p>
            </div>

            {/* Craftsmanship */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-champagne-gold flex items-center justify-center bg-white text-champagne-gold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-800">CRAFTSMANSHIP</h3>
              <p className="text-neutral-500 font-light text-sm max-w-xs leading-relaxed">
                Mastering the intricate details that transform fabric into a wearable masterpiece of structural integrity.
              </p>
            </div>

            {/* Innovation */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-champagne-gold flex items-center justify-center bg-white text-champagne-gold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-800">INNOVATION</h3>
              <p className="text-neutral-500 font-light text-sm max-w-xs leading-relaxed">
                Pushing the boundaries of design with avant-garde techniques while respecting the tenets of classical fashion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Artisans Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-28">
        <div className="text-center mb-20">
          <span className="text-[10px] text-champagne-gold uppercase tracking-[0.3em] block mb-3 font-semibold">
            THE ARTISANS
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 uppercase">
            Meet Our Visionaries
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Mitchell',
              role: 'Creative Director',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop',
            },
            {
              name: 'Elena Rossi',
              role: 'Head of Design',
              image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2861&auto=format&fit=crop',
            },
            {
              name: 'Marco Valenti',
              role: 'Master Tailor',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop',
            },
          ].map((member, idx) => (
            <div
              key={member.name}
              className={`flex flex-col ${
                idx === 1 ? 'md:translate-y-8' : ''
              } bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="overflow-hidden aspect-[3/4]">
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  alt={member.name}
                  src={member.image}
                />
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl font-bold text-neutral-800 mb-1">
                  {member.name}
                </h4>
                <p className="text-[10px] text-champagne-gold uppercase tracking-widest font-semibold">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline / Journey Section */}
      <section className="bg-white/40 border-t border-silk py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="text-center mb-24">
            <span className="text-[10px] text-champagne-gold uppercase tracking-[0.3em] block mb-3 font-semibold">
              OUR JOURNEY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 uppercase">
              Milestones of Excellence
            </h2>
          </div>

          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-neutral-200 hidden md:block transform -translate-x-1/2" />

            <div className="space-y-16 md:space-y-24">
              {[
                {
                  year: '2020',
                  title: 'Founded',
                  desc: 'YOUR STYLE is born from a desire to redefine contemporary luxury through ancestral techniques.',
                },
                {
                  year: '2022',
                  title: 'Flagship Store Opens',
                  desc: 'A minimalist sanctuary opens its doors on Milans Via Montenapoleone, merging architecture with fashion.',
                },
                {
                  year: '2024',
                  title: 'Sustainability Pledge',
                  desc: 'Achieving 100% transparency in our supply chain and launching our first fully circular textile initiative.',
                },
                {
                  year: '2026',
                  title: 'Digital High-Fashion Atelier',
                  desc: 'Launching our advanced bespoke platform, bridging custom handcrafting and worldwide availability.',
                },
              ].map((milestone, idx) => (
                <div
                  key={milestone.year}
                  className={`flex flex-col md:flex-row items-center justify-between w-full relative ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`w-full md:w-5/12 text-center ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="font-serif text-5xl md:text-6xl text-champagne-gold font-light opacity-50 mb-2 block">
                      {milestone.year}
                    </span>
                    <h4 className="font-serif text-xl font-bold text-neutral-800 mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-neutral-500 font-light text-sm max-w-md mx-auto md:mx-0">
                      {milestone.desc}
                    </p>
                  </div>

                  {/* Bullet */}
                  <div className="hidden md:block w-3.5 h-3.5 rounded-full bg-champagne-gold absolute left-1/2 transform -translate-x-1/2 z-10 border-4 border-white shadow-sm" />

                  <div className="w-full md:w-5/12 h-0 md:h-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-gold rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6 px-6">
          <h2 className="font-serif text-3xl md:text-5xl text-white">Join Our Journey</h2>
          <p className="text-sm font-light text-neutral-400 max-w-md mx-auto leading-relaxed">
            Experience our timeless designs and beautiful bespoke craftsmanship today.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#755a24] text-white px-10 py-4 text-xs font-semibold tracking-widest uppercase rounded-md hover:bg-white hover:text-black transition-all duration-300"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
