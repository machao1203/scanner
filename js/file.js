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
var Project_fileUrl = "";
var fileOutMsg;
function gotFileEntry(fileEntry) {
    Project_fileUrl = fileEntry.fullPath;
    console.log(Project_fileUrl);
    var firstLen = Project_fileUrl.lastIndexOf(":");
	//Project_fileUrl = decodeURI(fileURI.substring(firstLen+1));
	Project_fileUrl = Project_fileUrl.substring(firstLen+1);
	console.log(Project_fileUrl);
	fileEntry.file(gotFile, fail);
}

function fail(evt) {
	console.log(evt.target.error);
	alert("操作失败");
}

function gotFile(file) {
	readAsText(file);
}

function readAsText(file) {
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		console.log("Read as text");
		fileText = evt.target.result;
		database_create();
	};
	reader.readAsText(file);
}

var fileIn = function() {
	//
	var source = navigator.camera.PictureSourceType.PHOTOLIBRARY;
	//描述类型，取文件路径
	var destinationType2 = navigator.camera.DestinationType.FILE_URI;
	//媒体类型，设置为ALLMEDIA即支持任意文件选择
	var mediaType2 = navigator.camera.MediaType.ALLMEDIA;
	var options = {
		quality : 50,
		destinationType : destinationType2,
		sourceType : source,
		mediaType : mediaType2
	};
	navigator.camera.getPicture(downloadFile, null, options);
};

function gotFS(fileSystem) {
	fileSystem.root.getFile(Project_fileUrl, {
		create : true,
		exclusive : false
	}, gotOutFileEntry, fail);
};
function downloadFile(fileURI) {
   
	window.resolveLocalFileSystemURI(fileURI, gotFileEntry, fail);
};
function gotOutFileEntry(fileEntry) {

	fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
	writer.onwriteend = function(evt) {
		alert("导出工程信息成功！\n 保存至：" + Project_fileUrl);
	};
	//console.log(fileOutMsg);
	writer.write(fileOutMsg);
}
function dbTofile() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}