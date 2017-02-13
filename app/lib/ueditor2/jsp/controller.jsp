<%@ page language="java" contentType="text/html; charset=UTF-8"
	import="com.baidu.ueditor.*,java.util.*,com.baidu.ueditor.upload.*,com.baidu.ueditor.define.*,com.baidu.ueditor.PathFormat,org.apache.commons.codec.binary.Base64,java.io.*,com.baidu.ueditor.define.ActionMap,com.baidu.ueditor.define.*"
    pageEncoding="utf-8"%>
	
<%
    request.setCharacterEncoding( "utf-8" );
	response.setHeader("Content-Type" , "text/html");
	
	String rootPath = application.getRealPath( "/" );
	
	// 网上粘贴图片不需要上传
	String actionType = request.getParameter("action");
	if("catchimage".equalsIgnoreCase(actionType)){
		//System.out.println("~~~~~~~~~~~~~~~~~粘贴来自外网的图片~~~~~~~~~~~~~~~~~~~~");
		out.write("");
		return;
	}
	// 上传图片直接上传到服务器
	if("uploadimage".equalsIgnoreCase(actionType)){
		//System.out.println("~~~~~~~~~~~~~~~~~手动上传图片~~~~~~~~~~~~~~~~~~~~");
		//request.getRequestDispatcher("/system/file_upload_dowith_ueditor.jsp?ResponseType=2&FileParamName=upfile").forward(request,response);
		request.getRequestDispatcher("/openapi/uploadImageForEditor").forward(request,response);
		return;
	}
	if("uploadfile".equalsIgnoreCase(actionType)){
		//System.out.println("~~~~~~~~~~~~~~~~~手动上传附件~~~~~~~~~~~~~~~~~~~~");
		//request.getRequestDispatcher("/system/file_upload_dowith_ueditor.jsp?ResponseType=2&FileParamName=upfile").forward(request,response);
		request.getRequestDispatcher("/openapi/uploadImageForEditor").forward(request,response);
		return;
	}
	out.write( new ActionEnter( request, rootPath ).exec() );
%>
