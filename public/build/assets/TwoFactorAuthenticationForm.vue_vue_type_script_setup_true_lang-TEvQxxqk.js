import{d as L,r as v,H as W,e as n,o,a as u,b as r,p as Y,w as s,g as i,n as k,t as T,G as M,I as h,l as z,J as D,C as G,j as U,z as j,c as w,f as d,u as S,F as J,h as O,W as H}from"./app-BcwI-xJi.js";import{_ as X}from"./Modal.vue_vue_type_script_setup_true_lang-BYBHocgD.js";import{_ as Z}from"./DialogModal.vue_vue_type_script_setup_true_lang-C1UAhHHs.js";import{_ as q,a as E}from"./TextInput.vue_vue_type_script_setup_true_lang-DT3gv-hJ.js";import{_ as P}from"./PrimaryButton.vue_vue_type_script_setup_true_lang-DDOSM63m.js";import{_ as F}from"./SecondaryButton.vue_vue_type_script_setup_true_lang-BIgngevG.js";import{_ as ee}from"./DangerButton.vue_vue_type_script_setup_true_lang-BIyfjtfO.js";import{_ as te}from"./InputLabel.vue_vue_type_script_setup_true_lang-DwjJThu-.js";const oe={class:"mt-4"},_=L({__name:"ConfirmsPassword",props:{title:{type:String,default:"Confirm Password"},content:{type:String,default:"For your security, please confirm your password to continue."},button:{type:String,default:"Confirm"}},emits:["confirmed"],setup(b,{emit:$}){const x=$,c=v(!1),e=W({password:"",error:"",processing:!1}),m=v(null);function g(){h.get(route("password.confirmation")).then(l=>{l.data.confirmed?x("confirmed"):(c.value=!0,setTimeout(()=>{var a;return(a=m.value)==null?void 0:a.focus()},250))})}function y(){e.processing=!0,h.post(route("password.confirm"),{password:e.password}).then(()=>{e.processing=!1,f(),z().then(()=>x("confirmed"))}).catch(l=>{var a;e.processing=!1,e.error=l.response.data.errors.password[0],(a=m.value)==null||a.focus()})}function f(){c.value=!1,e.password="",e.error=""}return(l,a)=>(o(),n("span",null,[u("span",{onClick:g},[Y(l.$slots,"default")]),r(Z,{show:c.value,onClose:f},{title:s(()=>[i(T(b.title),1)]),content:s(()=>[i(T(b.content)+" ",1),u("div",oe,[r(q,{ref_key:"passwordInput",ref:m,modelValue:e.password,"onUpdate:modelValue":a[0]||(a[0]=V=>e.password=V),type:"password",class:"mt-1 block w-3/4",placeholder:"Password",autocomplete:"current-password",onKeyup:M(y,["enter"])},null,8,["modelValue"]),r(E,{message:e.error,class:"mt-2"},null,8,["message"])])]),footer:s(()=>[r(F,{type:"button",onClick:f},{default:s(()=>a[1]||(a[1]=[i(" Cancel ")])),_:1}),r(P,{type:"button",class:k(["ms-3",{"opacity-25":e.processing}]),disabled:e.processing,onClick:y},{default:s(()=>[i(T(b.button),1)]),_:1},8,["class","disabled"])]),_:1},8,["show"])]))}}),se={key:0,class:"text-lg font-medium text-gray-900"},ae={key:1,class:"text-lg font-medium text-gray-900"},ne={key:2,class:"text-lg font-medium text-gray-900"},re={key:3},le={key:0},ie={class:"mt-4 max-w-xl text-sm text-gray-600"},ue={key:0,class:"font-semibold"},ce={key:1},de=["innerHTML"],me={key:0,class:"mt-4 max-w-xl text-sm text-gray-600"},fe={class:"font-semibold"},pe=["innerHTML"],ve={key:1,class:"mt-4"},ye={key:1},we={class:"mt-4 grid max-w-xl gap-1 rounded-lg bg-gray-100 p-4 font-mono text-sm"},ge={class:"mt-5"},_e={key:0},he={key:1},Ve=L({__name:"TwoFactorAuthenticationForm",props:{requiresConfirmation:{type:Boolean}},setup(b){const $=b,x=D(),c=v(!1),e=v(!1),m=v(!1),g=v(null),y=v(null),f=v([]),l=G({code:""}),a=U(()=>{var p;return!c.value&&((p=x.props.auth.user)==null?void 0:p.two_factor_enabled)});j(a,()=>{a.value||(l.reset(),l.clearErrors())});function V(){c.value=!0,H.post(route("two-factor.enable"),{},{preserveScroll:!0,onSuccess:()=>Promise.all([N(),I(),A()]),onFinish:()=>{c.value=!1,e.value=$.requiresConfirmation}})}async function N(){const p=await h.get(route("two-factor.qr-code"));g.value=p.data.svg}async function I(){const p=await h.get(route("two-factor.secret-key"));y.value=p.data.secretKey}async function A(){const p=await h.get(route("two-factor.recovery-codes"));f.value=p.data}function K(){l.post(route("two-factor.confirm"),{errorBag:"confirmTwoFactorAuthentication",preserveScroll:!0,preserveState:!0,onSuccess:()=>{e.value=!1,g.value=null,y.value=null}})}function Q(){h.post(route("two-factor.recovery-codes")).then(()=>A())}function R(){m.value=!0,H.delete(route("two-factor.disable"),{preserveScroll:!0,onSuccess:()=>{m.value=!1,e.value=!1}})}return(p,t)=>(o(),w(X,null,{title:s(()=>t[1]||(t[1]=[i(" Two Factor Authentication ")])),description:s(()=>t[2]||(t[2]=[i(" Add additional security to your account using two factor authentication. ")])),content:s(()=>{var B;return[a.value&&!e.value?(o(),n("h3",se," You have enabled two factor authentication. ")):a.value&&e.value?(o(),n("h3",ae," Finish enabling two factor authentication. ")):(o(),n("h3",ne," You have not enabled two factor authentication. ")),t[11]||(t[11]=u("div",{class:"mt-3 max-w-xl text-sm text-gray-600"},[u("p",null," When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application. ")],-1)),a.value?(o(),n("div",re,[g.value?(o(),n("div",le,[u("div",ie,[e.value?(o(),n("p",ue," To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code. ")):(o(),n("p",ce," Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application or enter the setup key. "))]),u("div",{class:"mt-4 inline-block bg-white p-2",innerHTML:g.value},null,8,de),y.value?(o(),n("div",me,[u("p",fe,[t[3]||(t[3]=i(" Setup Key: ")),u("span",{innerHTML:y.value},null,8,pe)])])):d("",!0),e.value?(o(),n("div",ve,[r(te,{for:"code",value:"Code"}),r(q,{id:"code",modelValue:S(l).code,"onUpdate:modelValue":t[0]||(t[0]=C=>S(l).code=C),type:"text",name:"code",class:"mt-1 block w-1/2",inputmode:"numeric",autofocus:"",autocomplete:"one-time-code",onKeyup:M(K,["enter"])},null,8,["modelValue"]),(B=S(l).errors)!=null&&B.code?(o(),w(E,{key:0,message:S(l).errors.code,class:"mt-2"},null,8,["message"])):d("",!0)])):d("",!0)])):d("",!0),f.value.length>0&&!e.value?(o(),n("div",ye,[t[4]||(t[4]=u("div",{class:"mt-4 max-w-xl text-sm text-gray-600"},[u("p",{class:"font-semibold"}," Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost. ")],-1)),u("div",we,[(o(!0),n(J,null,O(f.value,C=>(o(),n("div",{key:C},T(C),1))),128))])])):d("",!0)])):d("",!0),u("div",ge,[a.value?(o(),n("div",he,[r(_,{onConfirmed:K},{default:s(()=>[e.value?(o(),w(P,{key:0,type:"button",class:k(["me-3",{"opacity-25":c.value}]),disabled:c.value},{default:s(()=>t[6]||(t[6]=[i(" Confirm ")])),_:1},8,["class","disabled"])):d("",!0)]),_:1}),r(_,{onConfirmed:Q},{default:s(()=>[f.value.length>0&&!e.value?(o(),w(F,{key:0,type:"button",class:"me-3"},{default:s(()=>t[7]||(t[7]=[i(" Regenerate Recovery Codes ")])),_:1})):d("",!0)]),_:1}),r(_,{onConfirmed:A},{default:s(()=>[f.value.length===0&&!e.value?(o(),w(F,{key:0,type:"button",class:"me-3"},{default:s(()=>t[8]||(t[8]=[i(" Show Recovery Codes ")])),_:1})):d("",!0)]),_:1}),r(_,{onConfirmed:R},{default:s(()=>[e.value?(o(),w(F,{key:0,type:"button",class:k({"opacity-25":m.value}),disabled:m.value},{default:s(()=>t[9]||(t[9]=[i(" Cancel ")])),_:1},8,["class","disabled"])):d("",!0)]),_:1}),r(_,{onConfirmed:R},{default:s(()=>[e.value?d("",!0):(o(),w(ee,{key:0,type:"submit",class:k({"opacity-25":m.value}),disabled:m.value},{default:s(()=>t[10]||(t[10]=[i(" Disable ")])),_:1},8,["class","disabled"]))]),_:1})])):(o(),n("div",_e,[r(_,{onConfirmed:V},{default:s(()=>[r(P,{type:"button",class:k({"opacity-25":c.value}),disabled:c.value},{default:s(()=>t[5]||(t[5]=[i(" Enable ")])),_:1},8,["class","disabled"])]),_:1})]))])]}),_:1}))}});export{Ve as _};
