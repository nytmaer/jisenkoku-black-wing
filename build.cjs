// Bundles Three.js, the embedded fighter art, and the game scripts into one offline dist/index.html.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname,read=f=>fs.readFileSync(path.join(root,f),'utf8');
let three=read('vendor/three.module.js');
const match=/export \{([\s\S]*?)\};?\s*$/.exec(three);
if(!match)throw new Error('Local Three.js export not found');
const names=match[1].split(',').map(item=>{let parts=item.trim().split(' as ');return parts.length===2?parts[1]+':'+parts[0]:parts[0];});
three='const THREE=(()=>{\n'+three.slice(0,match.index)+'\nreturn {'+names.join(',')+'};\n})();';
const assetData={};
for(const name of fs.readdirSync(path.join(root,'assets')).filter(n=>n.endsWith('.png')).sort())assetData[name]='data:image/png;base64,'+fs.readFileSync(path.join(root,'assets',name)).toString('base64');
const source='const BLACK_WING_ASSET_DATA='+JSON.stringify(assetData)+';\n'+['core.js','assets.js','render.js','software.js','audio.js','main.js'].map(read).join('\n');
const html=read('template.html').replace('<!--BUNDLE-->',()=>'<script>\n'+three+'\n'+source+'\n</script>');
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(root,'dist','index.html'),html);
console.log('Built standalone HTML:',html.length,'characters');
