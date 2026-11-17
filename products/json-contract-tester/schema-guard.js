(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.JSONContractTesterSchemaGuard=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const SUPPORTED=new Set([
    'type','required','properties','additionalProperties','items','enum','const',
    'minimum','maximum','minLength','maxLength','pattern','minItems','maxItems'
  ]);
  const ANNOTATIONS=new Set([
    '$schema','$id','$comment','title','description','default','examples',
    'deprecated','readOnly','writeOnly'
  ]);
  const TYPES=new Set(['null','boolean','object','array','number','integer','string']);

  function join(path,part){
    return path+'/'+String(part).replace(/~/g,'~0').replace(/\//g,'~1');
  }
  function isRecord(value){
    return value!==null&&typeof value==='object'&&!Array.isArray(value);
  }
  function inspectSchema(schema){
    const issues=[];
    function add(keyword,path,message){
      if(issues.length<50)issues.push({keyword,schemaPath:path,message});
    }
    function visit(node,path){
      if(!isRecord(node)){
        add('schema',path,'Schema node must be an object; boolean and array schemas are not supported.');
        return;
      }
      for(const [keyword,value] of Object.entries(node)){
        const keywordPath=join(path,keyword);
        if(ANNOTATIONS.has(keyword))continue;
        if(!SUPPORTED.has(keyword)){
          add(keyword,keywordPath,'Unsupported JSON Schema keyword: '+keyword+'.');
          continue;
        }
        if(keyword==='properties'){
          if(!isRecord(value)){
            add(keyword,keywordPath,'properties must be an object mapping property names to schema objects.');
            continue;
          }
          for(const [name,child] of Object.entries(value))visit(child,join(keywordPath,name));
        }else if(keyword==='items'){
          if(!isRecord(value)){
            add(keyword,keywordPath,'items must be one schema object; tuple-form arrays and boolean schemas are not supported.');
            continue;
          }
          visit(value,keywordPath);
        }else if(keyword==='additionalProperties'){
          if(typeof value!=='boolean'){
            add(keyword,keywordPath,'additionalProperties supports only true or false; schema-valued forms are not supported.');
          }
        }else if(keyword==='required'){
          if(!Array.isArray(value)||value.some(name=>typeof name!=='string')){
            add(keyword,keywordPath,'required must be an array of strings.');
          }
        }else if(keyword==='type'){
          const types=Array.isArray(value)?value:[value];
          if(types.length===0||types.some(type=>typeof type!=='string'||!TYPES.has(type))){
            add(keyword,keywordPath,'type must be a supported JSON type name or a non-empty array of supported type names.');
          }
        }else if(keyword==='enum'){
          if(!Array.isArray(value)||value.length===0){
            add(keyword,keywordPath,'enum must be a non-empty array.');
          }
        }else if(keyword==='minimum'||keyword==='maximum'){
          if(typeof value!=='number'||!Number.isFinite(value)){
            add(keyword,keywordPath,keyword+' must be a finite number.');
          }
        }else if(keyword==='minLength'||keyword==='maxLength'||keyword==='minItems'||keyword==='maxItems'){
          if(!Number.isInteger(value)||value<0){
            add(keyword,keywordPath,keyword+' must be a non-negative integer.');
          }
        }else if(keyword==='pattern'){
          if(typeof value!=='string'){
            add(keyword,keywordPath,'pattern must be a string.');
          }else{
            try{new RegExp(value);}catch(error){add(keyword,keywordPath,'pattern is not a valid JavaScript regular expression.');}
          }
        }
      }
    }
    visit(schema,'#');
    return issues;
  }
  return {inspectSchema};
});
