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
		image_url: "https://youtu.be/ZeEXwgcZ_Vk",
		category: '중식',
	},
	{
		title: "오구오오",
		address: "충남 논산시 은진면 대학로 138",
		url: "http://naver.me/53XgXLjX",
		image_url: "https://youtu.be/OoOegRMaBME",
		category: '한식',
	},
	{
		title: "한솥도시락 건양대앞점",
		address: "충남 논산시 은진면 와야길 9",
		url: "http://naver.me/FrKAVg62",
		image_url: "https://youtu.be/dtYexNnsGvI",
		category: '양식',
	},
	{
		title: "동해안동태찜 논산본점",
		address: "충남 논산시 시민로84번길 3",
		url: "http://naver.me/xivSVGIO",
		image_url: "https://youtu.be/7Du6stvhQ5g",
		category: '한식',
	},
	{
		title: "국이랑밥이랑",
		address: "충남 논산시 은진면 대학로 136",
		url: "http://naver.me/xbwaAHtq",
		image_url: "https://youtu.be/asDQQWRS1uY",
		category: '한식',
	},
	{
		title: "내동춘천닭갈비",
		address: "충남 논산시 시민로132번길 52",
		url: "http://naver.me/G14gIeta",
		image_url: "https://youtu.be/Md6LQFtfApY",
		category: '한식',
	},
];

/*
**********************************************************
3. 여러개 마커 찍기
  * 주소 - 좌표 변환
*/

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소-좌표 변환 함수
function getCoordsByAddress(address) {
	return new Promise((resolve, reject) => {
    	// 주소로 좌표를 검색합니다
		geocoder.addressSearch(
			address,
			function (result, status) {
    		// 정상적으로 검색이 완료됐으면
    		if (status === kakao.maps.services.Status.OK) {
				var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
				resolve(coords);
      		}
			reject(new Error("getCoordsByAddress Error: invaild Address"));
    		}
		);
	});
}


/* 
*************************************************************
4. 마커에 인포윈도우 붙이기
*/

function getContent(data) {
  let replaceUrl = data.image_url;
  let finUrl = "";
  replaceUrl = replaceUrl.replace("https://youtu.be/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
  finUrl = replaceUrl.split("&")[0];

  // 인포윈도우 가공하기
  return `
  <div class="infowindow">
      <div class="infowindow-img-container">
        <img
          src="https://img.youtube.com/vi/${finUrl}/mqdefault.jpg"
          class="infowindow-img"
        />
      </div>
      <div class="infowindow-body">
        <h5 class="infowindow-title">${data.title}</h5>
        <p class="infowindow-address">${data.address}</p>
        <a href="${data.url}" class="infowindow-btn" target="_blank">가게정보</a>
      </div>
    </div>
  `;
}

async function setMap(dataSet) {
  //markerArray = [];
  // infowindowArray = [];

	for (var i = 0; i < dataSet.length; i++) {
    // 마커를 생성합니다
    	const coords = await getCoordsByAddress(dataSet[i].address);
    	var marker = new kakao.maps.Marker({
      		map: map, // 마커를 표시할 지도
      		position: coords, // 마커를 표시할 위치
    	});

    	markerArray.push(marker);

    // 마커에 표시할 인포윈도우를 생성합니다
    	var infowindow = new kakao.maps.InfoWindow({
      		content: getContent(dataSet[i]), // 인포윈도우에 표시할 내용
    	});

    	infowindowArray.push(infowindow);

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    	kakao.maps.event.addListener(
    		marker,
			"click",
    		makeOverListener(map, marker, infowindow, coords)
    	);
    	kakao.maps.event.addListener(
			map,
			"click",
			makeOutListener(infowindow)
		);
	}
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
// 1. 클릭시 다른 인포윈도우 닫기
// 2. 클릭한 곳으로 지도 중심 옮기기
function makeOverListener(map, marker, infowindow, coords) {
	return function () {
    	closeInfoWindow();
    	infowindow.open(map, marker);
    	map.panTo(coords);
	};
}

let infowindowArray = [];
function closeInfoWindow() {
	for (let info of infowindowArray) {
    	info.close();
	}
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
	return function () {
    	infowindow.close();
	};
}

/*
**********************************************
5. 카테고리 분류
*/

// 카테고리
const categoryMap = {
	korea: '한식',
	china: '중식',
	japan: '일식',
	america: '양식',
	wheat: '분식',
	meat: '구이',
	sushi: '회/초밥',
	etc: '기타',
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

async function categoryHandler(event) {
	const categoryId = categoryMap[event.target.id];

  // 데이터 분류
	let categorizedDataSet = [];
	for (let data of dataSet) {
    	if (data.category === categoryId) {
			categorizedDataSet.push(data);
    	}
	}

  // 기존 마커 삭제
	closeMarker();

  // 기존 인포윈도우 닫기
	closeInfoWindow();

	setMap(categorizedDataSet);
}

let markerArray = [];
function closeMarker() {
	for (let marker of markerArray) {
    	marker.setMap(null);
	}
}

setMap(dataSet);