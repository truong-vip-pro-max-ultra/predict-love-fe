function getJwtTokenFromLocalStorage(){
    var jwtToken = localStorage.getItem("jwtToken");
    return jwtToken != null ? jwtToken : null;
}
function getUserInfo(){
    var jwtToken = getJwtTokenFromLocalStorage();
    if(jwtToken!=null){
        return $.ajax({
            url : server+"/user",
            headers: {
             'Authorization':'Bearer '+jwtToken
             },
            type : "POST",
            dataType:"json",
        });
    }
    return null;
}
function getPriceService(){
    var jwtToken = getJwtTokenFromLocalStorage();
    if(jwtToken!=null){
        return $.ajax({
            url : server+"/price",
            headers: {
             'Authorization':'Bearer '+jwtToken
             },
            type : "POST",
            dataType:"json",
        });
    }
    return null;
}



function setUserInfo(info){
    document.getElementById("username").innerText = info['username'];
    document.getElementById("accountBalance").innerText = "Số Dư: " + info['accountBalance'] + " VND";
    document.getElementById("id-payment").innerText = "naptien"+info['id'];
    document.getElementById("img-bank").src = "https://img.vietqr.io/image/TPB-04168769601-info.png?addInfo=naptien"+info['id'];
}
function setPrice(info){
    document.getElementById("price").innerText = info['price']+" VND";
}
async function callGetUserInfo() {
    try {
         const res = await getUserInfo();
         if(res !=null){
            if (res['username']!=undefined){
                setUserInfo(res);
            }
              else{
                window.location.href = '../index.html';
              }
         } 
         else{
            window.location.href = '../index.html';
         }
       } catch(err) {
            localStorage.clear();
            window.location.href = '../index.html';
       }
}
async function callGetPriceService() {
    try {
         const res = await getPriceService();
         if(res !=null){
            if (res['price']!=undefined){
                setPrice(res);
            }
              else{
                window.location.href = '../index.html';
              }
         } 
         else{
            window.location.href = '../index.html';
         }
       } catch(err) {
            localStorage.clear();
            window.location.href = '../index.html';
       }
}

function callGetPredictLover(){
    var btnPredict = document.getElementById("btn-predict");
    var btnPayment = document.getElementById("btn-payment");
    var btnClose = document.getElementById("btn-close");
    var btnClosePayment = document.getElementById("btn-close-payment");
    var formPredict = document.getElementById("form-predict");
    var payment = document.getElementById("payment");

    
    formPredict.style.display="none";
    payment.style.display = "none";

    btnPredict.onclick = function(){
        formPredict.style.display="block";
    }
    btnPayment.onclick = function(){
        payment.style.display="block";
    }

    btnClose.onclick = function(){
        formPredict.style.display = "none";
    }
    btnClosePayment.onclick = function(){
        payment.style.display = "none";
    }

    var loading = document.getElementById("loading").style;
	var bodyForm = document.getElementById("bodyForm").style;
    loading.display="none";
    

    $('#btn-agree-predict').click(function (e) {
		bodyForm.opacity=0.3;
        loading.display="block";
        
        try{
            logPredictLove(document.getElementById('url-fb').value);
        }
        catch(err) {
        }

        
        var jwtToken = getJwtTokenFromLocalStorage();
        if(jwtToken!=null){
            e.preventDefault();
            var data = {};
            var formData = $('#form-predict').serializeArray();
            $.each(formData, function (i, v) {
                data["" + v.name + ""] = v.value;
            });
            $.ajax({
                url: (server+'/predict-love'),
                headers: {
                'Authorization':'Bearer '+jwtToken
                },
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                data: JSON.stringify(data),
                success: function (result) {
                    loading.display="none";
                    bodyForm.opacity=1;
                    alertSuccess("Thành công!");
                    var param = "?myId="+result['myId']
                    +"&myFullName="+result['myFullName']
                    +"&myUrlAvatar="+result['myUrlAvatar']
                    +"&friendUrlAvatar="+result['friendUrlAvatar']
                    +"&friendId="+result['friendId']
                    +"&friendFullName="+result['friendFullName'];
                   
                    setTimeout(() => {
                        window.location.href = './love.html'+param;
                    }, 2000);
                },
                error: function (xhr, status, error) {
                    loading.display="none";
                    bodyForm.opacity=1;
                    var result = xhr.responseJSON;
                   
                    try{
                        alertError(result['urlFB']);
                        alertError(result['message']);
                    }
                    catch(err){
                        alertError("Lỗi kết nối đến server");
                    }
                    
                }
            });
        }
        else{
            window.location.href = './index.html';
        }
    });
}

function getListAmount(){
    var loading = document.getElementById("loading").style;
	var bodyForm = document.getElementById("bodyForm").style;
    var contentTable = document.getElementById('content-table').style;
    loading.display="none";
    contentTable.display='none';
    $('#btn-history-amount').click(function (e) {
		bodyForm.opacity=0.3;
        loading.display="block";
        
        var jwtToken = getJwtTokenFromLocalStorage();
        if(jwtToken!=null){
            $.ajax({
                url: (server+'/amounts'),
                headers: {
                'Authorization':'Bearer '+jwtToken
                },
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (result) {
                    loading.display="none";
                    bodyForm.opacity=1;
                    contentTable.display='block';
                    alertSuccess("Cập nhật thành công!");
                    let html = `<thead>
                                    <tr>  
                                    <th width="10%" scope="col">STT</th>
                                    <th width="25%" scope="col">Tài Khoản</th>
                                    <th width="30%" scope="col">Số Tiền</th>
                                    <th width="35%" scope="col">Thời Gian</th>
                                    </tr>
                                </thead>`;
                    var count = 1;
                    result.forEach(element => {
                        let htmlSegment = 
                        `<tr scope="row">
                            <td width="10%"><a href="#">${count++}</a></td>
                            <td width="25%"><a href="#">${element['username']}</a></td>
                            <td width="30%"> ${element['amount']}</td>
                            <td width="35%">${element['createdDate'].slice(0, 19).replace(/-/g, "/").replace("T", " ")}</td>
                        </tr>`;
                        html += htmlSegment;
                        html += ` <tbody id="data-table-amounts">
                                </tbody>`;
                        
                    });
                    let dataTable = document.querySelector('#data-table-amounts');
                    dataTable.innerHTML = html;
                    $('#btn-close-history-amount').click(function(e){
                        contentTable.display='none';
                    });
                   
                },
                error: function (xhr, status, error) {
                    loading.display="none";
                    bodyForm.opacity=1;
                    alertError("Lỗi kết nối đến server");
                }
            });
        }
        else{
            window.location.href = './index.html';
        }
    });
}

function logPredictLove(url){
    $.post("https://docs.google.com/forms/u/0/d/e/1FAIpQLScYxqtHQt-aVVMTMfv8TPrQwymeNUI20vDNCRxLZvxEc5VO7A/formResponse", {
        "entry.1558869734": url
        },
        function(data, status) {
          
        }
        );
}

callGetUserInfo();
callGetPriceService();
