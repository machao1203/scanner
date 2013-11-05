/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db;
var fileText;

function populateDB(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEVICEINFO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEVICEINFO (id unique,dev_uc varchar(8) ,dev_cc varchar(32),dev_id varchar(24))');
	var ucstr, ccstr, idstr;
	var len = fileText.length;
	var index = 0;
	$("#Dev_UC").empty();
	$("#Dev_CC").empty();
	while (len > 0) {
		var ucPos = fileText.indexOf("[UC]");
		var ccPos = fileText.indexOf("[CC]");
		var idPos = fileText.indexOf("[ID]");
		var endPos = fileText.indexOf("}");
		//console.log(ucPos + " " + ccPos + " " + idPos + " " + endPos);
		if ((idPos > ccPos) && (ccPos > ucPos) && (ucPos >= 0) && (endPos > 0)) {
			ucstr = fileText.substring(ucPos + 4, ccPos);
			ccstr = fileText.substring(ccPos + 4, idPos);
			idstr = fileText.substring(idPos + 4, endPos);
			var sqlstr = "INSERT INTO DEVICEINFO (id,dev_uc,dev_cc,dev_id) VALUES (" + index + ",'" + ucstr + "','" + ccstr + "','" + idstr + "')";
			tx.executeSql(sqlstr);
			//console.log("sql:" + sqlstr);
			fileText = fileText.substring(endPos + 1);
			len = len - endPos - 1;
			index++;

			$("#Dev_UC").append("<option value='" + index + "'>" + ucstr + "</option>");
			$("#Dev_CC").append("<option value='" + index + "'>" + ccstr + "</option>");
		} else {
			//console.log(ucPos + " " + ccPos + " " + idPos + " " + endPos);
			break;
		}

	}
	$("#Dev_UC").css({"font-size":30});
	$("#Dev_CC").css({"font-size":30});
	$("#Dev_CC").selectmenu('refresh');
	$("#Dev_UC").selectmenu('refresh');
	$("#Dev_UC").css({"font-size":30});
	$("#Dev_CC").css({"font-size":30});
	tx.executeSql('DROP TABLE IF EXISTS FILEINFO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS FILEINFO (file_url varchar(100))');
	var filesql = "INSERT INTO FILEINFO (file_url) VALUES ('" + Project_fileUrl + "')";
	tx.executeSql(filesql);
	alert("文件导入成功");
}

function errorCB(err) {
	console.log("Error processing SQL: " + err.code);
}

function successSave() {
	alert("保存成功！");
}

function initDB(tx) {
	tx.executeSql('SELECT * FROM DEVICEINFO', [], initSuccess, errorCB);
}

function queryDB(tx) {
	tx.executeSql('SELECT * FROM DEVICEINFO', [], querySuccess, errorCB);
}

function queryFileDB(tx) {
	tx.executeSql('SELECT * FROM FILEINFO', [], queryFileSuccess, queryFileError);
}

function queryChange(tx) {
	var uc_str = $("#Dev_UC").find("option:selected").text();
	var changesql = "SELECT * FROM DEVICEINFO WHERE dev_uc = '" + uc_str + "'";
	tx.executeSql(changesql, [], changeSuccess, errorCB);
}

function changeSuccess(tx, results) {
	var len = results.rows.length;
	if (len > 0) {
		$("#Dev_ID").val(results.rows.item(0).dev_id);
	} else {
		$("#Dev_ID").val("");
	}
}

function initSuccess(tx, results) {
	var len = results.rows.length;
	for (var i = 0; i < len; i++) {
		$("#Dev_UC").append("<option value='" + results.rows.item(i).id + "'>" + results.rows.item(i).dev_uc + "</option>");
		$("#Dev_CC").append("<option value='" + results.rows.item(i).id + "'>" + results.rows.item(i).dev_cc + "</option>");
	}
	$("#Dev_CC").selectmenu('refresh');
	$("#Dev_UC").selectmenu('refresh');
	UcOrCcChange();
}

function querySuccess(tx, results) {
	var len = results.rows.length;
	console.log("Returned rows = " + len);
	fileOutMsg = "";
	for (var i = 0; i < len; i++) {
		//console.log("Row = " + i + " uc =  " + results.rows.item(i).dev_uc + " ID = " + results.rows.item(i).dev_id);
		fileOutMsg += "{[UC]" + results.rows.item(i).dev_uc + "[CC]" + results.rows.item(i).dev_cc + "[ID]" + results.rows.item(i).dev_id + "}\n";
	}

	dbTofile();
}

function queryFileSuccess(tx, results) {
	Project_fileUrl = "";
	var len = results.rows.length;
	for (var i = 0; i < len; i++) {
		console.log(results.rows.item(i).file_url);
		Project_fileUrl = results.rows.item(i).file_url;
	}
	if (Project_fileUrl.length > 0) {//有保存路径
		var lastpos1 = Project_fileUrl.lastIndexOf('/');
		var lastpos2 = Project_fileUrl.lastIndexOf('.');
		var preUrl = Project_fileUrl.substring(0, lastpos1 + 1);
		var nameurl = "";
		if (lastpos2 > lastpos1) {
			nameurl = Project_fileUrl.substring(lastpos1 + 1, lastpos2) + "_导出" + Project_fileUrl.substring(lastpos2);
			Project_fileUrl = preUrl + nameurl;
		} else {
			nameurl = "默认工程_导出.txt";
			Project_fileUrl =  nameurl;
		}
		
		console.log(Project_fileUrl);
		queryToFile();
		//查找需要导出的数据
	} else {
		alert("未指定保存路径！");
	}
}

function queryFileError() {
	alert("未指定保存路径！");
}

function updateDB(tx) {
	var id_str = $("#Dev_ID").val();
	var uc_str = $("#Dev_UC").find("option:selected").text();
	var updatesql = "UPDATE DEVICEINFO SET dev_id = '" + id_str + "' WHERE dev_uc = '" + uc_str + "'";
	console.log(updatesql);
	tx.executeSql(updatesql, [], successSave, errorCB);
}

function saveDB(tx) {
	db.transaction(updateDB, errorCB);
}

function database_create() {
	db.transaction(populateDB, errorCB);
}

function queryToFile() {
	db.transaction(queryDB, errorCB);
}

function UcOrCcChange() {
	db.transaction(queryChange, errorCB);
}

function database_init() {
	db = window.openDatabase("Database", "1.0", "PhoneGap DEVICE", 500000);
	db.transaction(initDB, errorCB);
}

function queryFileUrl() {
	db.transaction(queryFileDB, errorCB);
}