var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function a(t){t.forEach(e)}function o(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e,n,a){return t[1]&&a?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](a(e))):n.ctx}function r(t,e,n,a,o,i,r){const l=function(t,e,n,a){if(t[2]&&a){const o=t[2](a(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let a=0;a<n;a+=1)t[a]=e.dirty[a]|o[a];return t}return e.dirty|o}return e.dirty}(e,a,o,i);if(l){const o=s(e,n,a,r);t.p(o,l)}}function l(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function u(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function p(){return f(" ")}function h(){return f("")}function m(t,e,n,a){return t.addEventListener(e,n,a),()=>t.removeEventListener(e,n,a)}function $(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e){t.value=null==e?"":e}function y(t,e,n,a){t.style.setProperty(e,n,a?"important":"")}let x;function b(t){x=t}const k=[],v=[],M=[],w=[],A=Promise.resolve();let T=!1;function _(t){M.push(t)}function L(t){w.push(t)}let S=!1;const C=new Set;function O(){if(!S){S=!0;do{for(let t=0;t<k.length;t+=1){const e=k[t];b(e),R(e.$$)}for(b(null),k.length=0;v.length;)v.pop()();for(let t=0;t<M.length;t+=1){const e=M[t];C.has(e)||(C.add(e),e())}M.length=0}while(k.length);for(;w.length;)w.pop()();T=!1,S=!1,C.clear()}}function R(t){if(null!==t.fragment){t.update(),a(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(_)}}const E=new Set;let j;function N(){j={r:0,c:[],p:j}}function P(){j.r||a(j.c),j=j.p}function U(t,e){t&&t.i&&(E.delete(t),t.i(e))}function q(t,e,n,a){if(t&&t.o){if(E.has(t))return;E.add(t),j.c.push((()=>{E.delete(t),a&&(n&&t.d(1),a())})),t.o(e)}}const B="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function D(t,e){q(t,1,1,(()=>{e.delete(t.key)}))}function I(t,e,n,a,o,i,s,r,l,c,u,d){let f=t.length,p=i.length,h=f;const m={};for(;h--;)m[t[h].key]=h;const $=[],g=new Map,y=new Map;for(h=p;h--;){const t=d(o,i,h),r=n(t);let l=s.get(r);l?a&&l.p(t,e):(l=c(r,t),l.c()),g.set(r,$[h]=l),r in m&&y.set(r,Math.abs(h-m[r]))}const x=new Set,b=new Set;function k(t){U(t,1),t.m(r,u),s.set(t.key,t),u=t.first,p--}for(;f&&p;){const e=$[p-1],n=t[f-1],a=e.key,o=n.key;e===n?(u=e.first,f--,p--):g.has(o)?!s.has(a)||x.has(a)?k(e):b.has(o)?f--:y.get(a)>y.get(o)?(b.add(a),k(e)):(x.add(o),f--):(l(n,s),f--)}for(;f--;){const e=t[f];g.has(e.key)||l(e,s)}for(;p;)k($[p-1]);return $}function J(t,e,n){const a=t.$$.props[e];void 0!==a&&(t.$$.bound[a]=n,n(t.$$.ctx[a]))}function V(t){t&&t.c()}function z(t,n,i){const{fragment:s,on_mount:r,on_destroy:l,after_update:c}=t.$$;s&&s.m(n,i),_((()=>{const n=r.map(e).filter(o);l?l.push(...n):a(n),t.$$.on_mount=[]})),c.forEach(_)}function Y(t,e){const n=t.$$;null!==n.fragment&&(a(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function F(t,e){-1===t.$$.dirty[0]&&(k.push(t),T||(T=!0,A.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function G(e,o,i,s,r,l,c=[-1]){const d=x;b(e);const f=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:r,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:c,skip_bound:!1};let p=!1;if(f.ctx=i?i(e,o.props||{},((t,n,...a)=>{const o=a.length?a[0]:n;return f.ctx&&r(f.ctx[t],f.ctx[t]=o)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](o),p&&F(e,t)),n})):[],f.update(),p=!0,a(f.before_update),f.fragment=!!s&&s(f.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);f.fragment&&f.fragment.l(t),t.forEach(u)}else f.fragment&&f.fragment.c();o.intro&&U(e.$$.fragment),z(e,o.target,o.anchor),O()}b(d)}class H{$destroy(){Y(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const{document:K}=B;function Q(e){let n,a,o,i,s,r;return{c(){n=d("script"),o=p(),i=d("div"),n.src!==(a="https://cdn.plot.ly/plotly-latest.min.js")&&$(n,"src","https://cdn.plot.ly/plotly-latest.min.js"),$(i,"id","plotly-graph")},m(t,a){l(K.head,n),c(t,o,a),c(t,i,a),s||(r=m(n,"load",e[0]),s=!0)},p:t,i:t,o:t,d(t){u(n),t&&u(o),t&&u(i),s=!1,r()}}}function W(){for(let t of document.getElementsByClassName("traces"))1!=t.style.opacity&&(t.style.opacity=1)}function X(t,e,n){let a,o,{data:i}=e,{layout:s}=e;return t.$$set=t=>{"data"in t&&n(1,i=t.data),"layout"in t&&n(2,s=t.layout)},t.$$.update=()=>{30&t.$$.dirty&&a&&(clearTimeout(o),n(4,o=setTimeout((()=>{Plotly.react("plotly-graph",i,s),W()}),500)))},[function(){Plotly.newPlot("plotly-graph",i,s),W(),n(3,a=!0)},i,s,a,o]}class Z extends H{constructor(t){super(),G(this,t,X,Q,i,{data:1,layout:2})}}function tt(t){let e,n;return e=new Z({props:{data:t[0],layout:t[1]}}),{c(){V(e.$$.fragment)},m(t,a){z(e,t,a),n=!0},p(t,[n]){const a={};1&n&&(a.data=t[0]),2&n&&(a.layout=t[1]),e.$set(a)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){q(e.$$.fragment,t),n=!1},d(t){Y(e,t)}}}function et(t,e){if(t.log){let t=at(e.tables);return{type:"log",title:e.legend,range:t.range,tickvals:t.tickvals}}{let t=ot(e.tables);return{title:e.legend,range:t.range,tickvals:t.tickvals}}}function nt(t,e,n){if(t.log){let t=at(e.tables),a=function(t,e){let n=Math.max(...t.map((t=>Math.max(...t.y)))),a=Math.min(...t.map((t=>Math.min(...t.y))));if(a<=0)return{range:[0,Math.log10(n)],tickvals:[0,Math.log10(n)]};let o=Math.ceil(Math.log10(n)),i=Math.floor(Math.log10(a)),s=o-i;return{range:[i-.1*s,o+.1*s],tickvals:[...Array(e).keys()].map((t=>Math.pow(10,i+t*s/(e-1))))}}(n.tables,t.nTicks);return{type:"log",title:n.legend,side:"right",overlaying:"y",range:a.range,tickvals:a.tickvals}}{let t=ot(e.tables),a=function(t,e){let n,a=Math.max(...t.map((t=>Math.max(...t.y)))),o=1.1,i=2*a/(1+o),s=Math.pow(10,Math.floor(Math.log10(i)));for(let t of[1,.5,.1])if(t*=s,n=Math.ceil(i/(e-1)/t)*t,n*(e-1)*.75<=a)break;return{range:[0,n*(e-1)*o],tickvals:[...Array(e).keys()].map((t=>t*n))}}(n.tables,t.nticks);return{title:n.legend,side:"right",overlaying:"y",range:a.range,tickvals:a.tickvals}}}function at(t){let e=Math.max(...t.map((t=>Math.max(...t.y)))),n=Math.min(...t.map((t=>Math.min(...t.y))));if(n<=0)return{range:[0,Math.log10(e)],tickvals:[0,Math.log10(e)]};let a=Math.ceil(Math.log10(e)),o=Math.floor(Math.log10(n)),i=a-o;return{range:[o-.1*i,a+.1*i],tickvals:[...Array(1+i).keys()].map((t=>Math.pow(10,o+t))),nTicks:i+1}}function ot(t){let e,n=Math.max(...t.map((t=>Math.max(...t.y)))),a=2*n/2.1,o=Math.pow(10,Math.floor(Math.log10(a))),i=2;for(let t of[2,1,.5,.2])if(e=t*o,Math.round(n/e)>=4){i=Math.ceil(n/e)+1;break}return{range:[0,e*(i-1)*1.1],tickvals:[...Array(i).keys()].map((t=>t*e)),nticks:i}}function it(t){let e=["blue","red","green"],n={};return t.forEach((t=>{n[t.name]||(n[t.name]=e.pop()),t.color=n[t.name]})),{rects:t.map((t=>({type:"rect",xref:"x",yref:"paper",x0:t.start,x1:t.end,y0:0,y1:.1,line:{width:0},fillcolor:t.color,opacity:.3}))),colorMap:n}}function st(t,e,n){let a,o,{MainSettings:i}=e,{LeftAxis:s}=e,{RightAxis:r}=e,{Observations:l}=e,{Treatments:c}=e,u=s.tables[0];return t.$$set=t=>{"MainSettings"in t&&n(2,i=t.MainSettings),"LeftAxis"in t&&n(3,s=t.LeftAxis),"RightAxis"in t&&n(4,r=t.RightAxis),"Observations"in t&&n(5,l=t.Observations),"Treatments"in t&&n(6,c=t.Treatments)},t.$$.update=()=>{if(88&t.$$.dirty){r.tables.forEach((t=>t.yaxis="y2"));let t=it(c).colorMap,e=Object.keys(t).map((e=>({x:u.x,y:u.y,showlegend:!0,visible:"legendonly",opacity:.3,mode:"markers",marker:{color:t[e],symbol:"square",size:15},name:e})));n(0,a=[...s.tables,...r.tables,{x:u.x,y:u.y,xaxis:"x2",showlegend:!1,opacity:0}].concat(e))}if(124&t.$$.dirty){let t=function(t){let e=["dot","dash","longdash","dashdot","longdashdot"],n=t.reduce(((t,n,a)=>t.concat(n.data.map((t=>({dash:e[a],time:t.time,name:t.name}))))),[]);return{lines:n.map((t=>({type:"line",xref:"x",yref:"paper",x0:t.time,x1:t.time,y0:0,y1:1,line:{width:2,dash:t.dash}}))),times:n.map((t=>t.time)),names:n.map((t=>t.name))}}(l.tables),e=it(c).rects;n(1,o={title:i.title,xaxis:{side:"top",tickformat:i.xdays?"":"%Y-%m-%d"},xaxis2:{side:"bottom",overlaying:"x",matches:"x",tickvals:t.times,ticktext:t.names.map((t=>" "+t)),showgrid:!1,tickangle:90,automargin:!0},yaxis:et(i,s),yaxis2:nt(i,s,r),legend:{x:1.05,itemclick:!1,itemdoubleclick:!1},shapes:t.lines.concat(e)})}},[a,o,i,s,r,l,c]}class rt extends H{constructor(t){super(),G(this,t,st,tt,i,{MainSettings:2,LeftAxis:3,RightAxis:4,Observations:5,Treatments:6})}}function lt(e){let n,a,o;return{c(){n=d("textarea")},m(t,i){c(t,n,i),g(n,e[0]),a||(o=m(n,"input",e[2]),a=!0)},p(t,[e]){1&e&&g(n,t[0])},i:t,o:t,d(t){t&&u(n),a=!1,o()}}}function ct(t,e,n){let{table:a=[]}=e,o=a.map((t=>t.join(","))).join("\n");return t.$$set=t=>{"table"in t&&n(1,a=t.table)},t.$$.update=()=>{if(1&t.$$.dirty){let t=o.trim().split("\n");n(1,a=t.map((t=>t.split(","))))}},[o,a,function(){o=this.value,n(0,o)}]}class ut extends H{constructor(t){super(),G(this,t,ct,lt,i,{table:1})}}function dt(t){let e,n,a,o,i,f,h,$,y;const x=t[4].default,b=function(t,e,n,a){if(t){const o=s(t,e,n,a);return t[0](o)}}(x,t,t[3],null);function k(e){t[6](e)}let M={};return void 0!==t[1]&&(M.table=t[1]),i=new ut({props:M}),v.push((()=>J(i,"table",k))),{c(){e=d("div"),n=d("input"),a=p(),b&&b.c(),o=p(),V(i.$$.fragment)},m(s,r){c(s,e,r),l(e,n),g(n,t[0]),l(e,a),b&&b.m(e,null),c(s,o,r),z(i,s,r),h=!0,$||(y=m(n,"input",t[5]),$=!0)},p(t,[e]){1&e&&n.value!==t[0]&&g(n,t[0]),b&&b.p&&8&e&&r(b,x,t,t[3],e,null,null);const a={};!f&&2&e&&(f=!0,a.table=t[1],L((()=>f=!1))),i.$set(a)},i(t){h||(U(b,t),U(i.$$.fragment,t),h=!0)},o(t){q(b,t),q(i.$$.fragment,t),h=!1},d(t){t&&u(e),b&&b.d(t),t&&u(o),Y(i,t),$=!1,y()}}}function ft(t,e,n){let{$$slots:a={},$$scope:o}=e,{data:i}=e,s=i.name,r=i.x.map(((t,e)=>[t,i.y[e]]));return t.$$set=t=>{"data"in t&&n(2,i=t.data),"$$scope"in t&&n(3,o=t.$$scope)},t.$$.update=()=>{if(2&t.$$.dirty){let t=function(t){let e={x:[],y:[]};return t.forEach((t=>{t.length>=2&&(e.x.push(t[0]),e.y.push(Number(t[1])))})),e}(r);n(2,i.x=t.x,i),n(2,i.y=t.y,i)}1&t.$$.dirty&&n(2,i.name=s,i)},[s,r,i,o,a,function(){s=this.value,n(0,s)},function(t){r=t,n(1,r)}]}class pt extends H{constructor(t){super(),G(this,t,ft,dt,i,{data:2})}}function ht(t,e,n){const a=t.slice();return a[9]=e[n],a[10]=e,a[11]=n,a}function mt(t){let e,n,a,o,i;function s(){return t[5](t[11])}return{c(){e=d("button"),n=f("-"),e.disabled=a=1==t[0].tables.length},m(t,a){c(t,e,a),l(e,n),o||(i=m(e,"click",s),o=!0)},p(n,o){t=n,1&o&&a!==(a=1==t[0].tables.length)&&(e.disabled=a)},d(t){t&&u(e),o=!1,i()}}}function $t(t,e){let n,a,o,i;function s(t){e[6](t,e[9],e[10],e[11])}let r={$$slots:{default:[mt]},$$scope:{ctx:e}};return void 0!==e[9]&&(r.data=e[9]),a=new pt({props:r}),v.push((()=>J(a,"data",s))),{key:t,first:null,c(){n=h(),V(a.$$.fragment),this.first=n},m(t,e){c(t,n,e),z(a,t,e),i=!0},p(t,n){e=t;const i={};4097&n&&(i.$$scope={dirty:n,ctx:e}),!o&&1&n&&(o=!0,i.data=e[9],L((()=>o=!1))),a.$set(i)},i(t){i||(U(a.$$.fragment,t),i=!0)},o(t){q(a.$$.fragment,t),i=!1},d(t){t&&u(n),Y(a,t)}}}function gt(t){let e,n,o,i,s,r,l,f,h,$=[],y=new Map,x=t[0].tables;const b=t=>t[9].id;for(let e=0;e<x.length;e+=1){let n=ht(t,x,e),a=b(n);y.set(a,$[e]=$t(a,n))}return{c(){e=d("input"),n=p();for(let t=0;t<$.length;t+=1)$[t].c();o=p(),i=d("button"),i.textContent="+",s=p(),r=d("hr")},m(a,u){c(a,e,u),g(e,t[1]),c(a,n,u);for(let t=0;t<$.length;t+=1)$[t].m(a,u);c(a,o,u),c(a,i,u),c(a,s,u),c(a,r,u),l=!0,f||(h=[m(e,"input",t[4]),m(i,"click",t[2])],f=!0)},p(t,[n]){2&n&&e.value!==t[1]&&g(e,t[1]),9&n&&(x=t[0].tables,N(),$=I($,n,b,1,t,x,y,o.parentNode,D,$t,o,ht),P())},i(t){if(!l){for(let t=0;t<x.length;t+=1)U($[t]);l=!0}},o(t){for(let t=0;t<$.length;t+=1)q($[t]);l=!1},d(t){t&&u(e),t&&u(n);for(let e=0;e<$.length;e+=1)$[e].d(t);t&&u(o),t&&u(i),t&&u(s),t&&u(r),f=!1,a(h)}}}function yt(t,e,n){let{data:a}=e,o=a.legend,i=1;function s(t){return a.tables.some((e=>e.name==t))?s(t+"'"):t}function r(t){a.tables.splice(t,1),n(0,a),n(1,o)}a.tables.forEach((t=>t.id=i++));return t.$$set=t=>{"data"in t&&n(0,a=t.data)},t.$$.update=()=>{2&t.$$.dirty&&n(0,a.legend=o,a)},[a,o,function(){n(0,a.tables=[...a.tables,{x:[],y:[],name:s("new"),id:i++}],a)},r,function(){o=this.value,n(1,o)},t=>r(t),function(t,e,i,s){i[s]=t,n(0,a),n(1,o)}]}class xt extends H{constructor(t){super(),G(this,t,yt,gt,i,{data:0})}}function bt(t){let e,n,a;function o(e){t[3](e)}let i={};return void 0!==t[0]&&(i.table=t[0]),e=new ut({props:i}),v.push((()=>J(e,"table",o))),{c(){V(e.$$.fragment)},m(t,n){z(e,t,n),a=!0},p(t,[a]){const o={};!n&&1&a&&(n=!0,o.table=t[0],L((()=>n=!1))),e.$set(o)},i(t){a||(U(e.$$.fragment,t),a=!0)},o(t){q(e.$$.fragment,t),a=!1},d(t){Y(e,t)}}}function kt(t,e,n){let{data:a}=e,{keys:o}=e,i=a.map((t=>o.map((e=>t[e]))));return t.$$set=t=>{"data"in t&&n(1,a=t.data),"keys"in t&&n(2,o=t.keys)},t.$$.update=()=>{1&t.$$.dirty&&n(1,a=function(t){let e=[];return t.forEach((t=>{if(t.length==o.length){let n={};t.forEach(((t,e)=>n[o[e]]=t)),e.push(n)}})),e}(i))},[i,a,o,function(t){i=t,n(0,i)}]}class vt extends H{constructor(t){super(),G(this,t,kt,bt,i,{data:1,keys:2})}}function Mt(t,e,n){const a=t.slice();return a[6]=e[n],a[7]=e,a[8]=n,a}function wt(t,e){let n,a,o,i,s,r,$,g,y,x;function b(t){e[3](t,e[6])}let k={keys:e[0].keys};function M(){return e[4](e[8])}return void 0!==e[6].data&&(k.data=e[6].data),a=new vt({props:k}),v.push((()=>J(a,"data",b))),{key:t,first:null,c(){n=h(),V(a.$$.fragment),i=p(),s=d("button"),r=f("-"),s.disabled=$=1==e[0].tables.length,this.first=n},m(t,e){c(t,n,e),z(a,t,e),c(t,i,e),c(t,s,e),l(s,r),g=!0,y||(x=m(s,"click",M),y=!0)},p(t,n){e=t;const i={};1&n&&(i.keys=e[0].keys),!o&&1&n&&(o=!0,i.data=e[6].data,L((()=>o=!1))),a.$set(i),(!g||1&n&&$!==($=1==e[0].tables.length))&&(s.disabled=$)},i(t){g||(U(a.$$.fragment,t),g=!0)},o(t){q(a.$$.fragment,t),g=!1},d(t){t&&u(n),Y(a,t),t&&u(i),t&&u(s),y=!1,x()}}}function At(t){let e,n,a,o,i,s,r,l=[],f=new Map,h=t[0].tables;const $=t=>t[6].id;for(let e=0;e<h.length;e+=1){let n=Mt(t,h,e),a=$(n);f.set(a,l[e]=wt(a,n))}return{c(){for(let t=0;t<l.length;t+=1)l[t].c();e=p(),n=d("button"),n.textContent="+",a=p(),o=d("hr")},m(u,d){for(let t=0;t<l.length;t+=1)l[t].m(u,d);c(u,e,d),c(u,n,d),c(u,a,d),c(u,o,d),i=!0,s||(r=m(n,"click",t[1]),s=!0)},p(t,[n]){5&n&&(h=t[0].tables,N(),l=I(l,n,$,1,t,h,f,e.parentNode,D,wt,e,Mt),P())},i(t){if(!i){for(let t=0;t<h.length;t+=1)U(l[t]);i=!0}},o(t){for(let t=0;t<l.length;t+=1)q(l[t]);i=!1},d(t){for(let e=0;e<l.length;e+=1)l[e].d(t);t&&u(e),t&&u(n),t&&u(a),t&&u(o),s=!1,r()}}}function Tt(t,e,n){let{data:a}=e,o=1;function i(t){a.tables.splice(t,1),n(0,a)}a.tables.forEach((t=>t.id=o++));return t.$$set=t=>{"data"in t&&n(0,a=t.data)},[a,function(){n(0,a.tables=[...a.tables,{data:[],id:o++}],a)},i,function(e,o){t.$$.not_equal(o.data,e)&&(o.data=e,n(0,a))},t=>i(t)]}class _t extends H{constructor(t){super(),G(this,t,Tt,At,i,{data:0})}}function Lt(e){let n,o,i,s,r,h,y,x,b,k,v,M,w,A,T;return{c(){n=d("div"),o=f("Title: "),i=d("input"),s=p(),r=d("div"),h=f("Log input: "),y=d("input"),x=p(),b=d("div"),k=f("Use days not dates: "),v=d("input"),M=p(),w=d("hr"),$(y,"name","loginput"),$(y,"type","checkbox"),$(v,"name","xdays"),$(v,"type","checkbox")},m(t,a){c(t,n,a),l(n,o),l(n,i),g(i,e[0]),c(t,s,a),c(t,r,a),l(r,h),l(r,y),y.checked=e[1],c(t,x,a),c(t,b,a),l(b,k),l(b,v),v.checked=e[2],c(t,M,a),c(t,w,a),A||(T=[m(i,"input",e[4]),m(y,"change",e[5]),m(v,"change",e[6])],A=!0)},p(t,[e]){1&e&&i.value!==t[0]&&g(i,t[0]),2&e&&(y.checked=t[1]),4&e&&(v.checked=t[2])},i:t,o:t,d(t){t&&u(n),t&&u(s),t&&u(r),t&&u(x),t&&u(b),t&&u(M),t&&u(w),A=!1,a(T)}}}function St(t,e,n){let{data:a}=e,o=a.title,i=a.log,s=a.xdays;return t.$$set=t=>{"data"in t&&n(3,a=t.data)},t.$$.update=()=>{7&t.$$.dirty&&(n(3,a.title=o,a),n(3,a.log=i,a),n(3,a.xdays=s,a))},[o,i,s,a,function(){o=this.value,n(0,o)},function(){i=this.checked,n(1,i)},function(){s=this.checked,n(2,s)}]}class Ct extends H{constructor(t){super(),G(this,t,St,Lt,i,{data:3})}}function Ot(t){let e,n,a,o,i,s,r,f,h,g,x,b,k,M,w,A,T,_,S,C,O,R,E,j,N,P,B,D,I,F,G,H,K,Q;function W(e){t[6](e)}let X={};function Z(e){t[7](e)}void 0!==t[0]&&(X.data=t[0]),i=new Ct({props:X}),v.push((()=>J(i,"data",W)));let tt={};function et(e){t[8](e)}void 0!==t[1]&&(tt.data=t[1]),g=new xt({props:tt}),v.push((()=>J(g,"data",Z)));let nt={};function at(e){t[9](e)}void 0!==t[2]&&(nt.data=t[2]),w=new xt({props:nt}),v.push((()=>J(w,"data",et)));let ot={};function it(e){t[10](e)}void 0!==t[3]&&(ot.data=t[3]),C=new _t({props:ot}),v.push((()=>J(C,"data",at)));let st={keys:["name","start","end"]};return void 0!==t[4]&&(st.data=t[4]),N=new vt({props:st}),v.push((()=>J(N,"data",it))),I=new rt({props:{MainSettings:t[0],LeftAxis:t[1],RightAxis:t[2],Observations:t[3],Treatments:t[4]}}),{c(){e=d("div"),n=d("div"),a=d("h3"),a.textContent="Main settings",o=p(),V(i.$$.fragment),r=p(),f=d("h3"),f.textContent="Left axis data",h=p(),V(g.$$.fragment),b=p(),k=d("h3"),k.textContent="Right axis data",M=p(),V(w.$$.fragment),T=p(),_=d("h3"),_.textContent="Observations",S=p(),V(C.$$.fragment),R=p(),E=d("h3"),E.textContent="Treatments",j=p(),V(N.$$.fragment),B=p(),D=d("div"),V(I.$$.fragment),F=p(),G=d("button"),G.textContent="Copy link to clipboard",y(n,"display","flex"),y(n,"flex-direction","column"),y(n,"flex","20%"),$(G,"class","svelte-t96c28"),y(D,"flex","70%"),y(e,"display","flex")},m(s,u){c(s,e,u),l(e,n),l(n,a),l(n,o),z(i,n,null),l(n,r),l(n,f),l(n,h),z(g,n,null),l(n,b),l(n,k),l(n,M),z(w,n,null),l(n,T),l(n,_),l(n,S),z(C,n,null),l(n,R),l(n,E),l(n,j),z(N,n,null),l(e,B),l(e,D),z(I,D,null),l(D,F),l(D,G),H=!0,K||(Q=m(G,"click",t[11]),K=!0)},p(t,[e]){const n={};!s&&1&e&&(s=!0,n.data=t[0],L((()=>s=!1))),i.$set(n);const a={};!x&&2&e&&(x=!0,a.data=t[1],L((()=>x=!1))),g.$set(a);const o={};!A&&4&e&&(A=!0,o.data=t[2],L((()=>A=!1))),w.$set(o);const r={};!O&&8&e&&(O=!0,r.data=t[3],L((()=>O=!1))),C.$set(r);const l={};!P&&16&e&&(P=!0,l.data=t[4],L((()=>P=!1))),N.$set(l);const c={};1&e&&(c.MainSettings=t[0]),2&e&&(c.LeftAxis=t[1]),4&e&&(c.RightAxis=t[2]),8&e&&(c.Observations=t[3]),16&e&&(c.Treatments=t[4]),I.$set(c)},i(t){H||(U(i.$$.fragment,t),U(g.$$.fragment,t),U(w.$$.fragment,t),U(C.$$.fragment,t),U(N.$$.fragment,t),U(I.$$.fragment,t),H=!0)},o(t){q(i.$$.fragment,t),q(g.$$.fragment,t),q(w.$$.fragment,t),q(C.$$.fragment,t),q(N.$$.fragment,t),q(I.$$.fragment,t),H=!1},d(t){t&&u(e),Y(i),Y(g),Y(w),Y(C),Y(N),Y(I),K=!1,Q()}}}function Rt(t,e,n){let a,o,i,s,r;function l(){const t=new URL(window.location),e=encodeURIComponent(btoa(JSON.stringify({MainSettings:a,LeftAxis:o,RightAxis:i,Observations:s,Treatments:r})));return t.searchParams.set("d",e),t.toString()}!function(){const t=function(){const t=new URL(window.location).searchParams.get("d");if(t){const e=JSON.parse(atob(decodeURIComponent(t)));return null==e.MainSettings&&(e.MainSettings={title:"",log:e.LeftAxis.log,xdays:!1}),e}}();n(0,({MainSettings:a,LeftAxis:o,RightAxis:i,Observations:s,Treatments:r}=t||{MainSettings:{title:"",log:!1,xdays:!1},LeftAxis:{legend:"Värde - ddPCR",tables:[{x:["2020-01-01","2020-01-15","2020-01-28"],y:[1,5,6],name:"ddPCR"}]},RightAxis:{legend:"Värde - LD",tables:[{x:["2020-01-01","2020-01-15","2020-02-01"],y:[2,7,5],name:"LD"}]},Observations:{keys:["name","time"],tables:[{data:[{name:"A",time:"2020-01-03"},{name:"B",time:"2020-01-18"}]}]},Treatments:[{name:"Taf",start:"2020-01-05",end:"2020-01-14"},{name:"Taf+Mek",start:"2020-01-14",end:"2020-01-20"},{name:"Taf",start:"2020-01-20",end:"2020-02-02"}]}),a,n(1,o),n(2,i),n(3,s),n(4,r))}();return[a,o,i,s,r,l,function(t){a=t,n(0,a)},function(t){o=t,n(1,o)},function(t){i=t,n(2,i)},function(t){s=t,n(3,s)},function(t){r=t,n(4,r)},()=>navigator.clipboard.writeText(l())]}return new class extends H{constructor(t){super(),G(this,t,Rt,Ot,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
