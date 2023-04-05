$ = jQuery;
var contentsJson;
var mixes = [];
var waveSurfers = [];
var markers = [];
var waves = [];
var loaders = [];
var MinimapPlugin = window.WaveSurfer.minimap;
var MarkersPlugin = window.WaveSurfer.markers;
var TimelinePlugin = window.WaveSurfer.timeline;

$(function () {
    $('.content_tabs_select_el').on('click', function () {
        console.log('click');
        var target = this.getAttribute('data-id');

        $('.content_tabs_select_el').removeClass('selected');
        $('.content_tabs_selections_el').removeClass('selected');

        $(this).addClass('selected');
        $('#' + target).addClass('selected');
    });


    async function populate_mixes() {
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
            fetch('./build/audio/mixes/meta_jsons/' + metaJson)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.json();
                })
                .then((json) => {
                    mix.querySelector('h3').innerHTML = json.name;
                    markers[key] = json.tracklist;
                });


            let waveJson = mixes[key].replace(/\.[^.]+$/, '.json');
            fetch('./build/audio/mixes/wave_jsons/' + waveJson)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.json();
                })
                .then((json) => {
                    //console.log(json);
                    waves[key] = json;
                });
        }



    }


    async function create_surfers() {

        await (mixes.length == markers.length == waves.length);
        for (var key in mixes) {
            waveSurfers[key] = WaveSurfer.create({
                container: '#mix_' + key,
                waveColor: '#e2715d',
                barWidth: 2,
                progressColor: '#ff211e',
                //backend: 'MediaElementWebAudio',
                normalize: true,
                //mediaControls: true,
                scrollParent: true,
                partialRender: true,
                hideScrollbar: true,
                plugins: [
                    MinimapPlugin.create({
                        // plugin options ...
                    }),
                    // MarkersPlugin.create({
                    // }),
                    // TimelinePlugin.create({
                    //     container: "#mix_"+key+" .timeline"
                    // })
                ]
            });

            waveSurfers[key].on('ready', function () {
                loaders[key].remove();
                var duration = parseFloat(waveSurfers[key].getDuration() / 60).toFixed(2) + ' minutes';
                $('#mix_'+key).find('h3').append(' <span class="duration">'+duration+'</span>');
                // for(var i in markers[key]) {
                //     console.log(markers[key][i]);
                //     waveSurfers[key].addMarker(markers[key][i]);
                // }
            });

            waveSurfers[key].on('error', message => {
                console.log(message);
            });

            waveSurfers[key].on('audioprocess', function () {

                // Draw the waves
                waveSurfers[key].drawBuffer();
            });

            waveSurfers[key].load('./build/audio/mixes/mp3/' + mixes[key],waves[key]);


        }
    }

    fetch('./build/contents.json')
        .then((response) => response.json())
        .then(async (json) => {
            console.log(json);
            contentsJson = json;

            await populate_mixes();
            await create_surfers();
        });


    //create mixes elements

});