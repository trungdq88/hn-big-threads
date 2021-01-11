async function get(id) {
  return await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  ).then(r => r.json());
}

async function pull(id) {
  window.pullCallback && window.pullCallback();
  const node = await get(id);

  const children = [];
  let value = 1;

  const pulledKids = await Promise.all(
    ((node && node.kids) || []).map(k => pull(k))
  );

  let data = {};

  for (k of pulledKids) {
    // k.parent = data;
    children.push(k);
    value += k.value;
  }

  data.id = id;
  data.name = node ? node.by : '?';
  data.value = value;
  data.text = node ? node.text || node.title || node.url : '?';
  data.children = children;

  if (children.length === 0) {
    delete data.children;
  }

  return data;
}

async function start(id) {
  const data = await pull(id);

  // fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8');
  return data;
}
