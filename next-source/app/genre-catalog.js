// Display missing requested categories without replacing saved genres or game arrays.
export const genreNames=['수집형 RPG','RPG','액션','슈팅','전략','시뮬레이션','샌드박스&생존','퍼즐','플랫폼','어드벤처'];
export function withGenreCatalog(genres){const existing=genres||[];return [...existing,...genreNames.filter(name=>!existing.some(genre=>genre.name===name)).map(name=>({name,classification:name==='수집형 RPG'?'main':'sub',description:'',games:[]}))]}
