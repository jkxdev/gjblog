package com.cmad.service;

import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.dao.BasicDAO;
import org.mongodb.morphia.mapping.Mapper;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.Sort;
import org.mongodb.morphia.query.UpdateOperations;
import org.mongodb.morphia.query.UpdateResults;

import com.cmad.infra.MongoService;
import com.cmad.model.Blog;
import com.cmad.model.UserDetail;
import com.cmad.model.dto.CommentDTO;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;

/*
 * Takes care of following use cases
 * 1. Creation of new blog
 * 2. Fetching a blog along with comments when client sends blog-id
 * 3. Fetching recent blog along with comments when user logs in to show in Home/Landing page
 * 4. Fetching favorite blogs of an user based on his area of interest
 * 5. Adding comments to an existing blog 
 */
public class BlogVerticle  extends AbstractVerticle {

	public void start() throws Exception {
		//To create a new blog
		handleNewBlogCreation();
		
		//To fetch recent blog available in DB
		//handleFetchRecentBlog();
		
		//To fetch favorite blogs 
		handleFetchFavoriteBlogsList();
		
		//To fetch a existing blog when client passes blog-id
		handleFetchBlog();
		
		//To update comments on existing blogs
		handleUpdateComments();
		
		//To fetch a list of blogs based on title match or area-of-interest/flag match
		handleSearchBlog();
	}

	/*
	 * To create a new blog
	 */
	private void handleNewBlogCreation() {
		vertx.eventBus().consumer(Topics.CREATE_NEW_BLOG, message -> {
			System.out.println("BlogVerticle.handleNewBlogCreation() inside --> "+message.body().toString());
			Blog newBlog = Json.decodeValue(message.body().toString(), Blog.class);
			if(newBlog != null){
				System.out.println("BlogVerticle.handleNewBlogCreation() newBlog= "+newBlog.toString());
				System.out.println("BlogVerticle.handleNewBlogCreation() newBlog.getBlogContent() "+newBlog.getBlogContent());
			}

			Datastore dataStore = MongoService.getDataStore();
			
			//Performing validations
			if(!isValidBlog(message, newBlog))
				return;

			BasicDAO<Blog, String> dao = new BasicDAO<>(Blog.class, dataStore);
			Object blog = dao.save(newBlog);

			MongoService.close();
			System.out.println("BlogVerticle.handleNewBlogCreation() blog = "+blog);
			System.out.println("BlogVerticle.handleNewBlogCreation() blog class = "+blog.getClass());
			if(blog == null){
				message.fail(404, "X. No Blog created");
			}else{
				message.reply(Json.encodePrettily(blog));
			}
		});
	}

	/*
	 * To fetch recent blog available in DB
	 */
	private Blog handleFetchRecentBlog() {
		Blog recentBlog = null;
	
		Datastore datastore = MongoService.getDataStore();
		
		final Query<Blog> blogFetchQuery = datastore.createQuery(Blog.class).order(Sort.descending("blogCreatedTimeStamp"));
				
		final List<Blog> blogs = blogFetchQuery.asList();
		System.out.println("BlogVerticle.handleFetchRecentBlog() blogs = "+blogs);

		recentBlog = null;
		if(blogs != null && blogs.size() > 0)	{
			recentBlog = blogs.get(0);
		}
		MongoService.close();
		System.out.println("BlogVerticle.handleFetchBlog() recentBlog = "+recentBlog);
			
		return recentBlog;

	}

