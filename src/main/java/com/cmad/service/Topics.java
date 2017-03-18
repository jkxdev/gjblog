package com.cmad.service;

public interface Topics {

	/////////Verticle1
	public static String REGISTRATION = "com.cisco.cmad.projects.registration";
	
	public static String PROFILE_UPDATE = "com.cisco.cmad.projects.profileupdate";
	
	public static String GET_USER_INFO = "com.cisco.cmad.projects.profileget";

	/////////Verticle2
	public static String LOGIN = "com.cisco.cmad.projects.login";
	
	public static String LOGOUT = "com.cisco.cmad.projects.logout";
	
	/////////Verticle3
	public static String CREATE_NEW_BLOG = "com.cisco.cmad.projects.createnewblog";
	
	public static String GET_RECENT_BLOG_WITH_COMMENTS = "com.cisco.cmad.projects.getrecentblogwithcomments";
	
	public static String GET_FAV_BLOGS_LIST = "com.cisco.cmad.projects.getfavblogs";

	public static String GET_BLOG_WITH_COMMENTS = "com.cisco.cmad.projects.getblogwithcomments";
	
	public static String SEARCH_BLOGS = "com.cisco.cmad.projects.searchblogs";
	
	public static String UPDATE_COMMENTS = "com.cisco.cmad.projects.updatecomment";
	////////// Authentication
	public static String VALIDATE = "com.cisco.cmad.projects.authenticate";
}
