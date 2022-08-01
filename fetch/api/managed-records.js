import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

const ITEMS_PER_PAGE = 10;
const PRIMARY_COLOR = new Set(['red','blue','yellow']);

function retrieve(options){
    const {page=1, colors=[]} = options ?? {};
    const offset = ((page)-1)*ITEMS_PER_PAGE;
    const limit = ITEMS_PER_PAGE;
    const uri = URI(window.path).search({limit, offset, 'color[]':colors})
    const previousPage = page===1?null:page-1;
    return fetch(uri).then(res=>res.json()).then(res=>{
        const ids = res.map(({id})=>id);
        const open = res.filter(({disposition})=>disposition==='open').map(datum=>({...datum, isPrimary:PRIMARY_COLOR.has(datum.color)}))
        const closedPrimaryCount = res.filter(({color, disposition})=>disposition==='closed'&&PRIMARY_COLOR.has(color)).length;
        const nextPage = res.length === ITEMS_PER_PAGE && page<50?page+1:null;
        return {previousPage, nextPage, ids, open, closedPrimaryCount};
    }).catch(()=>console.log('error'))
}

export default retrieve;
