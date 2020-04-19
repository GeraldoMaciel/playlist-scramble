package com.geraldo.playlistscrambler.controller;


import com.geraldo.playlistscrambler.DTO.PlayList;
import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.specification.Paging;
import com.wrapper.spotify.model_objects.specification.Playlist;
import com.wrapper.spotify.model_objects.specification.PlaylistSimplified;
import com.wrapper.spotify.model_objects.specification.PlaylistTrack;
import com.wrapper.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;
import com.wrapper.spotify.requests.data.playlists.GetPlaylistsTracksRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class PlaylistScramblerRestController {


    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder().build();


    @GetMapping("/fetchPlaylist")
    @CrossOrigin
    public Set<PlayList> spotifyReturn(@RequestParam String token) {
        System.out.println("token: " + token);

        Paging<PlaylistSimplified> playlistSimplifiedPaging = null;
        Set<PlayList> playListSet = null;

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

            playListSet = Arrays.stream(playlistSimplifiedPaging.getItems()).map(pl -> new PlayList(pl.getId(), pl.getName())).collect(Collectors.toSet());


        } catch (IOException | SpotifyWebApiException e) {
            System.out.println("Error: " + e.getMessage());
        }

        return playListSet;

    }

    @GetMapping("/generateRandomizedPlaylist")
    @CrossOrigin
    public List<String> generateRandomizedPlaylist(@RequestParam String token, @RequestParam String[] playlistArray) throws IOException, SpotifyWebApiException {

        System.out.println("Generating randomized playlist from playlists: " + playlistArray );
        final int numberOfTracksOnRandomizedPlaylist = 10;

        List<PlaylistTrack[]> playlistList = new ArrayList<>();

        List<String> randomizedTrackList = new ArrayList<>(10);


        for (String playListId : playlistArray) {
            Paging<PlaylistTrack> playListTraks = spotifyApi.getPlaylistsTracks(playListId).build().execute();
            playlistList.add(playListTraks.getItems());
        }

        Random random = new Random();
        while (randomizedTrackList.size() < 10){
            int randomPlayListIndex = random.nextInt(playlistList.size()-1);

            PlaylistTrack[] playlistTrackArray =  playlistList.get(randomPlayListIndex);

            int randomTrackIndex = random.nextInt(playlistTrackArray.length-1);

            System.out.println("Including track " + playlistTrackArray[randomTrackIndex].getTrack().getName());

            randomizedTrackList.add(playlistTrackArray[randomTrackIndex].getTrack().getUri());
        }

        return randomizedTrackList;

    }


}