	/*
	 * To fetch favorite blogs 
	 */
	private void handleFetchFavoriteBlogsList() {
		vertx.eventBus().consumer(Topics.GET_FAV_BLOGS_LIST, message -> {
//			System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() message="+message);
//			System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() message.body()="+message.body());
			String userId = message.body().toString();
			System.out.println("BlogVerticle.handleFetchBlog() inside --> userId = "+userId);

			Datastore datastore = MongoService.getDataStore();
			final Query<UserDetail> userDetailQuery = datastore.createQuery(UserDetail.class).field("username").equal(userId);
			UserDetail user  = userDetailQuery.get();
			
			System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() $$$$$$---------> user= "+user);
			
			if(user != null)	{
				
				/////
				String areaOfInterest = user.getAreaofinterest();
				List<Blog> favBlogsList = null;
				System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() user.getAreaofinterest() = "+user.getAreaofinterest());
				if(null != areaOfInterest) {
					StringTokenizer tokeNizer = new StringTokenizer(areaOfInterest, ",");
				
					
					while(tokeNizer.hasMoreTokens())	{
						String nextToken = tokeNizer.nextToken();
						final Query<Blog> favBlogsFetchQuery = datastore.createQuery(Blog.class)
								.field("blogAreaOfInterest").contains(nextToken);
						final List<Blog> tempFavBlogs = favBlogsFetchQuery.asList();
	//					System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() tokeNizer.nextToken() = "+nextToken);
	//					System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() tempFavBlogs.size() = "+tempFavBlogs.size());
						if(favBlogsList == null)	{
							favBlogsList = tempFavBlogs;
						}else	{
							for (Blog blog : tempFavBlogs) {
								favBlogsList.add(blog);
							}
						}
					}
				}
				
//				System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() favBlogsList = "+favBlogsList);
//				if(favBlogsList != null)	{
//					System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() size of favBlogsList = "+favBlogsList.size());
//				}
				if(null != favBlogsList) {
/*					Set<Blog> favBlogs = new HashSet<Blog>(favBlogsList);
					if(favBlogs == null || favBlogs.size() <= 0)	{
						message.fail(404, "No Favorite blogs available");
					}	else	{
						System.out.println("BlogVerticle.handleFetchFavoriteBlogsList() favBlogs.size()= "+favBlogs.size());
						Hashtable results = new Hashtable();
						Blog tempBlog;
						Iterator favBlogIterator = favBlogs.iterator();
						while(favBlogIterator.hasNext())	{
							tempBlog = (Blog) favBlogIterator.next();
							results.put(tempBlog.getBlog_id(), tempBlog.getBlogTitle());
						}
						message.reply(Json.encodePrettily(results));
					}		
					*/
					message.reply(Json.encodePrettily(favBlogsList));
				}
				else {
					message.fail(404, "No Favorite blogs available");
				}
			}
//			message.reply(Json.encodePrettily(blogs));
			MongoService.close();
		});
	}

	/*
	 * To fetch a existing blog when client passes blog-id
	 */
	@SuppressWarnings("unused")
	private void handleFetchBlog() {
		vertx.eventBus().consumer(Topics.GET_BLOG_WITH_COMMENTS, message -> {
			String blodId = message.body().toString();
			System.out.println("BlogVerticle.handleFetchBlog() inside --> blodId = "+blodId);
			Blog actualBlog  = null;
			if(blodId.equals("latest")) {
				actualBlog = handleFetchRecentBlog();
			}
			else {
				Datastore datastore = MongoService.getDataStore();
				
				final Query<Blog> blogFetchQuery = datastore.createQuery(Blog.class)
						.field(Mapper.ID_KEY).equal(blodId);
				actualBlog  = blogFetchQuery.get();
				MongoService.close();
			}
			if(actualBlog == null)	{
				message.fail(404, "X. Blog with id "+blodId+" is not available");
			}	else	{
				System.out.println("BlogVerticle.handleFetchBlog() actualBlog = "+actualBlog);
				System.out.println("BlogVerticle.handleFetchBlog() its comments = "+actualBlog.getComments());
				message.reply(Json.encodePrettily(actualBlog));
			}

			
		});
	}

	/*
	 * To update comments on existing blogs
	 */
	private void handleUpdateComments() {
		vertx.eventBus().consumer(Topics.UPDATE_COMMENTS, message -> {
			String blogId = (String) ((JsonObject)message.body()).getValue("blogId");
			JsonObject comData = (JsonObject) ((JsonObject)message.body()).getValue("commentData");
			CommentDTO commentDTO = Json.decodeValue(comData.toString(), CommentDTO.class);

			Datastore dataStore = MongoService.getDataStore();
			
			//Performing validations
			if(!isValidComment(message, commentDTO))
				return;
			
///////
			Query query = dataStore.createQuery(Blog.class).field("blog_id").equal(blogId);
			
			UpdateOperations ops = dataStore.createUpdateOperations(Blog.class)
					.push("comments", commentDTO);

			UpdateResults results = dataStore.update(query, ops, false);
///////			
			
			MongoService.close();

			if(results == null || results.getUpdatedCount() <= 0){
				message.fail(404, "Pr2. No Record updated as there is no blog with id "+blogId);
			}else{
				System.out.println("BlogVerticle.handleUpdateComments() ");
				final Query<Blog> outQuery = dataStore.createQuery(Blog.class)
						.field(Mapper.ID_KEY).equal(blogId);
				final Blog actualBlog  = outQuery.get();
				message.reply(Json.encodePrettily(actualBlog));
			}
		});
	}
	
