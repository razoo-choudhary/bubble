/**
 *
 * @param file
 * @returns {Promise<unknown>}
 */
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload   = () => resolve(reader.result);
    reader.onerror  = error => reject(error);
});

/**
 *
 * @param length
 * @returns {string}
 */
function make_id(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
let formData = new FormData();
$(document).ready( function (){
    let errorCase = $("#alert-file-send");
    $(".check").on("click", function () {
        errorCase.hide();
        const uploadedFiles = [];
        let caption = $("input[name=caption]");
        let sender = $("#nameF").attr("data-id");
        let typ, receiver;

        if(Number($(".chat-container").attr("data-private-id")) > 0){
            typ = "private";
            receiver = $(".chat-container").attr("data-private-id");
        }
        if(Number($(".chat-container").attr("data-group-id")) > 0){
            typ = "group";
            receiver = $(".chat-container").attr("data-group-id");
        }

        $(".item-image").find("img").each ( ( count, data ) => {
            uploadedFiles.push({
                'image' :   $(data).attr("data-source"),
                "name"  :   $(data).attr("alt")
            });
        })

        if(uploadedFiles.length < 1 )  {
            errorCase.html("Select at least 1 file to send !")
            errorCase.show();
        } else {
            SendFileToChat(formData, { sender, receiver, typ , caption : caption.val() })
        }
    })

    $(".add-file").on("click", function (e){
        errorCase.hide();
        $("#send-file-as-message").click();
    })

    $("#send-file-as-message").on("change", async function (e){
        if($(".x-fil-con").find(".item-image").length < 5){
            const file = this.files[0];
            formData.append("files", file)
            let displayImage;
            if(file.type.split('/')[0] === "image"){
                displayImage = "";
            }else{
                displayImage = "file"
            }
            if (file) {
                newFileIconOnSend(await toBase64(file), file.name, displayImage)
                $("#send-file-as-message").val("")
            }
        }else{
            errorCase.html("Maximum of 5 files can be attached at once.")
            errorCase.show();
        }
    })
})

function loadMessageContentFooter () {
    $(document).ready( function (){
        let messageSelector = $("input[name=new-message]");
        let receiver        = messageSelector.attr("data-to");
        let sender          = messageSelector.attr("data-from");
        let typ             = messageSelector.attr("data-type");

        new FgEmojiPicker({
            trigger             : ['.emojis_btn'],
            removeOnSelection   : false,
            closeButton         : true,
            position            : ['top', 'left'],
            preFetch            : true,
            insertInto          : document.querySelector('.fcdr'),
            emit(obj, triggerElement) {}
        });

        // $('.chat-conversation .simplebar-content-wrapper').scroll(function(){
        //     if( $(this).scrollTop()==0 ){
        //         chatLimit = chatLimit + 15;
        //         loadMainChat(currentUsername)
        //     }
        // });

        $('.send-file').on("click", function () { $("#send-file-modal").modal("show"); })

        $(".chat-user-list li a, .contact-list h5, .groupChatList li a").on("click", function () { $(".user-chat").addClass("user-chat-show"); });

        $(".user-chat-remove").on("click", function () { $(".user-chat").removeClass("user-chat-show");});

        $(".new-message-btn").on("click", function (){ sendMessageThroughSocket() })

        messageSelector.on("keyup",function () {$(this).removeAttr("style")});
        messageSelector.on("keypress", function (e) { if (e.which === 13)  sendMessageThroughSocket() });
        messageSelector.focus()
        function sendMessageThroughSocket(){
            if(!messageSelector.val() || messageSelector.val() === "" || messageSelector.val() === null) {
                messageSelector.attr('style', 'border-color: red !important')
            } else {
                if(typ === "group"){
                    Socket.emit("new-group-message", {
                        from_user : sender,
                        group_id : receiver,
                        message_text : messageSelector.val()
                    })
                }else{
                    Socket.emit("new-private-message", {
                        from_user : sender,
                        to_user : receiver,
                        message_text : messageSelector.val()
                    })
                }
                messageSelector.val("")
            }
        }
        $('.chat-conversation .simplebar-content-wrapper').animate({ scrollTop: $(document).height() * 5 * $(document).height() }, 1200)
    })
}


function loadBeforeLoad(){
    $(".user-chat").addClass("user-chat-show");// });
    loadMessageContentFooter()
}
/**
 *
 * @param username
 * @returns {Promise<void>}
 */
async function loadMainChat( username ){
    $("#chatContent").load( "/get-chat-content/chat/" + username + "?limit=" + 15, loadBeforeLoad);
    scrollIt();
}

async function LoadMainGroupChat( group_id ){
    $("#chatContent").load( "/get-chat-content/group/" + group_id + "?limit=" + 15, loadBeforeLoad);
    scrollIt();
}

/**
 *
 * @param element
 */
function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    Snackbar.show({text: 'Text Copied To Clipboard', pos: "bottom-center"});
}

