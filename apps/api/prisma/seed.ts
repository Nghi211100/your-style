import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined. Please set it in your .env file.');
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with luxury products...');

  const products = [
    {
      name: 'Structured Wool Blazer',
      slug: 'structured-wool-blazer',
      description: 'A masterpiece of architectural tailoring, crafted from premium Italian wool. This blazer features sharp shoulders, a nipped-in waist, and hand-finished buttonholes for a silhouette of intentional restraint.',
      price: 1250,
      stock: 15,
      category: 'Blazers',
      images: [
        'https://lh3.googleusercontent.com/aida/ADBb0ui6vItKS79F0qOHdTPSg11BaW7kLhF3U4o4tduL4RJAiK8gh-1Rqj7Bvgr1KMiaAtluu9oinNMYxJQs95a4X1LZAeizbtI_ZLUBCV3_TSFrvyTuZIfpdpk1G8WIkLxoT4CMBx6TaNY9T7l29a7aL7ldUZ3VUbbpaT8s77d-Tm-8j7KDUNVQuz4eWIk94KTGtmAdgAi_cbo1FhAuIwFCk5lr_gbu4-4LayFk9hKuwJJpU-z1QhtVNHLDow'
      ],
      colors: ['Espresso', 'Ivory'],
      sizes: ['IT 38', 'IT 40', 'IT 42', 'IT 44']
    },
    {
      name: 'Cashmere Overcoat',
      slug: 'cashmere-overcoat',
      description: 'Generously proportioned yet meticulously sculpted. The cashmere overcoat features an asymmetric split layout that drapes effortlessly over any ensemble.',
      price: 2800,
      stock: 5,
      category: 'Outerwear',
      images: [
        'https://lh3.googleusercontent.com/aida/ADBb0uglKG_gR3VpcHgrjFJYTt__TWOTBivAu_-o1FweJ-f1YH4Fobk7x0BosCE2NbwSopG3Iq9eSFI__cDrEdrvHsmXlbs6lEKempHkqU8akE2qmgK82FSI39e86fexEON1MX_My_hg7Wm9IrDXmH1rzsg-D8YC7b0BkuSuXfskcLPx9IuAcgzIyCSewpM_O9B9SpZv2AGRB-3FLyyYkdfxBPOveVuO2mIdewDZaPVXgcFq9PwHLru9WTliu8c'
      ],
      colors: ['Stone', 'Espresso'],
      sizes: ['S', 'M', 'L']
    },
    {
      name: 'Pleated Wide-Leg Trousers',
      slug: 'pleated-wide-leg-trousers',
      description: 'Moving away from the excess of the past, these trousers focus on the harmony of the waistline and a subtle flare. Tailored from a fluid wool-silk blend.',
      price: 850,
      stock: 20,
      category: 'Trousers',
      images: [
        'https://lh3.googleusercontent.com/aida/ADBb0uh7oATmvqq3ttDk4IlXSya9lRX4d19Tmlokrq5p9AEBp69yipVUNAOwaghQ7UODKEixIFjkinM8v7Qi6NKNjzf1REaUOr2FBxOzcFnCeb_g0Edws44GeejQIZw0nBh0ijObDJ8Lk62lh2XwpuRY_CJIrCF64KoKFudKCU0P1w19OTVfvSNV1JPZllokXsaGticLSzUIv4-s1OvBRtD6PAtAQTbHkv656AzsEXMrQUojnbRMEgeXOENUnQ'
      ],
      colors: ['Ivory', 'Espresso', 'Stone'],
      sizes: ['IT 38', 'IT 40', 'IT 42', 'IT 44']
    },
    {
      name: 'Sustainable Silk Blouse',
      slug: 'sustainable-silk-blouse',
      description: 'A fluid canvas for your everyday wardrobe. Responsibly sourced silk is cut with geometric precision to create a blouse that moves like liquid while retaining its architectural shape.',
      price: 650,
      stock: 12,
      category: 'Tops',
      images: [
        'https://lh3.googleusercontent.com/aida/ADBb0uj6UeoJabgS-ncNV38KNWGb0hvQ4-L3faaHCEO_NgGmiT6LjO1meIXkCssUp8aTK6uiW2C7O_rTRxvyMNHc0dodueoDYNg6HH9-TDaojRg4xtHRpvOog0SGY-yWC77SZP30w0tozEKz7rcIiS0Bmqe62y12RfvnUnyAJSdzkHMtbiUHFJjlEXLcRE1MylygTWE6wME31KGtZrbqoEdegx3Z744rOQopvMAvqPK8mjZvUSA0SjzEsJzqLbw'
      ],
      colors: ['Champagne', 'Ivory'],
      sizes: ['XS', 'S', 'M', 'L']
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Seeding database with luxury blog posts...');
  
  const posts = [
    {
      title: 'The Art of Capsule Dressing',
      slug: 'the-art-of-capsule-dressing',
      summary: 'Discover the essential components of a timeless wardrobe. From structured silhouettes to high-quality fibers, we explore how to build a lasting identity.',
      content: 'Understanding the art of capsule dressing is an exercise in intentionality. In an era dominated by fleeting fashion cycles and loud, temporary aesthetics, true luxury lies in restraint. Building a timeless wardrobe begins with select garments that celebrate structure, texture, and exceptional craftsmanship.\n\nFirst, consider the structural foundation. A well-constructed blazer or a perfectly draped wide-leg trouser forms the cornerstone of daily dressing. These are pieces designed not only to fit the body but to elevate it, providing a subtle architectural frame that remains consistent regardless of the season.\n\nSecond, prioritize fibers. The tactile dialogue between the skin and the fabric is a vital aspect of luxury. Pure linen, heavyweight cotton, responsibly sourced silk, and Italian cashmere are not mere materials—they are a commitment to comfort and longevity.\n\nBy narrowing our focus to a curated selection of modular, high-quality garments, we liberate ourselves from the noise of the trend cycle, establishing a silent, elegant dialogue with the world.',
      category: 'Style Guide',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0ui6vItKS79F0qOHdTPSg11BaW7kLhF3U4o4tduL4RJAiK8gh-1Rqj7Bvgr1KMiaAtluu9oinNMYxJQs95a4X1LZAeizbtI_ZLUBCV3_TSFrvyTuZIfpdpk1G8WIkLxoT4CMBx6TaNY9T7l29a7aL7ldUZ3VUbbpaT8s77d-Tm-8j7KDUNVQuz4eWIk94KTGtmAdgAi_cbo1FhAuIwFCk5lr_gbu4-4LayFk9hKuwJJpU-z1QhtVNHLDow',
      authorName: 'Elena Rossi',
      authorRole: 'Head of Design',
      authorAvatar: 'ER',
      readTime: '6 min read',
      published: true
    },
    {
      title: 'Autumn Layering',
      slug: 'autumn-layering',
      summary: 'Master the art of transitioning seasons with our guide to luxurious textures and soft wool layers.',
      content: 'As the air turns crisp, the wardrobe transforms. Layering is not simply a practical response to dropping temperatures; it is an art form that allows for the juxtaposition of contrasting textures, weights, and shapes.\n\nThe key to successful luxury layering lies in asymmetry and volume control. Begin with a fluid silk top as the innermost canvas. Add structured, mid-weight trousers, and drape a generous cashmere overcoat as the outer shield.\n\nPlay with shades of espresso, ivory, and warm stone to create a rich tonal depth that catches the low autumn light. This is an invitation to explore fashion as tactile architecture.',
      category: 'Trends',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0uhAUs0pRyUVArWY3a3Q7Hs_tRNzAHz16QF0-waS5RWtkRKV04g6ofPNOpCbt0kmhSjND6tbyyn0mUJiwzPW5G8hjbCQhwyWuBunZWNdGnuj-zj8bQTOyKLLAhGzk6liuAN8Ic-HnU4gYKaQVscJAPQQkIV98ZfXud27n8cwNOJDAFat_pq94ABXgbOoia_QbNWHRw_AO3OK1pKYiqc5Oxx8id7GdUxr1YNVfpZvgNSDKwg7NF2Lrrxa8NE',
      authorName: 'Julian Marc',
      authorRole: 'Senior Stylist',
      authorAvatar: 'JM',
      readTime: '4 min read',
      published: true
    },
    {
      title: 'Inside the Atelier',
      slug: 'inside-the-atelier',
      summary: 'A rare glimpse into the meticulous craftsmanship that defines every YOUR STYLE silhouette.',
      content: 'Behind every finished garment lies a quiet sanctuary of craft. Our atelier is a space where time slows down, and every millimeter matters. From the initial pencil sketch to the final steam pressing, we adhere to legacy techniques that honor the heritage of high tailoring.\n\nEvery pattern piece is cut by hand under natural light, ensuring that the pattern of the fabric aligns seamlessly across all seams. Our tailors spend hours hand-stitching buttonholes, a subtle but unmistakable mark of authentic luxury.\n\nWe invite you to step inside and witness the silent dialogue between the artisan, the needle, and the cloth.',
      category: 'Behind the Scenes',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0uiT1PxclgX8B9lxmInv_sM0A65AGp1-h9v-OwaMxdnsdJc1Q-8WlH_UaTe2yfqIE9BIhaGXTTMEZRx6ClMDQdB0q3-pMohkTZnoO3PXBERu7FxQS6eC2wGS6p-3GfuB98qFzJG8uRw8xcULr8Cs_tdImcRY5wEKtD5Y8vou7HuuE3IbPFnKCeRZVqyZ35N1C-Q6N9PcF-LxnwZpbzxegzVDvEnhcIewXUq2DZtVVpZkA0_iBocAsksDrKs',
      authorName: 'Clara Vento',
      authorRole: 'Workshop Director',
      authorAvatar: 'CV',
      readTime: '8 min read',
      published: true
    },
    {
      title: 'Sustainable Silk',
      slug: 'sustainable-silk',
      summary: 'How we are redefining luxury through responsible sourcing and ethical fabric innovation.',
      content: 'Can luxury coexist with sustainability? At YOUR STYLE, we believe it must. Our silk is sourced from certified ethical farms that prioritize biodiversity and organic silk cultivation.\n\nTraditional silk production is highly resource-intensive and often chemically treated. Our sustainable silk, by contrast, uses closed-loop water systems and natural plant dyes to achieve its deep, rich luster.\n\nThe resulting fabric is fluid, resilient, and fully biodegradable. It is a modern luxury that respects the earth.',
      category: 'Sustainability',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0uj6UeoJabgS-ncNV38KNWGb0hvQ4-L3faaHCEO_NgGmiT6LjO1meIXkCssUp8aTK6uiW2C7O_rTRxvyMNHc0dodueoDYNg6HH9-TDaojRg4xtHRpvOog0SGY-yWC77SZP30w0tozEKz7rcIiS0Bmqe62y12RfvnUnyAJSdzkHMtbiUHFJjlEXLcRE1MylygTWE6wME31KGtZrbqoEdegx3Z744rOQopvMAvqPK8mjZvUSA0SjzEsJzqLbw',
      authorName: 'Elena Rossi',
      authorRole: 'Head of Design',
      authorAvatar: 'ER',
      readTime: '5 min read',
      published: true
    },
    {
      title: 'The Modern Suit',
      slug: 'the-modern-suit',
      summary: 'Exploring structured tailoring for the contemporary woman. Redefining power and poise.',
      content: 'The suit is the ultimate statement of posture. Historically designed for the boardroom, the modern suit has evolved to fit every aspect of a dynamic lifestyle.\n\nWe achieve this through relaxed styling and technical fabrics. By introducing lightweight wool-blends and softening the shoulder pads, our blazers offer ease of movement without sacrificing their crisp structural lines.\n\nPair it with structured wide-leg trousers or contrast it with a fluid silk top for a balance of power and grace.',
      category: 'Style Guide',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0uiZjbJk6YjJdkqbXXnhA5qtDp2sVkVsg2g8AL9dl67dboIvg3WgO8_G8363nlUxfA9PXrcgqZb1GRqHVuwGgTm3s1M7KSxvj0eFWHUqOOl8OWeA2pxpfC9mRxbWLxVHVSfJyCDJ5xsrVG5lSet8sn0-gNYNnYixuJChfOnMh_mOSg1gj7-34gigXBqTBfijW9UfoJ-_8eO7MPM53xORIMD396Dx54jhGklZG4Imz_7TtWSzKZVACrYVnQ',
      authorName: 'Mark Thorne',
      authorRole: 'Tailoring Specialist',
      authorAvatar: 'MT',
      readTime: '5 min read',
      published: true
    },
    {
      title: 'Essential Accessories',
      slug: 'essential-accessories',
      summary: 'The small details that make a significant impact. Scarves, belts, and understated jewelry.',
      content: 'In minimalist dressing, accessories are not an afterthought; they are the punctuation marks of the outfit.\n\nA single hand-rolled silk scarf or an understated leather belt can completely transform the silhouette of an oversized overcoat. We look for pieces that combine utility with structural art.\n\nExplore our curated collection of accessories designed to add a finishing whisper of gold or leather to your daily uniform.',
      category: 'Lookbook',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0uhyYxe_vaforMdTGOrtp2eCKo_IDZdxgscSd0a5JMReapTjp-ZJ-BxxjiHPv4W6kiTMkjouhpCJduPdh5aAGaH2syE4n4tu0KmaHXmVR19DJ4ceZsAq3RimxVh-AW9GPejClIX_DJ371FN7pCSKCJZ3xvrFis4sKC0zigT2ERClIlhQS0Y0NbIfeoPD6zPGL9XCOUqyzraTZiCnHMydK3FJ-aEys7_mJ3LR9tRratPtKAwLqjVNK9wYQgE',
      authorName: 'Sophia Lee',
      authorRole: 'Editorial Director',
      authorAvatar: 'SL',
      readTime: '3 min read',
      published: true
    },
    {
      title: 'The Perfect Fit',
      slug: 'the-perfect-fit',
      summary: 'Maintaining the longevity of your luxury pieces through proper care and storage techniques.',
      content: 'True luxury is a long-term relationship. Once you have acquired pieces crafted from premium natural fibers, proper care is essential to preserving their structural integrity and hand-feel.\n\nWool and cashmere require regular resting and gentle steaming rather than dry cleaning. Silk should be hand-washed with mild pH-neutral soap, and garments must be stored on contoured hangers to maintain their shoulder lines.\n\nFollow these fundamental storage and care rules to ensure your items remain impeccable for decades.',
      category: 'Care Tips',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0uh7oATmvqq3ttDk4IlXSya9lRX4d19Tmlokrq5p9AEBp69yipVUNAOwaghQ7UODKEixIFjkinM8v7Qi6NKNjzf1REaUOr2FBxOzcFnCeb_g0Edws44GeejQIZw0nBh0ijObDJ8Lk62lh2XwpuRY_CJIrCF64KoKFudKCU0P1w19OTVfvSNV1JPZllokXsaGticLSzUIv4-s1OvBRtD6PAtAQTbHkv656AzsEXMrQUojnbRMEgeXOENUnQ',
      authorName: 'Atelier Team',
      authorRole: 'Care Experts',
      authorAvatar: 'AT',
      readTime: '7 min read',
      published: true
    }
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
