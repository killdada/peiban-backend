(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-423a3bca"],{"4ad6":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"page-Member-list"},[a("header",[a("div"),a("el-button",{attrs:{type:"primary",size:"medium"}},[a("a",{staticStyle:{color:"#fff"},attrs:{href:t.reportLink}},[t._v("生成报表")])])],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{data:t.data}},[a("el-table-column",{attrs:{prop:"username","min-width":"200",label:"账号"}}),a("el-table-column",{attrs:{prop:"user_show_name","min-width":"200",label:"姓名"}}),a("el-table-column",{attrs:{prop:"week_time",label:"本周学习时长"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.format(e.row.week_time)))]}}])}),a("el-table-column",{attrs:{prop:"practice_week_num",label:"本周练习次数"}}),a("el-table-column",{attrs:{prop:"total_time",label:"累计学习时长"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.format(e.row.total_time)))]}}])}),a("el-table-column",{attrs:{prop:"practice_total_num",label:"累计练习次数"}}),a("el-table-column",{attrs:{label:"操作","min-width":"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.gotoEdit(e.row)}}},[t._v("查看")])]}}])})],1),a("page-pagination",{attrs:{pageSize:t.pageSize,total:t.total},on:{currentChange:t.handleCurrentChange}}),a("el-dialog",{attrs:{title:"学习记录",width:"700px",visible:t.showDialog},on:{"update:visible":function(e){t.showDialog=e}}},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingDetail,expression:"loadingDetail"}],staticClass:"hadBorder",attrs:{data:t.dataRecord,height:"500px"}},[a("el-table-column",{attrs:{prop:"category",label:"课程分类"}}),a("el-table-column",{attrs:{prop:"course_name",label:"课程名称"}}),a("el-table-column",{attrs:{width:"150",label:"共计学习时长"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.format(e.row.learning_time)))]}}])})],1),a("page-pagination",{attrs:{pageSize:20,total:t.totalRecord},on:{currentChange:t.handleCurrentChangeRecord}})],1)],1)},r=[],o=a("a9bf"),i=a("c9c8"),c=a("52f9"),l=Object(c["a"])();function s(t){return o["a"].get("/user",{params:t})}var u=Object(i["a"])("".concat(l,"/user/export"));function p(t,e){return o["a"].get("/user/detail/".concat(t),{params:e})}var d={data:function(){return{data:[],loading:!1,total:0,showDialog:!1,id:"",loadingDetail:!1,totalRecord:0,dataRecord:[],reportLink:u,page:1,pageRecord:1,pageSize:10}},components:{},methods:{format:function(t){var e=parseInt(t,10),a=parseInt(e/60,10),n=e%60;if(a>=60){var r=a%60,o=parseInt(a/60,10);return"".concat(o,"时").concat(r,"分").concat(n,"秒")}return"".concat(a,"分").concat(n,"秒")},createReport:function(){},handleCurrentChange:function(t){this.page=t,this.fetchData(t)},handleCurrentChangeRecord:function(t){this.pageRecord=t,this.fetchDetail(t)},fetchData:function(t){var e=this;this.loading||(this.loading=!0,s({page:t||this.page||1}).then((function(t){(1==t.max_page||1===e.page)&&(e.pageSize=t.list.length||20),e.data=t.list,e.total=t.sum})).catch((function(t){e.$message.error(t.message)})).finally((function(){e.loading=!1})))},gotoEdit:function(t){this.pageRecord=1,this.showDialog=!0,this.id=t.username,this.fetchDetail()},fetchDetail:function(t){var e=this;this.loadingDetail||(this.loadingDetail=!0,p(this.id,{page:t||this.pageRecord||1}).then((function(t){e.dataRecord=t.list,e.totalRecord=t.sum})).catch((function(t){e.$message.error(t.message)})).finally((function(){e.loadingDetail=!1})))}},created:function(){this.fetchData()}},f=d,g=(a("7919"),a("2877")),h=Object(g["a"])(f,n,r,!1,null,"2ff0e743",null);e["default"]=h.exports},7919:function(t,e,a){"use strict";a("f3fb")},"91dd":function(t,e,a){"use strict";function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,a,o){e=e||"&",a=a||"=";var i={};if("string"!==typeof t||0===t.length)return i;var c=/\+/g;t=t.split(e);var l=1e3;o&&"number"===typeof o.maxKeys&&(l=o.maxKeys);var s=t.length;l>0&&s>l&&(s=l);for(var u=0;u<s;++u){var p,d,f,g,h=t[u].replace(c,"%20"),m=h.indexOf(a);m>=0?(p=h.substr(0,m),d=h.substr(m+1)):(p=h,d=""),f=decodeURIComponent(p),g=decodeURIComponent(d),n(i,f)?r(i[f])?i[f].push(g):i[f]=[i[f],g]:i[f]=g}return i};var r=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},b383:function(t,e,a){"use strict";e.decode=e.parse=a("91dd"),e.encode=e.stringify=a("e099")},c9c8:function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));var n=a("b383"),r=a.n(n),o=a("a78e"),i=a.n(o);function c(t){var e=r.a.stringify({token:i.a.get("token")||""});return"".concat(t,"?").concat(e)}},e099:function(t,e,a){"use strict";var n=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};t.exports=function(t,e,a,c){return e=e||"&",a=a||"=",null===t&&(t=void 0),"object"===typeof t?o(i(t),(function(i){var c=encodeURIComponent(n(i))+a;return r(t[i])?o(t[i],(function(t){return c+encodeURIComponent(n(t))})).join(e):c+encodeURIComponent(n(t[i]))})).join(e):c?encodeURIComponent(n(c))+a+encodeURIComponent(n(t)):""};var r=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};function o(t,e){if(t.map)return t.map(e);for(var a=[],n=0;n<t.length;n++)a.push(e(t[n],n));return a}var i=Object.keys||function(t){var e=[];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.push(a);return e}},f3fb:function(t,e,a){}}]);
//# sourceMappingURL=chunk-423a3bca.fa327dd5.js.map