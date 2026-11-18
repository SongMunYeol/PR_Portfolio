const optionalFields=new Set(['activities','careers.*.images','projects.*.images','awards.*.images','licenses.*.image','projects.*.date','game.playPeriod','game.subTitle','game.subDescription','game.carouselDuration','game.carouselAutoplay','genres.*.classification','genres.*.description']);
export function validateShape(value,model,path=[],depth=0){
 if(depth>12)return false;
 if(typeof model==='string')return typeof value==='string';
 if(Array.isArray(model))return Array.isArray(value)&&value.length<=100&&value.every((item,index)=>validateShape(item,model[0],[...path,index],depth+1));
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 return Object.keys(model).every(key=>{const next=[...path,key];if(!Object.hasOwn(value,key))return optionalFields.has(next.map(k=>typeof k==='number'?'*':k).join('.'));return validateShape(value[key],model[key],next,depth+1)})&&Object.keys(value).every(key=>Object.hasOwn(model,key));
}
export function mainGenreIndex(genres){const explicit=genres.findIndex(g=>g.classification==='main');if(explicit>=0)return explicit;const collectible=genres.findIndex(g=>g.name.includes('수집'));return Math.max(0,collectible)}

