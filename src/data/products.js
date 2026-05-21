export const products = [
  {
    id: 1,
    name: 'Camiseta Essential Flow',
    price: 1,
    description:
      'Camiseta premium de algodão com caimento reto, toque macio e acabamento reforçado para uso diário.',
    categories: ['Camisetas'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Off White', hex: '#f8fafc' },
      { name: 'Preto', hex: '#0f172a' },
      { name: 'Terracota', hex: '#c2410c' },
    ],
    image:
      'https://placehold.co/900x1100/f8fafc/0f172a?text=Camiseta+Essential+Flow',
  },
  {
    id: 2,
    name: 'Camiseta Oversized Night',
    price: 119.9,
    description:
      'Modelagem oversized com tecido encorpado e visual urbano para composições modernas.',
    categories: ['Camisetas'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Grafite', hex: '#334155' },
      { name: 'Areia', hex: '#f1c27d' },
      { name: 'Verde Militar', hex: '#4d6b57' },
    ],
    image:
      'https://placehold.co/900x1100/1e293b/f8fafc?text=Oversized+Night',
  },
  {
    id: 3,
    name: 'Camiseta Rib Minimal',
    price: 99.9,
    description:
      'Peça versátil com gola canelada e visual clean para looks casuais ou mais arrumados.',
    categories: ['Camisetas'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Branco', hex: '#ffffff' },
      { name: 'Azul Petróleo', hex: '#155e75' },
      { name: 'Preto', hex: '#111827' },
    ],
    image:
      'https://placehold.co/900x1100/e2e8f0/0f172a?text=Rib+Minimal',
  },
  {
    id: 4,
    name: 'Calça Cargo Atlas',
    price: 199.9,
    description:
      'Calça cargo com bolsos utilitários, tecido resistente e ajuste confortável para o dia a dia.',
    categories: ['Calças'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#0f172a' },
      { name: 'Chumbo', hex: '#475569' },
      { name: 'Oliva', hex: '#556b2f' },
    ],
    image:
      'https://placehold.co/900x1100/111827/f8fafc?text=Calca+Cargo+Atlas',
  },
  {
    id: 5,
    name: 'Calça Jeans Straight Tide',
    price: 179.9,
    description:
      'Jeans de lavagem média com corte reto, cintura média e visual atemporal.',
    categories: ['Calças'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Azul Médio', hex: '#1d4ed8' },
      { name: 'Azul Escuro', hex: '#1e3a8a' },
      { name: 'Preto', hex: '#111827' },
    ],
    image:
      'https://placehold.co/900x1100/dbeafe/1e3a8a?text=Jeans+Straight+Tide',
  },
  {
    id: 6,
    name: 'Calça Wide Linen',
    price: 159.9,
    description:
      'Modelagem ampla com acabamento leve, ideal para um visual sofisticado e fresco.',
    categories: ['Calças'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Bege', hex: '#d6c4a1' },
      { name: 'Off White', hex: '#f8fafc' },
      { name: 'Marrom', hex: '#7c4a22' },
    ],
    image:
      'https://placehold.co/900x1100/fef3c7/7c4a22?text=Wide+Linen',
  },
  {
    id: 7,
    name: 'Casaco Puffer North',
    price: 329.9,
    description:
      'Casaco acolchoado com isolamento térmico, gola alta e presença forte para dias frios.',
    categories: ['Casacos'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#020617' },
      { name: 'Navy', hex: '#1e293b' },
      { name: 'Vinho', hex: '#7f1d1d' },
    ],
    image:
      'https://placehold.co/900x1100/0f172a/f8fafc?text=Puffer+North',
  },
  {
    id: 8,
    name: 'Casaco Wool Blend Urban',
    price: 389.9,
    description:
      'Casaco de lã com recorte elegante, forro confortável e acabamento premium.',
    categories: ['Casacos'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Cinza Claro', hex: '#cbd5e1' },
      { name: 'Camel', hex: '#b7791f' },
      { name: 'Preto', hex: '#111827' },
    ],
    image:
      'https://placehold.co/900x1100/e5e7eb/111827?text=Wool+Blend+Urban',
  },
];

export const categories = ['Todos', ...new Set(products.flatMap((product) => product.categories))];
