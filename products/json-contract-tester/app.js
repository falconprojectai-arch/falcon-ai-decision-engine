(function(){
const $=id=>document.getElementById(id), schemaInput=$('schema'), casesInput=$('cases'), results=$('results'), status=$('status');
const sampleSchema={type:'object',required:['ok','result','meta'],properties:{ok:{type:'boolean'},result:{type:'string',minLength:1},meta:{type:'object',required:['request_id','retry_count'],properties:{request_id:{type:'string',minLength:1},retry_count:{type:'integer',minimum:0}},additionalProperties:false}},additionalProperties:false};
const sampleCases=[{ok:true,result:'done',meta:{request_id:'req-001',retry_count:0}},{ok:true,meta:{request_id:'req-002',retry_count:1}},{ok:'yes',result:'done',meta:{request_id:'req-003',retry_count:0}},{ok:true,result:'done',meta:{request_id:'req-004',retry_count:'2'}}];
function sameJson(a,b){
 if(a===b)return true;
 if(a===null||b===null||typeof a!=='object'||typeof b!=='object')return false;
 if(Array.isArray(a)!==Array.isArray(b))return false;
 const ak=Object.keys(a),bk=Object.keys(b);
 return ak.length===bk.length&&ak.every(k=>Object.prototype.hasOwnProperty.call(b,k)&&sameJson(a[k],b[k]));
}
function pointerJoin(base,part){return base+'/'+String(part).replace(/~/g,'~0').replace(/\//g,'~1')}
function schemaJoin(base,part){return base+'/'+String(part).replace(/~/g,'~0').replace(/\//g,'~1')}
function actualValue(value){try{const s=JSON.stringify(value);return s===undefined?String(value):s.length>500?s.slice(0,497)+'...':s}catch(e){return String(value)}}
function issue(errors,instancePath,schemaPath,keyword,message,expected,actual){errors.push({instancePath:instancePath||'/',schemaPath:schemaPath||'#',keyword,message,expected:expected===undefined?null:expected,actual:actual===undefined?null:actual})}
function check(value,s,path='',schemaPath='#',errors=[]){
 if(!s||typeof s!=='object'||Array.isArray(s)){issue(errors,path,schemaPath,'schema','Schema node must be an object', 'object schema node',actualValue(s));return errors}
 if(Object.prototype.hasOwnProperty.call(s,'const')&&!sameJson(value,s.const))issue(errors,path,schemaJoin(schemaPath,'const'),'const','Value must equal const value',actualValue(s.const),actualValue(value));
 if(Array.isArray(s.enum)&&!s.enum.some(v=>sameJson(v,value)))issue(errors,path,schemaJoin(schemaPath,'enum'),'enum','Value is not in enum',actualValue(s.enum),actualValue(value));
 const types=Array.isArray(s.type)?s.type:[s.type];
 if(s.type){const matches=t=>t==='null'?value===null:t==='array'?Array.isArray(value):t==='object'?value!==null&&typeof value==='object'&&!Array.isArray(value):t==='integer'?typeof value==='number'&&Number.isInteger(value):t==='number'?typeof value==='number'&&Number.isFinite(value):t==='boolean'?typeof value==='boolean':t==='string'?typeof value==='string':false;
 if(!types.some(matches)){issue(errors,path,schemaJoin(schemaPath,'type'),'type','Value has the wrong type',types.join(' or '),Array.isArray(value)?'array':value===null?'null':typeof value);return errors}}
 if(typeof value==='string'){
  if(Number.isInteger(s.minLength)&&s.minLength>=0&&[...value].length<s.minLength)issue(errors,path,schemaJoin(schemaPath,'minLength'),'minLength','String is shorter than minLength',s.minLength,[...value].length);
  if(Number.isInteger(s.maxLength)&&s.maxLength>=0&&[...value].length>s.maxLength)issue(errors,path,schemaJoin(schemaPath,'maxLength'),'maxLength','String is longer than maxLength',s.maxLength,[...value].length);
  if(s.pattern!==undefined){if(typeof s.pattern!=='string')issue(errors,path,schemaJoin(schemaPath,'pattern'),'pattern','Pattern must be a string','string',typeof s.pattern);else try{if(!(new RegExp(s.pattern)).test(value))issue(errors,path,schemaJoin(schemaPath,'pattern'),'pattern','String does not match pattern',s.pattern,value)}catch(e){issue(errors,path,schemaJoin(schemaPath,'pattern'),'pattern','Invalid pattern in schema',s.pattern,e.message)}}
 }
 if(typeof value==='number'&&Number.isFinite(value)){
  if(typeof s.minimum==='number'&&value<s.minimum)issue(errors,path,schemaJoin(schemaPath,'minimum'),'minimum','Number is below minimum',s.minimum,value);
  if(typeof s.maximum==='number'&&value>s.maximum)issue(errors,path,schemaJoin(schemaPath,'maximum'),'maximum','Number is above maximum',s.maximum,value);
 }
 if(Array.isArray(value)){
  if(Number.isInteger(s.minItems)&&s.minItems>=0&&value.length<s.minItems)issue(errors,path,schemaJoin(schemaPath,'minItems'),'minItems','Array has fewer than minItems',s.minItems,value.length);
  if(Number.isInteger(s.maxItems)&&s.maxItems>=0&&value.length>s.maxItems)issue(errors,path,schemaJoin(schemaPath,'maxItems'),'maxItems','Array has more than maxItems',s.maxItems,value.length);
  if(s.items&&typeof s.items==='object'&&!Array.isArray(s.items))value.forEach((v,i)=>check(v,s.items,pointerJoin(path,i),schemaJoin(schemaPath,'items'),errors));
 }
 if(value!==null&&typeof value==='object'&&!Array.isArray(value)){
  if(Array.isArray(s.required))s.required.forEach(k=>{if(typeof k==='string'&&!Object.prototype.hasOwnProperty.call(value,k))issue(errors,pointerJoin(path,k),schemaJoin(schemaPath,'required'),'required','Missing required property',k,'missing')});
  if(s.properties&&typeof s.properties==='object'&&!Array.isArray(s.properties))Object.keys(s.properties).forEach(k=>{if(Object.prototype.hasOwnProperty.call(value,k))check(value[k],s.properties[k],pointerJoin(path,k),schemaJoin(schemaJoin(schemaPath,'properties'),k),errors)});
  if(s.additionalProperties===false&&s.properties&&typeof s.properties==='object'&&!Array.isArray(s.properties))Object.keys(value).forEach(k=>{if(!Object.prototype.hasOwnProperty.call(s.properties,k))issue(errors,pointerJoin(path,k),schemaJoin(schemaPath,'additionalProperties'),'additionalProperties','Unexpected property',Object.keys(s.properties),'present: '+k)});
 }
 return errors;
}
function run(){
 window.lastContractReport=null;results.replaceChildren();let schema;try{schema=JSON.parse(schemaInput.value);if(!schema||typeof schema!=='object'||Array.isArray(schema))throw new Error('Schema must be a JSON object.')}catch(e){status.textContent='Schema error: '+e.message;return}
 const lines=casesInput.value.split(/\r?\n/).map((v,i)=>({text:v.trim(),line:i+1})).filter(x=>x.text);
 if(!lines.length){status.textContent='Add at least one JSON output, one per line.';return}
 let passed=0;const report=[];
 lines.forEach((item,index)=>{let value,errors=[];try{value=JSON.parse(item.text);check(value,schema,'','#',errors)}catch(e){errors=[{instancePath:'/',schemaPath:'#',keyword:'invalid_json',message:'Invalid JSON: '+e.message,expected:'valid JSON value',actual:item.text.slice(0,500)}]}
 const ok=errors.length===0;if(ok)passed++;report.push({sampleIndex:index+1,inputLine:item.line,passed:ok,errors});
 const box=document.createElement('div');box.className='result '+(ok?'pass':'fail');
 const title=document.createElement('strong');title.textContent='Sample '+(index+1)+' (line '+item.line+'): '+(ok?'PASS':'FAIL');box.appendChild(title);
 if(errors.length){const ul=document.createElement('ul');errors.forEach(err=>{const li=document.createElement('li');li.textContent=err.message+' · keyword='+err.keyword+' · instance='+err.instancePath+' · schema='+err.schemaPath+(err.expected!==null?' · expected='+actualValue(err.expected):'')+(err.actual!==null?' · actual='+actualValue(err.actual):'');ul.appendChild(li)});box.appendChild(ul)}else{const p=document.createElement('p');p.textContent='Output matches the supported rules in this schema.';box.appendChild(p)}
 results.appendChild(box);
 });
 window.lastContractReport={reportVersion:'1.1',tool:'JSON Contract Tester',generatedAt:new Date().toISOString(),summary:{passed,total:lines.length,failed:lines.length-passed},results:report,limitation:'Subset validator; not a full JSON Schema implementation.'};
 status.textContent=passed+' of '+lines.length+' outputs passed. No data was uploaded.';
}
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const text=document.getElementById(button.dataset.copy).textContent.trim();try{await navigator.clipboard.writeText(text);$('copy-status').textContent='Address copied.'}catch(e){$('copy-status').textContent='Copy unavailable. Press and hold the address to copy it.'}}));
$('run').addEventListener('click',run);
$('sample').addEventListener('click',()=>{schemaInput.value=JSON.stringify(sampleSchema,null,2);casesInput.value=sampleCases.map(v=>JSON.stringify(v)).join('\n');run()});
$('download').addEventListener('click',()=>{if(!window.lastContractReport)run();if(!window.lastContractReport)return;const blob=new Blob([JSON.stringify(window.lastContractReport,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='contract-test-report.json';a.click();URL.revokeObjectURL(url)});
$('download-junit').addEventListener('click',()=>{if(!window.lastContractReport)run();if(!window.lastContractReport)return;if(!window.JSONContractTesterJUnit){status.textContent='JUnit XML export is unavailable. Reload the page and try again.';return}const xml=window.JSONContractTesterJUnit.buildJUnitXml(window.lastContractReport);const blob=new Blob([xml],{type:'application/xml;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='contract-test-report.junit.xml';a.click();URL.revokeObjectURL(url);status.textContent='JUnit XML report downloaded.'});
run();
})();