	private boolean isValidBlog(Message<Object> message, Blog newBlog) {
		boolean isValidBlog = true;
		 if(newBlog.getBlogTitle() == null || newBlog.getBlogTitle() == "")	{
				System.out.println("BlogVerticle.isValidBlog() Blog Title can't be empty");
				message.fail(404, "B1. Blog Title can't be empty");
				isValidBlog = false;
			} else if(newBlog.getBlogContent() == null || newBlog.getBlogContent() == "")	{
				System.out.println("BlogVerticle.isValidBlog() Blog content can't be empty");
				message.fail(404, "B2. Blog content can't be empty");
				isValidBlog = false;
			} else if(newBlog.getBlogAuthorUsername() == null || newBlog.getBlogAuthorUsername() == "")	{
				System.out.println("BlogVerticle.isValidBlog() Blog Author can't be empty");
				message.fail(404, "B3. Blog Author can't be empty");
				isValidBlog = false;
			} else if(newBlog.getBlogAreaOfInterest() == null || newBlog.getBlogAreaOfInterest() == "")	{
				System.out.println("BlogVerticle.isValidBlog() Blog AreaOfInterest can't be empty");
				message.fail(404, "B4. Blog AreaOfInterest can't be empty");
				isValidBlog = false;
			}
		 return isValidBlog;
	}
	
	private boolean isValidComment(Message<Object> message, CommentDTO commentDTO) {
		boolean isValidBlog = true;
		 /*if(commentDTO.getBlog_id() == null || commentDTO.getBlog_id() == "")	{
				System.out.println("BlogVerticle.isValidComment() Blog Id can't be empty");
				message.fail(404, "C1. Blog Id can't be empty");
				isValidBlog = false;
			} else */if(commentDTO.getCommentAuthorUsername() == null || commentDTO.getCommentAuthorUsername() == "")	{
				System.out.println("BlogVerticle.isValidComment() Comment author can't be empty");
				message.fail(404, "C2. Comment author can't be empty");
				isValidBlog = false;
			} else if(commentDTO.getCommentText() == null || commentDTO.getCommentText() == "")	{
				System.out.println("BlogVerticle.isValidComment() Comment Text can't be empty");
				message.fail(404, "C3. Comment Text can't be empty");
				isValidBlog = false;
			}
		 return isValidBlog;
	}

	/*
	 * To blogs where title or area-of-interest/tag matches
	 */
	private void handleSearchBlog() {
		vertx.eventBus().consumer(Topics.SEARCH_BLOGS, message -> {
			System.out.println("BlogVerticle.handleSearchBlog() message="+message);
			System.out.println("BlogVerticle.handleSearchBlog() message.body()="+message.body());
			String serarchTxt = message.body().toString();
			System.out.println("BlogVerticle.handleSearchBlog() inside --> serarchTxt = "+serarchTxt);

			Datastore datastore = MongoService.getDataStore();
			final Query<Blog> titleBasedSearchQuery = datastore.createQuery(Blog.class)
					.field("blogTitle").contains(serarchTxt);
			final List<Blog> titleBasedBlogsList = titleBasedSearchQuery.asList();
			System.out.println("BlogVerticle.handleSearchBlog() searcBlogsList = "+titleBasedBlogsList);
			if(titleBasedBlogsList != null)	{
				System.out.println("BlogVerticle.handleSearchBlog() size of searcBlogsList = "+titleBasedBlogsList.size());
			}
			
			final Query<Blog> tagBasedSearchQuery = datastore.createQuery(Blog.class)
					.field("blogAreaOfInterest").contains(serarchTxt);
			final List<Blog> tagBasedBlogsList = tagBasedSearchQuery.asList();
			System.out.println("BlogVerticle.handleSearchBlog() tagBasedBlogsList = "+tagBasedBlogsList);
			if(tagBasedBlogsList != null)	{
				System.out.println("BlogVerticle.handleSearchBlog() size of tagBasedBlogsList = "+tagBasedBlogsList.size());
				for(Blog tagBlog : tagBasedBlogsList)	
				{
					tagBlog.stripContentAt(120);
				}
			}
			
//			Set<Blog> finalBlogsSet = new HashSet(titleBasedBlogsList);
//			
//			if(finalBlogsSet == null || finalBlogsSet.isEmpty())	
//			{
//				finalBlogsSet = new HashSet(tagBasedBlogsList);
//			}	
//			else	
//			{
//				for(Blog tagBlog : tagBasedBlogsList)	
//				{
//					finalBlogsSet.add(tagBlog);
//				}
//			}
			/////
			
//			if(finalBlogsSet == null || finalBlogsSet.size() <= 0)	{
//				message.fail(404, "No Blog blogs available based on search criteria");
//			}
			if(tagBasedBlogsList == null || tagBasedBlogsList.size() <=0){
				message.fail(404, "No Blog blogs available based on search criteria");
			}
			else
			{
				//Hashtable results = new Hashtable();
				//for(Blog blog : finalBlogsSet)	{
					//results.put(blog.getBlog_id(), blog.getBlogTitle(),blogstr);
				//}
				//message.reply(Json.encodePrettily(results));
				//message.reply(Json.encodePrettily(finalBlogsSet));
				message.reply(Json.encodePrettily(tagBasedBlogsList));
			}				
//			message.reply(Json.encodePrettily(blogs));
			MongoService.close();
		});
	}
	
}
