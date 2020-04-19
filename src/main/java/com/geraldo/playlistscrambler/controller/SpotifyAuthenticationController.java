package com.geraldo.playlistscrambler.controller;


import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.SpotifyHttpManager;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import com.wrapper.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import com.wrapper.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;

@Controller
public class SpotifyAuthenticationController {


    private static final String clientId = "0c7e3c1bdf0f46f2bdbae0cad862fcff";
    private static final String clientSecret = "d46b6e83415b48e8833da79437e4f3cd";
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/spotifyReturn");

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientId)
            .setClientSecret(clientSecret)
            .setRedirectUri(redirectUri)
            .build();


    private static final AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
//          .state("x4xkmn9pu3j6ukrs8n")
//          .scope("user-read-birthdate,user-read-email")
//          .show_dialog(true)
            .build();





    @GetMapping("/")
    public RedirectView authenticationCodeFlow() throws MalformedURLException {
        final URI uri = authorizationCodeUriRequest.execute();

        System.out.println("url: " + uri.toURL().toString());
       // return uri.toURL().toString();
        return new RedirectView( uri.toURL().toString());
    }

    @GetMapping("/spotifyReturn")
    public String spotifyReturn(@RequestParam String code) {
        System.out.println("code: " + code);

        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                .build();

        AuthorizationCodeCredentials authorizationCodeCredentials = null;
        try {
             authorizationCodeCredentials = authorizationCodeRequest.execute();

//            // Set access and refresh token for further "spotifyApi" object usage
//            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
//            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());
//
//            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
//
//
//            GetListOfCurrentUsersPlaylistsRequest getListOfCurrentUsersPlaylistsRequest = spotifyApi
//                    .getListOfCurrentUsersPlaylists()
//                    .build();
//
//            final Paging<PlaylistSimplified> playlistSimplifiedPaging = getListOfCurrentUsersPlaylistsRequest.execute();
//
//
//            System.out.println("Total: " + playlistSimplifiedPaging.getTotal());
//            System.out.println("Playlists:");
//            for (PlaylistSimplified p : playlistSimplifiedPaging.getItems()){
//                System.out.println(p.getName());
//            }
//
//
        } catch (IOException | SpotifyWebApiException e) {
            System.out.println("Error: " + e.getMessage());
        }

        return "redirect:/index.html?token="+ authorizationCodeCredentials.getAccessToken();

    }


}
