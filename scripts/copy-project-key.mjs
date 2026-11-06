// Run locally only when ready to paste into the Site's OPENAI_API_KEY secret field.
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const file=new URL('../.env.local',import.meta.url);
const line=readFileSync(file,'utf8').split(/\r?\n/).find(line=>line.startsWith('OPENAI_API_KEY='));
const key=line?.slice('OPENAI_API_KEY='.length).trim().replace(/^(['"])(.*)\1$/,'$2');
if(!key?.startsWith('sk-')){console.error('No valid local project key found.');process.exit(1)}
const result=spawnSync('/usr/bin/pbcopy',[],{input:key,stdio:['pipe','ignore','ignore']});
if(result.status!==0){console.error('Could not copy key to clipboard.');process.exit(1)}
console.log('Project key copied without displaying it. Paste only into the Site runtime secret named OPENAI_API_KEY, mark it secret, and save. Replace the clipboard contents afterward.');
