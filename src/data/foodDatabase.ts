export interface Porcion {
  label: string;
  gramos: number;
  p: number;
  c: number;
  g: number;
  kcal: number;
}

export interface Food {
  id: string;
  nombre: string;
  grupo: 'proteinas' | 'carbohidratos' | 'lacteos' | 'grasas' | 'verduras' | 'frutas';
  subgrupo: string;
  preparacion: string;
  kcalPor100g: number;
  tags: string[];
  equivalentes: string[];
  porciones: Porcion[];
}

export const foodDatabase: Food[] = [
  {
    id: 'alimento-038',
    nombre: 'Aceite de aguacate',
    grupo: 'grasas',
    subgrupo: 'aceites',
    preparacion: 'crudo',
    kcalPor100g: 969,
    tags: ['natural', 'aceite'],
    equivalentes: ['alimento-037'],
    porciones: [
      { label: '1 cucharada', gramos: 13.0, p: 0.0, c: 0.0, g: 14.0, kcal: 126 }
    ],
  },
  {
    id: 'alimento-148',
    nombre: 'Aceite de coco',
    grupo: 'grasas',
    subgrupo: 'aceites',
    preparacion: 'crudo',
    kcalPor100g: 900,
    tags: ['natural', 'vegano'],
    equivalentes: ['alimento-037', 'alimento-038'],
    porciones: [
      { label: '1 cda 13g', gramos: 13.0, p: 0.0, c: 0.0, g: 13.0, kcal: 117 }
    ],
  },
  {
    id: 'alimento-037',
    nombre: 'Aceite de oliva',
    grupo: 'grasas',
    subgrupo: 'aceites',
    preparacion: 'crudo',
    kcalPor100g: 969,
    tags: ['natural', 'aceite'],
    equivalentes: ['alimento-038'],
    porciones: [
      { label: '1 cucharada', gramos: 13.0, p: 0.0, c: 0.0, g: 14.0, kcal: 126 },
      { label: '2 cucharadas', gramos: 26.0, p: 0.0, c: 0.0, g: 28.0, kcal: 252 }
    ],
  },
  {
    id: 'alimento-129',
    nombre: 'Aceitunas verdes',
    grupo: 'grasas',
    subgrupo: 'frutas',
    preparacion: 'curado',
    kcalPor100g: 145,
    tags: ['natural', 'mediterraneo'],
    equivalentes: ['alimento-039', 'alimento-037'],
    porciones: [
      { label: '5 unidades 20g', gramos: 20.0, p: 0.2, c: 0.8, g: 3.0, kcal: 31 }
    ],
  },
  {
    id: 'alimento-039',
    nombre: 'Aguacate',
    grupo: 'grasas',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 179,
    tags: ['natural', 'graso'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '1/2 unidad', gramos: 100.0, p: 2.0, c: 9.0, g: 15.0, kcal: 179 }
    ],
  },
  {
    id: 'alimento-035',
    nombre: 'Almendras',
    grupo: 'grasas',
    subgrupo: 'frutos-secos',
    preparacion: 'crudo',
    kcalPor100g: 580,
    tags: ['natural', 'frutos-secos'],
    equivalentes: ['alimento-036'],
    porciones: [
      { label: '1 porción', gramos: 30.0, p: 6.0, c: 6.0, g: 14.0, kcal: 174 }
    ],
  },
  {
    id: 'alimento-047',
    nombre: 'Almendras molidas',
    grupo: 'grasas',
    subgrupo: 'frutos-secos',
    preparacion: 'crudo',
    kcalPor100g: 570,
    tags: ['natural', 'frutos-secos', 'molido'],
    equivalentes: ['alimento-035'],
    porciones: [
      { label: '1 cucharada', gramos: 10.0, p: 2.0, c: 2.0, g: 4.6, kcal: 57 }
    ],
  },
  {
    id: 'alimento-056',
    nombre: 'Amaranto inflado',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'crudo',
    kcalPor100g: 377,
    tags: ['natural', 'sin-gluten', 'mexicano'],
    equivalentes: ['alimento-019', 'alimento-017'],
    porciones: [
      { label: '1/2 taza', gramos: 30.0, p: 4.1, c: 19.5, g: 2.1, kcal: 113 }
    ],
  },
  {
    id: 'alimento-015',
    nombre: 'Arroz blanco cocido',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 126,
    tags: ['natural', 'basico'],
    equivalentes: ['alimento-016', 'alimento-017'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.7, c: 28.0, g: 0.3, kcal: 126 },
      { label: '1.5 tazas', gramos: 150.0, p: 4.1, c: 42.0, g: 0.5, kcal: 189 }
    ],
  },
  {
    id: 'alimento-016',
    nombre: 'Arroz integral cocido',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 119,
    tags: ['integral', 'natural'],
    equivalentes: ['alimento-015', 'alimento-017'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.6, c: 25.0, g: 1.0, kcal: 119 }
    ],
  },
  {
    id: 'alimento-131',
    nombre: 'Arroz para sushi cocido',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 130,
    tags: ['natural', 'basico'],
    equivalentes: ['alimento-015'],
    porciones: [
      { label: '100g', gramos: 100.0, p: 2.4, c: 28.6, g: 0.2, kcal: 126 }
    ],
  },
  {
    id: 'alimento-077',
    nombre: 'Arroz rojo',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 127,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-015', 'alimento-016'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.7, c: 28.0, g: 0.5, kcal: 127 }
    ],
  },
  {
    id: 'alimento-005',
    nombre: 'Atún en agua',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 109,
    tags: ['bajo-grasa', 'natural', 'enlatado'],
    equivalentes: ['alimento-003', 'alimento-004'],
    porciones: [
      { label: '1 lata', gramos: 150.0, p: 37.5, c: 0.0, g: 1.5, kcal: 164 }
    ],
  },
  {
    id: 'alimento-136',
    nombre: 'Atún enlatado en aceite drenado',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 198,
    tags: ['natural', 'omega3'],
    equivalentes: ['alimento-005'],
    porciones: [
      { label: '1 lata 80g drenado', gramos: 80.0, p: 19.0, c: 0.0, g: 8.0, kcal: 148 }
    ],
  },
  {
    id: 'alimento-018',
    nombre: 'Avena cocida',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 72,
    tags: ['natural', 'integral'],
    equivalentes: ['alimento-019'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.5, c: 12.0, g: 1.5, kcal: 72 }
    ],
  },
  {
    id: 'alimento-019',
    nombre: 'Avena en hojuelas',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'crudo',
    kcalPor100g: 353,
    tags: ['natural', 'integral'],
    equivalentes: ['alimento-018'],
    porciones: [
      { label: '1 porción', gramos: 30.0, p: 3.0, c: 18.0, g: 2.5, kcal: 106 },
      { label: '1.5 porciones', gramos: 40.0, p: 4.0, c: 24.0, g: 3.3, kcal: 142 }
    ],
  },
  {
    id: 'alimento-132',
    nombre: 'Avena instantánea proteica',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'crudo',
    kcalPor100g: 367,
    tags: ['fitness', 'alto-proteina'],
    equivalentes: [],
    porciones: [
      { label: '1 sobre 40g', gramos: 40.0, p: 7.0, c: 22.0, g: 3.0, kcal: 143 }
    ],
  },
  {
    id: 'alimento-007',
    nombre: 'Bacalao',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 98,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-006', 'alimento-008'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 23.0, c: 0.0, g: 0.7, kcal: 98 }
    ],
  },
  {
    id: 'alimento-138',
    nombre: 'Bagel integral',
    grupo: 'carbohidratos',
    subgrupo: 'panes',
    preparacion: 'horneado',
    kcalPor100g: 273,
    tags: ['integral', 'fitness'],
    equivalentes: [],
    porciones: [
      { label: '1 unidad 90g', gramos: 90.0, p: 10.0, c: 48.0, g: 1.5, kcal: 246 }
    ],
  },
  {
    id: 'alimento-133',
    nombre: 'Barra de proteína (tipo)',
    grupo: 'proteinas',
    subgrupo: 'suplementos',
    preparacion: 'crudo',
    kcalPor100g: 350,
    tags: ['suplemento', 'fitness', 'practico'],
    equivalentes: ['alimento-014', 'alimento-111'],
    porciones: [
      { label: '1 barra 60g', gramos: 60.0, p: 20.0, c: 20.0, g: 6.0, kcal: 214 }
    ],
  },
  {
    id: 'alimento-059',
    nombre: 'Betabel cocido',
    grupo: 'carbohidratos',
    subgrupo: 'tuberculos',
    preparacion: 'cocido',
    kcalPor100g: 47,
    tags: ['natural', 'rendimiento'],
    equivalentes: ['alimento-028', 'alimento-055'],
    porciones: [
      { label: '1 unidad mediana', gramos: 100.0, p: 1.6, c: 9.6, g: 0.2, kcal: 47 },
      { label: '1 taza', gramos: 150.0, p: 2.4, c: 14.4, g: 0.3, kcal: 70 }
    ],
  },
  {
    id: 'alimento-074',
    nombre: 'Bolillo',
    grupo: 'carbohidratos',
    subgrupo: 'panes',
    preparacion: 'horneado',
    kcalPor100g: 348,
    tags: ['basico', 'mexicano'],
    equivalentes: ['alimento-020', 'alimento-021'],
    porciones: [
      { label: '1 unidad', gramos: 80.0, p: 8.0, c: 58.0, g: 1.5, kcal: 278 }
    ],
  },
  {
    id: 'alimento-045',
    nombre: 'Boniato cocido',
    grupo: 'carbohidratos',
    subgrupo: 'tuberculos',
    preparacion: 'cocido',
    kcalPor100g: 88,
    tags: ['natural', 'integral'],
    equivalentes: ['alimento-026', 'alimento-044'],
    porciones: [
      { label: '1 unidad mediana', gramos: 150.0, p: 2.4, c: 30.0, g: 0.3, kcal: 132 }
    ],
  },
  {
    id: 'alimento-116',
    nombre: 'Brócoli cocido',
    grupo: 'verduras',
    subgrupo: 'cruciferas',
    preparacion: 'cocido',
    kcalPor100g: 35,
    tags: ['natural', 'fibra', 'fitness'],
    equivalentes: ['alimento-045', 'alimento-046'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.4, c: 7.2, g: 0.4, kcal: 42 }
    ],
  },
  {
    id: 'alimento-146',
    nombre: 'Cacahuate tostado sin sal',
    grupo: 'grasas',
    subgrupo: 'frutos-secos',
    preparacion: 'tostado',
    kcalPor100g: 613,
    tags: ['natural', 'fitness', 'proteina-vegetal'],
    equivalentes: ['alimento-036'],
    porciones: [
      { label: '30g', gramos: 30.0, p: 7.8, c: 4.8, g: 14.9, kcal: 184 }
    ],
  },
  {
    id: 'alimento-036',
    nombre: 'Cacahuates',
    grupo: 'grasas',
    subgrupo: 'frutos-secos',
    preparacion: 'crudo',
    kcalPor100g: 593,
    tags: ['natural', 'frutos-secos'],
    equivalentes: ['alimento-035'],
    porciones: [
      { label: '1 porción', gramos: 30.0, p: 7.0, c: 6.0, g: 14.0, kcal: 178 }
    ],
  },
  {
    id: 'alimento-118',
    nombre: 'Calabacita cocida',
    grupo: 'verduras',
    subgrupo: 'verduras',
    preparacion: 'cocido',
    kcalPor100g: 17,
    tags: ['natural', 'bajo-cal', 'mexicano'],
    equivalentes: ['alimento-045', 'alimento-046'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 1.2, c: 3.1, g: 0.2, kcal: 19 }
    ],
  },
  {
    id: 'alimento-071',
    nombre: 'Calabaza cocida',
    grupo: 'carbohidratos',
    subgrupo: 'verduras',
    preparacion: 'cocido',
    kcalPor100g: 25,
    tags: ['natural', 'bajo-calorias'],
    equivalentes: ['alimento-053', 'alimento-055'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 1.0, c: 5.0, g: 0.1, kcal: 25 }
    ],
  },
  {
    id: 'alimento-053',
    nombre: 'Calamar cocido',
    grupo: 'proteinas',
    subgrupo: 'mariscos',
    preparacion: 'cocido',
    kcalPor100g: 172,
    tags: ['natural', 'bajo-grasa'],
    equivalentes: ['alimento-012', 'alimento-052'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 18.0, c: 8.0, g: 7.5, kcal: 172 }
    ],
  },
  {
    id: 'alimento-012',
    nombre: 'Camarones',
    grupo: 'proteinas',
    subgrupo: 'mariscos',
    preparacion: 'cocido',
    kcalPor100g: 105,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-006', 'alimento-007'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 24.0, c: 0.2, g: 0.9, kcal: 105 }
    ],
  },
  {
    id: 'alimento-026',
    nombre: 'Camote cocido',
    grupo: 'carbohidratos',
    subgrupo: 'tuberculos',
    preparacion: 'cocido',
    kcalPor100g: 88,
    tags: ['natural', 'integral'],
    equivalentes: ['alimento-028'],
    porciones: [
      { label: '1 unidad mediana', gramos: 150.0, p: 2.4, c: 30.0, g: 0.3, kcal: 132 }
    ],
  },
  {
    id: 'alimento-048',
    nombre: 'Carne de cerdo magra',
    grupo: 'proteinas',
    subgrupo: 'carnes',
    preparacion: 'cocido',
    kcalPor100g: 216,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-010', 'alimento-009'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 27.0, c: 0.0, g: 12.0, kcal: 216 },
      { label: '1.5 porciones', gramos: 150.0, p: 40.5, c: 0.0, g: 18.0, kcal: 324 }
    ],
  },
  {
    id: 'alimento-009',
    nombre: 'Carne molida 90/10',
    grupo: 'proteinas',
    subgrupo: 'carnes',
    preparacion: 'cocido',
    kcalPor100g: 249,
    tags: ['natural'],
    equivalentes: ['alimento-008', 'alimento-010'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 24.0, c: 0.0, g: 17.0, kcal: 249 }
    ],
  },
  {
    id: 'alimento-008',
    nombre: 'Carne molida 95/5',
    grupo: 'proteinas',
    subgrupo: 'carnes',
    preparacion: 'cocido',
    kcalPor100g: 212,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-007', 'alimento-009'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 26.0, c: 0.0, g: 12.0, kcal: 212 }
    ],
  },
  {
    id: 'alimento-119',
    nombre: 'Champiñones cocidos',
    grupo: 'verduras',
    subgrupo: 'hongos',
    preparacion: 'cocido',
    kcalPor100g: 22,
    tags: ['natural', 'bajo-cal', 'proteina-vegetal'],
    equivalentes: ['alimento-045', 'alimento-046'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.2, c: 3.3, g: 0.3, kcal: 25 }
    ],
  },
  {
    id: 'alimento-068',
    nombre: 'Chayote cocido',
    grupo: 'carbohidratos',
    subgrupo: 'verduras',
    preparacion: 'cocido',
    kcalPor100g: 23,
    tags: ['natural', 'mexicano', 'bajo-calorias'],
    equivalentes: ['alimento-052', 'alimento-053'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 0.8, c: 4.8, g: 0.1, kcal: 23 }
    ],
  },
  {
    id: 'alimento-110',
    nombre: 'Claras de huevo líquidas',
    grupo: 'proteinas',
    subgrupo: 'huevos',
    preparacion: 'crudo',
    kcalPor100g: 52,
    tags: ['bajo-grasa', 'fitness', 'natural'],
    equivalentes: ['alimento-002', 'alimento-014'],
    porciones: [
      { label: '100ml', gramos: 100.0, p: 11.0, c: 0.7, g: 0.2, kcal: 49 },
      { label: '250ml', gramos: 250.0, p: 27.5, c: 1.8, g: 0.5, kcal: 122 }
    ],
  },
  {
    id: 'alimento-070',
    nombre: 'Coliflor cocida',
    grupo: 'carbohidratos',
    subgrupo: 'verduras',
    preparacion: 'cocido',
    kcalPor100g: 26,
    tags: ['natural', 'bajo-calorias'],
    equivalentes: ['alimento-054', 'alimento-052'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 1.8, c: 4.1, g: 0.3, kcal: 26 }
    ],
  },
  {
    id: 'alimento-080',
    nombre: 'Crema',
    grupo: 'lacteos',
    subgrupo: 'cremas',
    preparacion: 'crudo',
    kcalPor100g: 240,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-029', 'alimento-030'],
    porciones: [
      { label: '1 cucharada', gramos: 15.0, p: 0.5, c: 0.5, g: 3.5, kcal: 36 }
    ],
  },
  {
    id: 'alimento-127',
    nombre: 'Crema de almendras natural',
    grupo: 'grasas',
    subgrupo: 'cremas',
    preparacion: 'crudo',
    kcalPor100g: 647,
    tags: ['natural', 'fitness', 'sin-azucar'],
    equivalentes: ['alimento-040', 'alimento-090'],
    porciones: [
      { label: '1 cda 15g', gramos: 15.0, p: 3.2, c: 1.2, g: 8.8, kcal: 97 }
    ],
  },
  {
    id: 'alimento-090',
    nombre: 'Crema de cacahuate natural sin azúcar',
    grupo: 'grasas',
    subgrupo: 'cremas',
    preparacion: 'crudo',
    kcalPor100g: 625,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-040', 'alimento-035'],
    porciones: [
      { label: '2 cucharadas', gramos: 32.0, p: 8.0, c: 6.0, g: 16.0, kcal: 200 }
    ],
  },
  {
    id: 'alimento-063',
    nombre: 'Dátiles',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 300,
    tags: ['natural', 'fruta', 'energia'],
    equivalentes: ['alimento-041', 'alimento-027'],
    porciones: [
      { label: '3 unidades', gramos: 25.0, p: 0.5, c: 18.0, g: 0.1, kcal: 75 }
    ],
  },
  {
    id: 'alimento-103',
    nombre: 'Edamame',
    grupo: 'proteinas',
    subgrupo: 'leguminosas',
    preparacion: 'cocido',
    kcalPor100g: 121,
    tags: ['natural', 'proteina-vegetal', 'fitness'],
    equivalentes: ['alimento-003', 'alimento-004'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 11.9, c: 8.9, g: 5.2, kcal: 130 }
    ],
  },
  {
    id: 'alimento-069',
    nombre: 'Ejotes cocidos',
    grupo: 'carbohidratos',
    subgrupo: 'verduras',
    preparacion: 'cocido',
    kcalPor100g: 40,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-054', 'alimento-053'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.1, c: 7.4, g: 0.2, kcal: 40 }
    ],
  },
  {
    id: 'alimento-117',
    nombre: 'Espinaca cocida',
    grupo: 'verduras',
    subgrupo: 'hojas-verdes',
    preparacion: 'cocido',
    kcalPor100g: 23,
    tags: ['natural', 'hierro', 'bajo-cal'],
    equivalentes: ['alimento-045', 'alimento-046'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.9, c: 3.6, g: 0.4, kcal: 30 }
    ],
  },
  {
    id: 'alimento-120',
    nombre: 'Espárragos cocidos',
    grupo: 'verduras',
    subgrupo: 'verduras',
    preparacion: 'cocido',
    kcalPor100g: 22,
    tags: ['natural', 'fitness', 'diuretico'],
    equivalentes: ['alimento-045', 'alimento-046'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 2.4, c: 4.1, g: 0.2, kcal: 28 }
    ],
  },
  {
    id: 'alimento-062',
    nombre: 'Fresas',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 36,
    tags: ['natural', 'fruta', 'antioxidante'],
    equivalentes: ['alimento-028', 'alimento-046'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 0.7, c: 7.7, g: 0.3, kcal: 36 }
    ],
  },
  {
    id: 'alimento-100',
    nombre: 'Frijoles negros cocidos',
    grupo: 'carbohidratos',
    subgrupo: 'leguminosas',
    preparacion: 'cocido',
    kcalPor100g: 132,
    tags: ['natural', 'proteina-vegetal', 'fibra'],
    equivalentes: ['alimento-024', 'alimento-025'],
    porciones: [
      { label: '1/2 taza', gramos: 100.0, p: 8.9, c: 23.7, g: 0.5, kcal: 135 }
    ],
  },
  {
    id: 'alimento-102',
    nombre: 'Garbanzos cocidos',
    grupo: 'carbohidratos',
    subgrupo: 'leguminosas',
    preparacion: 'cocido',
    kcalPor100g: 164,
    tags: ['natural', 'fibra'],
    equivalentes: ['alimento-024', 'alimento-025'],
    porciones: [
      { label: '1/2 taza', gramos: 100.0, p: 8.9, c: 27.4, g: 2.6, kcal: 169 }
    ],
  },
  {
    id: 'alimento-140',
    nombre: 'Granola sin azúcar',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'horneado',
    kcalPor100g: 330,
    tags: ['natural', 'fibra'],
    equivalentes: [],
    porciones: [
      { label: '30g', gramos: 30.0, p: 3.5, c: 14.0, g: 3.2, kcal: 99 }
    ],
  },
  {
    id: 'alimento-043',
    nombre: 'Hotcakes',
    grupo: 'carbohidratos',
    subgrupo: 'panes',
    preparacion: 'cocido',
    kcalPor100g: 169,
    tags: ['horneado', 'desayuno'],
    equivalentes: ['alimento-020', 'alimento-021'],
    porciones: [
      { label: '2 unidades', gramos: 100.0, p: 6.0, c: 25.0, g: 5.0, kcal: 169 }
    ],
  },
  {
    id: 'alimento-002',
    nombre: 'Huevo de claras',
    grupo: 'proteinas',
    subgrupo: 'huevos',
    preparacion: 'cocido',
    kcalPor100g: 48,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-001'],
    porciones: [
      { label: '1 clara (33g)', gramos: 33.0, p: 3.6, c: 0.2, g: 0.1, kcal: 16 },
      { label: '100g claras', gramos: 100.0, p: 11.0, c: 0.7, g: 0.2, kcal: 49 }
    ],
  },
  {
    id: 'alimento-001',
    nombre: 'Huevo entero',
    grupo: 'proteinas',
    subgrupo: 'huevos',
    preparacion: 'cocido',
    kcalPor100g: 142,
    tags: ['natural', 'entero'],
    equivalentes: ['alimento-002'],
    porciones: [
      { label: '1 unidad', gramos: 50.0, p: 6.0, c: 0.5, g: 5.0, kcal: 71 }
    ],
  },
  {
    id: 'alimento-130',
    nombre: 'Hummus',
    grupo: 'grasas',
    subgrupo: 'leguminosas',
    preparacion: 'crudo',
    kcalPor100g: 166,
    tags: ['natural', 'fibra', 'vegano'],
    equivalentes: ['alimento-039', 'alimento-102'],
    porciones: [
      { label: '2 cdas 30g', gramos: 30.0, p: 2.4, c: 4.3, g: 2.7, kcal: 51 }
    ],
  },
  {
    id: 'alimento-072',
    nombre: 'Jamón de pavo',
    grupo: 'proteinas',
    subgrupo: 'embutidos',
    preparacion: 'crudo',
    kcalPor100g: 116,
    tags: ['procesado', 'bajo-grasa'],
    equivalentes: ['alimento-004', 'alimento-003'],
    porciones: [
      { label: '2 rebanadas', gramos: 50.0, p: 10.0, c: 1.0, g: 1.5, kcal: 58 }
    ],
  },
  {
    id: 'alimento-141',
    nombre: 'Jitomate cherry',
    grupo: 'verduras',
    subgrupo: 'verduras',
    preparacion: 'crudo',
    kcalPor100g: 18,
    tags: ['natural', 'bajo-cal', 'antioxidante'],
    equivalentes: ['alimento-045'],
    porciones: [
      { label: '1 taza 150g', gramos: 150.0, p: 1.3, c: 5.8, g: 0.3, kcal: 31 }
    ],
  },
  {
    id: 'alimento-058',
    nombre: 'Jícama cruda',
    grupo: 'carbohidratos',
    subgrupo: 'tuberculos',
    preparacion: 'crudo',
    kcalPor100g: 40,
    tags: ['natural', 'mexicano', 'bajo-calorias'],
    equivalentes: ['alimento-028', 'alimento-060'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 0.7, c: 9.1, g: 0.1, kcal: 40 },
      { label: '1 pieza mediana', gramos: 200.0, p: 1.4, c: 18.2, g: 0.2, kcal: 80 }
    ],
  },
  {
    id: 'alimento-061',
    nombre: 'Kiwi',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 92,
    tags: ['natural', 'fruta'],
    equivalentes: ['alimento-028', 'alimento-027'],
    porciones: [
      { label: '1 unidad', gramos: 75.0, p: 1.1, c: 15.0, g: 0.5, kcal: 69 }
    ],
  },
  {
    id: 'alimento-150',
    nombre: 'Kéfir natural',
    grupo: 'lacteos',
    subgrupo: 'leches',
    preparacion: 'fermentado',
    kcalPor100g: 41,
    tags: ['probiotico', 'natural', 'fitness'],
    equivalentes: ['alimento-084', 'alimento-031'],
    porciones: [
      { label: '1 vaso 200ml', gramos: 200.0, p: 6.2, c: 9.2, g: 1.8, kcal: 78 }
    ],
  },
  {
    id: 'alimento-134',
    nombre: 'Leche de almendras sin azúcar',
    grupo: 'lacteos',
    subgrupo: 'leches',
    preparacion: 'crudo',
    kcalPor100g: 15,
    tags: ['vegano', 'bajo-cal', 'fitness'],
    equivalentes: ['alimento-030'],
    porciones: [
      { label: '1 vaso 250ml', gramos: 250.0, p: 0.5, c: 0.3, g: 1.1, kcal: 13 }
    ],
  },
  {
    id: 'alimento-030',
    nombre: 'Leche deslactosada',
    grupo: 'lacteos',
    subgrupo: 'leches',
    preparacion: 'crudo',
    kcalPor100g: 50,
    tags: ['sin-lactosa', 'natural'],
    equivalentes: ['alimento-029'],
    porciones: [
      { label: '1 vaso', gramos: 250.0, p: 8.0, c: 12.0, g: 5.0, kcal: 125 }
    ],
  },
  {
    id: 'alimento-029',
    nombre: 'Leche entera',
    grupo: 'lacteos',
    subgrupo: 'leches',
    preparacion: 'crudo',
    kcalPor100g: 61,
    tags: ['natural', 'entero'],
    equivalentes: ['alimento-030'],
    porciones: [
      { label: '1 vaso', gramos: 250.0, p: 8.0, c: 12.0, g: 8.0, kcal: 152 },
      { label: '2 vasos', gramos: 500.0, p: 16.0, c: 24.0, g: 16.0, kcal: 304 }
    ],
  },
  {
    id: 'alimento-081',
    nombre: 'Leche evaporada sin azúcar',
    grupo: 'lacteos',
    subgrupo: 'leches',
    preparacion: 'crudo',
    kcalPor100g: 112,
    tags: ['natural', 'mexicano', 'cremoso'],
    equivalentes: ['alimento-029', 'alimento-030'],
    porciones: [
      { label: '1/2 taza', gramos: 120.0, p: 6.5, c: 10.0, g: 7.5, kcal: 134 }
    ],
  },
  {
    id: 'alimento-114',
    nombre: 'Leche light 1%',
    grupo: 'lacteos',
    subgrupo: 'leches',
    preparacion: 'crudo',
    kcalPor100g: 42,
    tags: ['bajo-grasa', 'fitness'],
    equivalentes: ['alimento-030'],
    porciones: [
      { label: '1 vaso 250ml', gramos: 250.0, p: 8.2, c: 12.0, g: 2.5, kcal: 103 }
    ],
  },
  {
    id: 'alimento-101',
    nombre: 'Lentejas cocidas',
    grupo: 'carbohidratos',
    subgrupo: 'leguminosas',
    preparacion: 'cocido',
    kcalPor100g: 116,
    tags: ['natural', 'hierro', 'fitness'],
    equivalentes: ['alimento-024', 'alimento-025'],
    porciones: [
      { label: '1/2 taza', gramos: 100.0, p: 9.0, c: 20.0, g: 0.4, kcal: 120 }
    ],
  },
  {
    id: 'alimento-055',
    nombre: 'Lomo de cerdo magro',
    grupo: 'proteinas',
    subgrupo: 'carnes',
    preparacion: 'asado',
    kcalPor100g: 216,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-010', 'alimento-048'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 27.0, c: 0.0, g: 12.0, kcal: 216 },
      { label: '1.5 porciones', gramos: 150.0, p: 40.5, c: 0.0, g: 18.0, kcal: 324 }
    ],
  },
  {
    id: 'alimento-123',
    nombre: 'Mango',
    grupo: 'frutas',
    subgrupo: 'tropicales',
    preparacion: 'crudo',
    kcalPor100g: 60,
    tags: ['natural', 'tropical', 'mexicano'],
    equivalentes: ['alimento-027', 'alimento-028'],
    porciones: [
      { label: '1 taza 165g', gramos: 165.0, p: 1.4, c: 24.8, g: 0.6, kcal: 110 }
    ],
  },
  {
    id: 'alimento-079',
    nombre: 'Mantequilla',
    grupo: 'grasas',
    subgrupo: 'lacteos',
    preparacion: 'crudo',
    kcalPor100g: 743,
    tags: ['natural', 'lacteo'],
    equivalentes: ['alimento-037', 'alimento-038'],
    porciones: [
      { label: '1 cucharada', gramos: 14.0, p: 0.1, c: 0.0, g: 11.5, kcal: 104 }
    ],
  },
  {
    id: 'alimento-040',
    nombre: 'Mantequilla de maní',
    grupo: 'grasas',
    subgrupo: 'cremas',
    preparacion: 'crudo',
    kcalPor100g: 625,
    tags: ['graso', 'crema'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '2 cucharadas', gramos: 32.0, p: 8.0, c: 6.0, g: 16.0, kcal: 200 }
    ],
  },
  {
    id: 'alimento-028',
    nombre: 'Manzana',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 70,
    tags: ['natural', 'fruta'],
    equivalentes: ['alimento-027'],
    porciones: [
      { label: '1 unidad', gramos: 150.0, p: 0.5, c: 25.0, g: 0.3, kcal: 105 }
    ],
  },
  {
    id: 'alimento-126',
    nombre: 'Manzana verde',
    grupo: 'frutas',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 52,
    tags: ['natural', 'fibra', 'bajo-ig'],
    equivalentes: ['alimento-028'],
    porciones: [
      { label: '1 unidad 180g', gramos: 180.0, p: 0.5, c: 25.0, g: 0.3, kcal: 105 }
    ],
  },
  {
    id: 'alimento-042',
    nombre: 'Maple syrup',
    grupo: 'carbohidratos',
    subgrupo: 'endulzantes',
    preparacion: 'crudo',
    kcalPor100g: 260,
    tags: ['natural', 'endulzante'],
    equivalentes: ['alimento-041'],
    porciones: [
      { label: '1 cucharada', gramos: 20.0, p: 0.0, c: 13.0, g: 0.0, kcal: 52 }
    ],
  },
  {
    id: 'alimento-075',
    nombre: 'Mazorca de elote',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 97,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-015', 'alimento-016'],
    porciones: [
      { label: '1 unidad', gramos: 150.0, p: 5.0, c: 28.0, g: 1.5, kcal: 146 }
    ],
  },
  {
    id: 'alimento-067',
    nombre: 'Melón',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 38,
    tags: ['natural', 'fruta', 'bajo-calorias'],
    equivalentes: ['alimento-028', 'alimento-066'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 0.8, c: 8.2, g: 0.2, kcal: 38 }
    ],
  },
  {
    id: 'alimento-109',
    nombre: 'Merluza',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 84,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-007', 'alimento-011'],
    porciones: [
      { label: '100g', gramos: 100.0, p: 19.0, c: 0.0, g: 0.9, kcal: 84 }
    ],
  },
  {
    id: 'alimento-041',
    nombre: 'Miel',
    grupo: 'carbohidratos',
    subgrupo: 'endulzantes',
    preparacion: 'crudo',
    kcalPor100g: 324,
    tags: ['natural', 'endulzante'],
    equivalentes: ['alimento-042'],
    porciones: [
      { label: '1 cucharada', gramos: 21.0, p: 0.0, c: 17.0, g: 0.0, kcal: 68 }
    ],
  },
  {
    id: 'alimento-139',
    nombre: 'Miel de agave',
    grupo: 'carbohidratos',
    subgrupo: 'endulzantes',
    preparacion: 'crudo',
    kcalPor100g: 310,
    tags: ['natural', 'vegano'],
    equivalentes: ['alimento-041', 'alimento-042'],
    porciones: [
      { label: '1 cda 20g', gramos: 20.0, p: 0.0, c: 15.2, g: 0.0, kcal: 61 }
    ],
  },
  {
    id: 'alimento-051',
    nombre: 'Mojarra cocida',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 128,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-007', 'alimento-011'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 26.0, c: 0.0, g: 2.7, kcal: 128 }
    ],
  },
  {
    id: 'alimento-046',
    nombre: 'Moras azules',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 80,
    tags: ['natural', 'fruta', 'antioxidante'],
    equivalentes: ['alimento-027', 'alimento-028'],
    porciones: [
      { label: '1 taza', gramos: 80.0, p: 1.1, c: 14.0, g: 0.4, kcal: 64 }
    ],
  },
  {
    id: 'alimento-088',
    nombre: 'Nueces',
    grupo: 'grasas',
    subgrupo: 'frutos-secos',
    preparacion: 'crudo',
    kcalPor100g: 573,
    tags: ['natural', 'omega3'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '1 porción', gramos: 30.0, p: 4.0, c: 3.0, g: 16.0, kcal: 172 }
    ],
  },
  {
    id: 'alimento-147',
    nombre: 'Nuez de la india',
    grupo: 'grasas',
    subgrupo: 'frutos-secos',
    preparacion: 'crudo',
    kcalPor100g: 590,
    tags: ['natural'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '30g', gramos: 30.0, p: 5.5, c: 9.0, g: 13.2, kcal: 177 }
    ],
  },
  {
    id: 'alimento-021',
    nombre: 'Pan blanco',
    grupo: 'carbohidratos',
    subgrupo: 'panes',
    preparacion: 'horneado',
    kcalPor100g: 186,
    tags: ['basico', 'horneado'],
    equivalentes: ['alimento-020'],
    porciones: [
      { label: '1 rebanada', gramos: 35.0, p: 2.0, c: 12.0, g: 1.0, kcal: 65 }
    ],
  },
  {
    id: 'alimento-073',
    nombre: 'Pan dulce concha',
    grupo: 'carbohidratos',
    subgrupo: 'panes',
    preparacion: 'horneado',
    kcalPor100g: 435,
    tags: ['horneado', 'mexicano', 'endulzado'],
    equivalentes: ['alimento-020', 'alimento-021'],
    porciones: [
      { label: '1 unidad', gramos: 60.0, p: 5.0, c: 40.0, g: 9.0, kcal: 261 }
    ],
  },
  {
    id: 'alimento-020',
    nombre: 'Pan integral',
    grupo: 'carbohidratos',
    subgrupo: 'panes',
    preparacion: 'horneado',
    kcalPor100g: 197,
    tags: ['integral', 'horneado'],
    equivalentes: ['alimento-021'],
    porciones: [
      { label: '1 rebanada', gramos: 35.0, p: 3.0, c: 12.0, g: 1.0, kcal: 69 }
    ],
  },
  {
    id: 'alimento-099',
    nombre: 'Pan pita integral',
    grupo: 'carbohidratos',
    subgrupo: 'panes',
    preparacion: 'horneado',
    kcalPor100g: 303,
    tags: ['integral', 'fitness'],
    equivalentes: ['alimento-020'],
    porciones: [
      { label: '1 unidad', gramos: 60.0, p: 6.0, c: 36.0, g: 1.6, kcal: 182 }
    ],
  },
  {
    id: 'alimento-094',
    nombre: 'Papa blanca cocida',
    grupo: 'carbohidratos',
    subgrupo: 'tuberculos',
    preparacion: 'cocido',
    kcalPor100g: 62,
    tags: ['natural', 'basico'],
    equivalentes: ['alimento-026', 'alimento-044'],
    porciones: [
      { label: '1 unidad mediana (150g)', gramos: 150.0, p: 3.0, c: 20.0, g: 0.1, kcal: 93 }
    ],
  },
  {
    id: 'alimento-044',
    nombre: 'Papa cocida',
    grupo: 'carbohidratos',
    subgrupo: 'tuberculos',
    preparacion: 'cocido',
    kcalPor100g: 65,
    tags: ['natural', 'basico'],
    equivalentes: ['alimento-026'],
    porciones: [
      { label: '1 unidad mediana', gramos: 150.0, p: 3.8, c: 20.0, g: 0.2, kcal: 97 }
    ],
  },
  {
    id: 'alimento-024',
    nombre: 'Pasta cocida',
    grupo: 'carbohidratos',
    subgrupo: 'pastas',
    preparacion: 'cocido',
    kcalPor100g: 124,
    tags: ['basico'],
    equivalentes: ['alimento-025'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 5.0, c: 25.0, g: 0.5, kcal: 124 },
      { label: '1.5 tazas', gramos: 150.0, p: 7.5, c: 37.5, g: 0.75, kcal: 187 }
    ],
  },
  {
    id: 'alimento-025',
    nombre: 'Pasta integral cocida',
    grupo: 'carbohidratos',
    subgrupo: 'pastas',
    preparacion: 'cocido',
    kcalPor100g: 127,
    tags: ['integral', 'natural'],
    equivalentes: ['alimento-024'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 5.5, c: 24.0, g: 1.0, kcal: 127 }
    ],
  },
  {
    id: 'alimento-135',
    nombre: 'Pavo jamón 98%',
    grupo: 'proteinas',
    subgrupo: 'embutidos',
    preparacion: 'curado',
    kcalPor100g: 104,
    tags: ['bajo-grasa', 'practico', 'fitness'],
    equivalentes: ['alimento-004', 'alimento-106'],
    porciones: [
      { label: '2 rebanadas 40g', gramos: 40.0, p: 8.0, c: 0.5, g: 1.0, kcal: 43 }
    ],
  },
  {
    id: 'alimento-004',
    nombre: 'Pavo pechuga',
    grupo: 'proteinas',
    subgrupo: 'aves',
    preparacion: 'cocido',
    kcalPor100g: 134,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-003', 'alimento-005'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 30.0, c: 0.0, g: 1.5, kcal: 134 },
      { label: '1.5 porciones', gramos: 150.0, p: 45.0, c: 0.0, g: 2.25, kcal: 200 }
    ],
  },
  {
    id: 'alimento-054',
    nombre: 'Pechuga de pavo molida',
    grupo: 'proteinas',
    subgrupo: 'aves',
    preparacion: 'cocido',
    kcalPor100g: 212,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-008', 'alimento-009'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 26.0, c: 0.0, g: 12.0, kcal: 212 }
    ],
  },
  {
    id: 'alimento-106',
    nombre: 'Pechuga de pavo molida 99%',
    grupo: 'proteinas',
    subgrupo: 'aves',
    preparacion: 'cocido',
    kcalPor100g: 153,
    tags: ['bajo-grasa', 'fitness'],
    equivalentes: ['alimento-003', 'alimento-004'],
    porciones: [
      { label: '100g', gramos: 100.0, p: 30.0, c: 0.0, g: 3.0, kcal: 147 }
    ],
  },
  {
    id: 'alimento-142',
    nombre: 'Pepino',
    grupo: 'verduras',
    subgrupo: 'verduras',
    preparacion: 'crudo',
    kcalPor100g: 15,
    tags: ['natural', 'hidratante', 'bajo-cal'],
    equivalentes: ['alimento-045'],
    porciones: [
      { label: '1 taza 100g', gramos: 100.0, p: 0.7, c: 3.6, g: 0.1, kcal: 18 }
    ],
  },
  {
    id: 'alimento-065',
    nombre: 'Peras',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 71,
    tags: ['natural', 'fruta'],
    equivalentes: ['alimento-028', 'alimento-027'],
    porciones: [
      { label: '1 unidad', gramos: 150.0, p: 0.7, c: 25.0, g: 0.4, kcal: 106 }
    ],
  },
  {
    id: 'alimento-089',
    nombre: 'Pistaches',
    grupo: 'grasas',
    subgrupo: 'frutos-secos',
    preparacion: 'crudo',
    kcalPor100g: 580,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '1 porción', gramos: 30.0, p: 6.0, c: 6.0, g: 14.0, kcal: 174 }
    ],
  },
  {
    id: 'alimento-060',
    nombre: 'Piña',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 55,
    tags: ['natural', 'fruta', 'antiinflamatorio'],
    equivalentes: ['alimento-027', 'alimento-028'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 0.5, c: 13.0, g: 0.1, kcal: 55 }
    ],
  },
  {
    id: 'alimento-027',
    nombre: 'Plátano',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 97,
    tags: ['natural', 'fruta'],
    equivalentes: ['alimento-028'],
    porciones: [
      { label: '1 unidad', gramos: 120.0, p: 1.3, c: 27.0, g: 0.3, kcal: 116 }
    ],
  },
  {
    id: 'alimento-003',
    nombre: 'Pollo pechuga',
    grupo: 'proteinas',
    subgrupo: 'aves',
    preparacion: 'cocido',
    kcalPor100g: 156,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-004', 'alimento-005'],
    porciones: [
      { label: '1 porción mediana', gramos: 100.0, p: 31.0, c: 0.0, g: 3.6, kcal: 156 },
      { label: '1 porción grande', gramos: 150.0, p: 46.5, c: 0.0, g: 5.4, kcal: 235 },
      { label: '2 porciones', gramos: 200.0, p: 62.0, c: 0.0, g: 7.2, kcal: 313 }
    ],
  },
  {
    id: 'alimento-014',
    nombre: 'Proteína en polvo',
    grupo: 'proteinas',
    subgrupo: 'suplementos',
    preparacion: 'crudo',
    kcalPor100g: 403,
    tags: ['suplemento', 'polvo'],
    equivalentes: ['alimento-003', 'alimento-004'],
    porciones: [
      { label: '1 scoop', gramos: 30.0, p: 25.0, c: 3.0, g: 1.0, kcal: 121 }
    ],
  },
  {
    id: 'alimento-111',
    nombre: 'Proteína whey isolate',
    grupo: 'proteinas',
    subgrupo: 'suplementos',
    preparacion: 'crudo',
    kcalPor100g: 387,
    tags: ['suplemento', 'fitness', 'bajo-grasa'],
    equivalentes: ['alimento-014'],
    porciones: [
      { label: '1 scoop 30g', gramos: 30.0, p: 27.0, c: 1.0, g: 0.5, kcal: 116 }
    ],
  },
  {
    id: 'alimento-052',
    nombre: 'Pulpo cocido',
    grupo: 'proteinas',
    subgrupo: 'mariscos',
    preparacion: 'cocido',
    kcalPor100g: 156,
    tags: ['natural', 'bajo-grasa'],
    equivalentes: ['alimento-012', 'alimento-007'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 29.8, c: 4.4, g: 2.1, kcal: 156 }
    ],
  },
  {
    id: 'alimento-034',
    nombre: 'Queso cheddar',
    grupo: 'lacteos',
    subgrupo: 'quesos',
    preparacion: 'curado',
    kcalPor100g: 370,
    tags: ['graso', 'curado'],
    equivalentes: ['alimento-032', 'alimento-033'],
    porciones: [
      { label: '1 porción', gramos: 30.0, p: 7.0, c: 0.5, g: 9.0, kcal: 111 }
    ],
  },
  {
    id: 'alimento-033',
    nombre: 'Queso cottage',
    grupo: 'lacteos',
    subgrupo: 'quesos',
    preparacion: 'crudo',
    kcalPor100g: 77,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-032', 'alimento-034'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 11.0, c: 2.7, g: 2.5, kcal: 77 },
      { label: '0.5 porción', gramos: 50.0, p: 5.5, c: 1.4, g: 1.3, kcal: 39 }
    ],
  },
  {
    id: 'alimento-083',
    nombre: 'Queso Manchego',
    grupo: 'lacteos',
    subgrupo: 'quesos',
    preparacion: 'curado',
    kcalPor100g: 380,
    tags: ['natural', 'mexicano'],
    equivalentes: ['alimento-032', 'alimento-034'],
    porciones: [
      { label: '1 porción', gramos: 40.0, p: 9.0, c: 0.5, g: 12.0, kcal: 146 }
    ],
  },
  {
    id: 'alimento-149',
    nombre: 'Queso mozzarella light',
    grupo: 'lacteos',
    subgrupo: 'quesos',
    preparacion: 'crudo',
    kcalPor100g: 254,
    tags: ['bajo-grasa', 'fitness'],
    equivalentes: ['alimento-032', 'alimento-033'],
    porciones: [
      { label: '30g', gramos: 30.0, p: 8.4, c: 0.9, g: 4.6, kcal: 79 }
    ],
  },
  {
    id: 'alimento-082',
    nombre: 'Queso Oaxaca',
    grupo: 'lacteos',
    subgrupo: 'quesos',
    preparacion: 'crudo',
    kcalPor100g: 272,
    tags: ['natural', 'mexicano', 'fundido'],
    equivalentes: ['alimento-032', 'alimento-034'],
    porciones: [
      { label: '1 porción', gramos: 50.0, p: 11.0, c: 0.5, g: 10.0, kcal: 136 }
    ],
  },
  {
    id: 'alimento-032',
    nombre: 'Queso panela',
    grupo: 'lacteos',
    subgrupo: 'quesos',
    preparacion: 'crudo',
    kcalPor100g: 220,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-033', 'alimento-034'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 26.0, c: 2.0, g: 12.0, kcal: 220 },
      { label: '0.5 porción', gramos: 50.0, p: 13.0, c: 1.0, g: 6.0, kcal: 110 }
    ],
  },
  {
    id: 'alimento-017',
    nombre: 'Quinoa cocida',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 119,
    tags: ['sin-gluten', 'natural'],
    equivalentes: ['alimento-015', 'alimento-016'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 4.4, c: 21.0, g: 1.9, kcal: 119 }
    ],
  },
  {
    id: 'alimento-115',
    nombre: 'Requesón light',
    grupo: 'lacteos',
    subgrupo: 'quesos',
    preparacion: 'crudo',
    kcalPor100g: 72,
    tags: ['bajo-grasa', 'alto-proteina'],
    equivalentes: ['alimento-033', 'alimento-032'],
    porciones: [
      { label: '100g', gramos: 100.0, p: 12.4, c: 2.7, g: 1.0, kcal: 69 }
    ],
  },
  {
    id: 'alimento-010',
    nombre: 'Res lomo',
    grupo: 'proteinas',
    subgrupo: 'carnes',
    preparacion: 'cocido',
    kcalPor100g: 239,
    tags: ['natural'],
    equivalentes: ['alimento-009', 'alimento-011'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 26.0, c: 0.0, g: 15.0, kcal: 239 }
    ],
  },
  {
    id: 'alimento-006',
    nombre: 'Salmón',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 217,
    tags: ['graso', 'natural', 'omega3'],
    equivalentes: ['alimento-007', 'alimento-012'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 25.0, c: 0.0, g: 13.0, kcal: 217 },
      { label: '1.5 porciones', gramos: 150.0, p: 37.5, c: 0.0, g: 19.5, kcal: 326 }
    ],
  },
  {
    id: 'alimento-013',
    nombre: 'Salmón ahumado',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'fumado',
    kcalPor100g: 190,
    tags: ['graso', 'procesado'],
    equivalentes: ['alimento-006'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 25.0, c: 0.0, g: 10.0, kcal: 190 }
    ],
  },
  {
    id: 'alimento-066',
    nombre: 'Sandía',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 35,
    tags: ['natural', 'fruta', 'mexicano', 'bajo-calorias'],
    equivalentes: ['alimento-027', 'alimento-028'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 0.6, c: 7.6, g: 0.2, kcal: 35 }
    ],
  },
  {
    id: 'alimento-049',
    nombre: 'Sardinas en agua',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'enlatado',
    kcalPor100g: 112,
    tags: ['natural', 'enlatado', 'omega3'],
    equivalentes: ['alimento-005', 'alimento-006'],
    porciones: [
      { label: '1 lata', gramos: 100.0, p: 20.9, c: 0.0, g: 3.2, kcal: 112 }
    ],
  },
  {
    id: 'alimento-087',
    nombre: 'Semillas de calabaza',
    grupo: 'grasas',
    subgrupo: 'semillas',
    preparacion: 'crudo',
    kcalPor100g: 607,
    tags: ['natural', 'mexicano', 'zinc'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '1 porción', gramos: 30.0, p: 9.1, c: 3.2, g: 14.7, kcal: 182 }
    ],
  },
  {
    id: 'alimento-085',
    nombre: 'Semillas de chía',
    grupo: 'grasas',
    subgrupo: 'semillas',
    preparacion: 'crudo',
    kcalPor100g: 513,
    tags: ['natural', 'omega3', 'superalimento'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '1 cucharada', gramos: 15.0, p: 2.5, c: 6.3, g: 4.6, kcal: 77 }
    ],
  },
  {
    id: 'alimento-086',
    nombre: 'Semillas de linaza',
    grupo: 'grasas',
    subgrupo: 'semillas',
    preparacion: 'crudo',
    kcalPor100g: 570,
    tags: ['natural', 'omega3', 'fibra'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '1 cucharada', gramos: 10.0, p: 1.8, c: 2.9, g: 4.2, kcal: 57 }
    ],
  },
  {
    id: 'alimento-112',
    nombre: 'Skyr natural 0%',
    grupo: 'lacteos',
    subgrupo: 'yogures',
    preparacion: 'fermentado',
    kcalPor100g: 63,
    tags: ['alto-proteina', 'bajo-grasa', 'fitness'],
    equivalentes: ['alimento-031', 'alimento-084'],
    porciones: [
      { label: '1 envase 170g', gramos: 170.0, p: 19.0, c: 6.5, g: 0.2, kcal: 104 },
      { label: '100g', gramos: 100.0, p: 11.0, c: 4.0, g: 0.2, kcal: 54 }
    ],
  },
  {
    id: 'alimento-078',
    nombre: 'Sopa de tortilla',
    grupo: 'carbohidratos',
    subgrupo: 'sopas',
    preparacion: 'cocido',
    kcalPor100g: 103,
    tags: ['mexicano', 'sopa'],
    equivalentes: ['alimento-022', 'alimento-015'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 4.2, c: 16.0, g: 2.5, kcal: 103 }
    ],
  },
  {
    id: 'alimento-128',
    nombre: 'Tahini',
    grupo: 'grasas',
    subgrupo: 'semillas',
    preparacion: 'crudo',
    kcalPor100g: 633,
    tags: ['natural', 'calcio', 'vegano'],
    equivalentes: ['alimento-035', 'alimento-036'],
    porciones: [
      { label: '1 cda 15g', gramos: 15.0, p: 2.6, c: 3.2, g: 8.0, kcal: 95 }
    ],
  },
  {
    id: 'alimento-105',
    nombre: 'Tempeh',
    grupo: 'proteinas',
    subgrupo: 'soya',
    preparacion: 'cocido',
    kcalPor100g: 211,
    tags: ['vegano', 'fermentado', 'fitness'],
    equivalentes: ['alimento-003', 'alimento-104'],
    porciones: [
      { label: '100g', gramos: 100.0, p: 19.0, c: 9.0, g: 11.0, kcal: 211 }
    ],
  },
  {
    id: 'alimento-011',
    nombre: 'Tilapia',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 121,
    tags: ['bajo-grasa', 'natural'],
    equivalentes: ['alimento-010', 'alimento-007'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 26.0, c: 2.7, g: 0.7, kcal: 121 }
    ],
  },
  {
    id: 'alimento-104',
    nombre: 'Tofu firme',
    grupo: 'proteinas',
    subgrupo: 'soya',
    preparacion: 'crudo',
    kcalPor100g: 76,
    tags: ['vegano', 'proteina-vegetal'],
    equivalentes: ['alimento-003', 'alimento-011'],
    porciones: [
      { label: '100g', gramos: 100.0, p: 8.0, c: 1.9, g: 4.8, kcal: 83 }
    ],
  },
  {
    id: 'alimento-022',
    nombre: 'Tortilla de maíz',
    grupo: 'carbohidratos',
    subgrupo: 'tortillas',
    preparacion: 'cocido',
    kcalPor100g: 200,
    tags: ['sin-gluten', 'natural'],
    equivalentes: ['alimento-023'],
    porciones: [
      { label: '1 unidad', gramos: 30.0, p: 2.0, c: 12.0, g: 0.5, kcal: 60 },
      { label: '2 unidades', gramos: 60.0, p: 4.0, c: 24.0, g: 1.0, kcal: 121 }
    ],
  },
  {
    id: 'alimento-137',
    nombre: 'Tortilla integral',
    grupo: 'carbohidratos',
    subgrupo: 'tortillas',
    preparacion: 'cocido',
    kcalPor100g: 260,
    tags: ['integral', 'fibra', 'fitness'],
    equivalentes: ['alimento-099'],
    porciones: [
      { label: '1 unidad 40g', gramos: 40.0, p: 3.2, c: 20.0, g: 1.2, kcal: 104 }
    ],
  },
  {
    id: 'alimento-023',
    nombre: 'Tortillas de harina',
    grupo: 'carbohidratos',
    subgrupo: 'tortillas',
    preparacion: 'cocido',
    kcalPor100g: 205,
    tags: ['basico'],
    equivalentes: ['alimento-022'],
    porciones: [
      { label: '2 unidades', gramos: 60.0, p: 4.0, c: 20.0, g: 3.0, kcal: 123 }
    ],
  },
  {
    id: 'alimento-057',
    nombre: 'Trigo sarraceno cocido',
    grupo: 'carbohidratos',
    subgrupo: 'cereales',
    preparacion: 'cocido',
    kcalPor100g: 95,
    tags: ['sin-gluten', 'natural'],
    equivalentes: ['alimento-017', 'alimento-016'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 3.4, c: 19.0, g: 0.6, kcal: 95 }
    ],
  },
  {
    id: 'alimento-050',
    nombre: 'Trucha cocida',
    grupo: 'proteinas',
    subgrupo: 'pescados',
    preparacion: 'cocido',
    kcalPor100g: 162,
    tags: ['natural', 'omega3'],
    equivalentes: ['alimento-006', 'alimento-007'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 23.8, c: 0.0, g: 7.4, kcal: 162 }
    ],
  },
  {
    id: 'alimento-064',
    nombre: 'Uvas',
    grupo: 'carbohidratos',
    subgrupo: 'frutas',
    preparacion: 'crudo',
    kcalPor100g: 77,
    tags: ['natural', 'fruta'],
    equivalentes: ['alimento-028', 'alimento-027'],
    porciones: [
      { label: '1 taza', gramos: 100.0, p: 0.7, c: 18.0, g: 0.2, kcal: 77 }
    ],
  },
  {
    id: 'alimento-113',
    nombre: 'Yogur griego 0%',
    grupo: 'lacteos',
    subgrupo: 'yogures',
    preparacion: 'fermentado',
    kcalPor100g: 59,
    tags: ['alto-proteina', 'fitness'],
    equivalentes: ['alimento-031', 'alimento-084'],
    porciones: [
      { label: '170g', gramos: 170.0, p: 17.5, c: 6.8, g: 0.7, kcal: 104 }
    ],
  },
  {
    id: 'alimento-031',
    nombre: 'Yogur griego natural',
    grupo: 'lacteos',
    subgrupo: 'yogures',
    preparacion: 'fermentado',
    kcalPor100g: 58,
    tags: ['natural', 'fermentado'],
    equivalentes: ['alimento-029', 'alimento-030'],
    porciones: [
      { label: '1 envase', gramos: 170.0, p: 17.0, c: 6.0, g: 0.7, kcal: 98 }
    ],
  },
  {
    id: 'alimento-084',
    nombre: 'Yogur natural sin azúcar',
    grupo: 'lacteos',
    subgrupo: 'yogures',
    preparacion: 'fermentado',
    kcalPor100g: 59,
    tags: ['natural', 'probiótico'],
    equivalentes: ['alimento-031', 'alimento-029'],
    porciones: [
      { label: '1 envase', gramos: 200.0, p: 12.0, c: 8.0, g: 3.5, kcal: 112 }
    ],
  },
  {
    id: 'alimento-076',
    nombre: 'Yuca cocida',
    grupo: 'carbohidratos',
    subgrupo: 'tuberculos',
    preparacion: 'cocido',
    kcalPor100g: 189,
    tags: ['natural', 'sin-gluten'],
    equivalentes: ['alimento-026', 'alimento-044'],
    porciones: [
      { label: '1 porción', gramos: 100.0, p: 1.8, c: 45.0, g: 0.2, kcal: 189 }
    ],
  },
  {
    id: 'alimento-143',
    nombre: 'Zanahoria cruda',
    grupo: 'verduras',
    subgrupo: 'verduras',
    preparacion: 'crudo',
    kcalPor100g: 41,
    tags: ['natural', 'vitamina-a', 'fibra'],
    equivalentes: ['alimento-045'],
    porciones: [
      { label: '1 unidad 60g', gramos: 60.0, p: 0.6, c: 6.0, g: 0.2, kcal: 28 }
    ],
  },

  {
    id: 'alimento-151',
    nombre: 'Pechuga de pollo',
    grupo: 'proteinas',
    subgrupo: 'aves',
    preparacion: 'cocido',
    kcalPor100g: 156,
    tags: ['bajo-grasa', 'natural', 'fitness'],
    equivalentes: ['alimento-003'],
    porciones: [
      { label: '1 porción mediana', gramos: 100, p: 31, c: 0, g: 3.6, kcal: 156 },
      { label: '1 porción grande', gramos: 150, p: 46.5, c: 0, g: 5.4, kcal: 235 }
    ]
  },
  {
    id: 'alimento-152',
    nombre: 'Lechuga',
    grupo: 'verduras',
    subgrupo: 'hojas-verdes',
    preparacion: 'crudo',
    kcalPor100g: 15,
    tags: ['natural', 'bajo-cal', 'hidratante'],
    equivalentes: ['alimento-045'],
    porciones: [
      { label: '1 taza', gramos: 100, p: 1.4, c: 2.9, g: 0.2, kcal: 20 }
    ]
  },
  {
    id: 'alimento-153',
    nombre: 'Cebolla',
    grupo: 'verduras',
    subgrupo: 'verduras',
    preparacion: 'crudo',
    kcalPor100g: 40,
    tags: ['natural', 'mexicano', 'sabor'],
    equivalentes: ['alimento-045'],
    porciones: [
      { label: '1 taza', gramos: 100, p: 1.1, c: 9.3, g: 0.1, kcal: 41 }
    ]
  },
  {
    id: 'alimento-154',
    nombre: 'Pimiento',
    grupo: 'verduras',
    subgrupo: 'verduras',
    preparacion: 'crudo',
    kcalPor100g: 26,
    tags: ['natural', 'vitamina-c', 'antioxidante'],
    equivalentes: ['alimento-045'],
    porciones: [
      { label: '1 taza', gramos: 100, p: 1, c: 6, g: 0.2, kcal: 30 }
    ]
  },
  {
    id: 'alimento-155',
    nombre: 'Mantequilla de cacahuate',
    grupo: 'grasas',
    subgrupo: 'cremas',
    preparacion: 'crudo',
    kcalPor100g: 625,
    tags: ['graso', 'crema', 'energia'],
    equivalentes: ['alimento-040', 'alimento-090'],
    porciones: [
      { label: '2 cucharadas', gramos: 32, p: 8, c: 6, g: 16, kcal: 200 }
    ]
  },
  {
    id: 'alimento-156',
    nombre: 'Naranja',
    grupo: 'frutas',
    subgrupo: 'citricos',
    preparacion: 'crudo',
    kcalPor100g: 47,
    tags: ['natural', 'vitamina-c', 'fruta'],
    equivalentes: ['alimento-027', 'alimento-028'],
    porciones: [
      { label: '1 unidad', gramos: 130, p: 1, c: 12, g: 0.2, kcal: 54 }
    ]
  },
];