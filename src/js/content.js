$ = jQuery;
var contentsJson;
window.containers = [];
window.mixes = [];
window.waveSurfers = [];
window.regions = [];
window.markers = [];
window.waves = [];
window.loaders = [];
window.promises = [];
window.minimaps = [];

import WaveSurfer from '../../node_modules/wavesurfer.js/dist/wavesurfer.js';
import MinimapPlugin from '../../node_modules/wavesurfer.js/dist/plugins/minimap.js';
import RegionsPlugin from '../../node_modules/wavesurfer.js/dist/plugins/regions.js';
import { error } from 'jquery';

$(function () {
    $('.content_tabs_select_el').on('click', function () {
        console.log('click');
        var target = this.getAttribute('data-id');

        $('.content_tabs_select_el').removeClass('selected');
        $('.content_tabs_selections_el').removeClass('selected');

        $(this).addClass('selected');
        $('#' + target).addClass('selected');
    });

    function create_containers() {
        for (var i = mixes.length; i > 0; i--) {
            let key = Object.keys(mixes)[i-1];
            let mix = document.createElement('div');
            mix.innerHTML = '<h3></h3>';
            mix.setAttribute('id', 'mix_' + key);
            mix.setAttribute('data-key', key);
            mix.setAttribute('class', 'single_mix');

            let loader = document.createElement('div');
            loader.setAttribute('class', 'loader');
            loader.innerHTML = 'Waveform Loading';
            loaders[key] = loader;
            $(mix).append(loader);

            $('#content-tab-mixes').append(mix);
            containers[key] = mix;
        }
        console.log('created all');
    }


    async function pre_create_surfers() {

        await create_containers();

        for (let key in mixes) {

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
                        containers[key].querySelector('h3').innerHTML = json.name;
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

    }

    async function create_surfers() {


        mixes = contentsJson.audio.mixes.mp3.files;
        await pre_create_surfers();

        // wait until the promise returns us a value
        Promise.all(promises).then(() => {
            console.log('returned', mixes.length, markers.length, waves.length, document.querySelectorAll('.single_mix').length);
            for (let key in mixes) {
                //console.log('doing key' + key);
                console.log(document.querySelector('#mix_' + key));
                waveSurfers[key] = WaveSurfer.create({
                    container: document.querySelector('#mix_' + key),
                    waveColor: '#e2715d',
                    barWidth: 2,
                    progressColor: '#ff211e',
                    backend: 'MediaElementWebAudio',
                    normalize: true,
                    height: 80,
                    scrollParent: true,
                    hideScrollbar: true,
                    peaks: [waves[key].data],
                    url: './build/audio/mixes/mp3/' + mixes[key],
                    minPxPerSec: 50
                });

                regions[key] = RegionsPlugin.create({
                    drag: false
                });



                minimaps[key] = waveSurfers[key].registerPlugin(
                    MinimapPlugin.create({
                        container: document.querySelector('#mix_' + key),
                        scrollParent: false,
                        height: 30,
                        autoCenter: true,
                        waveColor: '#858585',
                        progressColor: '#666',
                        fillParent: true,
                        hideScrollbar: true,
                        interact: true,
                        minPxPerSec: 1,
                        peaks: [waves[key].data],
                        plugins: [ regions[key] ], 
                    }),
                );

                // waveSurfers[key].on('ready', function () {

                //     //waveSurfers[key].setOptions();

                // });

                waveSurfers[key].on('audioprocess',function(currentTime){
                    var totalSeconds = parseFloat(currentTime).toFixed(2);
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = parseInt(totalSeconds % 60) > 9 ? parseInt(totalSeconds % 60) : '0'+parseInt(totalSeconds % 60);
    
                    document.querySelector('#mix_' + key + ' .current').innerHTML = minutes + ':' + seconds;       
                });

                waveSurfers[key].on('decode', function () {

                    console.log(waveSurfers[key]);
                    //console.log(regions);

                    for (var i in markers[key]) {

                        const contentDiv = document.createElement('div');
                        contentDiv.className = 'wavesurfer-region';
                        contentDiv.innerHTML = markers[key][i]['label'];

                        regions[key].addRegion({
                            start: markers[key][i]['time'], 
                            content: contentDiv,  
                            color: markers[key][i]['color'],
                            drag: false
                        });
                    }


                    loaders[key].remove();

                    var host = document.querySelectorAll('#mix_'+key+' div')[1].querySelectorAll('div')[1];
                    var style = document.createElement( 'style' );
                    style.innerHTML = '.wrapper > div:nth-child(3) > div {pointer-events:none !important} .wavesurfer-region { cursor:initial; pointer-events:all !important; margin-top: 0 !important; opacity: 0; color: white; white-space: nowrap; font-size: 9px; } .wavesurfer-region:hover {opacity:1} .wavesurfer-region span {color: #bebebe;}';
                    host.shadowRoot.appendChild( style );

                    var totalSeconds = parseFloat(waveSurfers[key].getDuration()).toFixed(2);
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = parseInt(totalSeconds % 60) > 9 ? parseInt(totalSeconds % 60) : '0'+parseInt(totalSeconds % 60);
                    $('#mix_' + key).append('<span class="duration">' + minutes + ':' + seconds + '</span>');
                    $('#mix_' + key).append('<span class="current">0:00</span>');

                });

                waveSurfers[key].on('error', message => {
                    console.log(key + ' ' + message);
                });

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