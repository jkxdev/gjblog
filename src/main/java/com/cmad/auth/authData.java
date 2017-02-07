package com.cmad.auth;

import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class authData {
	private String name;
	private String tok;
	public authData() {

	}
	public authData(String uname) {
		name = uname;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTok() {
		return tok;
	}
	public void setTok(String tok) {
		this.tok = tok;
	}
	public authData makeBasicUserJoken() {
		tok = createJWT("User",  "basic", 300000);
		return this;
	}
	public  authData makeLongUserJoken() {
		tok = createJWT( "User",  "long", 3600000);
		System.out.println("authData.getLongUserJoken() :" + tok);
		return this;
	}	
	public authData makeAminJoken() {
		tok =  createJWT("Admin",  "long", 300000);
		return this;
	}
	public boolean validate() {
		return validateJoken();
	}
	// create new key
//	private String getSecret(){
//		SecretKey secretKey = null;
//		try {
//			secretKey = KeyGenerator.getInstance("AES").generateKey();
//			System.out.println("jauth.getSecret() secretKey :"+ secretKey);
//		} catch (NoSuchAlgorithmException e) {
//			e.printStackTrace();
//		}
//		String aaaa = Base64.getEncoder().encodeToString(secretKey.getEncoded());
//		// get base64 encoded version of the key
//		System.out.println("authData.getSecret() key : "  + aaaa);
//		return aaaa;
//	}
	
	//Sample method to construct a JWT
	private String createJWT(String issuer, String subject, long ttlMillis) {
	 
	    //The JWT signature algorithm we will be using to sign the token
	    SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
	 
	    long nowMillis = System.currentTimeMillis();
	    Date now = new Date(nowMillis);
	 
	    //We will sign our JWT with our ApiKey secret
	    byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(keyset.getSecret());
	    Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
	 
	    //Let's set the JWT Claims
	    JwtBuilder builder = Jwts.builder().setId(name)
	                                .setIssuedAt(now)
	                                .setSubject(subject)
	                                .setIssuer(issuer)
	                                .signWith(signatureAlgorithm, signingKey);
	 
	    //if it has been specified, let's add the expiration
	    if (ttlMillis >= 0) {
	    long expMillis = nowMillis + ttlMillis;
	        Date exp = new Date(expMillis);
	        builder.setExpiration(exp);
	    }
	 
	    //Builds the JWT and serializes it to a compact, URL-safe string
	    return builder.compact();
	}
	
	//Sample method to validate and read the JWT
	private Claims getJokenClaims(String jwt) {
	 
	    //This line will throw an exception if it is not a signed JWS (as expected)
	    Claims claims = Jwts.parser()         
	       .setSigningKey(DatatypeConverter.parseBase64Binary(keyset.getSecret()))
	       .parseClaimsJws(jwt).getBody();
	    System.out.println("ID: " + claims.getId());
	    System.out.println("Subject: " + claims.getSubject());
	    System.out.println("Issuer: " + claims.getIssuer());
	    System.out.println("Expiration: " + claims.getExpiration());
	    return claims;
	}
	
	private boolean validateJoken() {
		System.out.println("authData.validateJoken()");
		long nowMillis = System.currentTimeMillis();
	    Date now = new Date(nowMillis);
	    System.out.println("now time is : " + now);
	    boolean ret = false;
		Claims claims = getJokenClaims(tok);
		if(null != claims) {
			System.out.println("authData.validateJoken() claims.getExpiration().compareTo(now) : " + claims.getExpiration().compareTo(now)  + "name : " +name);
			if((-1 != claims.getExpiration().compareTo(now)) && 
					(-1 != claims.getId().compareTo(name))) {
				System.out.println("authData.validateJoken() HURRAY");
				ret = true;
			}
		}
		return ret;
	}

}
