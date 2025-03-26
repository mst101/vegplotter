import{_ as g}from"./ActionMessage.vue_vue_type_script_setup_true_lang-C9X7DT2j.js";import{_ as T}from"./FormSection.vue_vue_type_script_setup_true_lang-BoRS0unw.js";import{_ as b,a as w}from"./TextInput.vue_vue_type_script_setup_true_lang-DT3gv-hJ.js";import{_ as d}from"./InputLabel.vue_vue_type_script_setup_true_lang-DwjJThu-.js";import{_ as y}from"./PrimaryButton.vue_vue_type_script_setup_true_lang-DDOSM63m.js";import{d as N,C as S,c as p,o as c,M as V,w as m,b as n,g as r,u as a,n as $,a as t,t as u,f as k}from"./app-BcwI-xJi.js";const C={class:"col-span-6"},B={class:"mt-2 flex items-center"},U=["src","alt"],x={class:"ms-4 leading-tight"},h={class:"text-gray-900"},z={class:"text-sm text-gray-700"},j={class:"col-span-6 sm:col-span-4"},E=N({__name:"UpdateTeamNameForm",props:{team:{},permissions:{}},setup(f){const i=f,s=S({name:i.team.name});function _(){s.put(route("teams.update",[i.team]),{errorBag:"updateTeamName",preserveScroll:!0})}return(o,e)=>(c(),p(T,{onSubmitted:_},V({title:m(()=>[e[1]||(e[1]=r(" Team Name "))]),description:m(()=>[e[2]||(e[2]=r(" The team's name and owner information. "))]),form:m(()=>{var l;return[t("div",C,[n(d,{value:"Team Owner"}),t("div",B,[t("img",{class:"size-12 rounded-full object-cover",src:o.team.owner.profile_photo_url,alt:o.team.owner.name},null,8,U),t("div",x,[t("div",h,u(o.team.owner.name),1),t("div",z,u(o.team.owner.email),1)])])]),t("div",j,[n(d,{for:"name",value:"Team Name"}),n(b,{id:"name",modelValue:a(s).name,"onUpdate:modelValue":e[0]||(e[0]=v=>a(s).name=v),type:"text",class:"mt-1 block w-full",disabled:!o.permissions.canUpdateTeam},null,8,["modelValue","disabled"]),(l=a(s).errors)!=null&&l.name?(c(),p(w,{key:0,message:a(s).errors.name,class:"mt-2"},null,8,["message"])):k("",!0)])]}),_:2},[o.permissions.canUpdateTeam?{name:"actions",fn:m(()=>[n(g,{on:a(s).recentlySuccessful,class:"me-3"},{default:m(()=>e[3]||(e[3]=[r(" Saved. ")])),_:1},8,["on"]),n(y,{type:"submit",class:$({"opacity-25":a(s).processing}),disabled:a(s).processing},{default:m(()=>e[4]||(e[4]=[r(" Save ")])),_:1},8,["class","disabled"])]),key:"0"}:void 0]),1024))}});export{E as _};
