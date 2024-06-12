doctype html
head
  meta(charset='UTF-8')
  meta(name='viewport' content='width=device-width, initial-scale=1.0')
  title Document
  style#jsbin-css.
    textarea[autoresize] {
    display: block;
    overflow: hidden;
    resize: none;
    }
  script(src='jquery-3.7.1.min.js')
  link(rel='stylesheet' href='/public/css/warcaby.css')
  script(src='https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js')
  script(type='text/javascript' src='https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.min.js')
  script(src='https://code.jquery.com/jquery-3.6.0.min.js')
  script(src='/public/jq.js' type='text/javascript')
  script(src='/public/warcaby.js' type='text/javascript')
  script(src='/public/chat.js' type='text/javascript')
#info(style='display:flex;flex-direction: row;')
  input#player(type='text' value='Initial Value' style='height: 25px;font-size: 20px;')
  input#turn(type='text' value='Initial Value' style='height: 25px;font-size: 20px;')
  //- input#kill(type='text' value='Initial Value' style='height: 25px;font-size: 20px;')
  input#room(type='text' value='Initial Value' style='height: 25px;font-size: 20px;')
dmessreciv#main
  //- #chatContainer
  //-   #chat
  //-     #messages
  //-     textarea#text(autoresize='' style='margin: 0; max-width: 100vw;min-height:80px')
  #game
  #historyContainer
    #history
  script.
    $('textarea').on('input', function() {
    $(this).outerHeight(38).outerHeight(this.scrollHeight);
    if (typeof singleReceiver !== 'undefined') scroll();
    });