/**
 *
 * @param type
 * @param data
 * @returns {string}
 * @constructor
 */
function UrlReForm( type, data ){
    let baseUrl = $('meta[name=rootPath]').attr("content");
    let nextURL;
    if(baseUrl.slice(baseUrl.length - 1) !== "/") baseUrl = baseUrl + "/";
    if(type === "private") nextURL =  baseUrl + "chat/" + data;
    if(type === "group") nextURL = baseUrl + "group/" + data;
    return nextURL;
}

/**
 *
 * @param selector
 * @param onSelector
 */
function dynamicSearch( selector, onSelector){
    selector.on('keyup',function(event){
        let valThis = $(this).val();
        $(onSelector).find("li").each(function(){
            let text = $(this).attr('data-search-tag').toLowerCase();
            (text.indexOf(valThis) === 0) ? $(this).show() : $(this).hide();
        });
    })
}

/**
 *
 * @param data
 * @param thisSelector
 * @constructor
 */
function RejectRequest( data, thisSelector ){
    UpdateContactPreferences({
        request_user_id : data
    }, "/request/reject", thisSelector)
}

/**
 *
 * @param data
 * @param thisSelector
 * @constructor
 */
function AcceptRequest ( data, thisSelector ){
    UpdateContactPreferences({
        request_user_id : data
    }, "/request/accept", thisSelector)
}

/**
 *
 * @param selectedChat
 * @constructor
 */
function OpenNewGroupChat( selectedChat ){
    let group_id = Number(selectedChat.attr("data-group-id"));
    LoadMainGroupChat( group_id ).then( () => {
        window.history.pushState({}, '', UrlReForm("group",group_id ));
        window.history.replaceState({}, '', UrlReForm("group", group_id));
        scrollIt()
    })
}

/**
 *
 * @param selectedChat
 */
function loadChat( selectedChat ) {
    let username = selectedChat.attr('data-username').toLowerCase();
    loadMainChat(username).then( () => {
        $('a[data-username='+username+']').find(".unread-message > span").html('')
        window.history.pushState({}, '', UrlReForm("private", username));
        window.history.replaceState({}, '', UrlReForm("private", username));
        scrollIt()
    })
}

/**
 *
 * @param action
 */
function disableAll( action = "init"){
    let selector = $("body").find(":input",":button");
    if(action === "init") selector.attr("disabled", true)
    if(action === "dismiss") selector.attr("disabled", false)
}

/**
 *
 * @param selector
 */
function newChatContact( selector ){
    let username = selector.attr('data-username')
    if(username){
        username = username.toLowerCase();
        loadMainChat(username).then(r => {})
        scrollIt()
    }
}

/**
 *
 * @param status
 * @param from_user_id
 * @param to_user_id
 * @param type
 */
function changeMuteStatus(status, from_user_id , to_user_id, type){
    UpdateChat({from_user_id, to_user_id , status, type })
}

function convertBytes ( bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    if (bytes === 0) {
        return "n/a"
    }

    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))

    if (i === 0) {
        return bytes + " " + sizes[i]
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}