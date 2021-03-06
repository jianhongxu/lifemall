cacheFileList = new Array();
function getImageSrc(element_node,img_src) {
//	var filename_hash = CryptoJS.MD5(img_src);  
	if(cacheFileList.length !=0){
		////console.log("cacheFileList is "+cacheFileList.length+"&content is:"+cacheFileList.toLocaleString() );
		createDownload(setImgSrc,element_node,img_src);
	}
//	else if(sessionStorage.getItem("cacheFileList") != null){
//		////console.log("cacheFileList array is null" );
//		cacheFileList = sessionStorage.getItem("cacheFileList").split(",");
//		////console.log("cacheFileList storage is "+cacheFileList.length+"&content is:"+cacheFileList.toLocaleString() );
//		createDownload(setImgSrc,element_node,img_src);
//	}
	else{
//		////console.log("cacheFileList is null" );
		getFileList(setImgSrc,element_node,img_src);
	}
}
function setImgSrc(element_node,img_src){
//	img_open(img_src)
	var img_path = plus.io.convertLocalFileSystemURL( img_src );
	////console.log(img_path)
	element_node.src = img_path;
}

function getFileList(imgHandler,element_node,img_src){
	plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs){
		// fs.root是根目录操作对象DirectoryEntry
		// 创建读取目录信息对象 
		
		var directoryReader = fs.root.createReader();
		directoryReader.readEntries( function( entries ){
			for(var i=0; i < entries.length; i++ ) {
//				////console.log("cache file = "+ entries[i].name );
				cacheFileList.push(entries[i].name);
			} 
//			sessionStorage.setItem("cacheFileList",cacheFileList.toLocaleString());
			createDownload(imgHandler,element_node,img_src);
		}, function ( e ) {
			createDownload(imgHandler,element_node,img_src);
			//console.log( "Read entries failed: " + e.message );
		} );
	});
}
function img_open(img_src){
	plus.io.resolveLocalFileSystemURL( img_src, function( entry ) {
		// 可通过entry对象操作test.html文件 
		entry.file( function(file){
			var fileReader = new plus.io.FileReader();
			//console.log("getFile:" + JSON.stringify(file));
			fileReader.readAsDataURL(file);
			fileReader.onloadend = function(evt) {
//				//console.log("11" + evt);
//				alert("evt.target" + evt.target);
//				alert(evt.target.result);
			}
			//console.log(file.size + '--' + file.name);
		} );
	}, function ( e ) {
		//console.log( "Resolve file URL failed: " + e.message );
	} );
}
function createDownload(imgHandler,element_node,img_src){
	var img_arr = img_src.split("\/");
	////console.log(img_arr); 
	var src_filename = img_arr.pop();
	for(var i=0;i<cacheFileList.length;i++){
		if(src_filename == cacheFileList[i]){
			////console.log("read from cache");
			setImgSrc(element_node,"_downloads"+src_filename);
			return;
		}
	}
//	////console.log("filename_hash = "+filename_hash);
	var dtask = plus.downloader.createDownload( img_src, {}, function ( d, status ) {
		// 下载完成
		if ( status == 200 ) { 
			////console.log( "Download success: " + d.filename );
			var name_arr = d.filename.split("_downloads/")
			////console.log("&&&&&"+name_arr[1]);
			cacheFileList.push(name_arr[1])
			imgHandler(element_node,d.filename);
		} else {
			 //console.log("Download failed: " + status); 
		}  
	});
	//dtask.addEventListener( "statechanged", onStateChanged, false );
	dtask.start(); 
}
function getCreateDownload(imgHandler,element_node,img_src){
	return function(){
	var img_arr = img_src.split("\/");
	////console.log(img_arr); 
	var src_filename = img_arr.pop();
	for(var i=0;i<cacheFileList.length;i++){
		if(src_filename == cacheFileList[i]){
			
			element_node.src = plus.io.PRIVATE_DOC+"/"+src_filename;
			return;
		}
	}
//	////console.log("filename_hash = "+filename_hash);
	var dtask = plus.downloader.createDownload( img_src, {}, function ( d, status ) {
		// 下载完成
		if ( status == 200 ) { 
			////console.log( "Download success: " + d.filename );
			imgHandler(element_node,d.filename);
		} else {
			 //console.log("Download failed: " + status); 
		}  
	});
	//dtask.addEventListener( "statechanged", onStateChanged, false );
	dtask.start(); 
};
}
