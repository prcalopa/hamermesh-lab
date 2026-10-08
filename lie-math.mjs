// Exact formulas; floating-point evaluation is only used for the interactive plots.
export function transform(kind,x,y,e){
 const nonzero=d=>{if(Math.abs(d)<1e-9)throw new RangeError('Transformación fuera de su dominio');return d;};
 switch(kind){
  case 'rotation':return [x*Math.cos(e)-y*Math.sin(e),x*Math.sin(e)+y*Math.cos(e)];
  case 'scale':return [Math.exp(e)*x,Math.exp(e)*y];
  case 'rational':return [x+e,y/nonzero(1-e*y)];
  case 'hyperbola':return [x*y/nonzero(y-e),y-e];
  case 'odeScale':return [Math.exp(e)*x,Math.exp(-e)*y];
  case 'projective':return [x/nonzero(1+e*x),y-e];
  case 'ratio':return [x+e,(x+e)*y/nonzero(x)];
  case 'reciprocal':return [x/nonzero(1+e*x),y/nonzero(1+e*y)];
  default:throw new RangeError('Modelo desconocido');
 }
}
export function jacobian(kind,x,y,e){
 switch(kind){
  case 'scale':return [Math.exp(e),0,0,Math.exp(e)];
  case 'odeScale':return [Math.exp(e),0,0,Math.exp(-e)];
  case 'projective':return [1/(1+e*x)**2,0,0,1];
  case 'ratio':return [1,0,-e*y/x**2,(x+e)/x];
  case 'reciprocal':return [1/(1+e*x)**2,0,0,1/(1+e*y)**2];
  default:throw new RangeError('Jacobiano no disponible');
 }
}
export function pushSlope(kind,x,y,e,p){const [Xx,Xy,Yx,Yy]=jacobian(kind,x,y,e);return (Yx+Yy*p)/(Xx+Xy*p);}
export const odeRhs={
 simple:(x,y)=>x*y**3,
 projective:(x,y)=>(x*y+1)**3/x**5+1/x**2,
 riccati:(x,y)=>y*y-y/x-1/x**2,
 ratio:(x,y)=>y/x+x*x/(x+y),
 reciprocal:(x,y)=>2*y**3*(x-y-x*y)/(x*(x-y)**2)
};
export function riccati(x,c){return 1/x+2*x/(c-x*x);}
export function coordinates(kind,x,y){
 if(kind==='riccati')return [x*y,Math.log(Math.abs(x))];
 if(kind==='ratio')return [y/x,x];
 if(kind==='reciprocal')return [1/x-1/y,1/y];
 throw new RangeError('Coordenadas desconocidas');
}
export function reduced(kind,r){
 if(kind==='riccati')return 1/(r*r-1);
 if(kind==='ratio')return r+1;
 if(kind==='reciprocal')return -2*(r+1)/(r*r+2*r+2);
}
export function reducedSolution(kind,r,c){
 if(kind==='riccati')return .5*Math.log(Math.abs((r-1)/(r+1)))+c;
 if(kind==='ratio')return .5*r*r+r+c;
 if(kind==='reciprocal')return -Math.log(r*r+2*r+2)+c;
}
