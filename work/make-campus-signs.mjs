import sharp from 'sharp'
import {writeFile} from 'node:fs/promises'
const result = {}
for (const text of ['원당교회', 'LOVE', 'HOPE', 'FAITH', 'GOD is LOVE']) {
 const width = text === 'GOD is LOVE' ? 260 : 160, height=40
 const svg = `<svg width="${width}" height="${height}"><text x="2" y="32" font-family="AppleGothic" font-size="32" fill="white">${text}</text></svg>`
 const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true})
 const runs=[]
 for(let y=0;y<height;y++){let start=-1;for(let x=0;x<=width;x++){const on=x<width && data[(y*width+x)*info.channels+3]>128;if(on&&start<0)start=x;if(!on&&start>=0){runs.push([start,y,x-start]);start=-1}}}
 const right=Math.max(...runs.map(r=>r[0]+r[2]))
 result[text]={width:right,height,runs}
}
await writeFile('lib/campus-signs.ts','// Rasterized local font outlines for portable GLB signage.\nexport const campusSigns = '+JSON.stringify(result)+' as const\n')
