package com.cmad.auth;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class keyset {
	
	private static String sKey= null;
	public static String getSecret(){
		SecretKey secretKey= null;
		if(null == sKey) {
			try {
				secretKey = KeyGenerator.getInstance("AES").generateKey();
				System.out.println("keyset.getSecret() secretKey :"+ secretKey);
			} catch (NoSuchAlgorithmException e) {
				e.printStackTrace();
			}
			sKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());
		}
		// get base64 encoded version of the key
		System.out.println("keyset.getSecret() key : "  + sKey);
		return sKey;
	}
}
