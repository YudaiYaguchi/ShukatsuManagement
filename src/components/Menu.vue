<script setup>
import { onMounted,inject ,defineProps} from 'vue';

const props = defineProps({
  userId: Number,
  userName: String
});

const userId = inject('userId');
const userName = inject('userName');

// 受け取ったデータをconsole.logで表示
console.log("User ID:", userId);
console.log("User Name:", userName);

</script>

<template>
  <div class="hamburger-demo-menubox">
		<input id="hamburger-demo1" type="checkbox" class="input-hidden">
		<label for="hamburger-demo1" class="hamburger-demo-switch hamburger-demo-switch1">
			<span class="hamburger-switch-line1"></span>
		</label>
		<div class="hamburger-demo-menuwrap">
			<ul class="hamburger-demo-menulist">
				<li><router-link :to="'/' + userName + '/' + userId">HOME</router-link></li>
				<li><router-link :to="'/' + userName + '/' + userId">選考状況</router-link></li>
				<li><router-link :to="'/' + userName + '/' + userId">予定管理</router-link></li>
				<li><router-link :to="'/' + userName + '/' + userId">ESまとめ</router-link></li>
				<li><router-link :to="'/' + userName + '/' + userId">上記の機能は近日中に追加予定</router-link></li>
			</ul>
		</div>
		<div class="hamburger-demo-cover"></div>
	</div>
</template>

<style>
/* header（デモの参考値） */
.demobox-header{
background: #ddd;
height: 64px;
padding: 1em;
}
/* headerのサイト名（デモの参考値） */
.demobox-sitename{
font-weight: 700;
font-size: 18px;
}
/* 全体調整CSS */
.hamburger-demo-menubox *{
	font-size: 16px;
}
.hamburger-demo-menubox li{
	font-size: 14px;
}
/* hamburgerここから */
	/* inputを非表示 */
.input-hidden{
	display: none;
}
	/* label */
.hamburger-demo-switch{
	cursor: pointer;
	position: absolute;
	right: 3%;
	top: 0; /* ハンバーガーアイコンの位置（上から） */
	z-index: 9999;
	width: 4em; /* アイコン（クリック可能領域）の幅 */
	height: 4em; /* アイコン（クリック可能領域の）高さ */
}
/* メニュー展開時にハンバーガーアイコンを固定 */
#hamburger-demo1:checked ~ .hamburger-demo-switch{
	position: fixed;
}
/* ハンバーガーアイコン */
.hamburger-switch-line1, .hamburger-switch-line1:before, .hamburger-switch-line1:after{
	width: 25px;
	height: 3px;
	background: #333; /* ハンバーガーアイコンの色 */
	position: absolute;
	top: 50%;
	left: 50%;
	transition: .3s;
	content: "";
}
.hamburger-switch-line1{
		transform: translate(-50%, -50%);
}
.hamburger-switch-line1:before{
	transform: translate(-50%, -300%);
}
.hamburger-switch-line1:after{
	transform: translate(-50%, 200%);
}
/* ハンバーガーアイコン･アニメーション */
#hamburger-demo1:checked ~ .hamburger-demo-switch .hamburger-switch-line1{
	width: 0;
}
#hamburger-demo1:checked ~ .hamburger-demo-switch .hamburger-switch-line1:before{
	transform: rotate(45deg) translate(-40%, 325%);
}
#hamburger-demo1:checked ~ .hamburger-demo-switch .hamburger-switch-line1:after{
	transform: rotate(-45deg) translate(-40%, -325%);
}
/* メニューエリア */
.hamburger-demo-menuwrap{
	position: fixed;
	height: 100%;
	background: #fafafa; /* メニューエリアの背景色 */
	padding: 5em 3% 2em;
	z-index: 9998;
	transition: .3s;
	overflow-y: scroll; /* メニュー内容が多い場合に縦スクロールする */
	top: 0;
	left: 100%;
	width: 70%;
}
/* メニューリスト */
.hamburger-demo-menulist{
	margin-right: 3%;
	padding-left: 5% !important; /* !important不要な場合もあり */
	list-style: none;
}
.hamburger-demo-menulist li a{
	text-decoration: none;
	color: #333; /* メニューリストの文字色 */
	display: block;
	padding: .5em 0;
}
/* メニューエリア･アニメーション */
	/* 右から */
#hamburger-demo1:checked ~ .hamburger-demo-menuwrap{
	left: 30%;
}
	/* コンテンツカバー */
#hamburger-demo1:checked ~ .hamburger-demo-cover{
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 9997;
	background: rgba(3,3,3,.5);
	display: block;
}
</style>