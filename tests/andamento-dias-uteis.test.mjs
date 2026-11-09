import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../andamento.html',import.meta.url),'utf8');
const source=html.slice(html.indexOf('    const INICIO_CICLO_GLOBAL'),html.indexOf('    function instanteUltimoAndamento'));
const c=vm.createContext({});vm.runInContext(source,c);
const ciclo=data=>c.obterCicloGlobal(new Date(data+'T12:00:00-03:00'));
test('sexta, sábado e domingo mantêm o dia; segunda avança somente um',()=>{
 const sexta=ciclo('2026-10-16');for(const dia of ['2026-10-17','2026-10-18'])assert.equal(ciclo(dia).diaAtual,sexta.diaAtual);
 assert.equal(ciclo('2026-10-19').diaAtual,sexta.diaAtual+1);
});
test('sexta no dia 5 continua no dia 5 no fim de semana e segunda é dia 6',()=>{
 const v=vm.createContext({});vm.runInContext(source.replace("'2026-10-14'","'2026-10-12'"),v);
 for(const dia of ['2026-10-16','2026-10-17','2026-10-18'])assert.equal(v.obterCicloGlobal(new Date(dia+'T12:00:00-03:00')).diaAtual,5);
 assert.equal(v.obterCicloGlobal(new Date('2026-10-19T12:00:00-03:00')).diaAtual,6);
});
test('ciclo tem dez dias úteis e só reinicia no próximo dia de semana',()=>{
 assert.equal(ciclo('2026-10-14').diaAtual,1);assert.equal(ciclo('2026-10-27').diaAtual,10);
 assert.equal(ciclo('2026-10-28').diaAtual,1);assert.equal(ciclo('2026-10-27').proximoInicioTexto,'28/10/2026');
});
test('virada de data usa horário de Brasília',()=>{
 assert.equal(c.obterCicloGlobal(new Date('2026-10-28T02:59:59Z')).diaAtual,10);
 assert.equal(c.obterCicloGlobal(new Date('2026-10-28T03:00:00Z')).diaAtual,1);
});
test('datas anteriores à ativação não geram ciclos negativos',()=>assert.equal(ciclo('2026-01-01').diaAtual,1));
test('fila usa a data real de início do ciclo útil',()=>assert.equal(ciclo('2026-10-28').inicioCicloMs,Date.UTC(2026,9,28)));
