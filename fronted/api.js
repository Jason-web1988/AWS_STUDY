export default class APIHandler {
  constructor() {}

  // TODO: 전체 카드 객체 리스트 반환. 없으면 NULL
  async getCards() {
    const request = new APIRequest("GET", "/kanban/cards");
    const response = await APIProcessor(request);
    if(response !== "Error"){
      console.log(response);
      return response.Items;
    }else{
      return null;
    }
    //꼭!읽어보기 => MDN CORS : https://developer.mozilla.org/ko/docs/Web/HTTP/CORS
    //꼭!읽어보기 => https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/how-to-cors.html
  }

  // TODO: 카드 객체 생성/추가 후 ID 반환
  async postCard(cardObj) {
    const request = new APIRequest("POST", "/kanban/cards",{
      title : cardObj.title, 
      category : cardObj.category
    });
    const response = await APIProcessor(request);
    if(response !== "Error"){
      console.log(response);
      return response.id;
    }else{
      return null;
    }
  }

  // TODO: ID로 카드 검색 후 내용,카테고리 수정
  async putCard(cardObj) {
    const request = new APIRequest("PUT", `/kanban/cards/${cardObj.id}`,{
      title : cardObj.title, 
      category : cardObj.category
    });
    const response = await APIProcessor(request);
  }

  // TODO: ID로 카드 검색 후 삭제
  async deleteCard(id) {
    const request = new APIRequest("DELETE", `/kanban/cards/${id}`);
    await APIProcessor(request);
  }
}

const HOST = "https://5bskahhafc.execute-api.ap-northeast-2.amazonaws.com/prod"

// TODO: API 요청 컨테이너. Method, Path, Body 속성
class APIRequest{
  constructor(method, path, body){
    this.method = method;
    this.url = HOST + path;
    this.body = body;
  }
}

// TODO: API 호출 함수
const APIProcessor = async (request) => {  
  try{
      const response = await fetch(request.url, {
        method: request.method, // *GET, POST, PUT, DELETE 등
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json'  
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      //redirect: 'follow', // manual, *follow, error
      //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: request.body ?JSON.stringify(request.body) : null // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
      });
      //body를 보고 싶으면 제공하는 메소드 https://developer.mozilla.org/en-US/docs/Web/API/Response 참고!
      switch(response.status){
        case 200 : 
        case 201 :
          return await response.json();
        case 204 :
          return null;  
        default : 
            console.error(await response.json());
          }
      }catch(e){
        console.error(e);
      }      
      return "Error";
}