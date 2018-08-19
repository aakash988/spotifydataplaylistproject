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
      let url = 'https://api.spotify.com/v1/users/aakash988/playlists/4ChHfpD7bNNlOZtac1gsAt/tracks';
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
      type: 'bar',
      data: {
          labels: ["Acousticness", "Energy", "Danceability", "Valence", "Mode", "Speechiness"],
          datasets: [{
              label: 'Audio Features',
              data: barFeat,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
        scales: {
        	yAxes: [{
        		display: true,
        		ticks: {
        			suggestedMin: 0,
        			suggestedMax: 1
        		}
        	}]
        }
      }
  });
}
  
getPlaylist().then(function(result) {
    let objArr = [];
    let commaStr = "";
    let response = JSON.parse(result);
    //console.log(response)
    for (let x = 0; x < 100; x++) {
        let track = response.items[x].track.id;
        commaStr += track + ","
            //objArr.push(response.items[x].track.id);
    }
    commaStr = commaStr.substring(0, commaStr.length - 1);
    trackFeatures(commaStr).then(function(results) {
    	const featureObj = {};
        let responseAudio = JSON.parse(results);
        //console.log(responseAudio)
        let audioFeat = responseAudio.audio_features;
        const audioFeatID = ["acousticness", "danceability", "energy",
        "speechiness", "instrumentalness", "loudness", "tempo", "duration_ms", "valence", "mode"];
        for (let xi = 0; xi < audioFeatID.length; xi++) {
        	const featureArr = [];
        	console.log(audioFeat[0])
			for (let i = 0; i < 100; i++) {
			    featureArr.push(audioFeat[i][audioFeatID[xi]]);

			}
			let averageFeatureMetric = average(featureArr);
			featureObj[audioFeatID[xi]] = averageFeatureMetric;
        }
        createBar(featureObj);
})
})
/*
var xhr = new XMLHttpRequest();
xhr.open('GET', "https://api.spotify.com/v1/users/aakash988/playlists/4ChHfpD7bNNlOZtac1gsAt/tracks", false);
//xhr.setRequestHeader('Accept', 'application/json');
//xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Authorization', 'Bearer ' + _token );
//xhr.onreadystatechange = getData;
xhr.send();

function getData(callback) {
	if (xhr.readyState == 4 && xhr.status == 200) {
		const objArr = [];
	    var response = JSON.parse(xhr.responseText);
	    for (let x = 0; x < 100; x++) {
	    	objArr.push(response.items[x].track.id);
	    }
	    callback.apply(this, objArr)
	}
}


// Make a call using the token
$.ajax({
   url: "https://api.spotify.com/v1/me/top/artists",
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     // Do something with the returned data
     //console.log(data);
     data.items.map(function(artist) {
       let item = $('<li>' + artist.name + '</li>');
       item.appendTo($('#top-artists'));
     });
   }
});

$.ajax({
   url: "https://api.spotify.com/v1/me/playlists",
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     // Do something with the returned data
}});


function audioFeatureAverage (arr) {
	const energyVal = [];
	Object.keys(arr).forEach(function(key) {
		let val = arr[key]["energy"];
		energyVal.push(val);
	})
	console.log(energyVal);
}


function searchTrack(ID) {
	$.ajax({
	   url: "https://api.spotify.com/v1/audio-features/" + ID,
	   type: "GET",
	   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
	   success: function(data) {
	   	//console.log(data)
	   	objArr.push(data.energy);
	}});
}


function tracksFromPlaylist(playlistID, callback) {
	const objArr = [];
	$.ajax({
	   url: "https://api.spotify.com/v1/users/aakash988/playlists/" + playlistID + "/tracks",
	   type: "GET",
	   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
	   success: function(data) { 
	     //let tracks = data.items;
	     for (let x = 0; x < 100; x++) {
	     	//callback.apply(this, [data.items[x].track.id]
	     	objArr.push(data.items[x].track.id)
	     }
	     //console.log(objArr);
	     callback.apply(null, objArr);
	     //searchTrack(elements.track.id);
	     //console.log(objArr[1]);
	     //audioFeatureAverage(objArr);
	}});
	return objArr
}

tracksFromPlaylist('4ChHfpD7bNNlOZtac1gsAt', function(details) {
	console.log(details)
});
*/

