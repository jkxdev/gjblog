package com.cmad.cmad.service;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;

public class MainVerticle extends AbstractVerticle {
	
@Override
public void start(Future<Void> future) throws Exception {
//	System.out.println("starting...");
//	Router router = Router.router(vertx);
//	vertx.deployVerticle(UserVerticle.class.getName(), new DeploymentOptions().setWorker(true));
//	router.route("/about").handler(rctx -> {
//		HttpServerResponse response = rctx.response();
//		response.putHeader("content-type", "text/html")
//				.end("<h1>Hello from my first Vert.x 3 application via routers</h1>");
//	});
//	router.route("/*").handler(StaticHandler.create("spiderman"));
//	//router.route("/static/*").handler(StaticHandler.create("web"));
//	router.route("/api/user/registeration").handler(BodyHandler.create());
//	router.post("/api/user/registeration").handler(rctx -> {
//		System.out.println("MainVerticle.start() inside register ");
//		String name = rctx.request().getParam("name");
//		String pwd= rctx.request().getParam("pwd");
//		System.out.println("MainVerticle.start() name "+name);
//		System.out.println("MainVerticle.start()pwd "+pwd);
//		//final DictionaryItem item = new DictionaryItem(name,"dummy","anonym");
//		vertx.eventBus().send("com.cisco.cmad.projects.register", rctx.getBodyAsJson(), r -> {
//			System.out.println("MainVerticle.start() register message "+r.result().body().toString());
//			rctx.response().setStatusCode(200).end(r.result().body().toString());
//		});
//		/*rctx.response().setStatusCode(200).putHeader("content-type", "application/json; charset=utf-8")
//				.end();*/
//	});
//	router.route("/api/login").handler(BodyHandler.create());
//	router.post("/api/login").handler(rctx -> {
//		vertx.eventBus().send("com.cisco.cmad.projects.login", rctx.getBodyAsJson(), r -> {
//			System.out.println("MainVerticle.start() message "+r.result().body().toString());
//			rctx.response().setStatusCode(200).end(r.result().body().toString());
//		});
//	});
//
//	vertx.createHttpServer().requestHandler(router::accept).listen(config().getInteger("http.port", 8080),
//			result -> {
//				if (result.succeeded()) {
//					future.complete();
//				} else {
//					future.fail(result.cause());
//				}
//			});
}
public static void main(String[] args) {

	System.out.println("starting...");
	Vertx vertx = Vertx.vertx();
	Router router = Router.router(vertx);
	vertx.deployVerticle(UserVerticle.class.getName(), new DeploymentOptions().setWorker(true));
	router.route("/about").handler(rctx -> {
		HttpServerResponse response = rctx.response();
		response.putHeader("content-type", "text/html")
				.end("<h1>Hello from my first Vert.x 3 application via routers</h1>");
	});
	router.route("/*").handler(StaticHandler.create("spiderman"));
	//router.route("/static/*").handler(StaticHandler.create("web"));
	router.route("/api/user/registeration").handler(BodyHandler.create());
	router.post("/api/user/registeration").handler(rctx -> {
		System.out.println("MainVerticle.start() inside register ");
		String name = rctx.request().getParam("name");
		String pwd= rctx.request().getParam("pwd");
		System.out.println("MainVerticle.start() name "+name);
		System.out.println("MainVerticle.start()pwd "+pwd);
		//final DictionaryItem item = new DictionaryItem(name,"dummy","anonym");
		vertx.eventBus().send("com.cisco.cmad.projects.register", rctx.getBodyAsJson(), r -> {
			System.out.println("MainVerticle.start() register message "+r.result().body().toString());
			rctx.response().setStatusCode(200).end(r.result().body().toString());
		});
		/*rctx.response().setStatusCode(200).putHeader("content-type", "application/json; charset=utf-8")
				.end();*/
	});
	router.route("/api/login").handler(BodyHandler.create());
	router.post("/api/login").handler(rctx -> {
		vertx.eventBus().send("com.cisco.cmad.projects.login", rctx.getBodyAsJson(), r -> {
			System.out.println("MainVerticle.start() message "+r.result().body().toString());
			rctx.response().setStatusCode(200).end(r.result().body().toString());
		});
	});
	vertx.createHttpServer().requestHandler(router::accept).listen(8080);
//	,
//			result -> {
//				if (result.succeeded()) {
////					future.complete();
//				} else {
////					future.fail(result.cause());
//				}
//			});
//
}

}
