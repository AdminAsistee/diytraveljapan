(()=>{
const lang=document.documentElement.lang;
const localized=['zh-Hans','zh-Hant','id','ms','fil'].includes(lang);
window.DIY_T=(text,values={})=>{let result=window.DIY_LOCALE?.[text]||text;for(const [key,value] of Object.entries(values))result=result.replaceAll('{'+key+'}',String(value));return result};
window.DIY_PATH=path=>localized?'/'+lang+path.replace(/^\/(zh-Hans|zh-Hant|id|ms|fil)(?=\/)/,''):path;
})();
