let socket;
            window.onload = () => {
            	// socket 연결
                socket = io.connect();

                socket.emit('in',{
                    name: getCookie('id'),
                });
                socket.on('in',(name)=>{
                    makeEnterDiv(name);
                });
			// message 수신 이벤트
                socket.on('message', (name,content) => {
                    makeChatDiv(name, content);
                });
                socket.on('exit_chat',(name)=>{
                    makeExitDiv(name);
                });
            }
			// 버튼 클릭 시 메시지 송신
            const sendMessage = () => {
                var objDiv=document.getElementById("chatbox").scrollHeight;
                document.getElementById("chatbox").scrollTop=objDiv;
                let content = document.getElementById('content').value;
                //document.getElementById( 'content' ).removeAttribute( 'required' );
                document.getElementById('content').value = '';
                //document.getElementById('content').setAttribute('required');
                var name = getCookie("id");
                socket.emit('message', {
                    name,
                    content
                });
            }
            function exit(){
                var id=getCookie("id");
                socket.emit('exit',id);
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
                let date = document.createElement('span');
                var min=new Date().getMinutes(),hour=new Date().getHours();

                if(min<10){min='0'+min;}
                if(hour<10){hour='0'+hour}
                nameH3.innerHTML = name;
                contentP.innerHTML = content;
                date.innerHTML=hour+':'+min;

                div.appendChild(nameH3);
                div.appendChild(date);
                div.appendChild(contentP);

                div.className = "chat"
                document.getElementById('chatbox').appendChild(div);
            }
            const makeEnterDiv=(name)=>{
                let div=document.createElement('div');
                div.className="enter"
                let nameP=document.createElement('p');
                nameP.innerHTML=name+'님이 입장하셨습니다';
                div.appendChild(nameP);
                document.getElementById('chatbox').appendChild(div);
            };
            const makeExitDiv=(name)=>{
                let div=document.createElement('div');
                div.className="enter"
                let nameP=document.createElement('p');
                nameP.innerHTML=name+'님이 퇴장하셨습니다';
                div.appendChild(nameP);
                document.getElementById('chatbox').appendChild(div);
            };