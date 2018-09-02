// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '4582d1516a4a4b52926d64dbc67492c8';
const redirectUri = 'http://localhost:8888';
const scopes = [
  'user-top-read',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

function getPlaylist() {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      let url = 'https://api.spotify.com/v1/users/aakash988/playlists/4ChHfpD7bNNlOZtac1gsAt/tracks?offset=279'
      xhr.open("GET", url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
  })
}

function getPlaylist2() {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/users/aakash988/playlists/4ChHfpD7bNNlOZtac1gsAt/tracks?offset=279'
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
}

function getMultiplePlaylist(playlistID) {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      let url = 'https://api.spotify.com/v1/users/aakash988/playlists/' + playlistID + '/tracks?limit=100'
      xhr.open("GET", url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
  })
}

function getPlaylists() {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/me/playlists'
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  })
}

function addToPlaylist(playlistID, trackURIs) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks';
    xhr.open("POST", url + "?uris=" + trackURIs);
    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  })
}


function getArtists (artistList) {
  return new Promise (function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/artists/'
    xhr.open("GET", url + '?ids=' + artistList);
    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function getTopArtists() {
  return new Promise (function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/me/top/artists'
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function getTopSongs() {
  return new Promise (function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/me/top/tracks'
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function trackFeatures(final_track_list) {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      let url = 'https://api.spotify.com/v1/audio-features';
      xhr.open("GET", url + '?ids=' + final_track_list);
      xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

function genres (final_track_list) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/audio-features';
    xhr.open("GET", url + '?ids=' + final_track_list);
    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

  function average (arr) {
  	let sum = arr.reduce(function(a,b) {
  		return a+b
  	})
  	let average = sum/arr.length;
  	return average.toFixed(2);
  }

function createBar (obj) {
  const barFeat = [];
  barFeat.push(obj["acousticness"]);
  barFeat.push(obj["energy"]);
  barFeat.push(obj["danceability"]);
  barFeat.push(obj["valence"]);
  barFeat.push(obj["mode"]);
  barFeat.push(obj["speechiness"]);
  var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: ["Acousticness", "Energy", "Danceability", "Valence", "Mode", "Speechiness"],
          datasets: [{
              //label: 'Audio Features',
              data: barFeat,
              backgroundColor: [
                  'rgba(204, 232, 255, 0.5)',
                  'rgba(153, 210, 255, 0.5)',
                  'rgba(102, 187, 255, 0.5)',
                  'rgba(51, 165, 255, 0.5)',
                  'rgba(0, 142, 255, 0.5)',
                  'rgba(0, 128, 229, 0.5)'
              ],
              borderColor: [
                  'rgba(204, 232, 255, 0.7)',
                  'rgba(153, 210, 255, 0.7)',
                  'rgba(102, 187, 255, 0.7)',
                  'rgba(51, 165, 255, 0.7)',
                  'rgba(0, 142, 255, 0.7)',
                  'rgba(0, 128, 229, 0.7)'
              ],
              borderWidth: 2
          }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: false,
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0,
              suggestedMax: 1
            }
          }]
        },
        title: {
          display: true,
          fontFamily: 'Montserrat',
          fontSize: '20',
          text: 'Audio Features'
        }
      }
  });
}


function createPie (arr) {
  const names = [];
  const percentages = [];
  for (x = 0; x < 7; x++) {
    names.push(arr[x].name);
    percentages.push(arr[x].value.toFixed(2));
  }
  var ctz = document.getElementById("myPieChart").getContext('2d');
  var chart = new Chart(ctz, {
   type: 'pie',
   data: {
      labels: names,
      datasets: [{
         data: percentages,
         backgroundColor: 
          [
          'rgba(204, 232, 255, 0.5)',
          'rgba(153, 210, 255, 0.5)',
          'rgba(102, 187, 255, 0.5)',
          'rgba(51, 165, 255, 0.5)',
          'rgba(0, 142, 255, 0.5)',
          'rgba(0, 128, 229, 0.5)',
          'rgba(0, 114, 204, 0.5)'
          ]
      }]
    },
    options: {
      legend: {
          display: true
      },
      responsive: false,
      title: {
          display: true,
          fontFamily: 'Montserrat',
          fontSize: '20',
          text: 'Genre Distribution'
      }
   }
  })
};


function createScatter (arr) {
  var ctx = document.getElementById("myScatterChart").getContext('2d');
  var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Scatter Dataset',
            backgroundColor: ['rgba(51, 165, 255, 0.7)'],
            data: arr
        }]
    },
    options: {
      legend: {
          display: false
      },
      responsive: false,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
            }]
        },
        title: {
          display: true,
          fontFamily: 'Montserrat',
          fontSize: '20',
          text: 'BPM vs. Key'
      }
    }
});
}


