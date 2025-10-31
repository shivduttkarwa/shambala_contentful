// Default static data - replace with Contentful content

const publicUrl = import.meta.env.BASE_URL || '/';


export const defaultHeroData = {
  mainTitle: ['we', 'make'],
  typedTexts: [
    'eco-friendly outdoors',
    'self-sustaining gardens',
    'relaxing spaces',
    'beautiful landscapes'
  ],
  description: 'Transform your outdoor space into a sustainable paradise with our expert landscaping services.',
  ctaText: 'Get a Free Site Visit',
  ctaLink: '#contact',
  backgroundImage: `${publicUrl}images/l4.jpg`,
  serviceBoxes: [
    {
      id: 1,
      index: 0,
      title: 'Hardscape',
      description: 'Transform your outdoor space with durable and beautiful hardscape solutions including patios, walkways, retaining walls, and decorative stonework.',
      image: `${publicUrl}images/1.jpg`
    },
    {
      id: 2,
      index: 1,
      title: 'Paved Patio',
      description: 'Create the perfect outdoor entertainment area with custom-designed paved patios that combine functionality with aesthetic appeal.',
      image: `${publicUrl}images/2.jpg`
    },
    {
      id: 3,
      index: 2,
      title: 'Softscape',
      description: 'Enhance your landscape with lush plantings, gardens, and organic elements that bring life and color to your outdoor environment.',
      image: `${publicUrl}images/3.jpg`
    },
    {
      id: 4,
      index: 3,
      title: 'Turf Installation',
      description: 'Achieve a pristine, maintenance-free lawn with professional artificial turf installation that looks and feels natural year-round.',
      image: `${publicUrl}images/l3.jpg`
    },
    {
      id: 5,
      index: 4,
      title: 'Lawn Care',
      description: 'Maintain a healthy, vibrant lawn with our comprehensive care services including mowing, fertilization, and seasonal treatments.',
      image: `${publicUrl}images/5.jpg`
    },
    {
      id: 6,
      index: 5,
      title: 'Irrigation Systems',
      description: 'Ensure efficient water distribution with smart irrigation systems designed to keep your landscape healthy while conserving water.',
      image: `${publicUrl}images/6.jpg`
    },
    {
      id: 7,
      index: 6,
      title: 'Decking',
      description: 'Extend your living space outdoors with custom decking solutions that provide comfort, durability, and timeless style.',
      image: `${publicUrl}images/7.jpg`
    },
    {
      id: 8,
      index: 7,
      title: 'Fencing',
      description: 'Add privacy, security, and visual appeal with professional fencing installations tailored to complement your landscape design.',
      image: `${publicUrl}images/l4.jpg`
    }
  ]
};

export const defaultMenuItems = [
  { id: 1, label: 'Home', link: '#home' },
  { id: 2, label: 'Services', link: '#services' },
  { id: 3, label: 'Gallery', link: '#gallery' },
  { id: 4, label: 'About', link: '#about' },
  { id: 5, label: 'Contact', link: '#contact' }
];

export const defaultIconLinks = [
  { id: 1, title: 'Design my hardscape', icon: 'hardscape', link: '#' },
  { id: 2, title: 'Plan my softscape', icon: 'softscape', link: '#' },
  { id: 3, title: 'Install turf lawn', icon: 'turf', link: '#' },
  { id: 4, title: 'Build a deck', icon: 'deck', link: '#' },
  { id: 5, title: 'Add fencing', icon: 'fence', link: '#' },
  { id: 6, title: 'Install irrigation system', icon: 'irrigation', link: '#' },
  { id: 7, title: 'Get regular maintenance', icon: 'maintenance', link: '#' }
];

export const defaultServices = [
  {
    id: 1,
    title: 'Hardscape Design & Installation',
    description: 'Transform your outdoor space with durable and beautiful hardscape solutions. From patios to walkways, we create lasting structures that enhance your property.',
    image: `${publicUrl}images/1.jpg`,
    link: '#'
  },
  {
    id: 2,
    title: 'Softscape Solutions',
    description: 'Bring life and color to your landscape with expertly designed softscape features including gardens, plantings, and organic elements.',
    image: `${publicUrl}images/3.jpg`,
    link: '#'
  },
  {
    id: 3,
    title: 'Turf Installation',
    description: 'Enjoy a pristine, low-maintenance lawn year-round with our professional artificial turf installation services.',
    image: `${publicUrl}images/4.jpg`,
    link: '#'
  },
  {
    id: 4,
    title: 'Lawn Care Services',
    description: 'Keep your lawn healthy and vibrant with our comprehensive maintenance packages including mowing, fertilization, and treatments.',
    image: `${publicUrl}images/5.jpg`,
    link: '#'
  },
  {
    id: 5,
    title: 'Smart Irrigation',
    description: 'Conserve water and keep your landscape thriving with our efficient, smart irrigation system installations.',
    image: `${publicUrl}images/6.jpg`,
    link: '#'
  },
  {
    id: 6,
    title: 'Custom Decking',
    description: 'Expand your outdoor living space with beautiful, durable decking solutions designed for comfort and style.',
    image: `${publicUrl}images/7.jpg`,
    link: '#'
  }
];
