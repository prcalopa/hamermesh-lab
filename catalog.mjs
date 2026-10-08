import {arrigoLessons,arrigoNotes,arrigoQuizzes} from './arrigo-content.mjs';
import {arrigo2Lessons,arrigo2Notes,arrigo2Quizzes} from './arrigo2-content.mjs';
import {notes,quizzes} from './content.mjs';
import {chapter2Lessons,chapter2Notes,chapter2Quizzes} from './chapter2-content.mjs';
export const hamermeshLessons=[
 {title:'Correspondencias y transformaciones',nav:'Transformaciones',pages:'1–6',desc:'Una transformación cambia la posición de los objetos. Componer significa aplicar una y después otra.'},
 {title:'Grupos: definiciones y ejemplos',nav:'Qué es un grupo',pages:'6–15',desc:'Un conjunto y una operación. Cuatro condiciones que permiten combinar y deshacer sus elementos.'},
 {title:'Subgrupos y teorema de Cayley',nav:'Subgrupos y Cayley',pages:'15–20',desc:'Algunas operaciones forman un grupo más pequeño. Todo grupo finito puede realizarse con permutaciones.'},
 {title:'Clases laterales y teorema de Lagrange',nav:'Clases laterales',pages:'20–23',desc:'Las clases laterales reparten un grupo en bloques del mismo tamaño. De ahí sale la divisibilidad.'},
 {title:'Clases de conjugación',nav:'Conjugación',pages:'23–28',desc:'Conjugar cambia la referencia de una operación. Descubre qué elementos quedan relacionados.'},
 {title:'Subgrupos normales, cocientes y homomorfismos',nav:'Grupos cociente',pages:'28–30',desc:'Agrupar operaciones en clases puede producir un grupo nuevo, si el subgrupo es normal.'},
 {title:'Productos directos',nav:'Productos directos',pages:'30–31',desc:'Dos grupos independientes se combinan en pares. Cada componente conserva su propia operación.'}
];
export const materials=[
 {id:'hamermesh',author:'M. Hamermesh',title:'Teoría de grupos y simetría',original:'Group Theory and Its Application to Physical Problems',area:'Métodos matemáticos',description:'De las operaciones de un triángulo a los grupos del espacio, los cristales y los poliedros.',accent:'groups',chapters:[
  {id:1,title:'Elementos de teoría de grupos',lessons:hamermeshLessons,notes,quizzes,renderer:'groups',pages:'1–31',pdfPages:'7–37',reference:'§§ 1-1 a 1-7',thread:'Un triángulo.<br>Seis operaciones.<br>Siete ideas conectadas.',symbol:'D₃ ≅ S₃'},
  {id:2,title:'Grupos de simetría',lessons:chapter2Lessons,notes:chapter2Notes,quizzes:chapter2Quizzes,renderer:'space',pages:'32–67',pdfPages:'38–73',reference:'§§ 2-1 a 2-10',thread:'Del espacio al plano.<br>De una operación al grupo.<br>Diez ideas conectadas.',symbol:'det A = ±1'}
 ]},
 {id:'arrigo',author:'Daniel J. Arrigo',title:'Simetrías de ecuaciones diferenciales',original:'Symmetry Analysis of Differential Equations: An Introduction',area:'Métodos matemáticos',description:'De los grupos de Lie como movimientos a la reducción de ecuaciones diferenciales y sistemas.',accent:'lie',chapters:[
  {id:1,title:'Una introducción al análisis de simetrías',lessons:arrigoLessons,notes:arrigoNotes,quizzes:arrigoQuizzes,renderer:'lie',pages:'1–14',pdfPages:'17–30',reference:'§§ 1.1–1.4 y ejercicios',thread:'Encuentra lo que se conserva.<br>Transforma las pendientes.<br>Elige nuevas coordenadas.',symbol:'r̄=r · s̄=s+ε'},
  {id:2,title:'Ecuaciones diferenciales ordinarias',lessons:arrigo2Lessons,notes:arrigo2Notes,quizzes:arrigo2Quizzes,renderer:'lie2',pages:'15–72',pdfPages:'31–88',reference:'§§ 2.1–2.7 y ejercicios',thread:'Del generador al flujo.<br>Del flujo a la reducción.<br>De una EDO a un sistema.',symbol:'Γ⁽ⁿ⁾Δ | Δ=0 = 0'}
 ]}
];
export function getMaterial(id){return materials.find(m=>m.id===id);}
