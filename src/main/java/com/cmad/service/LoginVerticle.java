package com.cmad.service;

import org.mongodb.morphia.dao.BasicDAO;
import org.mongodb.morphia.query.Query;
import com.cmad.auth.AuthData;
import com.cmad.infra.MongoService;
import com.cmad.model.UserDetail;
import com.cmad.model.dto.LoginDTO;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.Json;

public class LoginVerticle extends AbstractVerticle {

	 
	@Override
	public void start() throws Exception {
		handleLogin();
		handleLogout();
	}

	private void handleLogin() {
		vertx.eventBus().consumer(Topics.LOGIN, message -> {
			LoginDTO loginData = Json.decodeValue(message.body().toString(), LoginDTO.class);
			
			String retstr = null;
			System.out.println("LoginVerticle.start()"+loginData);
			
			System.out.println("LoginVerticle.start() userbname"+loginData.getUsername());
			System.out.println("LoginVerticle.start() pwd "+loginData.getPwd());
			BasicDAO<UserDetail, String> dao = new BasicDAO<>(UserDetail.class, MongoService.getDataStore());
			Query<UserDetail> query=dao.createQuery();
			query.and(
					query.criteria("username").equal(loginData.getUsername()),
					query.criteria("pwd").equal(loginData.getPwd()));
			UserDetail user =query.get();
				MongoService.close();
			if(user==null){
				System.out.println("LoginVerticle.start() user not found ");
			}else{
//				message.reply(Json.encodePrettily(user));
				retstr = getAuthData(user);
				System.out.println("LoginVerticle.start() retstr : " + retstr);
				/*retstr = "{ \"tok\" : " + joken + ", \"name\" : " + user.getUsername() + " }";*/
			}
			message.reply(retstr);
			/*dao.createQuery().*/
		});
	}

	private void handleLogout() {
		vertx.eventBus().consumer(Topics.LOGOUT, message -> {
			AuthData aData = Json.decodeValue(message.body().toString(),AuthData.class);
			
			System.out.println("LoginVerticle.start() validate: uname"+aData.getName());
			System.out.println("LoginVerticle.start() validate: tok "+aData.getTok());

			String retstr;
			if(aData.validate()){
				retstr = "{\"status\" : \"Error\", \"Errorcode\" : \"Invalid Token\"}";
			}else{
				retstr = "{ \"status\" : \"ok\"}";
			}
			message.reply(retstr);
		});
	}
	private String getAuthData(UserDetail user){
		AuthData joken = new AuthData();
		joken.setName(user.getUsername());
		joken.makeLongUserJoken();
		joken.validate();
		return Json.encodePrettily(joken);
	}
}
