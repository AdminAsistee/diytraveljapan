const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

async function run() {
  const elements = new Map();
  const listeners = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {hidden: true, setAttribute() {}});
    return elements.get(id);
  }

  const publicDir = path.join(__dirname, '../public');
  const core = await import('../public/booking-check-core.js');
  const copy = require('../i18n/confidence.json').en;
  const fields = {currency: 'JPY', base: '1200', extras: '300', experience: 'Museum'};
  const form = element('booking-check');
  form.addEventListener = (name, fn) => listeners.set(name, fn);
  form.querySelectorAll = () => copy.checks.map(() => ({checked: true}));
  form.reportValidity = () => true;
  element('check-copy').textContent = JSON.stringify(copy);
  let releaseSave;
  let posted;
  const fetch = async (_, options) => {
    if (!options.method) return {ok: true, json: async () => ({version: 3, data: {trip: 'Existing itinerary'}})};
    posted = JSON.parse(options.body);
    await new Promise(resolve => { releaseSave = resolve; });
    return {ok: true};
  };
  const script = fs.readFileSync(path.join(publicDir, 'booking-check.js'), 'utf8');
  vm.runInNewContext(script.replace(/^import .*?;\n/, ''), {
    ...core, fetch, document: {getElementById: element, documentElement: {lang: 'en'}},
    FormData: function () { return Object.entries(fields); }
  });
  const firstSave = element('save-check').onclick();
  await new Promise(setImmediate);
  assert.equal(posted.version, 3);
  assert.ok(posted.text.startsWith('Existing itinerary\n\n'));
  for (const [label, amount] of [[copy.base, '1,200'], [copy.extras, '300'], [copy.total, '1,500']]) {
    assert.ok(posted.text.includes(label + ': ¥' + amount));
  }
  fields.experience = 'Revised visit';
  listeners.get('input')();
  releaseSave();
  await firstSave;
  assert.equal(element('check-status').textContent, '');
  assert.equal(element('check-trip').hidden, true);
  const retry = element('save-check').onclick();
  await new Promise(setImmediate);
  assert.ok(posted.text.includes('Revised visit'));
  releaseSave();
  await retry;
  assert.equal(element('check-status').textContent, copy.saved);
  assert.equal(element('check-trip').hidden, false);
  console.log('PASS: price breakdown survives saving; confirmation applies only to the submitted draft.');
}

run().catch(error => { console.error(error); process.exitCode = 1; });
