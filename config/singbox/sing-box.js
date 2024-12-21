const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['🌐 全部节点', '♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 香港节点', '️♻️ 香港自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|香港|hk|hongkong|🇭🇰/i))
  }
  if (['🇹🇼 台湾节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|台湾|tw|taiwan|🇹🇼/i))
  }
  if (['🇯🇵 日本节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日|日本|jp|japan|🇯🇵/i))
  }
  if (['🇺🇲 美国节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|美国|us|unitedstates|united states|🇺🇲/i))
  }
  if (['🇸🇬 狮城节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|新加坡|狮城|sg|singapore|🇸🇬)/i))
  }
  if (['🇰🇷 韩国节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /韩|韩国|kr|KR|Korea|KOR|🇰🇷/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
