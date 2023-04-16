$ = jQuery;
var contentsJson;
var mixes = [];
var waveSurfers = [];
var markers = [];
var waves = [];
var loaders = [];
var promises = [];
// var MinimapPlugin = window.WaveSurfer.minimap;
// var MarkersPlugin = window.WaveSurfer.markers;
// var TimelinePlugin = window.WaveSurfer.timeline;

import WaveSurfer from 'wavesurfer.js';
import MinimapPlugin from 'wavesurfer.js';

$(function () {
    $('.content_tabs_select_el').on('click', function () {
        console.log('click');
        var target = this.getAttribute('data-id');

        $('.content_tabs_select_el').removeClass('selected');
        $('.content_tabs_selections_el').removeClass('selected');

        $(this).addClass('selected');
        $('#' + target).addClass('selected');
    });

    async function create_surfers() {


        mixes = contentsJson.audio.mixes.mp3.files;

        for (var key in mixes) {
            let mix = document.createElement('div');
            mix.innerHTML = '<h3></h3>';
            mix.setAttribute('id', 'mix_' + key);
            mix.setAttribute('data-key', key);
            mix.setAttribute('class', 'single_mix');

            let timeline = document.createElement('div');
            timeline.setAttribute('class', 'timeline');
            $(mix).append(timeline);

            let loader = document.createElement('div');
            loader.setAttribute('class', 'loader');
            loader.innerHTML = 'Waveform Loading';
            loaders[key] = loader;
            $(mix).append(loader);

            $('#content-tab-mixes').append(mix);


            let metaJson = mixes[key].replace(/\.[^.]+$/, '.json');
            promises.push(
                await fetch('./build/audio/mixes/meta_jsons/' + metaJson)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("HTTP error " + response.status);
                        }
                        return response.json();
                    })
                    .then((json) => {
                        mix.querySelector('h3').innerHTML = json.name;
                        markers[key] = json.tracklist;
                    })
            )

            let waveJson = mixes[key].replace(/\.[^.]+$/, '.json');
            promises.push(
                await fetch('./build/audio/mixes/wave_jsons/' + waveJson)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("HTTP error " + response.status);
                        }
                        return response.json();
                    })
                    .then((json) => {
                        //console.log(json);
                        //console.log(key);
                        waves[key] = json;
                    })
            )


        }


        // wait until the promise returns us a value
        Promise.all(promises).then(() => {
            //console.log('returned', mixes.length, markers.length, waves.length);
            for (let key in mixes) {
                //console.log('doing key' + key);
                console.log(document.querySelector('#mix_' + key));
                waveSurfers[key] = WaveSurfer.create({
                    container:  document.querySelector('#mix_' + key),
                    waveColor: '#e2715d',
                    barWidth: 2,
                    progressColor: '#ff211e',
                    backend: 'MediaElementWebAudio',
                    normalize: true,
                    scrollParent: true,
                    hideScrollbar: true,
                    plugins: [
                        MinimapPlugin.create({
                            // plugin options ...
                            // plugins: [
                            //     // MarkersPlugin.create({
                            //     //     markers: markers[key]
                            //     // }),
                            // ]
                        }),
                    ]
                });

                //console.log(waveSurfers[key]);

                waveSurfers[key].on('ready', function () {
                    // console.log(waveSurfers);

                    loaders[key].remove();

                    var totalSeconds = parseFloat(waveSurfers[key].getDuration()).toFixed(2);
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = parseInt(totalSeconds % 60);
                    $('#mix_' + key).append('<span class="duration">' + minutes + ':' + seconds + '</span>');
                    // for(var i in markers[key]) {
                    //     console.log(markers[key][i]);
                    //     waveSurfers[key].addMarker(markers[key][i]);
                    // }
                    waveSurfers[key].drawBuffer();
                });

                waveSurfers[key].on('error', message => {
                    console.log(key + ' ' + message);
                });

                //console.log(mixes[key], waves[key]);
                waveSurfers[key].load('./build/audio/mixes/mp3/' + mixes[key], waves[key].data); //


            }

        });
    }

    fetch('./build/contents.json')
        .then((response) => response.json())
        .then(async (json) => {
            // console.log(json);
            contentsJson = json;

            await create_surfers();
        });


    //create mixes elements

});