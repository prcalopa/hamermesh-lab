import {emc1,emc2} from './emc12-content.mjs';
import {emc3} from './emc3-content.mjs';
import {emc4} from './emc4-content.mjs';
import {emc5} from './emc5-content.mjs';
import {emc6} from './emc6-content.mjs';
import {emc7} from './emc7-content.mjs';
import {ramadevi3} from './ramadevi3-content.mjs';
import {ramadevi5} from './ramadevi5-content.mjs';
import {ramadevi6} from './ramadevi6-content.mjs';
import {cantwell5Lessons,cantwell5Notes,cantwell5Quizzes} from './cantwell5-content.mjs';
import {applyDepth} from './depth.mjs';
import {arrigo3Lessons,arrigo3Notes,arrigo3Quizzes} from './arrigo3-content.mjs';
import {arrigoLessons,arrigoNotes,arrigoQuizzes} from './arrigo-content.mjs';
import {arrigo2Lessons,arrigo2Notes,arrigo2Quizzes} from './arrigo2-content.mjs';
import {notes,quizzes} from './content.mjs';
import {chapter2Lessons,chapter2Notes,chapter2Quizzes} from './chapter2-content.mjs';
import {cantwell1Lessons,cantwell1Notes,cantwell1Quizzes,cantwell2Lessons,cantwell2Notes,cantwell2Quizzes} from './cantwell-content.mjs';
import {chapter3Lessons,chapter3Notes,chapter3Quizzes} from './chapter3-content.mjs';
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
 {id:'emc',shortTitle:'EMC · Estadística y ciencia de datos',author:'EMC Education Services',title:'Ciencia de datos y estadística',original:'Data Science and Big Data Analytics: Discovering, Analyzing, Visualizing and Presenting Data (2015)',area:'Ciencia de datos · estadística aplicada',description:'Del diseño de un análisis a la inferencia, los clústeres, las reglas de asociación, la regresión y la clasificación. Derivaciones, problemas resueltos, código R y laboratorios reproducibles.',accent:'groups',symbol:'σ',chapters:[
  {id:1,shortTitle:'Introducción al análisis de big data',title:'Introducción al análisis de big data',...emc1,renderer:'emc',pages:'1–24',pdfPages:'21–44',reference:'§§ 1.1–1.4 y ampliaciones identificadas',thread:'Define la pregunta.<br>Comprueba los supuestos.<br>Cuantifica la incertidumbre.',symbolTex:String.raw`\hat\theta\ \pm\ \operatorname{EE}(\hat\theta)`},
  {id:2,shortTitle:'Ciclo de vida del análisis de datos',title:'Ciclo de vida del análisis de datos',...emc2,renderer:'emc',pages:'25–62',pdfPages:'45–82',reference:'§§ 2.1–2.8 y ampliaciones identificadas',thread:'Define la pregunta.<br>Comprueba los supuestos.<br>Cuantifica la incertidumbre.',symbolTex:String.raw`\hat\theta\ \pm\ \operatorname{EE}(\hat\theta)`},
  {id:3,shortTitle:'Análisis exploratorio e inferencia con R',title:'Análisis exploratorio e inferencia con R',...emc3,renderer:'emc',pages:'63–116',pdfPages:'83–136',reference:'§§ 3.1–3.3 y ampliaciones identificadas',thread:'Define la pregunta.<br>Comprueba los supuestos.<br>Cuantifica la incertidumbre.',symbolTex:String.raw`\hat\theta\ \pm\ \operatorname{EE}(\hat\theta)`},
  {id:4,shortTitle:'Agrupamiento y k-means',title:'Agrupamiento y k-means',...emc4,renderer:'emc',pages:'117–136',pdfPages:'137–156',reference:'§§ 4.1–4.3 y ampliaciones identificadas',thread:'Define la pregunta.<br>Comprueba los supuestos.<br>Cuantifica la incertidumbre.',symbolTex:String.raw`\hat\theta\ \pm\ \operatorname{EE}(\hat\theta)`},
  {id:5,shortTitle:'Reglas de asociación y Apriori',title:'Reglas de asociación y Apriori',...emc5,renderer:'emc',pages:'137–160',pdfPages:'157–180',reference:'§§ 5.1–5.7 y ampliaciones identificadas',thread:'Define la pregunta.<br>Comprueba los supuestos.<br>Cuantifica la incertidumbre.',symbolTex:String.raw`\hat\theta\ \pm\ \operatorname{EE}(\hat\theta)`},
  {id:6,shortTitle:'Regresión lineal y logística',title:'Regresión lineal y logística',...emc6,renderer:'emc',pages:'161–190',pdfPages:'181–210',reference:'§§ 6.1–6.4 y ampliaciones identificadas',thread:'Define la pregunta.<br>Comprueba los supuestos.<br>Cuantifica la incertidumbre.',symbolTex:String.raw`\hat\theta\ \pm\ \operatorname{EE}(\hat\theta)`},
  {id:7,shortTitle:'Clasificación y evaluación',title:'Clasificación y evaluación',...emc7,renderer:'emc',pages:'191–230',pdfPages:'211–250',reference:'§§ 7.1–7.4 y ampliaciones identificadas',thread:'Define la pregunta.<br>Comprueba los supuestos.<br>Cuantifica la incertidumbre.',symbolTex:String.raw`\hat\theta\ \pm\ \operatorname{EE}(\hat\theta)`},
 ]},
 {id:'ramadevi',shortTitle:'Ramadevi y Dubey · Grupos y física',author:'Pichai Ramadevi y Varun Dubey',title:'Teoría de grupos para físicos',original:'Group Theory for Physicists: With Applications',area:'Teoría de grupos · nivel avanzado',description:'Representaciones, álgebras de Lie y aplicaciones a momentos angulares, sabores, espacio-tiempo y átomo de hidrógeno.',accent:'groups',symbol:'λ',chapters:[
  {id:3,shortTitle:'Representaciones de grupos',title:'Representaciones de grupos',...ramadevi3,renderer:'ramadevi',pages:'29–58',pdfPages:'42–72',reference:'§§ 3.1–3.9',thread:'Identifica la simetría.<br>Construye la representación.<br>Deduce sus consecuencias.',symbolTex:String.raw`\chi(g)=\operatorname{tr}D(g)`},
  {id:5,shortTitle:'Grupos y álgebras de Lie',title:'Grupos y álgebras de Lie',...ramadevi5,renderer:'ramadevi',pages:'87–114',pdfPages:'101–128',reference:'§§ 5.1–5.7.3',thread:'Identifica la simetría.<br>Construye la representación.<br>Deduce sus consecuencias.',symbolTex:String.raw`[T_a,T_b]=if_{ab}^{\ \ c}T_c`},
  {id:6,shortTitle:'Aplicaciones de teoría de grupos',title:'Aplicaciones de teoría de grupos',...ramadevi6,renderer:'ramadevi',pages:'115–150',pdfPages:'129–164',reference:'§§ 6.1–6.6.2',thread:'Identifica la simetría.<br>Construye la representación.<br>Deduce sus consecuencias.',symbolTex:String.raw`j_1\otimes j_2=\bigoplus_{J=|j_1-j_2|}^{j_1+j_2}J`},
 ]},
 {id:'cantwell',shortTitle:'Cantwell · Simetría y dimensiones',author:'Brian J. Cantwell',title:'Análisis de simetría y semejanza',original:'Introduction to Symmetry Analysis',area:'Métodos matemáticos · nivel avanzado',description:'De las simetrías discretas a la difusión, los grupos continuos y el análisis dimensional. Derivaciones, dominios y límites de los modelos.',accent:'cantwell',symbol:'Π',chapters:[
  {id:1,shortTitle:'Introducción a la simetría',title:'Introducción a la simetría',lessons:cantwell1Lessons,notes:cantwell1Notes,quizzes:cantwell1Quizzes,renderer:'cantwell',pages:'1–32',pdfPages:'1–32',reference:'§§ 1.1–1.8',thread:'Conserva una estructura.<br>Transforma las derivadas.<br>Reduce el problema.',symbol:'Tₛ∘Tₜ=Tₛ₊ₜ',symbolTex:String.raw`T_s\circ T_t=T_{s+t}`},
  {id:2,shortTitle:'Análisis dimensional',title:'Análisis dimensional',lessons:cantwell2Lessons,notes:cantwell2Notes,quizzes:cantwell2Quizzes,renderer:'cantwell',pages:'33–54',pdfPages:'33–54',reference:'§§ 2.1–2.7',thread:'Elige las variables.<br>Calcula los invariantes.<br>Examina las hipótesis.',symbol:'Av=0',symbolTex:String.raw`Av=0,\quad\dim\ker A=n-r`},
  {id:5,shortTitle:'Grupos y álgebras de Lie',title:'Grupos de Lie de un parámetro',lessons:cantwell5Lessons,notes:cantwell5Notes,quizzes:cantwell5Quizzes,renderer:'cantwell5',pages:'121–148',pdfPages:'2–29 de la traducción española del capítulo 5',reference:'§§ 5.1–5.14 y ejercicios seleccionados',thread:'Del flujo al campo.<br>Del campo a los invariantes.<br>Del corchete al álgebra.',symbol:'ΓF=0',symbolTex:String.raw`\Gamma F=0,\quad[X_i,X_j]=c_{ij}^{k}X_k`}
 ]},
 {id:'hamermesh',shortTitle:'Hamermesh · Grupos',author:'M. Hamermesh',title:'Teoría de grupos y simetría',original:'Group Theory and Its Application to Physical Problems',area:'Métodos matemáticos',description:'De las operaciones de un triángulo a los grupos del espacio, los cristales y los poliedros.',accent:'groups',chapters:[
  {id:1,shortTitle:'Teoría de grupos',title:'Elementos de teoría de grupos',lessons:hamermeshLessons,notes,quizzes,renderer:'groups',pages:'1–31',pdfPages:'7–37',reference:'§§ 1-1 a 1-7',thread:'Un triángulo.<br>Seis operaciones.<br>Siete ideas conectadas.',symbol:'D₃ ≅ S₃'},
  {id:2,shortTitle:'Simetría espacial',title:'Grupos de simetría',lessons:chapter2Lessons,notes:chapter2Notes,quizzes:chapter2Quizzes,renderer:'space',pages:'32–67',pdfPages:'38–73',reference:'§§ 2-1 a 2-10',thread:'Del espacio al plano.<br>De una operación al grupo.<br>Diez ideas conectadas.',symbol:'det A = ±1'},
  {id:3,shortTitle:'Representaciones',title:'Representaciones de grupos',lessons:chapter3Lessons,notes:chapter3Notes,quizzes:chapter3Quizzes,renderer:'representations',pages:'68–114',pdfPages:'1–47 del extracto del capítulo 3',reference:'§§ 3-1 a 3-19',thread:'Representa una simetría.<br>Separa sus bloques.<br>Clasifica los estados.',symbol:'χ(g)=tr D(g)',symbolTex:String.raw`\chi(g)=\operatorname{tr}D(g)`}
 ]},
 {id:'arrigo',shortTitle:'Arrigo · Simetrías EDO y EDP',author:'Daniel J. Arrigo',title:'Simetrías de ecuaciones diferenciales',original:'Symmetry Analysis of Differential Equations: An Introduction',area:'Métodos matemáticos',description:'De los grupos de Lie como movimientos a la reducción de ecuaciones diferenciales y sistemas.',accent:'lie',chapters:[
  {id:1,shortTitle:'Introducción',title:'Una introducción al análisis de simetrías',lessons:arrigoLessons,notes:arrigoNotes,quizzes:arrigoQuizzes,renderer:'lie',pages:'1–14',pdfPages:'17–30',reference:'§§ 1.1–1.4 y ejercicios',thread:'Encuentra lo que se conserva.<br>Transforma las pendientes.<br>Elige nuevas coordenadas.',symbol:'r̄=r · s̄=s+ε'},
  {id:2,shortTitle:'EDO y sistemas',title:'Ecuaciones diferenciales ordinarias',lessons:arrigo2Lessons,notes:arrigo2Notes,quizzes:arrigo2Quizzes,renderer:'lie2',pages:'15–72',pdfPages:'31–88',reference:'§§ 2.1–2.7 y ejercicios',thread:'Del generador al flujo.<br>Del flujo a la reducción.<br>De una EDO a un sistema.',symbol:'Γ⁽ⁿ⁾Δ | Δ=0 = 0',symbolTex:String.raw`\left.\Gamma^{(n)}\Delta\right|_{\Delta=0}=0`},
  {id:3,shortTitle:'EDP y sistemas',title:'Ecuaciones en derivadas parciales',lessons:arrigo3Lessons,notes:arrigo3Notes,quizzes:arrigo3Quizzes,renderer:'lie3',pages:'73–132',pdfPages:'91–157 de la traducción española',reference:'§§ 3.1–3.5 y ejercicios seleccionados',thread:'Prolonga las derivadas.<br>Encuentra los invariantes.<br>Comprueba la reducción.',symbol:'Q=0',symbolTex:String.raw`Q=\eta-\tau u_t-\xi u_x=0`}
 ]}
];
applyDepth(materials);
export function getMaterial(id){return materials.find(m=>m.id===id);}
