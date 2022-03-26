/*
******************************************************************************
지도 생성과 확대 축소 컨트롤러 부분
https://apis.map.kakao.com/web/sample/addMapControl

*/
var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { 
    //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(36.181962789725695, 127.11024263810567), //지도의 중심좌표.
	level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 지도에 확대 축소 컨트롤 생성
let zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤 추가
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

