package com.geraldo.playlistscrambler;


import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.SpotifyHttpManager;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.specification.Paging;
import com.wrapper.spotify.model_objects.specification.PlaylistSimplified;
import com.wrapper.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;

@RestController
public class PlaylistScramblerRestController {


    private static final String clientId = "0c7e3c1bdf0f46f2bdbae0cad862fcff";
    private static final String clientSecret = "d46b6e83415b48e8833da79437e4f3cd";
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/spotifyReturn");

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientId)
            .setClientSecret(clientSecret)
            .setRedirectUri(redirectUri)
            .build();


    @GetMapping("/fetchPlaylist")
    public Paging<PlaylistSimplified> spotifyReturn(@RequestParam String token) {
        System.out.println("token: " + token);

        Paging<PlaylistSimplified> playlistSimplifiedPaging = null;

        try {

            // Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(token);


            GetListOfCurrentUsersPlaylistsRequest getListOfCurrentUsersPlaylistsRequest = spotifyApi
                    .getListOfCurrentUsersPlaylists()
                    .build();

            playlistSimplifiedPaging = getListOfCurrentUsersPlaylistsRequest.execute();


            System.out.println("Total: " + playlistSimplifiedPaging.getTotal());
            System.out.println("Playlists:");
            for (PlaylistSimplified p : playlistSimplifiedPaging.getItems()) {
                System.out.println(p.getName());
            }


        } catch (IOException | SpotifyWebApiException e) {
            System.out.println("Error: " + e.getMessage());
        }

        return playlistSimplifiedPaging;

    }


}
