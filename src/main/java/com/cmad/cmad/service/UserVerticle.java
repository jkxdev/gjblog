package com.cmad.cmad.service;

import org.mongodb.morphia.dao.BasicDAO;
import org.mongodb.morphia.query.Query;

import com.cmad.cmad.infra.MongoService;
import com.cmad.cmad.model.UserDetail;
import com.cmad.cmad.model.dto.LoginDTO;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.Json;

public class UserVerticle extends AbstractVerticle {

	
	@Override
	public void start() throws Exception {
		vertx.eventBus().consumer("com.cisco.cmad.projects.login", message -> {
			LoginDTO loginData = Json.decodeValue(message.body().toString(), LoginDTO.class);
			System.out.println("UserVerticle.start()"+loginData);
			
			System.out.println("UserVerticle.start() userbname"+loginData.getUsername());
			System.out.println("UserVerticle.start() pwd "+loginData.getPwd());
			BasicDAO<UserDetail, String> dao = new BasicDAO<>(UserDetail.class, MongoService.getDataStore());
			Query<UserDetail> query=dao.createQuery();
			query.and(
					query.criteria("username").equal(loginData.getUsername()),
					query.criteria("pwd").equal(loginData.getPwd()));
			UserDetail user =query.get();
				MongoService.close();
			if(user==null){
				message.reply("No User Found");
			}else{
				message.reply(Json.encodePrettily(user));
			}
			
			/*dao.createQuery().*/
		});
		
		vertx.eventBus().consumer("com.cisco.cmad.projects.register", message -> {
			System.out.println("UserVerticle.start() register ");
			UserDetail regData = Json.decodeValue(message.body().toString(), UserDetail.class);
			if(regData!=null){
				System.out.println("UserVerticle.start()getFullName "+regData.getFullName());
				System.out.println("UserVerticle.start()pwd "+regData.getPwd());
				System.out.println("UserVerticle.start() usrName"+regData.getUsername());
				System.out.println("UserVerticle.start() phone number"+regData.getPhno());
			}
			BasicDAO<UserDetail, String> dao = new BasicDAO<>(UserDetail.class, MongoService.getDataStore());
			dao.save(regData);
			/*Query<UserDetail> query=dao.createQuery();
			query.
			query.and(
					query.criteria("username").equal(loginData.getUsername()),
					query.criteria("pwd").equal(loginData.getPwd()));*/
			Object user =dao.save(regData).getId();/*query.get()*/;
				MongoService.close();
			if(user==null){
				message.reply("No User created");
			}else{
				message.reply(Json.encodePrettily(user));
			}
			
			/*dao.createQuery().*/
		});
	}
}
