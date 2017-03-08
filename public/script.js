var url = 'http://localhost:3000/';
var curEdit = null;
var backup = null;
var params = 0;
var empty = '';
var addForm;
var schemaAr = [];
var curTable = "planets";


$(function () {
    init(curTable);
});

function init(defaultTable) {
    addForm = document.getElementById("formx");
    loadTable(defaultTable);
    getSchema(defaultTable);
    createAddForm();
    document.getElementById("table").onclick = function (e) {
        delRow(e);
        editRow(e);
    };
    document.getElementById("list").onclick = function (e) {
        if(e.target.tagName != "LI") return;
        var target = e.target;
        getSchema(target.dataset.id);
        loadTable(target.dataset.id);
        curTable = target.dataset.id;
        createAddForm();
    };

}


function loadTable(table) {
    var request = new XMLHttpRequest();
    request.open('GET', url + table, false);
    request.onreadystatechange = function (e) {
        if (this.readyState = 4) {
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
                params = drawTable(response);
            }
            else {
                // тут сообщаем о сетевой ошибке
            }
        }
    };
    request.send(null);
}

function drawTable(arr) {
    var table = document.getElementById("table");
    var p = [];
    table.innerHTML = '';
    var s = "<thead><tr>";
    for (var i in arr[0]) {
        s += "<th>";
        s += i;
        p.push(i);
        s += "</th>";
    }
    s += '<th class="thEdit">Edit</th><th class="thDel">Delete</th></tr></thead>';
    table.innerHTML += s;
    s = '';
    for (var j = 0; j < arr.length; j++) {
        s += "<tr data-id='" + arr[j].Name+"'>";
        for (var i in arr[j]) {
            s += "<td>";
            s += arr[j][i];
            s += "</td>";
        }
        s += '<td class="editBtnTr"></td><td class="delBtnTr"></td></tr>';

    }
    table.innerHTML += s;
    return p;
}

function delRow(e) {
    var target = e.target;
    if(target.tagName != "TD") return;
    if(!target.classList.contains("delBtnTr")) return;
    var conf = confirm("Delete "+ e.target.parentNode.dataset.id);
    if(conf) {
        var msg = "id=" + e.target.parentNode.dataset.id;
        msg+="&table=" + curTable;
        $.ajax({
            type: 'POST',
            url: 'delRow',
            data: msg,
            error: function (xhr, str) {
                console.log('Возникла ошибка: ' + str);
            },
            success: function (xhr, str) {
                console.log('Success: ' + str);
            }
        });
        loadTable(curTable);
    }
}

function editRow(e) {
    var target = e.target;
    var id = '';
    if(target.tagName != "TD") return;
    if(!target.classList.contains("editBtnTr")) return;
    if(curEdit!=null){
        curEdit.innerHTML = backup.innerHTML;
        curEdit.classList = '';
    }
    backup = target.parentNode.cloneNode(true);
    var tr = target.parentNode;
    var obj = {};
    for(var j=0; j<params.length; j++){
        obj[params[j]] = target.parentNode.children[j].textContent;
    }
    id = obj.Name;
    var html ='';
    var arToTR = [];
    for(var i in obj){
        arToTR.push(obj[i])
    }
    for (var i = 0; i < schemaAr.length; i++) {
        html+=  "<td>"+schemaAr[i].replace(/VAL/,arToTR[i])+"</td>";
    }
    // var html = '<td><input id="Name" name="Name" value="'+ obj.Name+'" type="text" placeholder="Name"></td>'+
    //    '<td><input id="Radius" name="Radius" value="'+obj.Radius+'" type="number" placeholder="Radius"></td>'+
    //     '<td><input id="CoreTemperature" name="CoreTemperature" value="'+obj.CoreTemperature+'" type="number" placeholder="CoreTemperature"></td>'+
    //     '<td><input id="isAthmosphere" name="isAthmosphere" value="'+obj.isAthmosphere+'" type="number" min="0" max="1" placeholder="isAthmosphere"></td>'+
    //     '<td><input id="isLife" name="isLife" value="'+obj.isLife+'" type="number" min="0" max="1" placeholder="isLife"></td>'+
    //     '<td><input id="star" name="star" value="'+obj.star+'" type="text" placeholder="Star"></td>'+
    //     '<td><input id="satellites" name="satellites" value="'+obj.satellites+'" type="number" min="0" placeholder="satellites"></td>'+
    html+='<td id="editConfirmBtn"></td>'+ '<td id="editCloseBtn">Close</td>';

    tr.classList.add("editable");
    tr.innerHTML = html;
    curEdit = tr;

    document.getElementById("editCloseBtn").addEventListener("click",function (e) {
        curEdit.innerHTML = backup.innerHTML;curEdit.classList = empty;backup=null;curEdit=null;
    });
    document.getElementById("editConfirmBtn").addEventListener("click",function (e) {
        for (var i = 0; i < params.length; i++) {
            obj[params[i]] = tr.children[i].children[0].value;
        }
        var msg = "json="+JSON.stringify(obj)+"&id="+id;
        msg+="&table=" + curTable;
        $.ajax({
            type: 'POST',
            url: 'updateRow',
            data: msg,
            error: function (xhr, str) {
                console.log('Возникла ошибка: ' + str);
            },
            success: function (xhr, str) {
                console.log('Success: ' + str);
            }
        });
        loadTable(curTable);
    });

}

function addRow() {
    var msg = $('#formx').serialize();
    msg+="&table=" + curTable;
    $.ajax({
        type: 'POST',
        url: 'addRow',
        data: msg,
        error: function (xhr, str) {
            console.log('Возникла ошибка: ' + str);
        },
        success: function (xhr, str) {
            console.log('Success: ' + str);
        }
    });
    loadTable(curTable);

}

function createAddForm() {
    addForm.innerHTML = '';
    for (var i = 0; i < schemaAr.length; i++) {
        addForm.innerHTML += schemaAr[i].replace(/VAL/,'');
    }
    addForm.innerHTML+=	'<input value="Add" type="submit">'+
       '<a onclick="this.parentNode.style.height=empty" class="formClose"></a>';

}

function createEditAr(schema) {

    var tmplVC = '<input id="NAME" name="NAME" value="VAL" type="text" placeholder="NAME">';
    var tmplBOOL = '<input id="NAME" name="NAME" value="VAL" min="0" max="1" type="number" placeholder="NAME">';
    var tmplINT = '<input id="NAME" name="NAME" value="VAL"  type="number" placeholder="NAME">';
    var s ='';
    var ar = [];
    for (var i = 0; i < schema.length; i++) {
        if(/varchar/.test(schema[i].Type)){
            s = tmplVC.replace(/NAME/g,schema[i].Field);
            ar.push(s);
        }
        if(/int/.test(schema[i].Type) && !/tinyint/.test(schema[i].Type)){
            s = tmplINT.replace(/NAME/g,schema[i].Field);
            ar.push(s);
        }
        if(/tinyint/.test(schema[i].Type)){
            s = tmplBOOL.replace(/NAME/g,schema[i].Field);
            ar.push(s);
        }
    }

    return ar;
}

function getSchema(table) {
    var request = new XMLHttpRequest();
    request.open('GET', url + "schema/"+table, false);
    request.onreadystatechange = function (e) {
        if (this.readyState = 4) {
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
                schemaAr = createEditAr(response);
            }
            else {
                // тут сообщаем о сетевой ошибке
            }
        }
    };
    request.send(null);
}
