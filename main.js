/*
******************************************************************************
1. 지도 생성과 확대 축소 컨트롤러 부분
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

/*
******************************************************************************
2. 더미데이터 준비(제목, 주소, url, 카테고리)
*/

const dataSet = [
	{
		title: "건양반점",
		address: "충남 논산시 은진면 대학로 120",
		url: "http://naver.me/xlWIs5zI",
		category: "중식",
	},
	{
		title: "오구오오",
		address: "충남 논산시 은진면 대학로 136",
		url: "http://naver.me/53XgXLjX",
		category: "한식",
	},
	{
		title: "국이랑밥이랑",
		address: "충남 논산시 은진면 대학로 136",
		url: "http://naver.me/xbwaAHtq",
		category: "한식",
	},
];

/*
******************************************************************************
3. 여러개 마커 찍기
    주소 - 좌표 변환
*/
// 주소 - 좌표 변환 객체를 생성합니다.
async function setMap() {
	for (var i = 0; i < dataSet.length; i++) {
		let position = await getCoordsByAddress(dataSet[i].address);
		console.log(position);

	  	// 마커를 생성합니다
		var marker = new kakao.maps.Marker({
			map: map, // 마커를 표시할 지도
			// position: positions[i].latlng, // 마커를 표시할 위치
			position: position,
			// title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
		});
	}
}


var geocoder = new kakao.maps.services.Geocoder();
function getCoordsByAddress(address) {
	return new Promise((resolve, reject) => {
		geocoder.addressSearch(address, function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
				return resolve(coords);
			}
			reject(new Error("getCoordsByAddress Error: not valid Address"));
		});
	});
}

setMap();