function compareTrackFeatures(obj1, obj2, id) {
    let counter = 0;
    let featureHash = {};
    const featureID = ["acousticness", "danceability", "energy", "valence", "speechiness"];
    for (let x = 0; x < featureID.length; x++) {
      let feature = featureID[x];
      let high = Number(obj1[feature]) + 0.15;
      let low = Number(obj1[feature]) - 0.15;
      if (obj2[feature] !== null && obj2[feature] !== "null" && obj2[feature] !== undefined && obj2[feature] !== "undefined") {
        if (low <= Number(obj2[feature]) && high >= Number(obj2[feature])) {
            counter++;
        }
      }
    }
    if (counter > 3) {
        return obj2.uri;
    }
    else {
      return null;
    }
}

document.getElementById("createDashboard").addEventListener("click", function(){
      document.getElementById("analysisAndCharts").style.visibility="visible";
      document.getElementById("listArtists").style.visibility="visible";
      document.getElementById("listTracks").style.visibility="visible";
      document.getElementById("Averages").style.visibility="visible";
      document.getElementById("createDashboard").style.visibility="hidden";
});

function createList (arr, listType) {
  let listElem = document.createElement(listType);
  for (let x = 0; x < arr.length; x++) {
    let listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(arr[x]));
    listElem.appendChild(listItem)
  }
  return listElem;
}


