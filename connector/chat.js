let socket;
            window.onload = () => {
            	// socket 연결
                socket = io.connect();

			// message 수신 이벤트
                socket.on('message', (name,content) => {
                    makeChatDiv(name, content);
                });
            }
			// 버튼 클릭 시 메시지 송신
            const sendMessage = () => {
                let content = document.getElementById('content').value;
                document.getElementById('content').value = '';
                var name = getCookie("id");
                socket.emit('message', {
                    name,
                    content
                });
            }
            function getCookie(name) {
                var nameOfCookie = name + "=";
                var x = 0;
                while (x <= document.cookie.length) {
                    var y = (x + nameOfCookie.length);
                     if (document.cookie.substring(x, y) == nameOfCookie) {
                          if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                               endOfCookie = document.cookie.length;
                          return unescape(document.cookie.substring(y, endOfCookie));
                     }
                    x = document.cookie.indexOf(" ", x) + 1;
                    if (x == 0)
                        break;
                }
                return "";
           }
			// message 수신 시 채팅 컴포넌트 생성
            const makeChatDiv = (name, content) => {
                let div = document.createElement('div');
                let nameH3 = document.createElement('h3');
                let contentP = document.createElement('p');

                nameH3.innerHTML = name;
                contentP.innerHTML = content;

                div.appendChild(nameH3);
                div.appendChild(contentP);

                div.className = "chat"

                document.getElementById('chatbox').prepend(div);
            }