function dataAnalysis() {
    getTopArtists().then(function(result) {
      const artistsArr = []
      let response = JSON.parse(result);
      for (let x = 0; x < 5; x++) {
        let artistName = artistsArr.push(response.items[x].name);
      }
      let x = createList(artistsArr, "ol");
      document.getElementById("listArtists").appendChild(x);
    })

    getTopSongs().then(function(result) {
      const tracksArr = []
      let response = JSON.parse(result);
      for (let x = 0; x < 5; x++) {
        let trackName = tracksArr.push(response.items[x].name);
      }
      let x = createList(tracksArr, "ol");
      document.getElementById("listTracks").appendChild(x);
    })

    getPlaylist().then(function(result) {
        let objArr = [];
        let commaStrTrackIDs = "";
        let commaStrArtistIDs = "";
        let popularity = [];
        let duration = []
        const artistArr = [];
        const averageStats = [];

        let response = JSON.parse(result);
        for (let x = 0; x < 100; x++) {
            let y = response.items[x].track
            let track = response.items[x].track.id;
            let artist = response.items[x].track.artists[0].id;
            let durationMS = response.items[x].track.duration_ms;
            let popularityVal = response.items[x].track.popularity;
            popularity.push(popularityVal);
            duration.push(durationMS);
            artistArr.push(artist);
            commaStrTrackIDs += track + ","
        }
        commaStrTrackIDs = commaStrTrackIDs.substring(0, commaStrTrackIDs.length - 1);
        let newArtistArr = Array.from(new Set(artistArr));
        for (let i = 0; i < 50; i++) {
            if (newArtistArr[i] !== "null" && newArtistArr[i] !== null) {
                commaStrArtistIDs += newArtistArr[i] + ",";
            }
        }
        commaStrArtistIDs = commaStrArtistIDs.substring(0, commaStrArtistIDs.length - 1);
        let pop = averageStats.push("Popularity: " + average(popularity));
        let dur = average(duration);
        let date = new Date(Number(dur));
        let min = date.getMinutes();
        let sec = date.getSeconds();
        dur = min + " min " + sec + " sec";
        averageStats.push("Duration: " + dur);
        


        getArtists(commaStrArtistIDs).then(function(result) {
            let responseArtist = JSON.parse(result);
            let artistsHierarchy = responseArtist.artists
            let genreArr = [];
            for (let a = 0; a < artistsHierarchy.length; a++) {
                genreArr = genreArr.concat(artistsHierarchy[a].genres);
            }
            let genreHash = {};
            for (let ix = 0; ix < genreArr.length; ix++) {
                if (!genreHash[genreArr[ix]]) {
                    genreHash[genreArr[ix]] = 1;
                } else {
                    genreHash[genreArr[ix]]++;
                }
            }
            let sum = 0;
            const sumArr = [];
            for (key in genreHash) {
                sum += genreHash[key];
                sumArr.push({
                    name: key,
                    value: genreHash[key]
                })
            }
            var sortedArr = sumArr.sort(function(a, b) {
                return (b.value > a.value) ? 1 : ((a.value > b.value) ? -1 : 0)
            })
            for (x = 0; x < sortedArr.length; x++) {
                sortedArr[x].value = sortedArr[x].value / (sum) * 100;
            }
            createPie(sortedArr);
        })




        trackFeatures(commaStrTrackIDs).then(function(results) {
            const featureObj = {};
            let responseAudio = JSON.parse(results);
            let audioFeat = responseAudio.audio_features;
            const audioFeatID = ["acousticness", "danceability", "energy",
                "speechiness", "instrumentalness", "loudness", "tempo", "duration_ms", "valence", "mode", "key"
            ];
            let keyArr = [];
            let tempoArr = [];
            for (let xi = 0; xi < audioFeatID.length; xi++) {
                let featureArr = [];
                for (let i = 0; i < 50; i++) {
                    featureArr.push(audioFeat[i][audioFeatID[xi]]);
                }
                if (audioFeatID[xi] == "key") {
                    keyArr = keyArr.concat(featureArr);
                }
                if (audioFeatID[xi] == "tempo") {
                    tempoArr = tempoArr.concat(featureArr);
                }
                let averageFeatureMetric = average(featureArr);
                featureObj[audioFeatID[xi]] = averageFeatureMetric;
            }
            let keyTempoPair = [];
            for (let xz = 0; xz < keyArr.length; xz++) {
                let newObj = {}
                newObj["x"] = keyArr[xz];
                newObj["y"] = tempoArr[xz];
                keyTempoPair.push(newObj);
            }
            createScatter(keyTempoPair);
            createBar(featureObj);
            let tempoAvg = averageStats.push("Tempo: " + average(tempoArr) + " BPM");
            let averageList = createList(averageStats, "ul");
            document.getElementById("Averages").appendChild(averageList);



            getPlaylists().then(function(results) {
                let response = JSON.parse(results);
                let playlistID = [];
                for (let i = 1; i < 5; i++) {
                    playlistID.push(response.items[i].id);
                }
                for (let x = 0; x < playlistID.length; x++) {
                getMultiplePlaylist(playlistID[x]).then(function(results) {
                    let summerResponse = JSON.parse(results);
                    let stringTrack = ""
                    for (let i = 0; i < 50; i++) {
                      if (summerResponse.items[i] !== undefined) {
                        stringTrack += summerResponse.items[i].track.id + ","
                      }
                    }
                    stringTrack = stringTrack.substring(0, stringTrack.length - 1);
                    trackFeatures(stringTrack).then(function(results) {
                        let responseAudio = JSON.parse(results);
                        let audioFeat = responseAudio.audio_features;
                        const featID = ["acousticness", "danceability", "energy", "valence", "speechiness"];
                        let matchingTrackIDs = "";
                        for (let xi = 0; xi < 50; xi++) {
                            let trackObj = audioFeat[xi];
                            if (trackObj !== null && trackObj !== undefined) {
                                let trackIDMatch = compareTrackFeatures(featureObj, trackObj, featID);
                                if (trackIDMatch !== null) {
                                    matchingTrackIDs += trackIDMatch + ","
                                }
                            }
                        }
                        matchingTrackIDs = matchingTrackIDs.substring(0, matchingTrackIDs.length - 1);
                        //addToPlaylist('0qTPcxS0YvsJcKEFH6X2w5', matchingTrackIDs);
                    })
                })
              }
            })
        })
    })
}